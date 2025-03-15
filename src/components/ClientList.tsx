
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus } from 'lucide-react';
import { mockClients } from '@/data/mockData';
import { Client } from '@/types';

interface ClientListProps {
  onClientSelect: (client: Client) => void;
}

const ClientList = ({ onClientSelect }: ClientListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredClients = mockClients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-500">Your Clients</h3>
        <ul className="space-y-1">
          {filteredClients.length > 0 ? (
            filteredClients.map(client => (
              <li key={client.id}>
                <button
                  className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition-colors text-left"
                  onClick={() => onClientSelect(client)}
                >
                  <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
                    <img 
                      src={client.profileImage || "https://via.placeholder.com/150"} 
                      alt={client.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-medium truncate">{client.name}</p>
                    <p className="text-xs text-gray-500 truncate">{client.email}</p>
                  </div>
                </button>
              </li>
            ))
          ) : (
            <li className="text-sm text-gray-500 p-2">No clients found</li>
          )}
        </ul>
      </div>
      
      <Button className="w-full flex items-center gap-2" variant="outline">
        <UserPlus className="h-4 w-4" />
        <span>Add New Client</span>
      </Button>
    </div>
  );
};

export default ClientList;
