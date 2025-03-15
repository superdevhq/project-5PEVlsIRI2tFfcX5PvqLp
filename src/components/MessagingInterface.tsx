
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Client, Message } from '@/types';
import { useMessages } from '@/hooks/useMessages';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { Send, User, Loader2, MessageSquare } from 'lucide-react';

interface MessagingInterfaceProps {
  client: Client;
}

const MessagingInterface = ({ client }: MessagingInterfaceProps) => {
  const { messages, loading, sendMessage } = useMessages(client.id);
  const [newMessage, setNewMessage] = useState('');
  const [simulatedMessage, setSimulatedMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { trainer } = useAuth();
  const { toast } = useToast();

  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      setIsSending(true);
      await sendMessage(newMessage, 'trainer');
      setNewMessage('');
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
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

  const handleSimulateClientMessage = async () => {
    if (!simulatedMessage.trim()) return;
    
    try {
      setIsSending(true);
      await sendMessage(simulatedMessage, 'client');
      setSimulatedMessage('');
      toast({
        title: "Client message simulated",
        description: "The client message has been added to the conversation.",
      });
    } catch (error: any) {
      toast({
        title: "Error simulating message",
        description: error.message || "There was an error simulating the client message.",
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Messages</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="simulate">Simulate Client Response</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="space-y-4">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={client.profileImage} alt={client.name} />
                  <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{client.name}</span>
              </CardTitle>
              <CardDescription>
                {loading ? 'Loading messages...' : messages.length === 0 ? 'No messages yet' : `${messages.length} messages`}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-6">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                  <MessageSquare className="h-12 w-12 mb-2 opacity-20" />
                  <p>No messages yet</p>
                  <p className="text-sm">Start the conversation with {client.name}</p>
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
                        className={`flex ${message.senderType === 'trainer' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.senderType === 'trainer' 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p 
                            className={`text-xs mt-1 ${
                              message.senderType === 'trainer' 
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
        </TabsContent>
        
        <TabsContent value="simulate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Simulate Client Response</CardTitle>
              <CardDescription>
                Use this to simulate messages from {client.name} for testing purposes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={client.profileImage} alt={client.name} />
                    <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-gray-500">{client.email}</p>
                  </div>
                </div>
                
                <Textarea
                  placeholder={`Type a message as if you were ${client.name}...`}
                  value={simulatedMessage}
                  onChange={(e) => setSimulatedMessage(e.target.value)}
                  rows={4}
                />
                
                <Button 
                  onClick={handleSimulateClientMessage} 
                  disabled={!simulatedMessage.trim() || isSending}
                  className="w-full"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Simulating...
                    </>
                  ) : (
                    <>
                      <User className="mr-2 h-4 w-4" />
                      Simulate Client Message
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>About Simulated Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>
                  This feature allows you to simulate client responses for testing and demonstration purposes.
                </p>
                <p>
                  In a production environment, clients would have their own interface to respond to your messages.
                </p>
                <p>
                  Simulated messages will appear in the chat as if they were sent by the client.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MessagingInterface;
