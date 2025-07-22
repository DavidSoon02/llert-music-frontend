# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# 🎵 Music Store Frontend

A modern, Spotify-inspired music e-commerce platform built with React, TypeScript, and Tailwind CSS v4.1. This frontend consumes multiple microservices to provide a complete music shopping experience.

## 🚀 Features

### 🎯 Core Functionality
- **Authentication System**: Login and registration with JWT tokens
- **Music Catalog**: Browse and search through available songs
- **Shopping Cart**: Add, remove, and manage music purchases
- **User Management**: Profile and settings management
- **Responsive Design**: Mobile-first, Spotify-inspired UI

### 🎨 Design Features
- **Modern UI**: Spotify-like dark theme with green accents
- **Responsive**: Optimized for all screen sizes
- **Animations**: Smooth transitions and hover effects
- **Loading States**: Skeleton screens and loading indicators
- **Error Handling**: User-friendly error messages

### 🔧 Technical Features
- **TypeScript**: Full type safety
- **React Router**: Client-side routing
- **Context API**: State management for auth and cart
- **Axios**: HTTP client with interceptors
- **Protected Routes**: Authentication guards
- **Environment Variables**: Configuration management

## 🏗️ Architecture

### 📁 Project Structure
```
src/
├── components/          # React components
│   ├── Cart.tsx        # Shopping cart component
│   ├── Header.tsx      # Navigation header
│   ├── Home.tsx        # Landing page
│   ├── Login.tsx       # Authentication login
│   ├── Register.tsx    # User registration
│   ├── Songs.tsx       # Music catalog
│   ├── Layout.tsx      # Page layout wrapper
│   ├── ProtectedRoute.tsx # Route protection
│   └── ErrorPage.tsx   # Error handling
├── contexts/           # React contexts
│   ├── AuthContext.tsx # Authentication state
│   └── CartContext.tsx # Shopping cart state
├── services/           # API services
│   └── api.ts         # HTTP client and endpoints
├── types/             # TypeScript definitions
│   └── index.ts       # Type definitions
├── App.tsx            # Main application
├── main.tsx          # Application entry point
└── index.css         # Global styles
```

### 🔌 Microservices Integration

The frontend connects to the following microservices through a load balancer:

#### Authentication Domain
- **Login Service** (`/login`): User authentication
- **Register Service** (`/register`): User registration

#### Song Domain
- **List Service** (`/songs`): Browse music catalog
- **Add Service** (`/songs-add`): Add new songs (admin)
- **Delete Service** (`/songs-delete`): Remove songs (admin)

#### Cart Domain
- **Add Service** (`/cart-add`): Add items to cart
- **Remove Service** (`/cart-remove`): Remove cart items
- **View Service** (`/cart-view`): View cart contents

#### Client Domain (Admin)
- **List Service** (`/clients`): List users
- **Add Service** (`/clients-add`): Add new users
- **Delete Service** (`/clients-delete`): Remove users

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Load balancer running on port 8080

### 1. Install Dependencies
```bash
cd songs-frontend
npm install
```

### 2. Environment Configuration
Copy and configure the environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your load balancer configuration:
```env
# Microservices Configuration - Load Balancer URLs
VITE_LOGIN_SERVICE_URL=http://localhost:8080/login
VITE_REGISTER_SERVICE_URL=http://localhost:8080/register
VITE_SONG_LIST_SERVICE_URL=http://localhost:8080/songs
# ... other services
```

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🎯 Usage

### 🔐 Authentication Flow
1. **Registration**: New users create accounts via `/register`
2. **Login**: Existing users authenticate via `/login`
3. **Token Management**: JWT tokens stored in localStorage
4. **Auto-login**: Persistent sessions with token validation

### 🛒 Shopping Flow
1. **Browse Music**: View catalog on `/songs`
2. **Search & Filter**: Find specific tracks or artists
3. **Add to Cart**: Click "Add" on desired songs
4. **Review Cart**: View cart contents on `/cart`
5. **Checkout**: Process payment (PayPal integration planned)

### 🎵 Music Management
- **Catalog Browsing**: Grid layout with cover art
- **Song Details**: Title, artist, duration, price
- **Search**: Real-time filtering by title/artist
- **Sorting**: By title, artist, price, or duration

## 🎨 UI/UX Design

### 🎯 Design Philosophy
- **Spotify-Inspired**: Familiar interface for music lovers
- **Dark Theme**: Easy on the eyes for extended browsing
- **Green Accents**: Brand color for CTAs and highlights
- **Smooth Animations**: Enhanced user experience

### 📱 Responsive Design
- **Mobile First**: Optimized for small screens
- **Tablet Support**: Adaptive layouts for medium screens
- **Desktop Enhanced**: Full features on large screens

### ♿ Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Semantic HTML and ARIA labels
- **High Contrast**: Sufficient color contrast ratios
- **Focus Indicators**: Clear focus states

## 🔧 Development

### 🧪 Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### 🔍 Code Quality
- **TypeScript**: Strict type checking
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting (if configured)

### 🚀 Build & Deployment
```bash
npm run build    # Creates dist/ folder
npm run preview  # Test production build locally
```

## 🔮 Future Enhancements

### 💳 Payment Integration
- **PayPal Checkout**: Secure payment processing
- **Order History**: Track purchase history
- **Download Links**: Access purchased content

### 🎵 Music Features
- **Audio Preview**: 30-second song previews
- **Playlists**: Create and manage playlists
- **Favorites**: Like/unlike songs
- **Recommendations**: AI-powered suggestions

### 👤 User Features
- **Profile Management**: Update user information
- **Purchase History**: View past transactions
- **Wishlist**: Save songs for later
- **Social Features**: Share favorites

### 🎨 UI Enhancements
- **Animations**: Advanced micro-interactions
- **Themes**: Multiple color schemes
- **Personalization**: Customizable interface
- **Progressive Web App**: Offline support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is part of a distributed systems architecture demo. See the main repository for license information.

## 🆘 Support

For support and questions:
- Check the main repository documentation
- Review microservices setup guides
- Ensure load balancer is properly configured
- Verify environment variables are correct

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
