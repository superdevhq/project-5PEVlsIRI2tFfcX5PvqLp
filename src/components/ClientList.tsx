```javascript
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, Calendar } from 'lucide-react';
import { useClients } from '@/hooks/useClients';
import { Client } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import CreateClientAccount from './CreateClientAccount';
import { Badge } from "@/components/ui/badge";
import { formatDate } from '@/lib/utils';

interface ClientListProps {
  onClientSelect: (client: Client) => void;
}

const ClientList = ({ onClientSelect }: ClientListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { clients, loading, refreshClients } = useClients();
  const { toast } = useToast();
  
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClientCreated = () => {
    refreshClients();
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search clients..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500">Clients 1.0</h3>
          <Badge variant="outline" className="text-xs">
            {clients.length} total
          </Badge>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <ul className="space-y-2">
            {filteredClients.length > 0 ? (
              filteredClients.map(client => (
                <li key={client.id}>
                  <button
                    className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition-colors text-left"
                    onClick={() => onClientSelect(client)}
                  >
                    <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0 border border-gray-100">
                      <img 
                        src={client.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(client.name)}`} 
                        alt={client.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-medium truncate">{client.name}</p>
                      <div className="flex items-center text-xs text-gray-500 gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Joined {formatDate(client.joinDate, 'short')}</span>
                      </div>
                    </div>
                  </button>
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-500 p-4 text-center border border-dashed rounded-lg">
                {searchQuery ? 'No clients found' : 'No clients yet'}
              </li>
            )}
          </ul>
        )}
      </div>
      
      <div className="space-y-2">
        <CreateClientAccount onClientCreated={handleClientCreated} />
      </div>
    </div>
  );
};

export default ClientList;
```