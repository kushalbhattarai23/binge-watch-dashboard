import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.netlify.trackerhub',
  appName: 'TrackeHub',
  webDir: 'dist',
  plugins: {
    Deploy: {
      appId: 'dc43bdc7',
      channel: 'production',
      updateMethod: 'background'
    }
  }
};

export default config;
