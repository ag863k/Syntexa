# Syntexa - Coding Notes Hub

A collaborative platform where developers share coding problems, solutions, and notes with secure JWT authentication and mobile-responsive design.

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Maven 3.6+
- Node.js 16+
- PostgreSQL 12+

### Backend Setup

1. **Database Setup**
   ```sql
   CREATE DATABASE syntexa_db;
   CREATE USER syntexa_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE syntexa_db TO syntexa_user;
   ```

2. **Configuration**
   ```bash
   cd syntexa-api/src/main/resources
   cp application.properties.template application.properties
   ```
   
   Edit `application.properties` and update:
   - Database credentials
   - JWT secret (generate with: `echo -n "YourSecretKey" | base64`)

3. **Run Backend**
   ```bash
   cd syntexa-api
   mvn spring-boot:run
   ```

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd syntexa-frontend
   npm install
   ```

2. **Environment Configuration (Optional)**
   ```bash
   cp .env.template .env
   # Edit .env to customize API URLs if needed
   ```

3. **Run Frontend**
   ```bash
   npm start
   ```

## 📱 Features

- **Secure Authentication**: JWT-based user authentication with timeout protection
- **Notes Management**: Create, edit, share, and organize coding notes
- **Mobile Responsive**: Optimized for all device sizes with adaptive layouts
- **Syntax Highlighting**: Code syntax highlighting for multiple programming languages
- **Problem Sharing**: Collaborative problem-solving platform with unique share tokens
- **Starter Content**: Automatic starter notes for new users

## 🔒 Security Features

- JWT token-based authentication
- Password validation with security requirements
- CORS protection for cross-origin requests
- Environment variable configuration for sensitive data
- Secure share token generation for note sharing

## 🛠️ Development

- Backend API: `http://localhost:8080`
- Frontend App: `http://localhost:3000`
- API Base URL: `/api/v1/`

## 📦 Deployment

### Backend Deployment
- Configure environment variables for production
- Set up PostgreSQL database
- Use production-grade JWT secrets
- Enable HTTPS and proper CORS settings

### Frontend Deployment
- Build production bundle: `npm run build`
- Configure production API URLs in environment variables
- Deploy to static hosting service (Netlify, Vercel, etc.)

## 🏗️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.x with Java 17
- **Security**: Spring Security with JWT authentication
- **Database**: PostgreSQL with JPA/Hibernate
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18+ with modern hooks
- **Styling**: Tailwind CSS for responsive design
- **HTTP Client**: Axios with timeout protection
- **Syntax Highlighting**: React Syntax Highlighter

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## Features

- **Topic Management:**  
  - Create, update, and delete coding problem topics.
  - Tag topics with metadata for easy discovery.

- **Collaborative Note Sharing:**  
  - Add multiple notes, solutions, and approaches to each topic.
  - Enable community feedback and discussion.

- **User Authentication & Authorization:**  
  - Secure registration and login using JWT-based authentication.
  - Fine-grained access control for topic ownership and note modifications.

- **Responsive Interface:**  
  - A React-based frontend provides a modern and intuitive user experience.
  - Seamless integration between backend services and frontend UI.

---

## Tech Stack

### Backend
- **Language:** Java 17  
- **Framework:** Spring Boot 3.x  
- **Security:** Spring Security with JWT authentication  
- **Database:** PostgreSQL (production) and H2 (testing)  
- **Build Tool:** Maven

### Frontend
- **Library:** React  
- **Styling:** Tailwind CSS  
- **Package Manager:** npm  
- **Additional Tools:** PostCSS, Create React App

---

## Getting Started

### Prerequisites

- **Java 17:** Ensure Java 17 is installed and `JAVA_HOME` is set.
- **Maven:** For building and running the backend.
- **Node.js and npm:** For the frontend development and dependency management.
- **PostgreSQL:** (Optional) For production use; alternatively, H2 is available for testing.

### Backend Setup

**Configure Environment Variables:**  
   In your `application.properties` (or `application.yml`), configure:
   ```properties
   app.jwt.secret=YOUR_BASE64_ENCODED_SECRET
   app.jwt.expiration-ms=3600000
   spring.datasource.url=jdbc:postgresql://localhost:5432/your_database
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```
**Build and Run the Backend**

```bash
cd syntexa-api
mvn clean install
mvn spring-boot:run
```
Once running, the backend API will be available at [http://localhost:8080](http://localhost:8080).

## Frontend Setup

The frontend is built with React and styled using Tailwind CSS.

### Install Dependencies

```bash
cd syntexa-frontend
npm install
```

## Run the Frontend

```bash
npm start
```
The frontend will launch in your browser at [http://localhost:3000](http://localhost:3000).



