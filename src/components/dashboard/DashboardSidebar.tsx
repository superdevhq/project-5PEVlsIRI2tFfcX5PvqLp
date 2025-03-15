
import { User, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ClientList from '@/components/ClientList';
import { useAuth } from '@/contexts/AuthContext';
import { Client } from '@/types';

interface DashboardSidebarProps {
  onClientSelect: (client: Client) => void;
}

const DashboardSidebar = ({ onClientSelect }: DashboardSidebarProps) => {
  const { signOut, trainer } = useAuth();

  return (
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
      
      <ClientList onClientSelect={onClientSelect} />
      
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
  );
};

export default DashboardSidebar;
