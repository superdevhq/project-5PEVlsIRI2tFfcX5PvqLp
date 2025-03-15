
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Client } from '@/types';
import { Mail, Phone, Calendar, Activity, ArrowLeft, User } from 'lucide-react';
import { calculateBMI, getBMICategory, formatDate } from '@/lib/utils';

interface ClientHeaderProps {
  client: Client;
  onBackToClients: () => void;
}

const ClientHeader = ({ client, onBackToClients }: ClientHeaderProps) => {
  const bmi = calculateBMI(client.weight, client.height);
  const bmiCategory = bmi ? getBMICategory(bmi) : null;

  return (
    <div className="mb-6">
      <Button 
        variant="ghost" 
        size="sm" 
        className="mb-4 text-gray-500"
        onClick={onBackToClients}
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to all clients
      </Button>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-blue-100">
              <img 
                src={client.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(client.name)}`} 
                alt={client.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-bold">{client.name}</h2>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-gray-500">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span>{client.email}</span>
                  </div>
                  {client.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Client since {formatDate(client.joinDate)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {bmi && (
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
                )}
                <Badge variant="outline" className="text-xs px-3 py-1">
                  Age: {client.age}
                </Badge>
                <Badge variant="outline" className="text-xs px-3 py-1">
                  <Activity className="h-3 w-3 mr-1" />
                  {client.height} cm, {client.weight} kg
                </Badge>
              </div>
            </div>
            
            {client.goals && (
              <div className="mt-2 p-3 bg-blue-50 rounded-md text-sm">
                <span className="font-medium">Goals: </span>
                {client.goals}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientHeader;
