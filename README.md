
# TrackerHub - Personal Management Platform

TrackerHub is a comprehensive personal management platform that helps you track TV shows, manage finances, organize movies, and split bills with friends. Built with modern web technologies and mobile-first design.

## 🚀 Features

### TV Shows Tracker
- **Personal Show Management**: Track your favorite TV shows and episodes
- **Universe Organization**: Group related shows into universes (e.g., Marvel, DC)
- **Episode Tracking**: Mark episodes as watched/unwatched
- **Public Discovery**: Browse public shows and universes
- **Private Collections**: Create and manage private universes

### Finance Management
- **Multi-Wallet Support**: Manage multiple wallets and accounts
- **Transaction Tracking**: Record income and expenses
- **Category Management**: Organize transactions by custom categories
- **Budget Planning**: Set and track budgets
- **Transfer Management**: Handle money transfers between wallets
- **Reporting**: Generate financial reports and insights
- **Organization Support**: Multi-organization financial management

### Movies Tracker
- **Watchlist Management**: Keep track of movies to watch
- **Rating System**: Rate and review movies
- **Discovery**: Explore new movies and recommendations

### Bill Splitting (SettleBill & SettleGara)
- **Network Management**: Create groups for bill splitting
- **Expense Tracking**: Add and split bills among group members
- **Settlement Calculation**: Automatically calculate who owes what
- **Member Management**: Add/remove members from networks
- **Bill Simplification**: Optimize payment settlements

### Additional Features
- **Dark/Light Theme**: Toggle between dark and light modes
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **User Authentication**: Secure login and registration
- **Admin Panel**: Administrative tools for content management
- **Public Content**: Browse public shows and universes without authentication

## 🛠 Technology Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/UI** - Beautiful and accessible UI components
- **React Router DOM** - Client-side routing
- **React Query (TanStack)** - Server state management
- **Lucide React** - Beautiful icon library

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Real-time subscriptions
  - Row Level Security (RLS)
  - Authentication & authorization
  - File storage

### Mobile Development
- **Capacitor** - Cross-platform native runtime
- **Progressive Web App (PWA)** - Web app with native-like features
- **Responsive Design** - Mobile-first approach

## 📱 Mobile Application

TrackerHub is built as a Progressive Web App (PWA) with Capacitor integration for native mobile capabilities.

### Capacitor Integration
TrackerHub uses Capacitor to provide native mobile app functionality:

- **Cross-Platform**: Deploy to iOS and Android from a single codebase
- **Native APIs**: Access device features like camera, storage, and notifications
- **Performance**: Near-native performance with web technologies
- **Live Reload**: Development with hot reload on physical devices

### Mobile Features
- **Offline Support**: Core functionality works offline
- **Push Notifications**: Stay updated with bill reminders and show updates
- **Native Navigation**: Smooth transitions and mobile-optimized UI
- **Touch Optimized**: Gesture-friendly interface
- **Responsive Layout**: Adapts to all screen sizes

### Getting Started with Mobile Development

#### Prerequisites
- Node.js 16+ and npm
- For iOS: Xcode (macOS only)
- For Android: Android Studio

#### Setup Mobile Development

1. **Clone and Install**
   ```bash
   git clone <your-repo-url>
   cd trackerhub
   npm install
   ```

2. **Add Mobile Platforms**
   ```bash
   # Add iOS platform (macOS only)
   npx cap add ios
   
   # Add Android platform
   npx cap add android
   ```

3. **Build and Sync**
   ```bash
   # Build the web app
   npm run build
   
   # Sync with native platforms
   npx cap sync
   ```

4. **Run on Device/Emulator**
   ```bash
   # Run on Android
   npx cap run android
   
   # Run on iOS (macOS only)
   npx cap run ios
   ```

#### Development Workflow

1. **Live Reload Development**
   - The app is configured for live reload during development
   - Changes to web code automatically reflect on connected devices
   - URL: `https://425137a2-93b5-4d31-afc3-416add5e747b.lovableproject.com`

2. **Native Code Changes**
   - After modifying native code or adding plugins
   - Run `npx cap sync` to update native projects

3. **Deployment**
   - Build web app: `npm run build`
   - Sync changes: `npx cap sync`
   - Use platform-specific tools (Xcode/Android Studio) for final deployment

## 🏗 Project Structure

```
src/
├── apps/                    # Feature-specific applications
│   ├── finance/            # Finance management
│   ├── movies/             # Movie tracking
│   ├── settlebill/         # Bill splitting (new version)
│   ├── settlegara/         # Bill splitting (legacy)
│   ├── tv-shows/           # TV show tracking
│   └── admin/              # Admin panel
├── components/             # Shared UI components
│   ├── Layout/             # Layout components
│   ├── ui/                 # Base UI components (Shadcn)
│   └── Auth/               # Authentication components
├── hooks/                  # Custom React hooks
├── contexts/               # React contexts
├── integrations/           # External service integrations
├── lib/                    # Utility libraries
├── pages/                  # Main application pages
└── types/                  # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16 or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd trackerhub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Configure your Supabase credentials
   - Set up authentication providers

4. **Database Setup**
   - Run Supabase migrations
   - Configure Row Level Security policies
   - Set up initial data

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Build for Production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Schema
The application uses PostgreSQL with the following main tables:
- `profiles` - User profiles and settings
- `shows` - TV show information
- `universes` - Show universe groupings
- `user_shows` - User's show tracking data
- `settlegara_networks` - Bill splitting networks
- `settlegara_bills` - Bill information
- `finance_transactions` - Financial transactions
- `finance_wallets` - User wallets

## 🔐 Authentication & Authorization

- **Supabase Auth**: Email/password authentication
- **Row Level Security**: Database-level security policies
- **User Roles**: Admin and regular user roles
- **Organization Support**: Multi-tenant finance management

## 📊 Key Features by App

### TV Shows App
- Personal show tracking
- Episode progress management
- Universe creation and management
- Public content discovery
- Season and episode organization

### Finance App
- Multi-currency support
- Category-based expense tracking
- Budget management
- Financial reporting
- Organization-based isolation

### Movies App
- Movie watchlist management
- Rating and review system
- Discovery and recommendations

### Bill Splitting Apps
- Group expense management
- Automatic settlement calculation
- Member invitation system
- Bill categorization
- Payment tracking

## 🚀 Deployment

### Web Deployment
The application can be deployed to any static hosting service:
- Netlify (recommended)
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

### Mobile App Deployment

#### iOS App Store
1. Build in Xcode
2. Archive and validate
3. Submit to App Store Connect
4. Complete App Store review process

#### Google Play Store
1. Build signed APK/AAB in Android Studio
2. Upload to Google Play Console
3. Complete Play Store review process

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Contact the development team

## 🔮 Future Roadmap

- **Enhanced Mobile Features**: More native integrations
- **Offline Sync**: Better offline data handling
- **Social Features**: Share and discover content with friends
- **API Integration**: Third-party service integrations
- **Advanced Analytics**: Detailed usage and financial analytics
- **Multi-language Support**: Internationalization
- **Advanced Notifications**: Smart reminders and alerts

---

Built with ❤️ using modern web technologies and mobile-first design principles.
