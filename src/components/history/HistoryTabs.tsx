
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GameHistoryTable from './GameHistoryTable';
import DepositHistoryTable from './DepositHistoryTable';
import WithdrawalHistoryTable from './WithdrawalHistoryTable';

const HistoryTabs: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Transaction History</h1>
      
      <Tabs defaultValue="games" className="w-full">
        <TabsList className="border border-casino-purple-dark bg-muted w-full mb-6">
          <TabsTrigger value="games" className="flex-1">Game History</TabsTrigger>
          <TabsTrigger value="deposits" className="flex-1">Deposit History</TabsTrigger>
          <TabsTrigger value="withdrawals" className="flex-1">Withdrawal History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="games">
          <GameHistoryTable />
        </TabsContent>
        
        <TabsContent value="deposits">
          <DepositHistoryTable />
        </TabsContent>
        
        <TabsContent value="withdrawals">
          <WithdrawalHistoryTable />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HistoryTabs;
