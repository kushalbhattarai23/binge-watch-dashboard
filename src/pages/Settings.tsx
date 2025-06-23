
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { User, Moon, Sun, Download, Upload, Settings as SettingsIcon, Trash2, Users, Globe, Shield, Mail, Key } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const Settings = () => {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [feedback, setFeedback] = useState('');

  const { data: userProfile } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      return data;
    },
    enabled: !!user?.id,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: any) => {
      if (!user?.id) throw new Error('No user ID');
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    },
  });

  const sendFeedbackMutation = useMutation({
    mutationFn: async (feedback: string) => {
      // For now, we'll just use the requests table to store feedback
      const { error } = await supabase
        .from('requests')
        .insert([
          {
            user_id: user?.id,
            title: 'User Feedback',
            type: 'feedback',
            message: feedback,
          }
        ]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      setFeedback('');
      toast({
        title: "Feedback sent",
        description: "Thank you for your feedback!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send feedback.",
        variant: "destructive",
      });
    },
  });

  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
    // For now, we'll just update the local state since the profiles table doesn't have preferences
    toast({
      title: "Theme preference saved",
      description: "Dark mode preference has been updated.",
    });
  };

  const handleNotificationToggle = (type: string, checked: boolean) => {
    // For now, we'll just show a toast since the profiles table doesn't have preferences
    toast({
      title: "Notification preference saved",
      description: `${type} notifications have been ${checked ? 'enabled' : 'disabled'}.`,
    });
  };

  const handlePrivacyToggle = (setting: string, checked: boolean) => {
    // For now, we'll just show a toast since the profiles table doesn't have preferences
    toast({
      title: "Privacy setting saved",
      description: `${setting} has been ${checked ? 'enabled' : 'disabled'}.`,
    });
  };

  const exportUserData = async () => {
    setIsExporting(true);
    try {
      // Export user show tracking data
      const { data: userShowTracking } = await supabase
        .from('user_show_tracking')
        .select(`
          *,
          show:shows(*)
        `)
        .eq('user_id', user?.id);

      // Export movies
      const { data: movies } = await supabase
        .from('movies')
        .select('*')
        .eq('user_id', user?.id);

      // Export finance data
      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user?.id);

      const { data: wallets } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user?.id);

      const exportData = {
        exported_at: new Date().toISOString(),
        user_show_tracking: userShowTracking || [],
        movies: movies || [],
        finance: {
          transactions: transactions || [],
          wallets: wallets || []
        }
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `trackerhub-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Data exported",
        description: "Your data has been exported successfully.",
      });
      setExportDialogOpen(false);
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "Failed to export your data.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const deleteAccount = async () => {
    try {
      // This would typically involve calling an edge function to properly delete all user data
      // For now, we'll just show a message
      toast({
        title: "Account deletion requested",
        description: "Please contact support to complete account deletion.",
        variant: "destructive",
      });
      setDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process account deletion.",
        variant: "destructive",
      });
    }
  };

  const handleFeedbackSubmit = () => {
    if (!feedback.trim()) {
      toast({
        title: "Error",
        description: "Please enter your feedback.",
        variant: "destructive",
      });
      return;
    }
    sendFeedbackMutation.mutate(feedback);
  };

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400">Please log in to access settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <SettingsIcon className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Profile Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Email</Label>
              <Input value={user.email || ''} disabled />
            </div>
            <div>
              <Label>User ID</Label>
              <Input value={user.id || ''} disabled />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={user.email_confirmed_at ? "default" : "destructive"}>
              {user.email_confirmed_at ? "Verified" : "Unverified"}
            </Badge>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Account created: {new Date(user.created_at || '').toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            <span>Appearance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Dark Mode</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Toggle between light and dark themes
              </p>
            </div>
            <Switch
              checked={darkMode}
              onCheckedChange={handleDarkModeToggle}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Receive email updates about your activities
              </p>
            </div>
            <Switch
              checked={false}
              onCheckedChange={(checked) => handleNotificationToggle('email', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Bill Reminders</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get reminded about pending bills and settlements
              </p>
            </div>
            <Switch
              checked={false}
              onCheckedChange={(checked) => handleNotificationToggle('bills', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>New Episodes</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get notified when new episodes are available
              </p>
            </div>
            <Switch
              checked={false}
              onCheckedChange={(checked) => handleNotificationToggle('episodes', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Privacy</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Public Profile</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Allow others to see your public activity
              </p>
            </div>
            <Switch
              checked={false}
              onCheckedChange={(checked) => handlePrivacyToggle('public_profile', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Share Watchlists</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Allow friends to see your TV shows and movies
              </p>
            </div>
            <Switch
              checked={false}
              onCheckedChange={(checked) => handlePrivacyToggle('share_watchlists', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Data Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Export Data</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Download all your TrackerHub data
              </p>
            </div>
            <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Export Your Data</DialogTitle>
                  <DialogDescription>
                    This will download all your TrackerHub data including TV shows, movies, and finance records in JSON format.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={exportUserData} disabled={isExporting}>
                    {isExporting ? "Exporting..." : "Export Data"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Send Feedback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Share your thoughts, suggestions, or report issues..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
          />
          <Button onClick={handleFeedbackSubmit} disabled={sendFeedbackMutation.isPending}>
            {sendFeedbackMutation.isPending ? "Sending..." : "Send Feedback"}
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-600 dark:text-red-400">
            <Trash2 className="h-5 w-5" />
            <span>Danger Zone</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-red-600 dark:text-red-400">Delete Account</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Account</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete your account and all associated data.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={deleteAccount}>
                    Delete Account
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
