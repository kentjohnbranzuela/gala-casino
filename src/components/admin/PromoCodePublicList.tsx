
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const PromoCodePublicList: React.FC = () => {
  const [promoCodes, setPromoCodes] = useState<any[]>([]);
  const [publicPromoCodes, setPublicPromoCodes] = useState<any[]>([]);

  useEffect(() => {
    loadPromoCodes();
    
    window.addEventListener('storage', loadPromoCodes);
    return () => {
      window.removeEventListener('storage', loadPromoCodes);
    };
  }, []);

  const loadPromoCodes = () => {
    try {
      // Load all promo codes
      const storedCodes = localStorage.getItem('promoCodes');
      if (storedCodes) {
        const parsedCodes = JSON.parse(storedCodes);
        setPromoCodes(parsedCodes);
      }
      
      // Load public promo codes
      const storedPublicCodes = localStorage.getItem('publicPromoCodes');
      if (storedPublicCodes) {
        const parsedPublicCodes = JSON.parse(storedPublicCodes);
        setPublicPromoCodes(parsedPublicCodes);
      } else {
        // Initialize public promo codes if they don't exist
        localStorage.setItem('publicPromoCodes', JSON.stringify([]));
        setPublicPromoCodes([]);
      }
    } catch (error) {
      console.error('Error loading promo codes:', error);
    }
  };
  
  const togglePromoCodeVisibility = (code: string) => {
    const isPublic = publicPromoCodes.some(promo => promo.code === code);
    const promoToToggle = promoCodes.find(promo => promo.code === code);
    
    if (!promoToToggle) return;
    
    try {
      let updatedPublicCodes;
      
      if (isPublic) {
        // Remove from public list
        updatedPublicCodes = publicPromoCodes.filter(promo => promo.code !== code);
        toast.success(`Promo code ${code} is now hidden from users`);
      } else {
        // Add to public list
        updatedPublicCodes = [...publicPromoCodes, promoToToggle];
        toast.success(`Promo code ${code} is now visible to users`);
      }
      
      setPublicPromoCodes(updatedPublicCodes);
      localStorage.setItem('publicPromoCodes', JSON.stringify(updatedPublicCodes));
    } catch (error) {
      console.error('Error toggling promo code visibility:', error);
      toast.error('Failed to update promo code visibility');
    }
  };
  
  const syncAllPromoCodesVisibility = () => {
    try {
      // Set all promo codes as public
      localStorage.setItem('publicPromoCodes', JSON.stringify(promoCodes));
      setPublicPromoCodes(promoCodes);
      toast.success('All promo codes are now visible to users');
    } catch (error) {
      console.error('Error syncing promo codes:', error);
      toast.error('Failed to sync promo codes');
    }
  };
  
  const hideAllPromoCodes = () => {
    try {
      // Set all promo codes as private
      localStorage.setItem('publicPromoCodes', JSON.stringify([]));
      setPublicPromoCodes([]);
      toast.success('All promo codes are now hidden from users');
    } catch (error) {
      console.error('Error hiding promo codes:', error);
      toast.error('Failed to hide promo codes');
    }
  };

  return (
    <div className="bg-card border border-casino-purple-dark rounded-lg p-6 mt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h3 className="text-lg font-semibold text-white mb-2 md:mb-0">Promo Code Visibility</h3>
        <div className="space-x-2">
          <Button 
            onClick={syncAllPromoCodesVisibility} 
            variant="outline" 
            size="sm"
          >
            Show All
          </Button>
          <Button 
            onClick={hideAllPromoCodes} 
            variant="outline" 
            size="sm"
          >
            Hide All
          </Button>
        </div>
      </div>
      
      <div className="text-sm text-gray-400 mb-4">
        Control which promo codes are visible to users in their profile.
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Code</th>
              <th className="text-left">Bonus</th>
              <th className="text-left">Status</th>
              <th className="text-left">Public</th>
            </tr>
          </thead>
          <tbody>
            {promoCodes.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-400">
                  No promo codes available
                </td>
              </tr>
            ) : (
              promoCodes.map((promo) => (
                <tr key={promo.id || promo.code} className="border-t border-gray-800">
                  <td className="py-3">{promo.code}</td>
                  <td className="py-3">₱{promo.bonus.toLocaleString()}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 text-xs rounded ${promo.used ? 'bg-gray-600' : 'bg-green-800'}`}>
                      {promo.used ? 'USED' : 'ACTIVE'}
                    </span>
                  </td>
                  <td className="py-3">
                    <Switch
                      checked={publicPromoCodes.some(p => p.code === promo.code)}
                      onCheckedChange={() => togglePromoCodeVisibility(promo.code)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PromoCodePublicList;
