
import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CustomerServiceForm from '../profile/CustomerServiceForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: string;
  read: boolean;
  replied: boolean;
  reply?: string;
}

export const ContactButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const username = localStorage.getItem('username') || '';
  
  // Load user's messages
  useEffect(() => {
    if (!username) return;
    
    const loadMessages = () => {
      try {
        const storedMessages = localStorage.getItem('customerServiceMessages');
        if (storedMessages) {
          const allMessages = JSON.parse(storedMessages);
          const userMessages = allMessages.filter((msg: ChatMessage) => msg.username === username);
          
          setMessages(userMessages);
          
          // Count unread replies
          const unread = userMessages.filter((msg: ChatMessage) => msg.replied && !msg.read).length;
          setUnreadCount(unread);
        }
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };
    
    loadMessages();
    
    // Set up event listener for new messages
    window.addEventListener('storage', loadMessages);
    window.addEventListener('user:notification', loadMessages);
    
    return () => {
      window.removeEventListener('storage', loadMessages);
      window.removeEventListener('user:notification', loadMessages);
    };
  }, [username, isOpen]);
  
  // Mark messages as read when opening chat
  useEffect(() => {
    if (isOpen && messages.length > 0 && username) {
      try {
        const storedMessages = localStorage.getItem('customerServiceMessages');
        if (storedMessages) {
          const allMessages = JSON.parse(storedMessages);
          
          // Mark user's messages as read
          const updatedMessages = allMessages.map((msg: ChatMessage) => {
            if (msg.username === username && msg.replied) {
              return { ...msg, read: true };
            }
            return msg;
          });
          
          localStorage.setItem('customerServiceMessages', JSON.stringify(updatedMessages));
          setUnreadCount(0);
          
          // Also update notifications
          const notifications = JSON.parse(localStorage.getItem('userNotifications') || '{}');
          if (notifications[username]) {
            notifications[username] = notifications[username].map((notif: any) => {
              if (notif.type === 'support') {
                return { ...notif, read: true };
              }
              return notif;
            });
            localStorage.setItem('userNotifications', JSON.stringify(notifications));
          }
        }
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    }
  }, [isOpen, messages, username]);
  
  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-casino-gold text-black rounded-full p-3 shadow-lg hover:bg-amber-400 transition-all"
        aria-label="Contact Customer Service"
      >
        <MessageCircle className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Customer Support</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="new-message" className="w-full">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="new-message">New Message</TabsTrigger>
              <TabsTrigger value="history">Chat History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="new-message">
              <CustomerServiceForm />
            </TabsContent>
            
            <TabsContent value="history">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <MessageCircle className="mx-auto h-10 w-10 mb-2 opacity-50" />
                  <p>No message history found</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {messages.map((msg) => (
                    <div key={msg.id} className="space-y-2">
                      <div className="bg-casino-purple-dark p-3 rounded-lg">
                        <div className="flex justify-between text-sm text-gray-400 mb-1">
                          <span>You</span>
                          <span>{new Date(msg.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-white">{msg.message}</p>
                      </div>
                      
                      {msg.replied && (
                        <div className="bg-casino-purple/40 p-3 rounded-lg ml-4">
                          <div className="flex justify-between text-sm text-gray-400 mb-1">
                            <span>Support</span>
                            <span>{msg.reply && new Date().toLocaleString()}</span>
                          </div>
                          <p className="text-white">{msg.reply}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContactButton;
