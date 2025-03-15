
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Client } from '@/types';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user, userType, trainer } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    fetchClients();
    
    // Set up real-time subscription for clients
    const subscription = supabase
      .channel('clients-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'clients',
          filter: userType === 'trainer' ? `trainer_id=eq.${user.id}` : null
        }, 
        () => {
          fetchClients();
        }
      )
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [user, userType]);

  const fetchClients = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // If user is a trainer, fetch their clients
      if (userType === 'trainer') {
        console.log('Fetching clients for trainer:', user.id);
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('trainer_id', user.id)
          .order('name');
          
        if (error) {
          throw error;
        }
        
        // Transform the data to match our Client type
        const transformedClients: Client[] = data.map(client => ({
          id: client.id,
          name: client.name,
          email: client.email || '',
          phone: client.phone || '',
          age: client.age || 0,
          height: client.height || 0,
          weight: client.weight || 0,
          goals: client.goals || '',
          notes: client.notes || '',
          joinDate: client.join_date,
          profileImage: client.profile_image
        }));
        
        setClients(transformedClients);
      } else {
        // If user is a client, they don't have clients
        setClients([]);
      }
    } catch (err: any) {
      setError(err);
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const addClient = async (client: Omit<Client, 'id'>) => {
    if (!user) throw new Error('User not authenticated');
    if (userType !== 'trainer') throw new Error('Only trainers can add clients');
    
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert({
          name: client.name,
          email: client.email,
          phone: client.phone,
          age: client.age,
          height: client.height,
          weight: client.weight,
          goals: client.goals,
          notes: client.notes,
          join_date: client.joinDate,
          profile_image: client.profileImage,
          trainer_id: user.id
        })
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      return data;
    } catch (err) {
      console.error('Error adding client:', err);
      throw err;
    }
  };

  const refreshClients = () => {
    fetchClients();
  };
  
  return {
    clients,
    loading,
    error,
    addClient,
    refreshClients
  };
}
