# Anyware Software Challenge - Setup Instructions

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

## Quick Setup

### 1. Clone and Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Setup

```bash
# Copy environment file
cp backend/env.example backend/.env

# Edit the .env file with your MongoDB connection string
# For local MongoDB: mongodb://localhost:27017/anyware-challenge
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/anyware-challenge
```

### 3. Database Setup

```bash
# Start MongoDB (if using local installation)
# On Windows: Start MongoDB service
# On macOS: brew services start mongodb-community
# On Linux: sudo systemctl start mongod

# Seed the database with sample data
cd backend
npm run seed
```

### 4. Start Development Servers

```bash
# From the root directory
npm run dev

# This will start both frontend (port 3000) and backend (port 5000)
```

## Manual Setup (Alternative)

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Edit .env with your MongoDB connection string

# Seed database
npm run seed

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

## Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Production Build

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
```

## Features Implemented

### ✅ Frontend Requirements
- [x] React with TypeScript
- [x] Redux Toolkit for state management
- [x] Material-UI components
- [x] Responsive design
- [x] Reusable components
- [x] HOC for authentication (requireAuth)
- [x] Simple login/logout functionality
- [x] Hover effects on sidebar
- [x] i18n setup for internationalization
- [x] Unit tests with React Testing Library

### ✅ Backend Requirements
- [x] Express.js with TypeScript
- [x] MongoDB with Mongoose
- [x] JWT authentication
- [x] CRUD operations for announcements
- [x] CRUD operations for quizzes
- [x] RESTful API design
- [x] Error handling middleware
- [x] Input validation
- [x] Unit and integration tests

### ✅ UI/UX Features
- [x] Dark blue sidebar with hover effects
- [x] Welcome message with user name
- [x] Search functionality
- [x] Notification badges
- [x] Profile avatar
- [x] Exams banner with study tips
- [x] Announcements feed
- [x] Due assignments and quizzes
- [x] Responsive design for all screen sizes

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Announcements
- `GET /api/announcements` - Get all announcements
- `POST /api/announcements` - Create announcement
- `PUT /api/announcements/:id` - Update announcement
- `DELETE /api/announcements/:id` - Delete announcement

### Quizzes
- `GET /api/quizzes` - Get all quizzes
- `GET /api/quizzes/upcoming` - Get upcoming quizzes
- `POST /api/quizzes` - Create quiz
- `PUT /api/quizzes/:id` - Update quiz
- `DELETE /api/quizzes/:id` - Delete quiz

## Project Structure

```
anyware-software-challenge/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store and slices
│   │   ├── services/       # API services
│   │   ├── i18n/           # Internationalization
│   │   └── types/          # TypeScript types
│   └── public/             # Static assets
├── backend/                 # Express.js backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── config/         # Configuration files
│   │   └── utils/          # Utility functions
│   └── tests/              # Backend tests
└── shared/                 # Shared types and utilities
```

## Code Quality

- **TypeScript**: Full type safety throughout the application
- **ESLint**: Code linting and formatting
- **Best Practices**: Clean code principles and patterns
- **Documentation**: Comprehensive comments and README
- **Testing**: Unit and integration tests
- **Error Handling**: Centralized error management
- **Security**: JWT authentication, input validation, CORS

## Performance

- **Frontend**: React optimization, lazy loading, efficient re-renders
- **Backend**: Database indexing, query optimization, compression
- **Responsive**: Mobile-first design with breakpoints
- **Caching**: Redux state management, localStorage for tokens

## Security

- **Authentication**: JWT tokens with expiration
- **Authorization**: Protected routes and middleware
- **Input Validation**: Express-validator for API inputs
- **CORS**: Configured for frontend domain
- **Helmet**: Security headers and protection 