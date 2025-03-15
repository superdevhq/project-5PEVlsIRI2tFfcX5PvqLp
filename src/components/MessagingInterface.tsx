
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot } from 'lucide-react';
import { Client, Message } from '@/types';
import { mockMessages } from '@/data/mockData';

interface MessagingInterfaceProps {
  client: Client;
}

const MessagingInterface = ({ client }: MessagingInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>(
    mockMessages.filter(msg => msg.clientId === client.id)
  );
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: Date.now().toString(),
      clientId: client.id,
      senderId: 'trainer-1',
      senderType: 'trainer',
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
    
    // Simulate client response after a delay
    if (Math.random() > 0.5) {
      setTimeout(() => {
        const response: Message = {
          id: (Date.now() + 1).toString(),
          clientId: client.id,
          senderId: client.id,
          senderType: 'client',
          content: getRandomResponse(),
          timestamp: new Date().toISOString(),
          read: false
        };
        
        setMessages(prev => [...prev, response]);
      }, 2000 + Math.random() * 3000);
    }
  };

  const getRandomResponse = () => {
    const responses = [
      "Thanks for the update!",
      "Got it, I'll try to follow the plan.",
      "I'm feeling a bit sore from yesterday's workout.",
      "The nutrition plan is working well so far.",
      "Can we adjust the workout intensity for next week?",
      "I'll let you know how it goes!",
      "I've been drinking more water as you suggested.",
      "I'm really enjoying the new exercise routine."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateAIMessage = () => {
    // Simulate AI-generated message
    const aiSuggestions = [
      `Hi ${client.name}, just checking in on your progress with the workout plan. How are you feeling after yesterday's session?`,
      `${client.name}, I noticed you've been consistent with your workouts this week. Great job! Would you like to increase the intensity next week?`,
      `Remember to stay hydrated during your workouts, ${client.name}. Aim for at least 2-3 liters of water daily.`,
      `${client.name}, your nutrition plan for next week is ready. I've adjusted the macros based on your recent progress.`,
      `Don't forget to log your measurements this weekend, ${client.name}. It's important to track your progress.`
    ];
    
    setNewMessage(aiSuggestions[Math.floor(Math.random() * aiSuggestions.length)]);
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatMessageDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  // Group messages by date
  const groupedMessages: { [date: string]: Message[] } = {};
  messages.forEach(message => {
    const date = formatMessageDate(message.timestamp);
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });

  return (
    <div className="h-[calc(100vh-16rem)] flex flex-col">
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="flex justify-between items-center">
            <span>Conversation with {client.name}</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={generateAIMessage}
              className="flex items-center gap-2"
            >
              <Bot className="h-4 w-4" />
              <span>AI Suggestions</span>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            {Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <div key={date}>
                <div className="flex justify-center mb-4">
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                    {date}
                  </span>
                </div>
                <div className="space-y-3">
                  {dateMessages.map(message => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.senderType === 'trainer' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.senderType === 'trainer' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderType === 'trainer' 
                            ? 'text-blue-100' 
                            : 'text-gray-500'
                        }`}>
                          {formatMessageTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex gap-2 mt-4">
        <Input 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <Button 
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
          className="flex items-center gap-2"
        >
          <Send className="h-4 w-4" />
          <span>Send</span>
        </Button>
      </div>
      
      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">Quick Responses</h3>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setNewMessage("How are you feeling after yesterday's workout?")}
          >
            Workout Check-in
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setNewMessage("I've updated your nutrition plan for next week. Please check it out when you have a moment.")}
          >
            Nutrition Update
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setNewMessage("Great progress this week! Keep up the good work.")}
          >
            Encouragement
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setNewMessage("Don't forget to log your measurements this weekend.")}
          >
            Reminder
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessagingInterface;
