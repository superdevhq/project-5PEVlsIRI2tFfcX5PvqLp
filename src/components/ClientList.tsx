
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, Loader2, Mail, Phone, Calendar, Activity } from 'lucide-react';
import { useClients } from '@/hooks/useClients';
import { Client } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import CreateClientAccount from './CreateClientAccount';
import { Badge } from "@/components/ui/badge";
import { calculateBMI, getBMICategory, formatDate } from '@/lib/utils';

interface ClientListProps {
  onClientSelect: (client: Client) => void;
}

const ClientList = ({ onClientSelect }: ClientListProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { clients, loading, addClient, refreshClients } = useClients();
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // New client form state
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    age: 30,
    height: 170,
    weight: 70,
    goals: '',
    notes: ''
  });
  
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsAddingClient(true);
      
      await addClient({
        ...newClient,
        joinDate: new Date().toISOString(),
        profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(newClient.name)}&background=random`
      });
      
      toast({
        title: "Client added",
        description: `${newClient.name} has been added to your client list.`,
      });
      
      // Reset form
      setNewClient({
        name: '',
        email: '',
        phone: '',
        age: 30,
        height: 170,
        weight: 70,
        goals: '',
        notes: ''
      });
      
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error adding client",
        description: error.message || "There was an error adding the client.",
        variant: "destructive",
      });
    } finally {
      setIsAddingClient(false);
    }
  };

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
          <h3 className="text-sm font-medium text-gray-500">Your Clients</h3>
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
              filteredClients.map(client => {
                const bmi = calculateBMI(client.weight, client.height);
                const bmiCategory = bmi ? getBMICategory(bmi) : null;
                
                return (
                  <li key={client.id}>
                    <button
                      className="w-full flex flex-col p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all text-left shadow-sm hover:shadow"
                      onClick={() => onClientSelect(client)}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-12 w-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-blue-100">
                          <img 
                            src={client.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(client.name)}`} 
                            alt={client.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="overflow-hidden flex-1">
                          <p className="font-medium text-base truncate">{client.name}</p>
                          <div className="flex items-center text-xs text-gray-500 gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Joined {formatDate(client.joinDate, 'short')}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          {bmi && (
                            <Badge 
                              variant={
                                bmiCategory === 'Normal weight' 
                                  ? 'outline' 
                                  : bmiCategory?.includes('Obesity') 
                                    ? 'destructive' 
                                    : 'secondary'
                              }
                              className="text-xs mb-1"
                            >
                              BMI: {bmi}
                            </Badge>
                          )}
                          <div className="text-xs text-gray-500">
                            {client.age} years
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1 text-gray-500">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{client.email}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Phone className="h-3 w-3" />
                          <span>{client.phone || 'No phone'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Activity className="h-3 w-3" />
                          <span>{client.height} cm, {client.weight} kg</span>
                        </div>
                        {client.goals && (
                          <div className="flex items-center gap-1 text-gray-500 col-span-2">
                            <span className="font-medium">Goals:</span>
                            <span className="truncate">{client.goals}</span>
                          </div>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })
            ) : (
              <li className="text-sm text-gray-500 p-4 text-center border border-dashed rounded-lg">
                {searchQuery ? 'No clients found' : 'No clients yet'}
              </li>
            )}
          </ul>
        )}
      </div>
      
      <div className="space-y-2">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full flex items-center gap-2" variant="outline">
              <UserPlus className="h-4 w-4" />
              <span>Add New Client</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleAddClient}>
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
                <DialogDescription>
                  Enter the details of your new client. You can add more information later.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newClient.name}
                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="age" className="text-right">
                    Age
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    value={newClient.age}
                    onChange={(e) => setNewClient({ ...newClient, age: parseInt(e.target.value) || 0 })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="height" className="text-right">
                    Height (cm)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    value={newClient.height}
                    onChange={(e) => setNewClient({ ...newClient, height: parseInt(e.target.value) || 0 })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="weight" className="text-right">
                    Weight (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    value={newClient.weight}
                    onChange={(e) => setNewClient({ ...newClient, weight: parseInt(e.target.value) || 0 })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="goals" className="text-right">
                    Goals
                  </Label>
                  <Textarea
                    id="goals"
                    value={newClient.goals}
                    onChange={(e) => setNewClient({ ...newClient, goals: e.target.value })}
                    className="col-span-3"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    value={newClient.notes}
                    onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                    className="col-span-3"
                    rows={2}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isAddingClient || !newClient.name}>
                  {isAddingClient ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Client'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        <CreateClientAccount onClientCreated={handleClientCreated} />
      </div>
    </div>
  );
};

export default ClientList;
