
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Save, Dumbbell, Edit, Loader2 } from 'lucide-react';
import { Client, Exercise, WorkoutPlan } from '@/types';
import { useWorkoutPlans } from '@/hooks/useWorkoutPlans';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface WorkoutPlannerProps {
  client: Client;
}

const WorkoutPlanner = ({ client }: WorkoutPlannerProps) => {
  const { workoutPlans, loading, addWorkoutPlan, updateWorkoutPlan, deleteWorkoutPlan } = useWorkoutPlans(client.id);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { toast } = useToast();
  
  const [newWorkout, setNewWorkout] = useState<Partial<WorkoutPlan>>({
    clientId: client.id,
    name: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    exercises: []
  });
  
  const [newExercise, setNewExercise] = useState<Partial<Exercise>>({
    name: '',
    sets: 3,
    reps: 10,
    weight: 0,
    restTime: 60,
    notes: ''
  });

  const handleAddExercise = () => {
    if (!newExercise.name) return;
    
    setNewWorkout({
      ...newWorkout,
      exercises: [
        ...(newWorkout.exercises || []),
        {
          ...newExercise,
          id: `temp-${Date.now()}`
        } as Exercise
      ]
    });
    
    // Reset exercise form
    setNewExercise({
      name: '',
      sets: 3,
      reps: 10,
      weight: 0,
      restTime: 60,
      notes: ''
    });
  };

  const handleRemoveExercise = (index: number) => {
    const updatedExercises = [...(newWorkout.exercises || [])];
    updatedExercises.splice(index, 1);
    setNewWorkout({
      ...newWorkout,
      exercises: updatedExercises
    });
  };

  const handleSaveWorkout = async () => {
    if (!newWorkout.name || !newWorkout.exercises || newWorkout.exercises.length === 0) return;
    
    try {
      setIsSaving(true);
      
      if (isEditing) {
        await updateWorkoutPlan(isEditing, newWorkout as WorkoutPlan);
        toast({
          title: "Workout plan updated",
          description: `${newWorkout.name} has been updated successfully.`,
        });
        setIsEditing(null);
      } else {
        await addWorkoutPlan(newWorkout as Omit<WorkoutPlan, 'id'>);
        toast({
          title: "Workout plan created",
          description: `${newWorkout.name} has been created successfully.`,
        });
      }
      
      setIsCreating(false);
      resetWorkoutForm();
    } catch (error: any) {
      toast({
        title: isEditing ? "Error updating workout plan" : "Error creating workout plan",
        description: error.message || "There was an error with the workout plan.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditWorkout = (workout: WorkoutPlan) => {
    setNewWorkout({
      clientId: workout.clientId,
      name: workout.name,
      description: workout.description,
      startDate: new Date(workout.startDate).toISOString().split('T')[0],
      endDate: new Date(workout.endDate).toISOString().split('T')[0],
      exercises: workout.exercises
    });
    setIsEditing(workout.id);
    setIsCreating(true);
  };

  const handleDeleteWorkout = async (id: string) => {
    try {
      setIsDeleting(id);
      await deleteWorkoutPlan(id);
      toast({
        title: "Workout plan deleted",
        description: "The workout plan has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting workout plan",
        description: error.message || "There was an error deleting the workout plan.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const resetWorkoutForm = () => {
    setNewWorkout({
      clientId: client.id,
      name: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      exercises: []
    });
  };

  const generateAIWorkout = () => {
    // Simulate AI-generated workout
    setTimeout(() => {
      setNewWorkout({
        clientId: client.id,
        name: `${client.name}'s Personalized Workout`,
        description: `AI-generated workout plan based on ${client.goals}`,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        exercises: [
          {
            id: `temp-1`,
            name: 'Barbell Squat',
            sets: 4,
            reps: 8,
            weight: 80,
            restTime: 120,
            notes: 'Focus on form and depth'
          },
          {
            id: `temp-2`,
            name: 'Bench Press',
            sets: 3,
            reps: 10,
            weight: 60,
            restTime: 90,
            notes: 'Keep elbows tucked'
          },
          {
            id: `temp-3`,
            name: 'Deadlift',
            sets: 3,
            reps: 6,
            weight: 100,
            restTime: 180,
            notes: 'Maintain neutral spine'
          },
          {
            id: `temp-4`,
            name: 'Pull-ups',
            sets: 3,
            reps: 8,
            restTime: 90,
            notes: 'Use assistance if needed'
          }
        ]
      });
    }, 1500);
  };

  const cancelEdit = () => {
    setIsCreating(false);
    setIsEditing(null);
    resetWorkoutForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Workout Plans 3.0 (Beta)</h2>
        {!isCreating && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={generateAIWorkout}
            >
              <Dumbbell className="h-4 w-4" />
              <span>Generate AI Workout</span>
            </Button>
            <Button 
              className="flex items-center gap-2"
              onClick={() => {
                resetWorkoutForm();
                setIsCreating(true);
              }}
            >
              <Plus className="h-4 w-4" />
              <span>Create Plan</span>
            </Button>
          </div>
        )}
      </div>

      {isCreating ? (
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? 'Edit Workout Plan' : 'Create New Workout Plan'}</CardTitle>
            <CardDescription>
              {isEditing ? `Update workout plan for ${client.name}` : `Design a custom workout plan for ${client.name}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Plan Name</label>
                <Input 
                  value={newWorkout.name}
                  onChange={(e) => setNewWorkout({...newWorkout, name: e.target.value})}
                  placeholder="e.g., Strength Building Program"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration</label>
                <div className="flex gap-2">
                  <Input 
                    type="date"
                    value={newWorkout.startDate}
                    onChange={(e) => setNewWorkout({...newWorkout, startDate: e.target.value})}
                  />
                  <span className="flex items-center">to</span>
                  <Input 
                    type="date"
                    value={newWorkout.endDate}
                    onChange={(e) => setNewWorkout({...newWorkout, endDate: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                value={newWorkout.description}
                onChange={(e) => setNewWorkout({...newWorkout, description: e.target.value})}
                placeholder="Describe the goals and focus of this workout plan"
                rows={3}
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Exercises</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={generateAIWorkout}
                  className="flex items-center gap-2"
                >
                  <Dumbbell className="h-4 w-4" />
                  <span>AI Suggestions</span>
                </Button>
              </div>
              
              {newWorkout.exercises && newWorkout.exercises.length > 0 ? (
                <div className="space-y-4">
                  {newWorkout.exercises.map((exercise, index) => (
                    <div key={exercise.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-md">
                      <div className="flex-1">
                        <p className="font-medium">{exercise.name}</p>
                        <p className="text-sm text-gray-500">
                          {exercise.sets} sets × {exercise.reps} reps
                          {exercise.weight ? ` @ ${exercise.weight}kg` : ''}
                          {exercise.duration ? ` for ${exercise.duration} min` : ''}
                          {` • ${exercise.restTime}s rest`}
                        </p>
                        {exercise.notes && <p className="text-xs italic mt-1">{exercise.notes}</p>}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveExercise(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 border border-dashed rounded-md">
                  <p className="text-gray-500">No exercises added yet</p>
                </div>
              )}
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Add Exercise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Exercise Name</label>
                      <Input 
                        value={newExercise.name}
                        onChange={(e) => setNewExercise({...newExercise, name: e.target.value})}
                        placeholder="e.g., Barbell Squat"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Sets</label>
                        <Input 
                          type="number"
                          value={newExercise.sets}
                          onChange={(e) => setNewExercise({...newExercise, sets: parseInt(e.target.value) || 0})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Reps</label>
                        <Input 
                          type="number"
                          value={newExercise.reps}
                          onChange={(e) => setNewExercise({...newExercise, reps: parseInt(e.target.value) || 0})}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Weight (kg)</label>
                      <Input 
                        type="number"
                        value={newExercise.weight}
                        onChange={(e) => setNewExercise({...newExercise, weight: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Rest Time (sec)</label>
                      <Input 
                        type="number"
                        value={newExercise.restTime}
                        onChange={(e) => setNewExercise({...newExercise, restTime: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Duration (min)</label>
                      <Input 
                        type="number"
                        value={newExercise.duration}
                        onChange={(e) => setNewExercise({...newExercise, duration: parseInt(e.target.value) || undefined})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <label className="text-sm font-medium">Notes</label>
                    <Input 
                      value={newExercise.notes}
                      onChange={(e) => setNewExercise({...newExercise, notes: e.target.value})}
                      placeholder="Any special instructions"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={handleAddExercise}
                    disabled={!newExercise.name}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Exercise</span>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={cancelEdit}>Cancel</Button>
            <Button 
              onClick={handleSaveWorkout}
              disabled={!newWorkout.name || !(newWorkout.exercises && newWorkout.exercises.length > 0) || isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{isEditing ? 'Update' : 'Save'} Workout Plan</span>
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading workout plans...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {workoutPlans.length > 0 ? (
                workoutPlans.map(workout => (
                  <Card key={workout.id}>
                    <CardHeader>
                      <CardTitle>{workout.name}</CardTitle>
                      <CardDescription>
                        {new Date(workout.startDate).toLocaleDateString()} - {new Date(workout.endDate).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4 text-sm text-gray-600">{workout.description}</p>
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Exercises:</h4>
                        <ul className="space-y-2">
                          {workout.exercises.map(exercise => (
                            <li key={exercise.id} className="text-sm p-2 bg-gray-50 rounded">
                              <span className="font-medium">{exercise.name}</span>
                              <p className="text-xs text-gray-500">
                                {exercise.sets} sets × {exercise.reps} reps
                                {exercise.weight ? ` @ ${exercise.weight}kg` : ''}
                                {exercise.duration ? ` for ${exercise.duration} min` : ''}
                                {` • ${exercise.restTime}s rest`}
                              </p>
                              {exercise.notes && <p className="text-xs italic mt-1">{exercise.notes}</p>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditWorkout(workout)}
                        className="flex items-center gap-1"
                      >
                        <Edit className="h-3 w-3" />
                        <span>Edit</span>
                      </Button>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex items-center gap-1 text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Delete</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Workout Plan</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete "{workout.name}"? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button 
                              variant="destructive"
                              onClick={() => handleDeleteWorkout(workout.id)}
                              disabled={isDeleting === workout.id}
                            >
                              {isDeleting === workout.id ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  Deleting...
                                </>
                              ) : (
                                'Delete'
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 text-center p-12 border border-dashed rounded-md">
                  <h3 className="text-lg font-medium mb-2">No Workout Plans Yet</h3>
                  <p className="text-gray-500 mb-4">Create your first workout plan for {client.name}</p>
                  <Button onClick={() => setIsCreating(true)}>Create Workout Plan</Button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WorkoutPlanner;
