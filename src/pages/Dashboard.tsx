
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ClientList from '@/components/ClientList';
import WorkoutPlanner from '@/components/WorkoutPlanner';
import NutritionPlanner from '@/components/NutritionPlanner';
import MessagingInterface from '@/components/MessagingInterface';
import ProgressTracker from '@/components/ProgressTracker';
import { mockClients } from '@/data/mockData';
import { Client } from '@/types';

const Dashboard = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setActiveTab("overview");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-blue-600">FitPro AI</h1>
          <p className="text-gray-500 text-sm">Personal Trainer Dashboard</p>
        </div>
        <ClientList onClientSelect={handleClientSelect} />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {selectedClient ? (
          <>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-full overflow-hidden">
                <img 
                  src={selectedClient.profileImage || "https://via.placeholder.com/150"} 
                  alt={selectedClient.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{selectedClient.name}</h2>
                <p className="text-gray-500">{selectedClient.email} • {selectedClient.phone}</p>
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
                          <p>{selectedClient.goals}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-500 mb-1">Notes</h4>
                          <p>{selectedClient.notes}</p>
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
                      <div className="flex flex-wrap gap-4">
                        <button 
                          onClick={() => setActiveTab("workouts")}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Create Workout
                        </button>
                        <button 
                          onClick={() => setActiveTab("nutrition")}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        >
                          Plan Nutrition
                        </button>
                        <button 
                          onClick={() => setActiveTab("messages")}
                          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                        >
                          Send Message
                        </button>
                        <button 
                          onClick={() => setActiveTab("progress")}
                          className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
                        >
                          Update Progress
                        </button>
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
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-bold mb-2">Welcome to FitPro AI</h2>
              <p className="text-gray-500 mb-6">
                Select a client from the sidebar to view their details and manage their fitness journey.
              </p>
              <div className="flex justify-center">
                <button 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  onClick={() => {
                    // For demo purposes, select the first client
                    if (mockClients.length > 0) {
                      handleClientSelect(mockClients[0]);
                    }
                  }}
                >
                  Select a Client
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
