
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { WorkoutPlan, Exercise } from '@/types';

export function useWorkoutPlans(clientId?: string) {
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    const fetchWorkoutPlans = async () => {
      try {
        setLoading(true);
        
        let query = supabase
          .from('workout_plans')
          .select('*')
          .eq('trainer_id', user.id);
          
        if (clientId) {
          query = query.eq('client_id', clientId);
        }
        
        const { data: workoutPlansData, error: workoutPlansError } = await query.order('start_date', { ascending: false });
          
        if (workoutPlansError) {
          throw workoutPlansError;
        }
        
        // Fetch exercises for each workout plan
        const workoutPlansWithExercises = await Promise.all(
          workoutPlansData.map(async (plan) => {
            const { data: exercisesData, error: exercisesError } = await supabase
              .from('exercises')
              .select('*')
              .eq('workout_plan_id', plan.id)
              .order('order_index');
              
            if (exercisesError) {
              throw exercisesError;
            }
            
            // Transform the data to match our Exercise type
            const exercises: Exercise[] = exercisesData.map(exercise => ({
              id: exercise.id,
              name: exercise.name,
              sets: exercise.sets,
              reps: exercise.reps,
              weight: exercise.weight || undefined,
              duration: exercise.duration || undefined,
              restTime: exercise.rest_time,
              notes: exercise.notes || undefined
            }));
            
            // Transform the data to match our WorkoutPlan type
            return {
              id: plan.id,
              clientId: plan.client_id,
              name: plan.name,
              description: plan.description || '',
              startDate: plan.start_date,
              endDate: plan.end_date,
              exercises
            };
          })
        );
        
        setWorkoutPlans(workoutPlansWithExercises);
      } catch (err: any) {
        setError(err);
        console.error('Error fetching workout plans:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorkoutPlans();
    
    // Set up real-time subscription for workout plans
    const workoutPlansSubscription = supabase
      .channel('workout-plans-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'workout_plans',
          filter: clientId 
            ? `trainer_id=eq.${user.id}&client_id=eq.${clientId}`
            : `trainer_id=eq.${user.id}`
        }, 
        () => {
          fetchWorkoutPlans();
        }
      )
      .subscribe();
      
    // Set up real-time subscription for exercises
    const exercisesSubscription = supabase
      .channel('exercises-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'exercises'
        }, 
        () => {
          fetchWorkoutPlans();
        }
      )
      .subscribe();
      
    return () => {
      workoutPlansSubscription.unsubscribe();
      exercisesSubscription.unsubscribe();
    };
  }, [user, clientId]);
  
  const addWorkoutPlan = async (newWorkoutPlan: Omit<WorkoutPlan, 'id'>) => {
    if (!user) return null;
    
    try {
      // First, insert the workout plan
      const { data: workoutPlanData, error: workoutPlanError } = await supabase
        .from('workout_plans')
        .insert({
          client_id: newWorkoutPlan.clientId,
          trainer_id: user.id,
          name: newWorkoutPlan.name,
          description: newWorkoutPlan.description,
          start_date: newWorkoutPlan.startDate,
          end_date: newWorkoutPlan.endDate
        })
        .select()
        .single();
        
      if (workoutPlanError) {
        throw workoutPlanError;
      }
      
      // Then, insert all exercises
      if (newWorkoutPlan.exercises.length > 0) {
        const exercisesToInsert = newWorkoutPlan.exercises.map((exercise, index) => ({
          workout_plan_id: workoutPlanData.id,
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight,
          duration: exercise.duration,
          rest_time: exercise.restTime,
          notes: exercise.notes,
          order_index: index
        }));
        
        const { error: exercisesError } = await supabase
          .from('exercises')
          .insert(exercisesToInsert);
          
        if (exercisesError) {
          throw exercisesError;
        }
      }
      
      return workoutPlanData;
    } catch (err) {
      console.error('Error adding workout plan:', err);
      throw err;
    }
  };
  
  const updateWorkoutPlan = async (id: string, updates: Partial<WorkoutPlan>) => {
    if (!user) return null;
    
    try {
      // First, update the workout plan
      const workoutPlanUpdates: any = {};
      
      if (updates.name) workoutPlanUpdates.name = updates.name;
      if (updates.description !== undefined) workoutPlanUpdates.description = updates.description;
      if (updates.startDate) workoutPlanUpdates.start_date = updates.startDate;
      if (updates.endDate) workoutPlanUpdates.end_date = updates.endDate;
      
      if (Object.keys(workoutPlanUpdates).length > 0) {
        const { error: workoutPlanError } = await supabase
          .from('workout_plans')
          .update(workoutPlanUpdates)
          .eq('id', id)
          .eq('trainer_id', user.id);
          
        if (workoutPlanError) {
          throw workoutPlanError;
        }
      }
      
      // If exercises are updated, handle them
      if (updates.exercises) {
        // First, delete all existing exercises
        const { error: deleteError } = await supabase
          .from('exercises')
          .delete()
          .eq('workout_plan_id', id);
          
        if (deleteError) {
          throw deleteError;
        }
        
        // Then, insert all new exercises
        if (updates.exercises.length > 0) {
          const exercisesToInsert = updates.exercises.map((exercise, index) => ({
            workout_plan_id: id,
            name: exercise.name,
            sets: exercise.sets,
            reps: exercise.reps,
            weight: exercise.weight,
            duration: exercise.duration,
            rest_time: exercise.restTime,
            notes: exercise.notes,
            order_index: index
          }));
          
          const { error: exercisesError } = await supabase
            .from('exercises')
            .insert(exercisesToInsert);
            
          if (exercisesError) {
            throw exercisesError;
          }
        }
      }
      
      return true;
    } catch (err) {
      console.error('Error updating workout plan:', err);
      throw err;
    }
  };
  
  const deleteWorkoutPlan = async (id: string) => {
    if (!user) return null;
    
    try {
      // Delete the workout plan (exercises will be deleted automatically due to cascade)
      const { error } = await supabase
        .from('workout_plans')
        .delete()
        .eq('id', id)
        .eq('trainer_id', user.id);
        
      if (error) {
        throw error;
      }
      
      return true;
    } catch (err) {
      console.error('Error deleting workout plan:', err);
      throw err;
    }
  };
  
  return {
    workoutPlans,
    loading,
    error,
    addWorkoutPlan,
    updateWorkoutPlan,
    deleteWorkoutPlan
  };
}
