
# TrackerHub - Your Personal Dashboard

TrackerHub is a comprehensive web application that brings together multiple productivity and entertainment tracking tools in one unified platform. Built with modern web technologies, it provides a seamless experience for managing your digital life.

## 🚀 Features

### 📺 TV Shows Tracker
- Track your favorite TV shows and episodes
- Create and manage custom universes (show collections)
- Mark episodes as watched and keep track of your progress
- Browse public shows and universes
- Organize shows by custom categories

### 💰 Finance Manager
- Multi-wallet support for different accounts
- Transaction tracking with categories
- Budget management and expense monitoring
- Financial reports and analytics
- Organization support for shared finances
- Credit tracking and payments

### 🎬 Movies Tracker
- Personal movie watchlist management
- Rate and review movies you've watched
- Track viewing status (want to watch, watched, etc.)
- Add personal notes and ratings
- Discover new movies

### 🧾 SettleGara - Bill Splitting
- Create networks with friends and family
- Split bills and expenses easily
- Track who owes what to whom
- Simplify group payments
- Manage multiple expense groups

## 🛠️ Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Backend**: Supabase (PostgreSQL database, Authentication, Real-time)
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Icons**: Lucide React

## 🔐 Authentication & Security

- Secure user authentication via Supabase Auth
- Row Level Security (RLS) for data protection
- Email/password and social login support
- Per-user app preferences and settings
- Role-based access control for admin features

## 🎨 Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **Modular Architecture**: Enable/disable apps based on your needs
- **Real-time Updates**: Live data synchronization across devices
- **Offline Support**: Continue working even with poor connectivity

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/trackerhub.git
cd trackerhub
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Fill in your Supabase credentials in the `.env` file.

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Copy your project URL and anon key to the `.env` file
3. Run the database migrations (SQL files provided)
4. Configure authentication providers as needed

### App Preferences
Each user can customize which apps are visible in their dashboard:
- Go to Settings → App Preferences
- Toggle apps on/off based on your needs
- Changes are saved per-user in the database

## 📱 Usage

1. **Sign Up/Login**: Create an account or sign in to access all features
2. **Choose Your Apps**: Enable the apps you want to use in Settings
3. **Start Tracking**: Begin adding your shows, transactions, movies, or bills
4. **Organize**: Use categories, universes, and networks to stay organized
5. **Analyze**: Review reports and insights to understand your habits

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines
- Follow the existing code style and patterns
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev) - AI-powered web development
- UI components from [Shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide](https://lucide.dev/)
- Backend powered by [Supabase](https://supabase.com/)

## 📞 Support

If you have any questions or need help, please:
1. Check the documentation
2. Search existing issues
3. Create a new issue if needed

---

**TrackerHub** - Bringing all your tracking needs together in one beautiful, unified platform. 🎯
