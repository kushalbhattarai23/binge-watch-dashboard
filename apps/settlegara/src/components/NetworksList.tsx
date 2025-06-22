
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { sampleNetworks } from '../data/sampleData';
import { Users, Mail, Plus } from 'lucide-react';

export const NetworksList: React.FC = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sampleNetworks.map((network) => (
        <Card key={network.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{network.name}</CardTitle>
                <p className="text-sm text-gray-600 mt-1">{network.description}</p>
              </div>
              <Badge variant="outline">
                {network.members.length} members
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Members</span>
            </div>
            
            <div className="flex -space-x-2">
              {network.members.slice(0, 4).map((member) => (
                <Avatar key={member.id} className="w-8 h-8 border-2 border-white">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
              {network.members.length > 4 && (
                <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                  <span className="text-xs font-medium">+{network.members.length - 4}</span>
                </div>
              )}
            </div>

            <div className="text-sm text-gray-600">
              {network.members.map(m => m.name).join(', ')}
            </div>

            {network.invitePending.length > 0 && (
              <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                <Mail className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-700">
                  {network.invitePending.length} pending invitation(s)
                </span>
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                View Network
              </Button>
              <Button size="sm" className="flex items-center gap-1">
                <Plus className="w-3 h-3" />
                Invite
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
