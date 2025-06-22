
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { sampleBills, sampleUsers } from '../data/sampleData';
import { Receipt, Users, DollarSign } from 'lucide-react';

export const BillsList: React.FC = () => {
  const getUserById = (id: string) => sampleUsers.find(user => user.id === id);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sampleBills.map((bill) => {
        const creator = getUserById(bill.createdBy);
        const myShare = bill.participants.find(p => p.userId === '1'); // Current user

        return (
          <Card key={bill.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{bill.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{bill.description}</p>
                </div>
                <Badge variant={bill.settled ? "default" : "destructive"}>
                  {bill.settled ? 'Settled' : 'Pending'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="font-semibold">${bill.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{bill.participants.length} people</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={creator?.avatar} />
                  <AvatarFallback>{creator?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-600">Added by {creator?.name}</span>
              </div>

              {myShare && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Your share:</span>
                    <span className="font-semibold">${myShare.amount.toFixed(2)}</span>
                  </div>
                  {myShare.owes > 0 && (
                    <div className="flex justify-between items-center text-red-600">
                      <span className="text-sm">You owe:</span>
                      <span className="font-semibold">${myShare.owes.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Details
                </Button>
                {myShare?.owes > 0 && (
                  <Button size="sm" className="flex-1">
                    Settle Up
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
