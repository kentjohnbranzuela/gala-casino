
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WithdrawModalProps {
  onClose: () => void;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ onClose }) => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('gcash');
  const [accountNumber, setAccountNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleWithdraw = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (!accountNumber) {
      toast.error('Please enter your account number');
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success(`Withdrawal request of ₱${amount} is being processed`);
      onClose();
      
      // In a real app, you'd save this to a database
    }, 1500);
  };
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-card text-card-foreground border-casino-purple-dark">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-casino-gold">
            Withdraw Funds
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Withdrawal Method
            </label>
            <Select defaultValue={method} onValueChange={setMethod}>
              <SelectTrigger className="bg-muted border-casino-purple-dark">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gcash">GCash</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              {method === 'gcash' ? 'GCash Number' : 'Bank Account Number'}
            </label>
            <Input
              type="text"
              placeholder={method === 'gcash' ? 'Enter GCash number' : 'Enter account number'}
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="bg-muted border-casino-purple-dark"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Amount to Withdraw (₱)
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
              onClick={handleWithdraw} 
              className="btn-gold"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Request Withdrawal'}
            </Button>
          </div>
          
          <div className="text-xs text-gray-400 mt-2">
            <p>All withdrawals are subject to review. Processing time is typically 24-48 hours.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawModal;
