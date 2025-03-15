
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Client } from '@/types';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    const fetchClients = async () => {
      try {
        setLoading(true);
        
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
      } catch (err: any) {
        setError(err);
        console.error('Error fetching clients:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClients();
    
    // Set up real-time subscription for clients
    const subscription = supabase
      .channel('clients-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'clients',
          filter: `trainer_id=eq.${user.id}`
        }, 
        () => {
          fetchClients();
        }
      )
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [user]);
  
  const addClient = async (newClient: Omit<Client, 'id'>) => {
    if (!user) return null;
    
    try {
      // Transform client data to match database schema
      const clientData = {
        trainer_id: user.id,
        name: newClient.name,
        email: newClient.email,
        phone: newClient.phone,
        age: newClient.age,
        height: newClient.height,
        weight: newClient.weight,
        goals: newClient.goals,
        notes: newClient.notes,
        join_date: newClient.joinDate,
        profile_image: newClient.profileImage
      };
      
      const { data, error } = await supabase
        .from('clients')
        .insert(clientData)
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
  
  const updateClient = async (id: string, updates: Partial<Client>) => {
    if (!user) return null;
    
    try {
      // Transform client data to match database schema
      const clientData: any = {};
      
      if (updates.name) clientData.name = updates.name;
      if (updates.email) clientData.email = updates.email;
      if (updates.phone) clientData.phone = updates.phone;
      if (updates.age) clientData.age = updates.age;
      if (updates.height) clientData.height = updates.height;
      if (updates.weight) clientData.weight = updates.weight;
      if (updates.goals) clientData.goals = updates.goals;
      if (updates.notes) clientData.notes = updates.notes;
      if (updates.joinDate) clientData.join_date = updates.joinDate;
      if (updates.profileImage) clientData.profile_image = updates.profileImage;
      
      const { data, error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', id)
        .eq('trainer_id', user.id)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      return data;
    } catch (err) {
      console.error('Error updating client:', err);
      throw err;
    }
  };
  
  const deleteClient = async (id: string) => {
    if (!user) return null;
    
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)
        .eq('trainer_id', user.id);
        
      if (error) {
        throw error;
      }
      
      return true;
    } catch (err) {
      console.error('Error deleting client:', err);
      throw err;
    }
  };
  
  return {
    clients,
    loading,
    error,
    addClient,
    updateClient,
    deleteClient
  };
}
