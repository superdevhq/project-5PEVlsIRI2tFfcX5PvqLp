
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Message } from '@/types';
import { useMessages } from '@/hooks/useMessages';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { Send, Loader2, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ClientMessagingInterfaceProps {
  trainerId?: string;
  trainerName?: string;
  trainerAvatar?: string;
}

const ClientMessagingInterface = ({ 
  trainerId, 
  trainerName, 
  trainerAvatar 
}: ClientMessagingInterfaceProps) => {
  const { client } = useAuth();
  const { messages, loading: messagesLoading, sendMessage } = useMessages(client?.id || '');
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [trainerInfo, setTrainerInfo] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch trainer info if not provided
  useEffect(() => {
    const fetchTrainerInfo = async () => {
      if (!client) return;
      
      // If trainer info is already provided as props, use that
      if (trainerId && trainerName) {
        setTrainerInfo({
          id: trainerId,
          full_name: trainerName,
          avatar_url: trainerAvatar
        });
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        console.log("Fetching trainer info for client:", client);
        
        // First check if we need to get the trainer_id from the clients table
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('trainer_id')
          .eq('id', client.id)
          .single();
          
        if (clientError) {
          console.error("Error fetching client data:", clientError);
          throw clientError;
        }
        
        console.log("Client data with trainer_id:", clientData);
        
        if (clientData?.trainer_id) {
          // Then get the trainer details
          const { data: trainerData, error: trainerError } = await supabase
            .from('trainers')
            .select('*')
            .eq('id', clientData.trainer_id)
            .single();
            
          if (trainerError) {
            console.error("Error fetching trainer data:", trainerError);
            throw trainerError;
          }
          
          console.log("Trainer data fetched:", trainerData);
          setTrainerInfo(trainerData);
        } else {
          console.warn("No trainer_id found for client");
        }
      } catch (error) {
        console.error("Error fetching trainer info:", error);
        toast({
          title: "Error",
          description: "Failed to load trainer information",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrainerInfo();
  }, [client, trainerId, trainerName, trainerAvatar, toast]);

  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !client || !trainerInfo) return;
    
    try {
      setIsSending(true);
      await sendMessage(newMessage, 'client');
      setNewMessage('');
      toast({
        title: "Message sent",
        description: "Your message has been sent to your trainer.",
      });
    } catch (error: any) {
      toast({
        title: "Error sending message",
        description: error.message || "There was an error sending your message.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const formatMessageTime = (timestamp: string) => {
    return format(new Date(timestamp), 'h:mm a');
  };

  const formatMessageDate = (timestamp: string) => {
    return format(new Date(timestamp), 'MMMM d, yyyy');
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups: { [date: string]: Message[] } = {};
    
    messages.forEach(message => {
      const date = formatMessageDate(message.timestamp);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return groups;
  };

  const messageGroups = groupMessagesByDate();

  if (loading || messagesLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Messages with Your Trainer</h2>
        </div>
        <Card className="h-[600px] flex flex-col justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-gray-500">Loading messages...</p>
        </Card>
      </div>
    );
  }

  if (!trainerInfo) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Messages</h2>
        </div>
        <Card className="h-[600px] flex flex-col justify-center items-center p-8 text-center">
          <MessageSquare className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-medium mb-2">No Trainer Assigned</h3>
          <p className="text-gray-500 max-w-md">
            You don't have a trainer assigned to your account yet. Once a trainer is assigned to you, 
            you'll be able to message them directly from here.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Messages with Your Trainer</h2>
      </div>

      <Card className="h-[600px] flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={trainerInfo.avatar_url} alt={trainerInfo.full_name} />
              <AvatarFallback>{trainerInfo.full_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>{trainerInfo.full_name}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <MessageSquare className="h-12 w-12 mb-2 opacity-20" />
              <p>No messages yet</p>
              <p className="text-sm">Start the conversation with your trainer</p>
            </div>
          ) : (
            Object.entries(messageGroups).map(([date, dateMessages]) => (
              <div key={date} className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-2 text-xs text-gray-500">
                      {date}
                    </span>
                  </div>
                </div>
                
                {dateMessages.map(message => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.senderType === 'client' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.senderType === 'client' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p 
                        className={`text-xs mt-1 ${
                          message.senderType === 'client' 
                            ? 'text-blue-100' 
                            : 'text-gray-500'
                        }`}
                      >
                        {formatMessageTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        <CardFooter className="border-t p-3">
          <div className="flex w-full items-center space-x-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isSending}
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={!newMessage.trim() || isSending}
              size="icon"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ClientMessagingInterface;
