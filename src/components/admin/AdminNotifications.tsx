
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Bell, Users } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AdminNotifications: React.FC = () => {
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [hasNewUsers, setHasNewUsers] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for unread customer service messages
    const checkForNewMessages = () => {
      const storedMessages = localStorage.getItem('customerServiceMessages');
      if (storedMessages) {
        const messages = JSON.parse(storedMessages);
        const unreadMessages = messages.filter((msg: any) => !msg.read);
        setHasNewMessages(unreadMessages.length > 0);
        
        if (unreadMessages.length > 0) {
          // Add to notifications
          unreadMessages.forEach((msg: any) => {
            if (!notifications.some(n => n.id === msg.id)) {
              setNotifications(prev => [
                ...prev,
                {
                  id: msg.id,
                  type: 'message',
                  text: `New support message from ${msg.username}`,
                  time: new Date(msg.timestamp).toLocaleString(),
                  read: false
                }
              ]);
            }
          });
        }
      }
    };
    
    // Listen for user registrations
    const handleNewUser = (event: CustomEvent) => {
      setHasNewUsers(true);
      const { username } = event.detail;
      
      // Add to notifications
      setNotifications(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'registration',
          text: `New user registered: ${username}`,
          time: new Date().toLocaleString(),
          read: false
        }
      ]);
      
      toast.info(`New user registered: ${username}`);
    };
    
    // Listen for new customer service messages
    const handleNewMessage = (event: CustomEvent) => {
      setHasNewMessages(true);
      const { username, message } = event.detail;
      
      // Add to notifications
      setNotifications(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          type: 'message',
          text: `New message from ${username}`,
          time: new Date().toLocaleString(),
          read: false
        }
      ]);
      
      toast.info(`New customer service message from ${username}`);
    };
    
    checkForNewMessages();
    
    // Check every 30 seconds for new messages
    const interval = setInterval(checkForNewMessages, 30000);
    
    // Event listeners
    window.addEventListener('customerService:new-message', handleNewMessage as EventListener);
    window.addEventListener('user:registered', handleNewUser as EventListener);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('customerService:new-message', handleNewMessage as EventListener);
      window.removeEventListener('user:registered', handleNewUser as EventListener);
    };
  }, [notifications]);
  
  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setHasNewMessages(false);
    setHasNewUsers(false);
  };
  
  const handleNavigate = (type: string) => {
    if (type === 'message') {
      navigate('/admin?tab=support');
    } else if (type === 'registration') {
      navigate('/admin?tab=users');
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="relative"
        >
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          {(hasNewMessages || hasNewUsers) && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Notifications</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMarkAllRead}
              className="text-xs"
            >
              Mark all as read
            </Button>
          </div>
          
          <div className="max-h-[300px] overflow-y-auto space-y-2">
            {notifications.length === 0 ? (
              <div className="text-center py-6 text-gray-400">
                No new notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-3 rounded-md cursor-pointer ${
                    notification.read ? 'bg-muted' : 'bg-muted/80 border-l-2 border-casino-gold'
                  }`}
                  onClick={() => handleNavigate(notification.type)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {notification.type === 'message' ? (
                        <Bell className="h-4 w-4 text-casino-gold" />
                      ) : (
                        <Users className="h-4 w-4 text-casino-gold" />
                      )}
                      <span className="font-medium text-sm">{notification.text}</span>
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-gray-400">{notification.time}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AdminNotifications;
