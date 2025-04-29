
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Send } from 'lucide-react';

const CustomerServiceForm: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const username = localStorage.getItem('username') || '';
  const phoneNumber = localStorage.getItem('phoneNumber') || '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    setIsSending(true);
    
    try {
      // Get existing messages
      const storedMessages = localStorage.getItem('customerServiceMessages') || '[]';
      const messages = JSON.parse(storedMessages);
      
      // Add new message
      const newMessage = {
        id: Date.now().toString(),
        username: username,
        message: message,
        timestamp: new Date().toISOString(),
        read: false,
        replied: false
      };
      
      messages.push(newMessage);
      localStorage.setItem('customerServiceMessages', JSON.stringify(messages));
      
      // Trigger notification event for admin
      window.dispatchEvent(new CustomEvent('customerService:new-message', {
        detail: { username, message }
      }));
      
      setTimeout(() => {
        toast.success('Your message has been sent to customer service. We will respond shortly.');
        setMessage('');
        setIsSending(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
      setIsSending(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <span>Contact Customer Service</span>
        </CardTitle>
        <CardDescription>Send us a message and we'll get back to you as soon as possible</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              className="w-full h-32 p-3 border border-casino-purple-dark bg-muted rounded-md"
              placeholder="How can we help you today?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>
          <Button 
            type="submit" 
            className="btn-gold w-full flex items-center justify-center"
            disabled={isSending}
          >
            {isSending ? 'Sending...' : (
              <>
                <Send className="w-4 h-4 mr-2" />
                <span>Send Message</span>
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CustomerServiceForm;
