
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
import { Tag, Trash, Eye, EyeOff } from 'lucide-react';

interface PromoCode {
  id: string;
  code: string;
  bonus: number;
  expiryDate: string;
  used: boolean;
  usedBy?: string;
  isHidden: boolean; // Changed to required property
}

const PromoCodeManagement: React.FC = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [newCode, setNewCode] = useState('');
  const [newBonus, setNewBonus] = useState('');
  const [newExpiryDate, setNewExpiryDate] = useState('');
  const [isHidden, setIsHidden] = useState(true); // Default to hidden
  
  useEffect(() => {
    // Load promo codes from localStorage
    const loadPromoCodes = () => {
      try {
        const storedCodes = localStorage.getItem('promoCodes');
        if (storedCodes) {
          const parsedCodes = JSON.parse(storedCodes);
          // Make sure all codes have the isHidden property
          const updatedCodes = parsedCodes.map((code: any) => ({
            ...code,
            isHidden: code.isHidden !== undefined ? code.isHidden : true
          }));
          setPromoCodes(updatedCodes);
          // Update storage with corrected data
          localStorage.setItem('promoCodes', JSON.stringify(updatedCodes));
        } else {
          // Initialize with empty array if none found
          localStorage.setItem('promoCodes', JSON.stringify([]));
          setPromoCodes([]);
        }
      } catch (error) {
        console.error("Error loading promo codes:", error);
        setPromoCodes([]);
      }
    };
    
    loadPromoCodes();
  }, []);
  
  const handleCreatePromoCode = () => {
    if (!newCode) {
      toast.error('Please enter a promo code');
      return;
    }
    
    if (!newBonus || isNaN(Number(newBonus))) {
      toast.error('Please enter a valid bonus amount');
      return;
    }
    
    if (!newExpiryDate) {
      toast.error('Please select an expiry date');
      return;
    }
    
    const newPromoCode: PromoCode = {
      id: Date.now().toString(),
      code: newCode.toUpperCase(),
      bonus: Number(newBonus),
      expiryDate: newExpiryDate,
      used: false,
      isHidden: isHidden
    };
    
    const updatedCodes = [...promoCodes, newPromoCode];
    setPromoCodes(updatedCodes);
    localStorage.setItem('promoCodes', JSON.stringify(updatedCodes));
    
    // Create a separate list for public promo codes
    const publicCodes = updatedCodes.filter(code => !code.isHidden);
    localStorage.setItem('publicPromoCodes', JSON.stringify(publicCodes));
    
    // Reset form
    setNewCode('');
    setNewBonus('');
    setNewExpiryDate('');
    setIsHidden(true);
    
    toast.success('Promo code created successfully');
  };
  
  const handleDeletePromoCode = (id: string) => {
    const updatedCodes = promoCodes.filter(code => code.id !== id);
    setPromoCodes(updatedCodes);
    localStorage.setItem('promoCodes', JSON.stringify(updatedCodes));
    
    // Update public codes list
    const publicCodes = updatedCodes.filter(code => !code.isHidden);
    localStorage.setItem('publicPromoCodes', JSON.stringify(publicCodes));
    
    toast.success('Promo code deleted successfully');
  };

  const toggleHidden = (id: string) => {
    const updatedCodes = promoCodes.map(code => {
      if (code.id === id) {
        return { ...code, isHidden: !code.isHidden };
      }
      return code;
    });
    setPromoCodes(updatedCodes);
    localStorage.setItem('promoCodes', JSON.stringify(updatedCodes));
    
    // Update public codes list
    const publicCodes = updatedCodes.filter(code => !code.isHidden);
    localStorage.setItem('publicPromoCodes', JSON.stringify(publicCodes));
    
    toast.success('Promo code visibility updated');
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-casino-purple-dark rounded-lg p-6">
        <h2 className="text-xl font-semibold text-casino-gold mb-4">Promo Code Management</h2>
        
        <div className="grid md:grid-cols-5 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Code</label>
            <Input
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              placeholder="Enter code"
              className="bg-muted border-casino-purple-dark"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Bonus Amount (₱)</label>
            <Input
              type="number"
              value={newBonus}
              onChange={(e) => setNewBonus(e.target.value)}
              placeholder="Enter amount"
              className="bg-muted border-casino-purple-dark"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Expiry Date</label>
            <Input
              type="date"
              value={newExpiryDate}
              onChange={(e) => setNewExpiryDate(e.target.value)}
              className="bg-muted border-casino-purple-dark"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Hidden from Users</label>
            <div className="flex items-center h-10">
              <input 
                type="checkbox" 
                checked={isHidden} 
                onChange={() => setIsHidden(!isHidden)}
                className="w-5 h-5 mr-2"
              />
              <span className="text-white">{isHidden ? 'Yes' : 'No'}</span>
            </div>
          </div>
          <div className="flex items-end">
            <Button 
              onClick={handleCreatePromoCode} 
              className="btn-gold w-full"
            >
              <Tag className="w-4 h-4 mr-2" /> Create Promo Code
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Promo Code</TableHead>
                <TableHead>Bonus Amount</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Used By</TableHead>
                <TableHead>Visibility</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promoCodes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-gray-400">
                    No promo codes created yet
                  </TableCell>
                </TableRow>
              ) : (
                promoCodes.map((code) => (
                  <TableRow key={code.id}>
                    <TableCell className="font-medium">{code.code}</TableCell>
                    <TableCell>₱{code.bonus.toLocaleString()}</TableCell>
                    <TableCell>{code.expiryDate}</TableCell>
                    <TableCell>
                      <span className={`status-badge ${code.used ? 'status-success' : 'bg-amber-500'}`}>
                        {code.used ? 'USED' : 'AVAILABLE'}
                      </span>
                    </TableCell>
                    <TableCell>{code.usedBy || '-'}</TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => toggleHidden(code.id)}
                        className={`flex items-center ${code.isHidden ? 'bg-red-900/30 text-red-300' : 'bg-green-900/30 text-green-300'}`}
                      >
                        {code.isHidden ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-1" /> Hidden
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-1" /> Visible
                          </>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDeletePromoCode(code.id)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default PromoCodeManagement;
