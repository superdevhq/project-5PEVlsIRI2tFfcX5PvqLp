
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WorkoutPlanner from '@/components/WorkoutPlanner';
import NutritionPlanner from '@/components/NutritionPlanner';
import MessagingInterface from '@/components/MessagingInterface';
import ProgressTracker from '@/components/ProgressTracker';
import ClientOverview from './ClientOverview';
import { Client } from '@/types';

interface ClientTabsProps {
  client: Client;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ClientTabs = ({ client, activeTab, onTabChange }: ClientTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="workouts">Workouts</TabsTrigger>
        <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
        <TabsTrigger value="messages">Messages</TabsTrigger>
        <TabsTrigger value="progress">Progress</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <ClientOverview client={client} onTabChange={onTabChange} />
      </TabsContent>
      
      <TabsContent value="workouts">
        <WorkoutPlanner client={client} />
      </TabsContent>
      
      <TabsContent value="nutrition">
        <NutritionPlanner client={client} />
      </TabsContent>
      
      <TabsContent value="messages">
        <MessagingInterface client={client} />
      </TabsContent>
      
      <TabsContent value="progress">
        <ProgressTracker client={client} />
      </TabsContent>
    </Tabs>
  );
};

export default ClientTabs;
