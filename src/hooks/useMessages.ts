
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types';

export function useMessages(clientId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  // Transform database message to our Message type
  const transformMessage = useCallback((message: any): Message => ({
    id: message.id,
    clientId: message.client_id,
    senderId: message.sender_id,
    senderType: message.sender_type,
    content: message.content,
    timestamp: message.timestamp,
    read: message.read
  }), []);

  // Fetch messages function that can be called multiple times
  const fetchMessages = useCallback(async () => {
    if (!user || !clientId) return;
    
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
      const transformedMessages: Message[] = data.map(transformMessage);
      
      setMessages(transformedMessages);
    } catch (err: any) {
      setError(err);
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  }, [user, clientId, transformMessage]);

  useEffect(() => {
    if (!user || !clientId) return;
    
    fetchMessages();
    
    // Set up real-time subscription for messages with specific handlers for each event type
    const subscription = supabase
      .channel(`messages-${clientId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `client_id=eq.${clientId}`
        }, 
        (payload) => {
          // Immediately add the new message to the state
          const newMessage = transformMessage(payload.new);
          setMessages(prevMessages => [...prevMessages, newMessage]);
        }
      )
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'messages',
          filter: `client_id=eq.${clientId}`
        }, 
        (payload) => {
          // Update the specific message in the state
          const updatedMessage = transformMessage(payload.new);
          setMessages(prevMessages => 
            prevMessages.map(msg => 
              msg.id === updatedMessage.id ? updatedMessage : msg
            )
          );
        }
      )
      .on('postgres_changes', 
        { 
          event: 'DELETE', 
          schema: 'public', 
          table: 'messages',
          filter: `client_id=eq.${clientId}`
        }, 
        (payload) => {
          // Remove the deleted message from the state
          setMessages(prevMessages => 
            prevMessages.filter(msg => msg.id !== payload.old.id)
          );
        }
      )
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [user, clientId, fetchMessages, transformMessage]);
  
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
      
      // Optimistically update the UI with the new message
      const transformedMessage = transformMessage(data);
      setMessages(prevMessages => [...prevMessages, transformedMessage]);
      
      return transformedMessage;
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
      
      // Optimistically update the UI
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === messageId ? { ...msg, read: true } : msg
        )
      );
      
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
      
      // Optimistically update the UI
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.senderType === 'client' ? { ...msg, read: true } : msg
        )
      );
      
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
    markAllAsRead,
    refreshMessages: fetchMessages // Expose the refresh function
  };
}
