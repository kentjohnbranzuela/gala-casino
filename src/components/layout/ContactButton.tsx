
import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CustomerServiceForm from '../profile/CustomerServiceForm';

export const ContactButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-casino-gold text-black rounded-full p-3 shadow-lg hover:bg-amber-400 transition-all"
        aria-label="Contact Customer Service"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Customer Service</DialogTitle>
          </DialogHeader>
          <CustomerServiceForm />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContactButton;
