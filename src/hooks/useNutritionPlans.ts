
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { NutritionPlan, Meal, Food } from '@/types';

export function useNutritionPlans(clientId?: string) {
  const [nutritionPlans, setNutritionPlans] = useState<NutritionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    const fetchNutritionPlans = async () => {
      try {
        setLoading(true);
        
        let query = supabase
          .from('nutrition_plans')
          .select('*')
          .eq('trainer_id', user.id);
          
        if (clientId) {
          query = query.eq('client_id', clientId);
        }
        
        const { data: nutritionPlansData, error: nutritionPlansError } = await query.order('start_date', { ascending: false });
          
        if (nutritionPlansError) {
          throw nutritionPlansError;
        }
        
        // Fetch meals and foods for each nutrition plan
        const nutritionPlansWithMeals = await Promise.all(
          nutritionPlansData.map(async (plan) => {
            // Fetch meals for this plan
            const { data: mealsData, error: mealsError } = await supabase
              .from('meals')
              .select('*')
              .eq('nutrition_plan_id', plan.id)
              .order('order_index');
              
            if (mealsError) {
              throw mealsError;
            }
            
            // Fetch foods for each meal
            const mealsWithFoods = await Promise.all(
              mealsData.map(async (meal) => {
                const { data: foodsData, error: foodsError } = await supabase
                  .from('foods')
                  .select('*')
                  .eq('meal_id', meal.id);
                  
                if (foodsError) {
                  throw foodsError;
                }
                
                // Transform the data to match our Food type
                const foods: Food[] = foodsData.map(food => ({
                  id: food.id,
                  name: food.name,
                  quantity: food.quantity,
                  unit: food.unit,
                  calories: food.calories,
                  protein: food.protein,
                  carbs: food.carbs,
                  fats: food.fats
                }));
                
                // Transform the data to match our Meal type
                return {
                  id: meal.id,
                  name: meal.name,
                  time: meal.time,
                  foods
                };
              })
            );
            
            // Transform the data to match our NutritionPlan type
            return {
              id: plan.id,
              clientId: plan.client_id,
              name: plan.name,
              description: plan.description || '',
              startDate: plan.start_date,
              endDate: plan.end_date,
              dailyCalories: plan.daily_calories,
              macros: {
                protein: plan.protein_grams,
                carbs: plan.carbs_grams,
                fats: plan.fats_grams
              },
              meals: mealsWithFoods
            };
          })
        );
        
        setNutritionPlans(nutritionPlansWithMeals);
      } catch (err: any) {
        setError(err);
        console.error('Error fetching nutrition plans:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNutritionPlans();
    
    // Set up real-time subscription for nutrition plans
    const nutritionPlansSubscription = supabase
      .channel('nutrition-plans-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'nutrition_plans',
          filter: clientId 
            ? `trainer_id=eq.${user.id}&client_id=eq.${clientId}`
            : `trainer_id=eq.${user.id}`
        }, 
        () => {
          fetchNutritionPlans();
        }
      )
      .subscribe();
      
    // Set up real-time subscription for meals
    const mealsSubscription = supabase
      .channel('meals-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'meals'
        }, 
        () => {
          fetchNutritionPlans();
        }
      )
      .subscribe();
      
    // Set up real-time subscription for foods
    const foodsSubscription = supabase
      .channel('foods-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'foods'
        }, 
        () => {
          fetchNutritionPlans();
        }
      )
      .subscribe();
      
    return () => {
      nutritionPlansSubscription.unsubscribe();
      mealsSubscription.unsubscribe();
      foodsSubscription.unsubscribe();
    };
  }, [user, clientId]);
  
  const addNutritionPlan = async (newPlan: Omit<NutritionPlan, 'id'>) => {
    if (!user) return null;
    
    try {
      // First, insert the nutrition plan
      const { data: nutritionPlanData, error: nutritionPlanError } = await supabase
        .from('nutrition_plans')
        .insert({
          client_id: newPlan.clientId,
          trainer_id: user.id,
          name: newPlan.name,
          description: newPlan.description,
          start_date: newPlan.startDate,
          end_date: newPlan.endDate,
          daily_calories: newPlan.dailyCalories,
          protein_grams: newPlan.macros.protein,
          carbs_grams: newPlan.macros.carbs,
          fats_grams: newPlan.macros.fats
        })
        .select()
        .single();
        
      if (nutritionPlanError) {
        throw nutritionPlanError;
      }
      
      // Then, insert all meals and their foods
      if (newPlan.meals.length > 0) {
        for (let i = 0; i < newPlan.meals.length; i++) {
          const meal = newPlan.meals[i];
          
          // Insert meal
          const { data: mealData, error: mealError } = await supabase
            .from('meals')
            .insert({
              nutrition_plan_id: nutritionPlanData.id,
              name: meal.name,
              time: meal.time,
              order_index: i
            })
            .select()
            .single();
            
          if (mealError) {
            throw mealError;
          }
          
          // Insert foods for this meal
          if (meal.foods.length > 0) {
            const foodsToInsert = meal.foods.map(food => ({
              meal_id: mealData.id,
              name: food.name,
              quantity: food.quantity,
              unit: food.unit,
              calories: food.calories,
              protein: food.protein,
              carbs: food.carbs,
              fats: food.fats
            }));
            
            const { error: foodsError } = await supabase
              .from('foods')
              .insert(foodsToInsert);
              
            if (foodsError) {
              throw foodsError;
            }
          }
        }
      }
      
      return nutritionPlanData;
    } catch (err) {
      console.error('Error adding nutrition plan:', err);
      throw err;
    }
  };
  
  const updateNutritionPlan = async (id: string, updates: Partial<NutritionPlan>) => {
    if (!user) return null;
    
    try {
      // First, update the nutrition plan
      const nutritionPlanUpdates: any = {};
      
      if (updates.name) nutritionPlanUpdates.name = updates.name;
      if (updates.description !== undefined) nutritionPlanUpdates.description = updates.description;
      if (updates.startDate) nutritionPlanUpdates.start_date = updates.startDate;
      if (updates.endDate) nutritionPlanUpdates.end_date = updates.endDate;
      if (updates.dailyCalories !== undefined) nutritionPlanUpdates.daily_calories = updates.dailyCalories;
      if (updates.macros) {
        nutritionPlanUpdates.protein_grams = updates.macros.protein;
        nutritionPlanUpdates.carbs_grams = updates.macros.carbs;
        nutritionPlanUpdates.fats_grams = updates.macros.fats;
      }
      
      if (Object.keys(nutritionPlanUpdates).length > 0) {
        const { error: nutritionPlanError } = await supabase
          .from('nutrition_plans')
          .update(nutritionPlanUpdates)
          .eq('id', id)
          .eq('trainer_id', user.id);
          
        if (nutritionPlanError) {
          throw nutritionPlanError;
        }
      }
      
      // If meals are updated, handle them
      if (updates.meals) {
        // First, get all existing meals for this plan
        const { data: existingMeals, error: mealsQueryError } = await supabase
          .from('meals')
          .select('id')
          .eq('nutrition_plan_id', id);
          
        if (mealsQueryError) {
          throw mealsQueryError;
        }
        
        // Delete all existing meals (this will cascade to foods)
        if (existingMeals.length > 0) {
          const { error: deleteMealsError } = await supabase
            .from('meals')
            .delete()
            .in('id', existingMeals.map(m => m.id));
            
          if (deleteMealsError) {
            throw deleteMealsError;
          }
        }
        
        // Insert all new meals and their foods
        if (updates.meals.length > 0) {
          for (let i = 0; i < updates.meals.length; i++) {
            const meal = updates.meals[i];
            
            // Insert meal
            const { data: mealData, error: mealError } = await supabase
              .from('meals')
              .insert({
                nutrition_plan_id: id,
                name: meal.name,
                time: meal.time,
                order_index: i
              })
              .select()
              .single();
              
            if (mealError) {
              throw mealError;
            }
            
            // Insert foods for this meal
            if (meal.foods.length > 0) {
              const foodsToInsert = meal.foods.map(food => ({
                meal_id: mealData.id,
                name: food.name,
                quantity: food.quantity,
                unit: food.unit,
                calories: food.calories,
                protein: food.protein,
                carbs: food.carbs,
                fats: food.fats
              }));
              
              const { error: foodsError } = await supabase
                .from('foods')
                .insert(foodsToInsert);
                
              if (foodsError) {
                throw foodsError;
              }
            }
          }
        }
      }
      
      return true;
    } catch (err) {
      console.error('Error updating nutrition plan:', err);
      throw err;
    }
  };
  
  const deleteNutritionPlan = async (id: string) => {
    if (!user) return null;
    
    try {
      // Delete the nutrition plan (meals and foods will be deleted automatically due to cascade)
      const { error } = await supabase
        .from('nutrition_plans')
        .delete()
        .eq('id', id)
        .eq('trainer_id', user.id);
        
      if (error) {
        throw error;
      }
      
      return true;
    } catch (err) {
      console.error('Error deleting nutrition plan:', err);
      throw err;
    }
  };
  
  return {
    nutritionPlans,
    loading,
    error,
    addNutritionPlan,
    updateNutritionPlan,
    deleteNutritionPlan
  };
}
