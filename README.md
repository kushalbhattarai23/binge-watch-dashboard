
# TrackerHub - Personal Management Platform

TrackerHub is a comprehensive personal management platform that helps you track TV shows, manage finances, organize movies, and split bills with friends. Built with modern web technologies and mobile-first design.

## 🚀 Features Overview

### 📺 TV Shows Tracker
**Organize and track your entertainment**
- **Personal Show Management**: Track your favorite TV shows and episodes with detailed progress tracking
- **Universe Organization**: Group related shows into universes (e.g., Marvel Cinematic Universe, DC Universe, Star Wars)
- **Episode Tracking**: Mark individual episodes as watched/unwatched with season and episode progression
- **Public Discovery**: Browse and discover public shows and universes created by the community
- **Private Collections**: Create and manage private universes visible only to you
- **Detailed Show Information**: View comprehensive show details, ratings, and episode guides
- **Watchlist Management**: Add shows to your personal watchlist for future viewing
- **Progress Analytics**: Track your viewing statistics and completion rates

### 💰 Finance Management
**Complete personal finance control**
- **Multi-Wallet Support**: Manage multiple wallets and accounts (Cash, Bank, Credit Cards, Digital Wallets)
- **Transaction Tracking**: Record and categorize all income and expenses with detailed descriptions
- **Category Management**: Organize transactions by custom categories (Food, Entertainment, Bills, etc.)
- **Budget Planning**: Set monthly/yearly budgets and track spending against targets
- **Transfer Management**: Handle money transfers between different wallets and accounts
- **Financial Reporting**: Generate detailed reports and insights about your spending patterns
- **Multi-Currency Support**: Support for USD, NPR, EUR, GBP, INR, JPY with proper currency formatting
- **Organization Support**: Multi-organization financial management for business users
- **Credit System**: Track loans, credits, and payment schedules
- **Export Capabilities**: Export financial data for external analysis

### 🎬 Movies Tracker
**Manage your movie collection**
- **Watchlist Management**: Keep track of movies you want to watch
- **Rating System**: Rate and review movies you've watched
- **Discovery Features**: Explore new movies and get recommendations
- **Collection Organization**: Organize movies by genre, rating, or custom lists
- **Progress Tracking**: Track watched vs. unwatched movies

### 💳 Bill Splitting (SettleBill & SettleGara)
**Simplify group expenses**
- **Network Management**: Create groups for splitting bills among friends, family, or colleagues
- **Expense Tracking**: Add and split bills among group members with customizable splitting methods
- **Settlement Calculation**: Automatically calculate who owes what to whom
- **Member Management**: Add/remove members from networks with invitation system
- **Bill Categorization**: Organize bills by type (Dining, Utilities, Travel, etc.)
- **Payment Tracking**: Mark bills as paid/unpaid and track settlement status
- **Debt Simplification**: Smart algorithm to minimize the number of transactions needed to settle debts
- **Notification System**: Get notified about new bills, payments, and settlements
- **Member Nicknames**: Use friendly nicknames for group members
- **Bill History**: Complete history of all group expenses and settlements

### 🎨 User Experience Features
- **Dark/Light Theme**: Toggle between dark and light modes with system preference detection
- **Responsive Design**: Seamlessly works on desktop, tablet, and mobile devices
- **User Authentication**: Secure login and registration with email verification
- **Admin Panel**: Comprehensive administrative tools for content management
- **Public Content**: Browse public shows and universes without requiring authentication
- **Profile Management**: Customize your profile with preferences and privacy settings
- **Data Export**: Export your personal data in JSON format
- **Feedback System**: Built-in feedback system to improve the platform

## 🛠 Technology Stack

### Frontend Technologies
- **React 18** - Modern React with hooks and concurrent rendering features
- **TypeScript** - Type-safe development with enhanced IDE support
- **Vite** - Lightning-fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Shadcn/UI** - Beautiful and accessible UI components built on Radix UI
- **React Router DOM** - Declarative client-side routing
- **React Query (TanStack)** - Powerful server state management with caching
- **Lucide React** - Comprehensive icon library with consistent design

### Backend & Database
- **Supabase** - Complete Backend-as-a-Service solution
  - **PostgreSQL Database** - Reliable relational database with advanced features
  - **Real-time Subscriptions** - Live data updates across clients
  - **Row Level Security (RLS)** - Database-level security policies
  - **Authentication & Authorization** - Complete user management system
  - **File Storage** - Secure file storage with CDN distribution
  - **Edge Functions** - Serverless functions for custom logic

### Mobile Development
- **Capacitor** - Cross-platform native runtime for mobile deployment
- **Progressive Web App (PWA)** - Web app with native-like features and offline support
- **Responsive Design** - Mobile-first approach ensuring optimal experience on all devices

## 📱 Mobile Application Features

TrackerHub is built as a Progressive Web App (PWA) with Capacitor integration for native mobile capabilities.

### Capacitor Integration Benefits
- **Cross-Platform Deployment**: Single codebase for iOS and Android apps
- **Native API Access**: Camera, storage, notifications, and other device features
- **Near-Native Performance**: Optimized performance rivaling native applications
- **Live Reload Development**: Hot reload on physical devices during development

### Mobile-Specific Features
- **Offline Support**: Core functionality works without internet connection
- **Push Notifications**: Stay updated with bill reminders and show updates
- **Native Navigation**: Smooth transitions and mobile-optimized gestures
- **Touch-Optimized Interface**: Designed specifically for touch interactions
- **Adaptive Layout**: Automatically adjusts to different screen sizes and orientations

## 🏗 Project Architecture

```
src/
├── apps/                    # Feature-specific applications
│   ├── finance/            # Personal finance management
│   │   ├── pages/          # Finance-related pages
│   │   └── components/     # Finance-specific components
│   ├── movies/             # Movie tracking and management
│   ├── settlebill/         # Modern bill splitting application
│   ├── settlegara/         # Legacy bill splitting (being phased out)
│   ├── tv-shows/           # TV show tracking and universe management
│   └── admin/              # Administrative panel and tools
├── components/             # Shared UI components
│   ├── Layout/             # Application layout components
│   ├── ui/                 # Base UI components (Shadcn/UI)
│   └── Auth/               # Authentication-related components
├── hooks/                  # Custom React hooks for data management
├── contexts/               # React contexts for global state
├── integrations/           # External service integrations (Supabase)
├── lib/                    # Utility libraries and helper functions
├── pages/                  # Main application pages and routing
└── types/                  # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites
- **Node.js 16+** - JavaScript runtime
- **npm or yarn** - Package manager
- **Git** - Version control system

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd trackerhub
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   Configure your environment variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   - Set up your Supabase project
   - Run database migrations
   - Configure Row Level Security policies
   - Set up authentication providers

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

6. **Build for Production**
   ```bash
   npm run build
   ```

## 📊 Feature Deep Dive

### TV Shows Application
**Complete entertainment tracking solution**

#### Personal Show Management
- Add shows to your personal collection
- Track watching progress across seasons and episodes
- Mark episodes as watched/unwatched with timestamps
- View detailed show information and episode guides
- Set personal ratings and add notes

#### Universe System
- Create themed collections (Marvel, DC, Star Wars, etc.)
- Organize related shows in logical groupings
- Public universes for community sharing
- Private universes for personal organization
- Universe-specific dashboards and analytics

#### Discovery Features
- Browse public shows and universes
- Search and filter capabilities
- Trending and popular content
- Recommendations based on your viewing history

### Finance Application
**Professional-grade personal finance management**

#### Wallet Management
- Create multiple wallets (Cash, Bank Accounts, Credit Cards)
- Track balances across all accounts
- Support for multiple currencies
- Wallet-specific transaction history

#### Transaction System
- Detailed income and expense tracking
- Custom categories and subcategories
- Recurring transaction support
- Bulk import/export capabilities
- Advanced filtering and search

#### Budgeting Tools
- Set monthly and yearly budgets
- Category-wise budget allocation
- Real-time budget vs. actual spending tracking
- Budget alerts and notifications

#### Reporting & Analytics
- Comprehensive financial reports
- Spending trends and patterns
- Category-wise analysis
- Export to popular formats (CSV, PDF)

### Bill Splitting Applications
**Streamlined group expense management**

#### SettleBill (Modern Version)
- **Network Creation**: Set up groups for different purposes (Friends, Family, Work)
- **Member Management**: Invite members via email or share codes
- **Bill Entry**: Add bills with detailed descriptions and categories
- **Smart Splitting**: Equal split, custom amounts, or percentage-based
- **Settlement Optimization**: Minimize transactions using advanced algorithms
- **Real-time Updates**: Live synchronization across all group members

#### Advanced Features
- **Bill Categories**: Organize expenses (Dining, Travel, Utilities, Entertainment)
- **Payment Tracking**: Mark who has paid and who owes
- **Settlement History**: Complete audit trail of all transactions
- **Notification System**: Automated reminders and updates
- **Currency Support**: Multi-currency bills with automatic conversion

### Movies Application
**Comprehensive movie management**
- Personal movie collection tracking
- Watchlist management with priority levels
- Rating and review system
- Genre-based organization
- Discovery and recommendation engine

## 🔐 Security & Privacy

### Authentication System
- **Secure Registration**: Email verification required
- **Login Protection**: Rate limiting and security monitoring
- **Password Security**: Industry-standard hashing and encryption
- **Session Management**: Secure token-based authentication

### Data Protection
- **Row Level Security**: Database-level access control
- **Data Encryption**: All sensitive data encrypted at rest and in transit
- **Privacy Controls**: Granular privacy settings for users
- **GDPR Compliance**: Data export and deletion capabilities

### User Permissions
- **Role-Based Access**: Admin and user roles with appropriate permissions
- **Organization Isolation**: Multi-tenant support for business users
- **Data Ownership**: Users maintain full control of their data

## 🎯 User Roles & Permissions

### Regular Users
- **Personal Data Management**: Full control over personal shows, finances, and bills
- **Group Participation**: Join networks and participate in bill splitting
- **Public Content**: Browse and interact with public shows and universes
- **Profile Customization**: Manage personal preferences and privacy settings

### Admin Users
- **Content Management**: Add and manage public shows and universes
- **User Administration**: View and manage user accounts
- **System Monitoring**: Access to system metrics and logs
- **Data Import**: Bulk import capabilities for shows and movies

## 🚀 Deployment Options

### Web Application Deployment
The application can be deployed to various hosting platforms:

#### Recommended Platforms
- **Netlify** - Zero-config deployment with CI/CD
- **Vercel** - Optimized for React applications
- **AWS S3 + CloudFront** - Scalable static hosting
- **GitHub Pages** - Free hosting for open source projects

#### Deployment Steps
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your chosen platform
3. Configure environment variables
4. Set up custom domain (optional)

### Mobile App Deployment

#### iOS App Store
1. **Development Setup**
   ```bash
   npx cap add ios
   npx cap sync
   ```
2. **Xcode Configuration**
   - Open project in Xcode
   - Configure signing certificates
   - Set app metadata and icons
3. **App Store Submission**
   - Archive and validate build
   - Submit to App Store Connect
   - Complete review process

#### Google Play Store
1. **Android Setup**
   ```bash
   npx cap add android
   npx cap sync
   ```
2. **Android Studio Configuration**
   - Configure signing keys
   - Set app metadata and icons
   - Build signed APK/AAB
3. **Play Store Submission**
   - Upload to Google Play Console
   - Complete store listing
   - Submit for review

## 🤝 Contributing

We welcome contributions from the community! Here's how to get started:

### Development Process
1. **Fork the Repository** - Create your own copy
2. **Create Feature Branch** - `git checkout -b feature/amazing-feature`
3. **Make Changes** - Implement your feature or fix
4. **Write Tests** - Ensure your changes don't break existing functionality
5. **Commit Changes** - `git commit -m 'Add amazing feature'`
6. **Push to Branch** - `git push origin feature/amazing-feature`
7. **Open Pull Request** - Describe your changes and submit for review

### Contribution Guidelines
- Follow existing code style and conventions
- Write clear, descriptive commit messages
- Include tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

### Areas for Contribution
- **New Features** - Enhance existing applications or add new ones
- **Bug Fixes** - Identify and fix issues
- **Documentation** - Improve guides and documentation
- **Testing** - Add test coverage
- **Performance** - Optimize application performance
- **Accessibility** - Improve accessibility features

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### License Summary
- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ❌ No warranty provided
- ❌ No liability accepted

## 🆘 Support & Help

### Getting Help
- **GitHub Issues** - Report bugs or request features
- **Documentation** - Comprehensive guides and API documentation
- **Community** - Join our community discussions
- **Email Support** - Contact our support team

### Common Issues & Solutions

#### Authentication Issues
- Verify email address is confirmed
- Check Supabase configuration
- Clear browser cache and cookies

#### Data Sync Problems
- Check internet connection
- Verify Supabase service status
- Try logging out and back in

#### Mobile App Issues
- Update to latest version
- Clear app cache
- Reinstall if necessary

## 🔮 Roadmap & Future Features

### Upcoming Features
- **Enhanced Mobile Features** - More native integrations and offline capabilities
- **Social Features** - Friend connections and content sharing
- **Advanced Analytics** - Detailed usage statistics and insights
- **API Integration** - Third-party service integrations (IMDb, TMDB, etc.)
- **Multi-language Support** - Internationalization for global users
- **Advanced Notifications** - Smart reminders and personalized alerts
- **Collaboration Tools** - Enhanced group features and permissions

### Long-term Vision
- **AI-Powered Recommendations** - Machine learning for personalized suggestions
- **Voice Integration** - Voice commands and smart assistant integration
- **Wearable Support** - Smartwatch apps and notifications
- **Enterprise Features** - Advanced business tools and analytics
- **Marketplace** - User-generated content and themes

### Performance Improvements
- **Caching Optimization** - Enhanced performance through intelligent caching
- **Bundle Optimization** - Reduced bundle sizes for faster loading
- **Database Optimization** - Query optimization and indexing improvements
- **CDN Integration** - Global content delivery for faster access

## 📈 Analytics & Monitoring

### User Analytics
- **Usage Tracking** - Monitor feature usage and user engagement
- **Performance Metrics** - Track application performance and load times
- **Error Monitoring** - Automatic error detection and reporting
- **User Feedback** - Built-in feedback system for continuous improvement

### Technical Monitoring
- **Uptime Monitoring** - 24/7 service availability tracking
- **Performance Monitoring** - Real-time performance metrics
- **Security Monitoring** - Continuous security threat detection
- **Backup Systems** - Automated data backup and recovery

## 🎨 Design System

### UI Components
- **Consistent Design Language** - Unified visual style across all applications
- **Accessible Components** - WCAG 2.1 AA compliance
- **Responsive Design** - Mobile-first approach for all screen sizes
- **Theme Support** - Dark and light themes with system preference detection

### Brand Guidelines
- **Color Palette** - Carefully selected colors for optimal user experience
- **Typography** - Professional typography with excellent readability
- **Iconography** - Consistent icon library with clear meanings
- **Animation** - Subtle animations that enhance user experience

---

## 📞 Contact Information

**Project Maintainers**: TrackerHub Development Team  
**Email**: support@trackerhub.app  
**Website**: https://trackerhub.app  
**Documentation**: https://docs.trackerhub.app  

---

**Built with ❤️ using modern web technologies and mobile-first design principles.**

*TrackerHub - Your personal dashboard for tracking TV shows, managing finances, organizing movies, and splitting bills with friends.*
