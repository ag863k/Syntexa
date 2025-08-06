# Syntexa - Problem Solving & Note Management Platform

A full-stack web application for managing problems and collaborative note-taking.

## Architecture
- **Frontend**: React.js with Tailwind CSS (deployed on Netlify)
- **Backend**: Spring Boot with PostgreSQL (deployed on Render)
- **Authentication**: JWT with auto-refresh capability

## Features
- User authentication and authorization
- Problem creation and management
- Collaborative note-taking
- Note sharing with public links
- Responsive mobile-first design
- Real-time token refresh
- Secure API endpoints

## Quick Start

### Prerequisites
- Node.js 18+
- Java 17+
- PostgreSQL database

### Local Development

1. **Backend Setup**:
   ```bash
   cd syntexa-api
   cp src/main/resources/application.properties.template src/main/resources/application.properties
   # Edit application.properties with your database credentials
   ./mvnw spring-boot:run
   ```

2. **Frontend Setup**:
   ```bash
   cd syntexa-frontend
   npm install
   npm start
   ```

### Production Deployment
See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## API Endpoints
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Token refresh
- `GET /api/v1/problems` - List problems
- `POST /api/v1/problems` - Create problem
- `GET /api/v1/notes/mine` - Get user notes

## Tech Stack

### Backend
- Spring Boot 3.2.5
- Java 17
- Spring Security with JWT
- PostgreSQL with JPA/Hibernate
- Maven build tool

### Frontend
- React 19.1.0
- Tailwind CSS 3.3.5
- React Router DOM 7.6.2
- Axios 1.9.0
- npm package manager

## Security Features
- JWT tokens with configurable expiration
- BCrypt password hashing
- CORS protection
- SQL injection prevention
- Environment variable configuration

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.



