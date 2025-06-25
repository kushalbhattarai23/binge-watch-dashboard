
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAppSettings } from '@/hooks/useAppSettings';
import { useTheme } from '@/contexts/ThemeContext';
import { Settings as SettingsIcon, Palette, Shield, Bell, Grid3X3 } from 'lucide-react';

const Settings = () => {
  const { settings, updateSettings } = useAppSettings();
  const { theme, toggleTheme } = useTheme();

  const handleAppToggle = (appId: keyof typeof settings.enabledApps) => {
    updateSettings({
      enabledApps: {
        ...settings.enabledApps,
        [appId]: !settings.enabledApps[appId]
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <SettingsIcon className="h-8 w-8" />
            Settings
          </h1>
          <p className="text-muted-foreground">Manage your preferences and application settings</p>
        </div>

        {/* App Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Grid3X3 className="h-5 w-5" />
              Application Preferences
            </CardTitle>
            <CardDescription>
              Choose which applications you want to use in TrackerHub
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="tv-shows">TV Shows</Label>
                <p className="text-sm text-muted-foreground">Track your favorite TV shows and episodes</p>
              </div>
              <Switch
                id="tv-shows"
                checked={settings.enabledApps.tvShows}
                onCheckedChange={() => handleAppToggle('tvShows')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="finance">Finance</Label>
                <p className="text-sm text-muted-foreground">Manage your personal finances and budgets</p>
              </div>
              <Switch
                id="finance"
                checked={settings.enabledApps.finance}
                onCheckedChange={() => handleAppToggle('finance')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="movies">Movies</Label>
                <p className="text-sm text-muted-foreground">Track your movie watchlist and ratings</p>
              </div>
              <Switch
                id="movies"
                checked={settings.enabledApps.movies}
                onCheckedChange={() => handleAppToggle('movies')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="settlebill">SettleBill</Label>
                <p className="text-sm text-muted-foreground">Split bills and manage expenses with friends</p>
              </div>
              <Switch
                id="settlebill"
                checked={settings.enabledApps.settlebill}
                onCheckedChange={() => handleAppToggle('settlebill')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="public">Public Content</Label>
                <p className="text-sm text-muted-foreground">Access public shows and universes</p>
              </div>
              <Switch
                id="public"
                checked={settings.enabledApps.public}
                onCheckedChange={() => handleAppToggle('public')}
              />
            </div>

            {settings.enabledApps.admin && (
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="admin">Admin Tools</Label>
                  <p className="text-sm text-muted-foreground">Administrative tools and settings</p>
                </div>
                <Switch
                  id="admin"
                  checked={settings.enabledApps.admin}
                  onCheckedChange={() => handleAppToggle('admin')}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize how TrackerHub looks and feels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Use dark theme across the application</p>
              </div>
              <Switch
                id="dark-mode"
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Security
            </CardTitle>
            <CardDescription>
              Manage your privacy and security preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="analytics">Analytics</Label>
                <p className="text-sm text-muted-foreground">Help improve TrackerHub by sharing usage data</p>
              </div>
              <Switch id="analytics" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="marketing">Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">Receive updates and promotional content</p>
              </div>
              <Switch id="marketing" />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch id="email-notifications" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
              </div>
              <Switch id="push-notifications" />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button>Save All Settings</Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
