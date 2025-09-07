# Bill Splitter

A React Native Expo app built with TypeScript for splitting bills between friends.

## Features

- 🎨 **Modern UI** with NativeWind (Tailwind CSS for React Native)
- 🌙 **Dark/Light Mode** support with system preference detection
- 🔐 **Authentication** context with secure token storage
- 🧭 **Navigation** using React Navigation v7
- 📱 **Cross-platform** support (iOS, Android, Web)
- 🧪 **Testing** setup with Jest and React Native Testing Library
- 🔧 **Development Tools** with ESLint and Prettier
- 📦 **Secure Storage** using Expo Secure Store
- 🌐 **API Integration** with Axios and interceptors

## Project Structure

```
src/
├── components/     # Reusable UI components
├── context/        # React Context providers
├── hooks/          # Custom React hooks
├── navigation/     # Navigation setup and types
├── screens/        # Screen components
└── services/       # API and external services
```

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bill-splitter
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm start
```

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Start on Android device/emulator
- `npm run ios` - Start on iOS device/simulator
- `npm run web` - Start web version
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run type-check` - Check TypeScript types

## Technologies Used

- **React Native** - Mobile app framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **React Navigation** - Navigation library
- **NativeWind** - Tailwind CSS for React Native
- **Axios** - HTTP client
- **Expo Secure Store** - Secure storage
- **Jest & React Native Testing Library** - Testing
- **ESLint & Prettier** - Code formatting and linting

## Key Features

### Theme Support
The app includes a comprehensive theme system with:
- Light/Dark mode toggle
- System preference detection
- Persistent theme storage

### Authentication
Mock authentication system with:
- Context-based state management
- Secure token storage
- Automatic token injection in API calls

### Navigation
Type-safe navigation with:
- Stack navigator
- Screen parameter typing
- Deep linking support

### API Integration
Configured Axios instance with:
- Request/response interceptors
- Automatic token injection
- Error handling

## Development Guidelines

### Code Style
- Use TypeScript for all new files
- Follow the configured ESLint rules
- Use Prettier for code formatting
- Write tests for new components and utilities

### Component Structure
- Use functional components with hooks
- Implement proper TypeScript interfaces
- Follow the established folder structure
- Export components through index files

### Testing
- Write unit tests for components
- Mock external dependencies
- Use React Native Testing Library
- Aim for good test coverage

## Environment Variables

Copy `.env.example` to `.env` and configure:

```
EXPO_PUBLIC_API_BASE_URL=https://your-api-url.com
EXPO_PUBLIC_APP_ENV=development
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
