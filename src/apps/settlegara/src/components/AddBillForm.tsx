
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Plus } from 'lucide-react';
import { sampleNetworks, sampleUsers } from '../data/sampleData';

interface AddBillFormProps {
  onClose: () => void;
}

export const AddBillForm: React.FC<AddBillFormProps> = ({ onClose }) => {
  const [selectedNetwork, setSelectedNetwork] = useState<string>('');
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');

  const availableUsers = selectedNetwork 
    ? sampleNetworks.find(n => n.id === selectedNetwork)?.members || []
    : sampleUsers;

  return (
    <Card className="mb-6">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Add New Bill</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Bill Title</Label>
            <Input id="title" placeholder="e.g., Dinner at restaurant" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Total Amount</Label>
            <Input id="amount" type="number" step="0.01" placeholder="0.00" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea id="description" placeholder="Add details about this expense..." />
        </div>

        <div className="space-y-2">
          <Label htmlFor="network">Network (Optional)</Label>
          <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
            <SelectTrigger>
              <SelectValue placeholder="Select a network or leave blank for individual bill" />
            </SelectTrigger>
            <SelectContent>
              {sampleNetworks.map((network) => (
                <SelectItem key={network.id} value={network.id}>
                  {network.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Select Participants</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {availableUsers.map((user) => (
              <div key={user.id} className="flex items-center space-x-2">
                <Checkbox
                  id={user.id}
                  checked={selectedParticipants.includes(user.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedParticipants([...selectedParticipants, user.id]);
                    } else {
                      setSelectedParticipants(selectedParticipants.filter(id => id !== user.id));
                    }
                  }}
                />
                <Label htmlFor={user.id} className="flex items-center gap-2 cursor-pointer">
                  <span>{user.name}</span>
                  <span className="text-sm text-gray-500">({user.email})</span>
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Split Type</Label>
          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="equal"
                checked={splitType === 'equal'}
                onCheckedChange={() => setSplitType('equal')}
              />
              <Label htmlFor="equal">Equal Split</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="custom"
                checked={splitType === 'custom'}
                onCheckedChange={() => setSplitType('custom')}
              />
              <Label htmlFor="custom">Custom Amounts</Label>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button className="flex-1">
            <Plus className="w-4 h-4 mr-2" />
            Add Bill
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
