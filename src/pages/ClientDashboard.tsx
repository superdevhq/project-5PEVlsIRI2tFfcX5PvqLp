
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
  const { client, user, userType, signOut, loading: authLoading } = useAuth();
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
          <p className="text-gray-500 mb-4">We couldn't find your client profile.</p>
          <Button onClick={handleSignOut}>Sign Out</Button>
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

              {/* Rest of the component remains the same */}
              {/* ... */}
            </div>
          </TabsContent>

          {/* Other tabs remain the same */}
          {/* ... */}
        </Tabs>
      </main>
    </div>
  );
}
