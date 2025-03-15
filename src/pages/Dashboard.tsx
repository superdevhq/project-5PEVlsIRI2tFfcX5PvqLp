
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ClientList from '@/components/ClientList';
import WorkoutPlanner from '@/components/WorkoutPlanner';
import NutritionPlanner from '@/components/NutritionPlanner';
import MessagingInterface from '@/components/MessagingInterface';
import ProgressTracker from '@/components/ProgressTracker';
import { useClients } from '@/hooks/useClients';
import { useAuth } from '@/contexts/AuthContext';
import { Client } from '@/types';
import { Dumbbell, Utensils, MessageSquare, LineChart, LogOut, User, Mail, Phone, Calendar, Activity, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { calculateBMI, getBMICategory, formatDate } from '@/lib/utils';

const Dashboard = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const { clients, loading: clientsLoading } = useClients();
  const { signOut, trainer, userType, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if not a trainer
  useEffect(() => {
    if (!authLoading && userType !== 'trainer') {
      navigate('/client-dashboard', { replace: true });
    }
  }, [userType, authLoading, navigate]);

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setActiveTab("overview");
  };

  const handleBackToClients = () => {
    setSelectedClient(null);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-blue-600">FitPro AI</h1>
          <p className="text-gray-500 text-sm">Personal Trainer Dashboard</p>
        </div>
        
        {trainer && (
          <div className="mb-6 flex items-center gap-3 p-3 bg-blue-50 rounded-md">
            <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0 bg-blue-200 flex items-center justify-center">
              {trainer.avatar_url ? (
                <img 
                  src={trainer.avatar_url} 
                  alt={trainer.full_name || 'Trainer'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-blue-600" />
              )}
            </div>
            <div className="overflow-hidden">
              <p className="font-medium truncate">{trainer.full_name || 'Trainer'}</p>
              <p className="text-xs text-gray-500 truncate">{trainer.email}</p>
            </div>
          </div>
        )}
        
        <ClientList onClientSelect={handleClientSelect} />
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-500 hover:text-gray-900"
            onClick={signOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {selectedClient ? (
          <>
            <div className="mb-6">
              <Button 
                variant="ghost" 
                size="sm" 
                className="mb-4 text-gray-500"
                onClick={handleBackToClients}
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to all clients
              </Button>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-blue-100">
                      <img 
                        src={selectedClient.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedClient.name)}`} 
                        alt={selectedClient.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <h2 className="text-2xl font-bold">{selectedClient.name}</h2>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-gray-500">
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            <span>{selectedClient.email}</span>
                          </div>
                          {selectedClient.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              <span>{selectedClient.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Client since {formatDate(selectedClient.joinDate)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {(() => {
                          const bmi = calculateBMI(selectedClient.weight, selectedClient.height);
                          const bmiCategory = bmi ? getBMICategory(bmi) : null;
                          
                          return bmi ? (
                            <Badge 
                              variant={
                                bmiCategory === 'Normal weight' 
                                  ? 'outline' 
                                  : bmiCategory?.includes('Obesity') 
                                    ? 'destructive' 
                                    : 'secondary'
                              }
                              className="text-xs px-3 py-1"
                            >
                              BMI: {bmi} ({bmiCategory})
                            </Badge>
                          ) : null;
                        })()}
                        <Badge variant="outline" className="text-xs px-3 py-1">
                          Age: {selectedClient.age}
                        </Badge>
                        <Badge variant="outline" className="text-xs px-3 py-1">
                          <Activity className="h-3 w-3 mr-1" />
                          {selectedClient.height} cm, {selectedClient.weight} kg
                        </Badge>
                      </div>
                    </div>
                    
                    {selectedClient.goals && (
                      <div className="mt-2 p-3 bg-blue-50 rounded-md text-sm">
                        <span className="font-medium">Goals: </span>
                        {selectedClient.goals}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="workouts">Workouts</TabsTrigger>
                <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="progress">Progress</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Client Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Age:</span>
                          <span>{selectedClient.age} years</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Height:</span>
                          <span>{selectedClient.height} cm</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Weight:</span>
                          <span>{selectedClient.weight} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Client since:</span>
                          <span>{new Date(selectedClient.joinDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Goals & Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-500 mb-1">Goals</h4>
                          <p>{selectedClient.goals || 'No goals specified'}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-500 mb-1">Notes</h4>
                          <p>{selectedClient.notes || 'No notes'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                      <CardDescription>Common tasks for this client</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        <Button 
                          variant="default"
                          className="h-auto py-6 flex flex-col items-center justify-center gap-2 w-full"
                          onClick={() => setActiveTab("workouts")}
                        >
                          <Dumbbell className="h-6 w-6" />
                          <span>Create Workout</span>
                        </Button>
                        
                        <Button 
                          variant="default"
                          className="h-auto py-6 flex flex-col items-center justify-center gap-2 w-full"
                          onClick={() => setActiveTab("nutrition")}
                        >
                          <Utensils className="h-6 w-6" />
                          <span>Plan Nutrition</span>
                        </Button>
                        
                        <Button 
                          variant="default"
                          className="h-auto py-6 flex flex-col items-center justify-center gap-2 w-full"
                          onClick={() => setActiveTab("messages")}
                        >
                          <MessageSquare className="h-6 w-6" />
                          <span>Send Message</span>
                        </Button>
                        
                        <Button 
                          variant="default"
                          className="h-auto py-6 flex flex-col items-center justify-center gap-2 w-full"
                          onClick={() => setActiveTab("progress")}
                        >
                          <LineChart className="h-6 w-6" />
                          <span>Update Progress</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="workouts">
                <WorkoutPlanner client={selectedClient} />
              </TabsContent>
              
              <TabsContent value="nutrition">
                <NutritionPlanner client={selectedClient} />
              </TabsContent>
              
              <TabsContent value="messages">
                <MessagingInterface client={selectedClient} />
              </TabsContent>
              
              <TabsContent value="progress">
                <ProgressTracker client={selectedClient} />
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)]">
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-bold mb-2">Welcome to FitPro AI</h2>
              {clientsLoading ? (
                <div className="flex justify-center py-4">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <span className="ml-2">Loading clients...</span>
                </div>
              ) : clients.length > 0 ? (
                <p className="text-gray-500 mb-6">
                  Select a client from the sidebar to view their details and manage their fitness journey.
                </p>
              ) : (
                <p className="text-gray-500 mb-6">
                  Get started by adding your first client using the "Add New Client" button in the sidebar.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
