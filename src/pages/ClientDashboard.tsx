
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  MessageSquare, 
  User, 
  Dumbbell, 
  Utensils, 
  LineChart, 
  LogOut,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export default function ClientDashboard() {
  const { client, user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [workoutPlans, setWorkoutPlans] = useState<any[]>([]);
  const [nutritionPlans, setNutritionPlans] = useState<any[]>([]);
  const [progressRecords, setProgressRecords] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState({
    workouts: true,
    nutrition: true,
    progress: true,
    messages: true
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (client) {
      fetchWorkoutPlans();
      fetchNutritionPlans();
      fetchProgressRecords();
      fetchMessages();
    }
  }, [client]);

  const fetchWorkoutPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('workout_plans')
        .select('*, exercises(*)')
        .eq('client_id', client.id)
        .order('start_date', { ascending: false });

      if (error) throw error;
      setWorkoutPlans(data || []);
    } catch (error: any) {
      console.error('Error fetching workout plans:', error);
      toast({
        title: 'Error',
        description: 'Failed to load workout plans',
        variant: 'destructive',
      });
    } finally {
      setLoading(prev => ({ ...prev, workouts: false }));
    }
  };

  const fetchNutritionPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('nutrition_plans')
        .select('*, meals(*, foods(*))')
        .eq('client_id', client.id)
        .order('start_date', { ascending: false });

      if (error) throw error;
      setNutritionPlans(data || []);
    } catch (error: any) {
      console.error('Error fetching nutrition plans:', error);
      toast({
        title: 'Error',
        description: 'Failed to load nutrition plans',
        variant: 'destructive',
      });
    } finally {
      setLoading(prev => ({ ...prev, nutrition: false }));
    }
  };

  const fetchProgressRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('progress_records')
        .select('*, progress_photos(*)')
        .eq('client_id', client.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setProgressRecords(data || []);
    } catch (error: any) {
      console.error('Error fetching progress records:', error);
      toast({
        title: 'Error',
        description: 'Failed to load progress records',
        variant: 'destructive',
      });
    } finally {
      setLoading(prev => ({ ...prev, progress: false }));
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('client_id', client.id)
        .order('timestamp', { ascending: false })
        .limit(10);

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load messages',
        variant: 'destructive',
      });
    } finally {
      setLoading(prev => ({ ...prev, messages: false }));
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Get current workout and nutrition plans
  const currentWorkoutPlan = workoutPlans.find(plan => 
    new Date(plan.start_date) <= new Date() && new Date(plan.end_date) >= new Date()
  );
  
  const currentNutritionPlan = nutritionPlans.find(plan => 
    new Date(plan.start_date) <= new Date() && new Date(plan.end_date) >= new Date()
  );

  // Get latest progress record
  const latestProgressRecord = progressRecords[0];

  // Calculate weight change if there are at least 2 records
  const weightChange = progressRecords.length >= 2 
    ? progressRecords[0].weight - progressRecords[progressRecords.length - 1].weight 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">FitTrack Pro</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={client?.profile_image} alt={client?.name} />
                <AvatarFallback>{client?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{client?.name}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full max-w-3xl mx-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workouts">Workouts</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={client?.profile_image} alt={client?.name} />
                      <AvatarFallback>{client?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-medium">{client?.name}</h3>
                      <p className="text-sm text-gray-500">{client?.email}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Age</p>
                      <p className="font-medium">{client?.age || 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Weight</p>
                      <p className="font-medium">{latestProgressRecord?.weight ? `${latestProgressRecord.weight} kg` : 'Not recorded'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Height</p>
                      <p className="font-medium">{client?.height ? `${client.height} cm` : 'Not set'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Member since</p>
                      <p className="font-medium">{client?.join_date ? format(new Date(client.join_date), 'MMM d, yyyy') : 'Not set'}</p>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-gray-500 mb-1">Goals</p>
                    <p className="text-sm">{client?.goals || 'No goals set'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Progress Summary Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5" />
                    <span>Progress Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loading.progress ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : progressRecords.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No progress records yet</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Weight Change</span>
                          <span className={`text-sm font-bold ${weightChange > 0 ? 'text-red-500' : weightChange < 0 ? 'text-green-500' : 'text-gray-500'}`}>
                            {weightChange > 0 ? '+' : ''}{weightChange} kg
                          </span>
                        </div>
                        <Progress value={Math.abs(weightChange) * 10} className="h-2" />
                      </div>
                      
                      <Separator />
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Latest Weight</p>
                          <p className="font-medium">{latestProgressRecord?.weight} kg</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Latest Waist</p>
                          <p className="font-medium">{latestProgressRecord?.waist ? `${latestProgressRecord.waist} cm` : 'Not recorded'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Latest Chest</p>
                          <p className="font-medium">{latestProgressRecord?.chest ? `${latestProgressRecord.chest} cm` : 'Not recorded'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Latest Arms</p>
                          <p className="font-medium">{latestProgressRecord?.arms ? `${latestProgressRecord.arms} cm` : 'Not recorded'}</p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <p className="text-gray-500 mb-1">Last Updated</p>
                        <p className="text-sm font-medium">{format(new Date(latestProgressRecord.date), 'MMMM d, yyyy')}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Current Plans */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Workout Plan */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Dumbbell className="h-5 w-5" />
                    <span>Current Workout Plan</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading.workouts ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : !currentWorkoutPlan ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No active workout plan</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium">{currentWorkoutPlan.name}</h3>
                        <p className="text-sm text-gray-500">
                          {format(new Date(currentWorkoutPlan.start_date), 'MMM d')} - {format(new Date(currentWorkoutPlan.end_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-3">
                        <p className="text-sm font-medium">Exercises:</p>
                        {currentWorkoutPlan.exercises.slice(0, 3).map((exercise: any) => (
                          <div key={exercise.id} className="bg-gray-50 p-3 rounded-md">
                            <p className="font-medium">{exercise.name}</p>
                            <p className="text-sm text-gray-500">
                              {exercise.sets} sets × {exercise.reps} reps
                              {exercise.weight ? ` @ ${exercise.weight} kg` : ''}
                            </p>
                          </div>
                        ))}
                        {currentWorkoutPlan.exercises.length > 3 && (
                          <p className="text-sm text-blue-500">
                            +{currentWorkoutPlan.exercises.length - 3} more exercises
                          </p>
                        )}
                      </div>
                      
                      <Button variant="outline" className="w-full" onClick={() => setActiveTab('workouts')}>
                        View Full Workout Plan
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Current Nutrition Plan */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Utensils className="h-5 w-5" />
                    <span>Current Nutrition Plan</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading.nutrition ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : !currentNutritionPlan ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No active nutrition plan</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium">{currentNutritionPlan.name}</h3>
                        <p className="text-sm text-gray-500">
                          {format(new Date(currentNutritionPlan.start_date), 'MMM d')} - {format(new Date(currentNutritionPlan.end_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                      
                      <Separator />
                      
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-blue-50 p-2 rounded-md">
                          <p className="text-sm text-gray-500">Calories</p>
                          <p className="font-medium">{currentNutritionPlan.daily_calories}</p>
                        </div>
                        <div className="bg-red-50 p-2 rounded-md">
                          <p className="text-sm text-gray-500">Protein</p>
                          <p className="font-medium">{currentNutritionPlan.protein_grams}g</p>
                        </div>
                        <div className="bg-yellow-50 p-2 rounded-md">
                          <p className="text-sm text-gray-500">Carbs</p>
                          <p className="font-medium">{currentNutritionPlan.carbs_grams}g</p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-3">
                        <p className="text-sm font-medium">Meals:</p>
                        {currentNutritionPlan.meals?.slice(0, 3).map((meal: any) => (
                          <div key={meal.id} className="bg-gray-50 p-3 rounded-md">
                            <div className="flex justify-between">
                              <p className="font-medium">{meal.name}</p>
                              <p className="text-sm text-gray-500">{meal.time}</p>
                            </div>
                            <p className="text-sm text-gray-500">
                              {meal.foods?.length || 0} items
                            </p>
                          </div>
                        ))}
                      </div>
                      
                      <Button variant="outline" className="w-full" onClick={() => setActiveTab('nutrition')}>
                        View Full Nutrition Plan
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recent Messages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Recent Messages</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading.messages ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No messages yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.slice(0, 3).map((message) => (
                      <div key={message.id} className="bg-gray-50 p-3 rounded-md">
                        <div className="flex justify-between">
                          <p className="font-medium">{message.sender_type === 'trainer' ? 'Trainer' : 'You'}</p>
                          <p className="text-xs text-gray-500">{format(new Date(message.timestamp), 'MMM d, h:mm a')}</p>
                        </div>
                        <p className="text-sm mt-1">{message.content}</p>
                      </div>
                    ))}
                    
                    <Button variant="outline" className="w-full" onClick={() => setActiveTab('messages')}>
                      View All Messages
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workouts Tab */}
          <TabsContent value="workouts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Workout Plans</CardTitle>
                <CardDescription>
                  View your current and past workout plans
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading.workouts ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : workoutPlans.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No workout plans yet</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {workoutPlans.map((plan) => {
                      const isActive = new Date(plan.start_date) <= new Date() && new Date(plan.end_date) >= new Date();
                      
                      return (
                        <div key={plan.id} className="border rounded-lg overflow-hidden">
                          <div className={`px-4 py-3 ${isActive ? 'bg-green-50 border-b border-green-100' : 'bg-gray-50 border-b'}`}>
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-medium">{plan.name}</h3>
                                <p className="text-sm text-gray-500">
                                  {format(new Date(plan.start_date), 'MMM d')} - {format(new Date(plan.end_date), 'MMM d, yyyy')}
                                </p>
                              </div>
                              {isActive && (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                  Active
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="p-4">
                            {plan.description && (
                              <p className="text-sm mb-4">{plan.description}</p>
                            )}
                            
                            <div className="space-y-4">
                              {plan.exercises.map((exercise: any) => (
                                <div key={exercise.id} className="bg-gray-50 p-3 rounded-md">
                                  <div className="flex justify-between">
                                    <h4 className="font-medium">{exercise.name}</h4>
                                    <span className="text-sm text-gray-500">
                                      {exercise.sets} × {exercise.reps}
                                    </span>
                                  </div>
                                  <div className="mt-1 text-sm text-gray-500 flex flex-wrap gap-2">
                                    {exercise.weight && (
                                      <span>Weight: {exercise.weight} kg</span>
                                    )}
                                    {exercise.duration && (
                                      <span>Duration: {exercise.duration} min</span>
                                    )}
                                    {exercise.rest_time && (
                                      <span>Rest: {exercise.rest_time} sec</span>
                                    )}
                                  </div>
                                  {exercise.notes && (
                                    <p className="mt-2 text-sm">{exercise.notes}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Nutrition Tab */}
          <TabsContent value="nutrition" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Nutrition Plans</CardTitle>
                <CardDescription>
                  View your current and past nutrition plans
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading.nutrition ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : nutritionPlans.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No nutrition plans yet</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {nutritionPlans.map((plan) => {
                      const isActive = new Date(plan.start_date) <= new Date() && new Date(plan.end_date) >= new Date();
                      
                      return (
                        <div key={plan.id} className="border rounded-lg overflow-hidden">
                          <div className={`px-4 py-3 ${isActive ? 'bg-green-50 border-b border-green-100' : 'bg-gray-50 border-b'}`}>
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-medium">{plan.name}</h3>
                                <p className="text-sm text-gray-500">
                                  {format(new Date(plan.start_date), 'MMM d')} - {format(new Date(plan.end_date), 'MMM d, yyyy')}
                                </p>
                              </div>
                              {isActive && (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                  Active
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="p-4">
                            {plan.description && (
                              <p className="text-sm mb-4">{plan.description}</p>
                            )}
                            
                            <div className="grid grid-cols-3 gap-3 mb-4">
                              <div className="bg-blue-50 p-3 rounded-md text-center">
                                <p className="text-sm text-gray-500">Daily Calories</p>
                                <p className="font-medium">{plan.daily_calories}</p>
                              </div>
                              <div className="bg-red-50 p-3 rounded-md text-center">
                                <p className="text-sm text-gray-500">Protein</p>
                                <p className="font-medium">{plan.protein_grams}g</p>
                              </div>
                              <div className="bg-yellow-50 p-3 rounded-md text-center">
                                <p className="text-sm text-gray-500">Carbs</p>
                                <p className="font-medium">{plan.carbs_grams}g</p>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              {plan.meals?.map((meal: any) => (
                                <div key={meal.id} className="border rounded-md overflow-hidden">
                                  <div className="bg-gray-50 px-3 py-2 border-b">
                                    <div className="flex justify-between items-center">
                                      <h4 className="font-medium">{meal.name}</h4>
                                      <span className="text-sm text-gray-500">{meal.time}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="p-3">
                                    {meal.foods?.length === 0 ? (
                                      <p className="text-sm text-gray-500">No foods specified</p>
                                    ) : (
                                      <div className="space-y-2">
                                        {meal.foods?.map((food: any) => (
                                          <div key={food.id} className="flex justify-between text-sm">
                                            <div>
                                              <span className="font-medium">{food.name}</span>
                                              <span className="text-gray-500 ml-2">
                                                {food.quantity} {food.unit}
                                              </span>
                                            </div>
                                            <div className="text-gray-500">
                                              {food.calories} cal
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
                <CardDescription>
                  Track your fitness journey over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading.progress ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : progressRecords.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No progress records yet</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {progressRecords.map((record) => (
                      <div key={record.id} className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">Progress Record</h3>
                            <span className="text-sm text-gray-500">
                              {format(new Date(record.date), 'MMMM d, yyyy')}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                            <div className="bg-blue-50 p-3 rounded-md">
                              <p className="text-sm text-gray-500">Weight</p>
                              <p className="font-medium">{record.weight} kg</p>
                            </div>
                            {record.waist && (
                              <div className="bg-gray-50 p-3 rounded-md">
                                <p className="text-sm text-gray-500">Waist</p>
                                <p className="font-medium">{record.waist} cm</p>
                              </div>
                            )}
                            {record.chest && (
                              <div className="bg-gray-50 p-3 rounded-md">
                                <p className="text-sm text-gray-500">Chest</p>
                                <p className="font-medium">{record.chest} cm</p>
                              </div>
                            )}
                            {record.arms && (
                              <div className="bg-gray-50 p-3 rounded-md">
                                <p className="text-sm text-gray-500">Arms</p>
                                <p className="font-medium">{record.arms} cm</p>
                              </div>
                            )}
                            {record.hips && (
                              <div className="bg-gray-50 p-3 rounded-md">
                                <p className="text-sm text-gray-500">Hips</p>
                                <p className="font-medium">{record.hips} cm</p>
                              </div>
                            )}
                            {record.thighs && (
                              <div className="bg-gray-50 p-3 rounded-md">
                                <p className="text-sm text-gray-500">Thighs</p>
                                <p className="font-medium">{record.thighs} cm</p>
                              </div>
                            )}
                          </div>
                          
                          {record.notes && (
                            <div className="mb-4">
                              <p className="text-sm font-medium mb-1">Notes</p>
                              <p className="text-sm">{record.notes}</p>
                            </div>
                          )}
                          
                          {record.progress_photos && record.progress_photos.length > 0 && (
                            <div>
                              <p className="text-sm font-medium mb-2">Photos</p>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {record.progress_photos.map((photo: any) => (
                                  <img 
                                    key={photo.id} 
                                    src={photo.photo_url} 
                                    alt="Progress" 
                                    className="rounded-md w-full h-32 object-cover"
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>
                  Communication with your trainer
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading.messages ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No messages yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`p-3 rounded-lg ${
                          message.sender_type === 'client' 
                            ? 'bg-blue-500 text-white ml-auto max-w-[80%]' 
                            : 'bg-gray-100 text-gray-800 mr-auto max-w-[80%]'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p 
                          className={`text-xs mt-1 ${
                            message.sender_type === 'client' 
                              ? 'text-blue-100' 
                              : 'text-gray-500'
                          }`}
                        >
                          {format(new Date(message.timestamp), 'h:mm a, MMM d')}
                        </p>
                      </div>
                    ))}
                    
                    <div className="text-center text-sm text-gray-500 mt-4">
                      <p>To send a message, please contact your trainer directly.</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
