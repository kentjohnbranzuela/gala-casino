
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, MessageSquare } from 'lucide-react';

interface CustomerMessage {
  id: string;
  username: string;
  message: string;
  timestamp: string;
  read: boolean;
  replied: boolean;
  reply?: string;
}

const CustomerSupportManagement: React.FC = () => {
  const [messages, setMessages] = useState<CustomerMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<CustomerMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  
  useEffect(() => {
    // Load customer service messages from localStorage
    const loadMessages = () => {
      try {
        const storedMessages = localStorage.getItem('customerServiceMessages');
        if (storedMessages) {
          const parsedMessages = JSON.parse(storedMessages);
          setMessages(parsedMessages);
        } else {
          localStorage.setItem('customerServiceMessages', JSON.stringify([]));
          setMessages([]);
        }
      } catch (error) {
        console.error("Error loading customer service messages:", error);
        setMessages([]);
      }
    };
    
    loadMessages();
    
    // Mark messages as read when admin views them
    if (messages.length > 0) {
      const updatedMessages = messages.map(msg => ({...msg, read: true}));
      setMessages(updatedMessages);
      localStorage.setItem('customerServiceMessages', JSON.stringify(updatedMessages));
    }
  }, []);
  
  const handleSelectMessage = (message: CustomerMessage) => {
    setSelectedMessage(message);
    
    // Mark as read
    const updatedMessages = messages.map(msg => 
      msg.id === message.id ? {...msg, read: true} : msg
    );
    setMessages(updatedMessages);
    localStorage.setItem('customerServiceMessages', JSON.stringify(updatedMessages));
  };
  
  const handleSendReply = () => {
    if (!selectedMessage) return;
    if (!replyText.trim()) {
      toast.error('Please enter a reply message');
      return;
    }
    
    // Update the message with reply
    const updatedMessages = messages.map(msg => 
      msg.id === selectedMessage.id ? 
      {...msg, replied: true, reply: replyText, read: true} : 
      msg
    );
    
    setMessages(updatedMessages);
    localStorage.setItem('customerServiceMessages', JSON.stringify(updatedMessages));
    
    // Add notification for the user
    const notifications = JSON.parse(localStorage.getItem('userNotifications') || '{}');
    if (!notifications[selectedMessage.username]) {
      notifications[selectedMessage.username] = [];
    }
    
    notifications[selectedMessage.username].push({
      id: Date.now().toString(),
      type: 'support',
      message: 'Customer support has responded to your inquiry',
      read: false,
      timestamp: new Date().toISOString()
    });
    
    localStorage.setItem('userNotifications', JSON.stringify(notifications));
    
    // Trigger notification event
    window.dispatchEvent(new CustomEvent('user:notification', {
      detail: { username: selectedMessage.username }
    }));
    
    toast.success('Reply sent to user');
    setReplyText('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-casino-purple-dark rounded-lg p-6">
        <h2 className="text-xl font-semibold text-casino-gold mb-4">Customer Support Requests</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <h3 className="font-medium text-white mb-3">Messages</h3>
            
            <div className="overflow-y-auto max-h-[500px]">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <MessageSquare className="mx-auto h-10 w-10 mb-2 opacity-50" />
                  <p>No customer support requests</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id}
                      onClick={() => handleSelectMessage(msg)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedMessage?.id === msg.id 
                          ? 'bg-casino-purple' 
                          : 'bg-casino-purple-dark hover:bg-casino-purple/50'
                      } ${!msg.read ? 'border-l-4 border-red-500' : ''}`}
                    >
                      <div className="flex justify-between items-start">
                        <p className="font-medium text-white">{msg.username}</p>
                        <span className="text-xs text-gray-400">
                          {new Date(msg.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 truncate">{msg.message}</p>
                      {msg.replied && (
                        <div className="text-xs text-green-400 mt-1">Replied</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="md:col-span-2 bg-casino-dark rounded-lg p-4">
            {selectedMessage ? (
              <div className="space-y-4">
                <div className="border-b border-gray-700 pb-3">
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-white">From: {selectedMessage.username}</h3>
                    <span className="text-sm text-gray-400">
                      {new Date(selectedMessage.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 bg-casino-purple-dark rounded-lg">
                  <p className="text-white">{selectedMessage.message}</p>
                </div>
                
                {selectedMessage.replied && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Your Reply:</h4>
                    <div className="p-4 bg-casino-purple/40 rounded-lg">
                      <p className="text-white">{selectedMessage.reply}</p>
                    </div>
                  </div>
                )}
                
                {!selectedMessage.replied && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-400">Your Reply:</h4>
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="w-full bg-muted border border-gray-700 rounded-md text-white p-3 h-32"
                      placeholder="Type your response here..."
                    />
                    <Button 
                      onClick={handleSendReply} 
                      className="btn-gold"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send Reply
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center text-gray-400 py-20">
                <div>
                  <Mail className="mx-auto h-12 w-12 mb-3 opacity-50" />
                  <p>Select a message to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupportManagement;
