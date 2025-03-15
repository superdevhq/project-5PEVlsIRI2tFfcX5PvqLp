
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types';

export function useMessages(clientId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !clientId) return;
    
    const fetchMessages = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('client_id', clientId)
          .order('timestamp', { ascending: true });
          
        if (error) {
          throw error;
        }
        
        // Transform the data to match our Message type
        const transformedMessages: Message[] = data.map(message => ({
          id: message.id,
          clientId: message.client_id,
          senderId: message.sender_id,
          senderType: message.sender_type,
          content: message.content,
          timestamp: message.timestamp,
          read: message.read
        }));
        
        setMessages(transformedMessages);
      } catch (err: any) {
        setError(err);
        console.error('Error fetching messages:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
    
    // Set up real-time subscription for messages
    const subscription = supabase
      .channel('messages-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'messages',
          filter: `client_id=eq.${clientId}`
        }, 
        () => {
          fetchMessages();
        }
      )
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [user, clientId]);
  
  const sendMessage = async (content: string, senderType: 'trainer' | 'client') => {
    if (!user || !clientId) return null;
    
    try {
      const newMessage = {
        client_id: clientId,
        sender_id: senderType === 'trainer' ? user.id : clientId,
        sender_type: senderType,
        content,
        timestamp: new Date().toISOString(),
        read: senderType === 'trainer' // Trainer's messages are automatically marked as read
      };
      
      const { data, error } = await supabase
        .from('messages')
        .insert(newMessage)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      return data;
    } catch (err) {
      console.error('Error sending message:', err);
      throw err;
    }
  };
  
  const markAsRead = async (messageId: string) => {
    if (!user) return null;
    
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId);
        
      if (error) {
        throw error;
      }
      
      return true;
    } catch (err) {
      console.error('Error marking message as read:', err);
      throw err;
    }
  };
  
  const markAllAsRead = async () => {
    if (!user || !clientId) return null;
    
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('client_id', clientId)
        .eq('sender_type', 'client'); // Only mark client messages as read
        
      if (error) {
        throw error;
      }
      
      return true;
    } catch (err) {
      console.error('Error marking all messages as read:', err);
      throw err;
    }
  };
  
  return {
    messages,
    loading,
    error,
    sendMessage,
    markAsRead,
    markAllAsRead
  };
}
