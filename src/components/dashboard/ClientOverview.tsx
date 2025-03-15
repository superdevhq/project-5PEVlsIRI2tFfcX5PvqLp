
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Client } from '@/types';
import { Mail, Phone, Calendar, Activity, Dumbbell, Utensils, MessageSquare, LineChart } from 'lucide-react';
import { calculateBMI, getBMICategory, formatDate } from '@/lib/utils';

interface ClientOverviewProps {
  client: Client;
  onTabChange: (tab: string) => void;
}

const ClientOverview = ({ client, onTabChange }: ClientOverviewProps) => {
  const bmi = calculateBMI(client.weight, client.height);
  const bmiCategory = bmi ? getBMICategory(bmi) : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Client Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Age:</span>
              <span>{client.age} years</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Height:</span>
              <span>{client.height} cm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Weight:</span>
              <span>{client.weight} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Client since:</span>
              <span>{new Date(client.joinDate).toLocaleDateString()}</span>
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
              <p>{client.goals || 'No goals specified'}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-500 mb-1">Notes</h4>
              <p>{client.notes || 'No notes'}</p>
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
              onClick={() => onTabChange("workouts")}
            >
              <Dumbbell className="h-6 w-6" />
              <span>Create Workout</span>
            </Button>
            
            <Button 
              variant="default"
              className="h-auto py-6 flex flex-col items-center justify-center gap-2 w-full"
              onClick={() => onTabChange("nutrition")}
            >
              <Utensils className="h-6 w-6" />
              <span>Plan Nutrition</span>
            </Button>
            
            <Button 
              variant="default"
              className="h-auto py-6 flex flex-col items-center justify-center gap-2 w-full"
              onClick={() => onTabChange("messages")}
            >
              <MessageSquare className="h-6 w-6" />
              <span>Send Message</span>
            </Button>
            
            <Button 
              variant="default"
              className="h-auto py-6 flex flex-col items-center justify-center gap-2 w-full"
              onClick={() => onTabChange("progress")}
            >
              <LineChart className="h-6 w-6" />
              <span>Update Progress</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientOverview;
