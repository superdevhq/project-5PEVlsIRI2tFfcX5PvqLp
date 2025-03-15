
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
import ClientMessagingInterface from '@/components/ClientMessagingInterface';
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
  const { client, user, userType, signOut, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [workoutPlans, setWorkoutPlans] = useState<any[]>([]);
  const [nutritionPlans, setNutritionPlans] = useState<any[]>([]);
  const [progressRecords, setProgressRecords] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [trainerInfo, setTrainerInfo] = useState<any>(null);
  const [loading, setLoading] = useState({
    workouts: true,
    nutrition: true,
    progress: true,
    messages: true,
    trainer: true
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if not a client
  useEffect(() => {
    if (!authLoading && userType !== 'client') {
      navigate('/dashboard', { replace: true });
    }
  }, [userType, authLoading, navigate]);

  useEffect(() => {
    if (client) {
      fetchWorkoutPlans();
      fetchNutritionPlans();
      fetchProgressRecords();
      fetchMessages();
      fetchTrainerInfo();
    }
  }, [client]);

  const fetchWorkoutPlans = async () => {
    if (!client) return;
    
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
    if (!client) return;
    
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
    if (!client) return;
    
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
    if (!client) return;
    
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

  const fetchTrainerInfo = async () => {
    if (!client) return;
    
    try {
      console.log("Fetching trainer info for client:", client);
      
      // First check if the client object already has the trainer_id
      if (client.trainer_id) {
        console.log("Client has trainer_id:", client.trainer_id);
        
        // Then get the trainer details
        const { data: trainerData, error: trainerError } = await supabase
          .from('trainers')
          .select('*')
          .eq('id', client.trainer_id);

        if (trainerError) {
          console.error("Error fetching trainer data:", trainerError);
          throw trainerError;
        }
        
        console.log("Trainer data fetched:", trainerData);
        
        if (trainerData && trainerData.length > 0) {
          setTrainerInfo(trainerData[0]);
        } else {
          console.warn("No trainer found with ID:", client.trainer_id);
        }
      } else {
        // If client doesn't have trainer_id directly, try to fetch it
        console.log("Client doesn't have trainer_id directly, fetching from clients table");
        
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('trainer_id')
          .eq('id', client.id);

        if (clientError) {
          console.error("Error fetching client data:", clientError);
          throw clientError;
        }
        
        console.log("Client data fetched:", clientData);
        
        if (clientData && clientData.length > 0 && clientData[0].trainer_id) {
          const trainerId = clientData[0].trainer_id;
          console.log("Found trainer_id:", trainerId);
          
          // Then get the trainer details
          const { data: trainerData, error: trainerError } = await supabase
            .from('trainers')
            .select('*')
            .eq('id', trainerId);

          if (trainerError) {
            console.error("Error fetching trainer data:", trainerError);
            throw trainerError;
          }
          
          console.log("Trainer data fetched:", trainerData);
          
          if (trainerData && trainerData.length > 0) {
            setTrainerInfo(trainerData[0]);
          } else {
            console.warn("No trainer found with ID:", trainerId);
          }
        } else {
          console.warn("No trainer_id found for client");
        }
      }
    } catch (error: any) {
      console.error('Error fetching trainer info:', error);
      toast({
        title: 'Error',
        description: 'Failed to load trainer information',
        variant: 'destructive',
      });
    } finally {
      setLoading(prev => ({ ...prev, trainer: false }));
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

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Client Data Not Found</h2>
          <p className="text-gray-500 mb-4">We couldn't find your client profile. This could be because:</p>
          <ul className="list-disc text-left mx-auto max-w-md mb-6 pl-5">
            <li className="mb-2">Your account is not set up as a client</li>
            <li className="mb-2">There was an error loading your profile data</li>
            <li className="mb-2">You might be logged in as a trainer instead</li>
          </ul>
          <div className="space-y-4">
            <Button onClick={handleSignOut} className="w-full">Sign Out</Button>
          </div>
        </div>
      </div>
    );
  }

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

          {/* Messages Tab */}
          <TabsContent value="messages">
            {loading.trainer ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : !trainerInfo ? (
              <Card>
                <CardHeader>
                  <CardTitle>No Trainer Assigned</CardTitle>
                  <CardDescription>
                    You don't have a trainer assigned to your account yet.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">
                    Once a trainer is assigned to you, you'll be able to message them directly from here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <ClientMessagingInterface 
                trainerId={trainerInfo.id}
                trainerName={trainerInfo.full_name || 'Your Trainer'}
                trainerAvatar={trainerInfo.avatar_url}
              />
            )}
          </TabsContent>

          {/* Other tabs would go here */}
          <TabsContent value="workouts">
            <Card>
              <CardHeader>
                <CardTitle>Your Workout Plans</CardTitle>
                <CardDescription>
                  View and track your assigned workout plans
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Workout plans content would go here */}
                <p>Workout plans content to be implemented</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nutrition">
            <Card>
              <CardHeader>
                <CardTitle>Your Nutrition Plans</CardTitle>
                <CardDescription>
                  View and track your assigned nutrition plans
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Nutrition plans content would go here */}
                <p>Nutrition plans content to be implemented</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
                <CardDescription>
                  Track your fitness journey progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Progress tracking content would go here */}
                <p>Progress tracking content to be implemented</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
