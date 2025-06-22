
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNetworks } from '@/hooks/useSettleGaraNetworks';
import { useBills } from '@/hooks/useSettleGaraBills';
import { Users, Receipt, DollarSign, TrendingUp, Plus, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';

export const OverviewPage: React.FC = () => {
  const { data: networks, isLoading: networksLoading } = useNetworks();
  const { data: bills, isLoading: billsLoading } = useBills();

  const totalNetworks = networks?.length || 0;
  const totalBills = bills?.length || 0;
  const pendingBills = bills?.filter(bill => bill.status === 'pending').length || 0;
  const totalAmount = bills?.reduce((sum, bill) => sum + Number(bill.total_amount), 0) || 0;

  const recentBills = bills?.slice(0, 5) || [];
  const recentNetworks = networks?.slice(0, 3) || [];

  if (networksLoading || billsLoading) {
    return <div className="text-center py-8">Loading overview...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Networks</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalNetworks}</div>
            <p className="text-xs text-muted-foreground">
              Active groups
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bills</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBills}</div>
            <p className="text-xs text-muted-foreground">
              All time bills
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Bills</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingBills}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              All bills combined
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link to="/settlegara/networks">
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Network
              </Button>
            </Link>
            <Link to="/settlegara/bills">
              <Button variant="outline" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Bill
              </Button>
            </Link>
            <Link to="/settlegara/simplify">
              <Button variant="outline" className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Simplify Debts
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bills */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Bills</CardTitle>
            <Link to="/settlegara/bills">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentBills.length > 0 ? (
              <div className="space-y-3">
                {recentBills.map((bill) => (
                  <div key={bill.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{bill.title}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(bill.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={bill.status === 'settled' ? 'default' : 'destructive'}>
                        {bill.status}
                      </Badge>
                      <span className="font-semibold">${Number(bill.total_amount).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent bills</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Networks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Your Networks</CardTitle>
            <Link to="/settlegara/networks">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentNetworks.length > 0 ? (
              <div className="space-y-3">
                {recentNetworks.map((network) => (
                  <div key={network.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{network.name}</p>
                      <p className="text-sm text-gray-500">
                        Created {new Date(network.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Link to={`/settlegara/network/${network.id}`}>
                      <Button size="sm" variant="outline">View</Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No networks yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
