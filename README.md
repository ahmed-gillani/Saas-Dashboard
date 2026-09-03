# Nexus.io - SaaS Dashboard

A modern, feature-rich SaaS dashboard built with React, TypeScript, and Firebase. Nexus.io provides comprehensive user management, analytics, real-time chat capabilities, and business intelligence tools in an elegant dark-themed interface.

## 🎯 Features

### Core Features
- **🔐 Authentication System** - Secure login/signup with Firebase Authentication, Google Sign-in support
- **📊 Advanced Dashboard** - Real-time analytics with revenue tracking, user metrics, and activity monitoring
- **👥 User Management** - Complete CRUD operations for managing users, roles, and permissions
- **💬 AI Chatbot** - Multi-conversation support with local storage persistence and markdown rendering
- **📈 Analytics** - Comprehensive analytics page with charts and performance metrics
- **🎭 Role-Based Access Control** - Manage user roles and permissions
- **⚙️ Settings** - Customizable user and application settings
- **📱 Dowry Module** - Specialized financial/inventory tracking
- **📧 Notifications** - Real-time toast notifications for user actions
- **🌙 Dark Theme** - Sleek dark mode interface by default

### Technical Features
- **Real-time Data** - Powered by Firebase Firestore and Realtime Database
- **Responsive Design** - Mobile-first approach with TailwindCSS
- **Type Safety** - Full TypeScript support across the entire codebase
- **State Management** - Zustand for efficient client-side state
- **Data Fetching** - React Query for server state management and caching
- **Form Handling** - React Hook Form with Zod validation
- **Charts & Visualizations** - Recharts for beautiful data visualization

## 🏗️ Project Structure

```
src/
├── api/                    # API integration layer
│   ├── authApi.ts         # Authentication API
│   ├── chatApi.ts         # Chatbot API
│   ├── dashboardApi.ts    # Dashboard data API
│   ├── usersApi.ts        # User management API
│   ├── dowryApi.ts        # Dowry module API
│   └── axiosInstance.ts   # Axios configuration
├── components/            # Reusable UI components
│   ├── auth/             # Authentication components
│   ├── Chatbot/          # Chatbot UI components
│   ├── layout/           # Layout components (Sidebar, Topbar, etc.)
│   └── ui/               # Generic UI components
├── hooks/                 # Custom React hooks
│   ├── useAuth.ts        # Authentication hook
│   ├── useDashboard.ts   # Dashboard data hook
│   ├── useUsers.ts       # User management hook
│   └── useNotifications.ts
├── pages/                 # Page components
│   ├── auth/             # Login, Signup pages
│   ├── chatbot/          # Chatbot interface
│   ├── dashboard/        # Dashboard with charts
│   ├── users/            # User management page
│   ├── analytics/        # Analytics dashboard
│   ├── roles/            # Role management
│   ├── settings/         # User settings
│   ├── dowry/            # Dowry module
│   └── home/             # Home/welcome page
├── store/                # Zustand state management
│   ├── authStore.ts      # Auth state
│   ├── notificationStore.ts
│   └── themeStore.ts
├── types/                # TypeScript type definitions
│   └── auth.types.ts
├── utils/                # Utility functions
│   ├── chatStorage.ts    # Local chat persistence
│   └── processChunk.ts   # Data processing utilities
├── lib/                  # Third-party library setup
│   └── firebase.ts       # Firebase configuration
├── App.tsx               # Main app component with routing
└── main.tsx              # Entry point
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ (LTS recommended)
- **npm** v9+ or **yarn**
- Firebase account for backend services

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Saas-Dashboard
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Firebase** (if needed)
   - Update `src/lib/firebase.ts` with your Firebase credentials
   - Current setup uses Nexus.io Firebase project

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
   - Navigate to `http://localhost:5173`
   - Default route redirects to login page

## 💻 Development

### Available Scripts

```bash
# Start development server with HMR
npm run dev

# Build for production
npm run build

# Run ESLint checks
npm run lint

# Preview production build
npm run preview
```

### Tech Stack Details

| Technology | Purpose | Version |
|---|---|---|
| React | UI Framework | 19.2.5 |
| TypeScript | Type Safety | 6.0.2 |
| Vite | Build Tool & Dev Server | 8.0.9 |
| TailwindCSS | Styling | 4.2.4 |
| Firebase | Backend & Authentication | 12.12.0 |
| Zustand | State Management | 5.0.12 |
| React Query | Server State Management | 5.99.2 |
| React Router DOM | Routing | 7.14.1 |
| React Hook Form | Form Management | 7.72.1 |
| Recharts | Data Visualization | 3.8.1 |
| Lucide React | Icons | 1.8.0 |
| Framer Motion | Animations | 12.38.0 |
| Zod | Schema Validation | 4.3.6 |
| Axios | HTTP Client | 1.15.1 |
| React Hot Toast | Notifications | 2.6.0 |

## 📖 Application Routes

| Route | Component | Purpose | Auth Required |
|---|---|---|---|
| `/login` | LoginPage | User authentication | ❌ |
| `/signup` | SignupPage | User registration | ❌ |
| `/home` | HomePage | Welcome/landing | ✅ |
| `/dashboard` | DashboardPage | Main analytics dashboard | ✅ |
| `/users` | UsersPage | User management | ✅ |
| `/analytics` | AnalyticsPage | Detailed analytics | ✅ |
| `/roles` | RolesPage | Role management | ✅ |
| `/settings` | SettingsPage | User settings | ✅ |
| `/dowry` | DowryPage | Dowry management | ✅ |
| `/chatbot` | ChatbotPage | AI chatbot interface | ✅ |
| `/chatbot/:id` | ChatbotPage | Specific conversation | ✅ |

## 🔑 Key Features Explained

### 🔐 Authentication
- Firebase-based authentication system
- Google Sign-in integration
- Automatic user profile creation on signup
- Session persistence using Zustand
- Protected routes with `AuthGuard` component

### 📊 Dashboard
Real-time metrics including:
- **Total Users** - With monthly growth metrics
- **Revenue Tracking** - Monthly revenue vs. target visualization
- **Active Sessions** - Current active user sessions
- **Churn Rate** - User retention metrics
- **User Activity** - Login and signup trends
- **Traffic Sources** - Distribution across channels
- **Recent Users Table** - Latest user registrations

### 💬 Chatbot
- Multi-conversation support
- Persistent chat history using localStorage
- Markdown message rendering
- Real-time streaming responses
- Create/delete conversations
- Auto-save functionality

### 👥 User Management
- Paginated user list with search
- Filter by role and status
- Add/Edit/Delete users
- User profile cards with avatars
- Bulk actions support

### 📈 Analytics
- Performance trends
- User acquisition data
- Engagement metrics
- Custom date range selection
- Exportable reports

## 🔄 State Management

### Zustand Stores
- **authStore** - User authentication state, tokens, user info
- **notificationStore** - Toast notifications queue
- **themeStore** - Theme preferences (dark/light mode)

### React Query
- Server state management with automatic caching
- Configured retry policy (1 retry) and stale time (5 minutes)
- Used for all API calls (dashboard data, users, etc.)

## 🎨 UI/UX

- **Dark Theme** - Modern dark interface with gray-900 backgrounds
- **Responsive** - Mobile-first design with Tailwind breakpoints
- **Animations** - Smooth transitions with Framer Motion
- **Icons** - Comprehensive icon library via Lucide React
- **Notifications** - Toast-based feedback for user actions
- **Loading States** - Skeleton screens for better UX

## 🔗 API Integration

All API calls are made through:
- **Axios Instance** (`src/api/axiosInstance.ts`) - Centralized configuration with interceptors
- **React Query Hooks** - For data fetching and caching
- **Custom Hooks** - Wrapper hooks in `src/hooks/` for clean component integration

### API Endpoints Structure
```
/api/auth/        # Authentication endpoints
/api/users/       # User management endpoints
/api/dashboard/   # Dashboard metrics
/api/chat/        # Chatbot endpoints
/api/dowry/       # Dowry module endpoints
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Environment Variables
Create a `.env` file (if needed for different Firebase configs):
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
# ... other Firebase config
```

## 🧪 Testing & Linting

```bash
# Run ESLint
npm run lint

# Type checking is automatic with TypeScript during build
npm run build
```

## 📝 Code Style

- **TypeScript** - Strict mode enabled
- **ESLint** - React and hooks best practices
- **No Comments** - Self-documenting code with clear naming
- **Functional Components** - React hooks throughout

## 🤝 Contributing

When contributing to Nexus.io:

1. Follow the existing project structure
2. Use TypeScript for type safety
3. Create components in appropriate directories
4. Use Zustand for global state, React Query for server state
5. Add proper error handling with React Hot Toast
6. Test responsive design across breakpoints
7. Maintain dark theme consistency

## 📦 Dependencies Management

### Core Dependencies
- React & React DOM - UI framework
- TypeScript - Type safety
- Vite - Build tooling

### UI & Styling
- TailwindCSS - Utility-first CSS
- Lucide React - Icon library
- Framer Motion - Animations

### State & Data
- Zustand - Client state
- React Query - Server state
- React Router - Routing

### Forms & Validation
- React Hook Form - Form management
- Zod - Schema validation

### API & Backend
- Firebase - BaaS platform
- Axios - HTTP client

## 📚 Learning Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Vite Guide](https://vitejs.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [TailwindCSS](https://tailwindcss.com/docs)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Query](https://tanstack.com/query/latest)

## ⚡ Performance

- **Code Splitting** - Vite automatically code-splits routes
- **Lazy Loading** - Routes are lazy-loaded for faster initial load
- **Caching** - React Query caches data intelligently
- **Asset Optimization** - Automatic minification and compression

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Use a different port
npm run dev -- --port 3000
```

### Firebase Connection Issues
- Verify Firebase credentials in `src/lib/firebase.ts`
- Check Firebase project firewall rules
- Ensure Firestore is enabled in Firebase Console

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
npm run build
```

## 📞 Support

For issues, questions, or feature requests, please create an issue in the repository.

## 📄 License

This project is proprietary software. All rights reserved.

---

**Last Updated**: September 2024  
**Version**: 1.0.0  
**Application Name**: Nexus.io SaaS Dashboard
