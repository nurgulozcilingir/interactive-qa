# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Interactive Q&A Tree Visualization Application - a real-time web app where participant answers are visualized as leaves on a tree during live sessions. The project is currently in the documentation/planning phase.

## Technology Stack

### Backend
- **Node.js + Express.js** - API server
- **Socket.io** - Real-time bidirectional communication
- **MongoDB** - Primary database for sessions and answers
- **Redis** - Session management and caching

### Frontend
- **React.js** - UI framework
- **Socket.io-client** - WebSocket client
- **D3.js or Three.js** - Tree visualization and animations
- **Tailwind CSS** - Styling framework
- **Framer Motion** - Animation library

### Deployment
- **Railway** - Cloud hosting platform for rapid prototyping
- **MongoDB Atlas** - Cloud database
- **Redis Cloud** - Cloud cache service

## Project Structure

This is a monorepo containing both backend and frontend applications:

```
interactive-qa-app/
├── backend/           # Node.js + Express + Socket.io server
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
├── frontend/          # React.js client application
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
├── shared/            # Shared types and constants
│   ├── types/
│   └── constants/
├── package.json       # Root package.json with workspace scripts
├── .gitignore
├── README.md
└── CLAUDE.md
```

## Development Commands

### Initial Setup
```bash
# Install all dependencies (root + workspaces)
npm install
cd backend && npm install
cd ../frontend && npm install

# Create environment files
cd backend && cp .env.example .env
cd ../frontend && cp .env.example .env

# Start both backend and frontend in development mode
npm run dev

# Or run separately:
npm run dev:backend
npm run dev:frontend
```

### Build Commands
```bash
# Build both applications
npm run build

# Build separately
npm run build:backend
npm run build:frontend
```

### Testing Commands
```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run specific workspace tests
npm run test:backend
npm run test:frontend

# E2E tests
npm run test:e2e

# Code quality
npm run lint
npm run format
```

## Architecture Overview

### Core Services
1. **Authentication Service** - Session and moderator management
2. **Question Service** - CRUD operations for questions
3. **Answer Service** - Collecting and processing participant answers
4. **Socket Service** - Real-time communication layer
5. **Tree Service** - Tree visualization data generation

### Real-time Events
Key Socket.io events to implement:
- `session:start`, `session:end` - Session lifecycle
- `question:publish` - Moderator publishes question
- `participant:join`, `participant:leave` - Participant management
- `answer:submit` - Answer submission
- `tree:update` - Tree visualization updates

### Database Schema
- **Sessions** - Event sessions with questions
- **Answers** - Participant responses with tree positions
- **Participants** - Active session participants

## Key Implementation Notes

1. **Real-time Performance** - The app must support 500+ concurrent users with <200ms response times
2. **Mobile-First** - Design responsive interfaces prioritizing mobile devices
3. **Tree Visualization** - Implement smooth animations for leaf additions using D3.js/Three.js
4. **State Management** - Use Redux or Zustand for complex state handling
5. **Error Handling** - Implement reconnection logic for WebSocket disconnections

## Development Sprints

The project is planned for 8 sprints (16 weeks total):
- **Sprints 1-2**: Backend API and database setup
- **Sprints 3-4**: User interfaces (moderator and participant)
- **Sprints 5-6**: Tree visualization implementation
- **Sprints 7-8**: Testing, optimization, and deployment

## Security Considerations

- JWT-based authentication for moderators
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration for cross-origin requests

## Performance Goals

- Support 500+ concurrent participants
- Process 100+ messages per second
- Maintain <200ms API response time
- Achieve 99.9% uptime