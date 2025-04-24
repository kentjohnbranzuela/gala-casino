
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DepositModalProps {
  onClose: () => void;
}

const DepositModal: React.FC<DepositModalProps> = ({ onClose }) => {
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleDeposit = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success(`Deposit request of ₱${amount} sent successfully`);
      onClose();
      
      // In a real app, you'd save this to a database
    }, 1500);
  };
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-card text-card-foreground border-casino-purple-dark">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-casino-gold">
            Deposit Funds
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="p-4 border border-casino-purple-dark rounded-md bg-casino-dark">
            <h4 className="text-lg font-medium text-white">GCash Payment</h4>
            <p className="text-sm text-gray-300 mt-1">Send funds to the following number:</p>
            <p className="text-casino-gold font-medium mt-1">09917104135</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Amount to Deposit (₱)
            </label>
            <Input
              type="number"
              min="100"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-muted border-casino-purple-dark"
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="border-casino-purple"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeposit} 
              className="btn-gold"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Deposit'}
            </Button>
          </div>
          
          <div className="text-xs text-gray-400 mt-2">
            <p>After sending, your account will be credited once payment is confirmed.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DepositModal;
