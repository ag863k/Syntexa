# Syntexa Deployment Guide

## 🚀 Production Deployment Steps

### Backend Deployment

1. **Environment Setup**
   ```bash
   # Copy configuration template
   cp syntexa-api/src/main/resources/application.properties.template application.properties
   ```

2. **Configure Environment Variables**
   ```properties
   # Database Configuration
   spring.datasource.url=jdbc:postgresql://your-db-host:5432/syntexa_db
   spring.datasource.username=${DB_USERNAME}
   spring.datasource.password=${DB_PASSWORD}
   
   # JWT Secret (Base64 encoded)
   app.jwt.secret=${JWT_SECRET}
   ```

3. **Generate Secure JWT Secret**
   ```bash
   # Generate a secure random string and encode it
   echo -n "$(openssl rand -base64 32)" | base64
   ```

### Frontend Deployment

1. **Environment Configuration**
   ```bash
   # Copy environment template
   cp .env.template .env
   ```

2. **Production Environment Variables**
   ```env
   REACT_APP_API_BASE_URL=https://your-backend-domain.com/api/v1/
   REACT_APP_AUTH_API_URL=https://your-backend-domain.com/api/v1/auth/
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

### Security Checklist

- ✅ JWT secrets are environment variables
- ✅ Database credentials are not hardcoded
- ✅ CORS is configured for production domains
- ✅ HTTPS is enabled for all endpoints
- ✅ No sensitive data in repository
- ✅ Build artifacts are ignored by git

### Local Development

1. **Backend Setup**
   ```bash
   cd syntexa-api
   cp src/main/resources/application.properties.template src/main/resources/application.properties
   # Edit application.properties with local database settings
   mvn spring-boot:run
   ```

2. **Frontend Setup**
   ```bash
   cd syntexa-frontend
   npm install
   npm start
   ```

### Database Migration

```sql
-- Create database and user
CREATE DATABASE syntexa_db;
CREATE USER syntexa_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE syntexa_db TO syntexa_user;

-- Spring Boot will auto-create tables on first run
```

### Monitoring & Logs

- Backend health check: `/actuator/health`
- Frontend build artifacts in `/build/`
- Check application logs for authentication issues
- Monitor JWT token expiration (24 hours default)

This deployment guide ensures secure, production-ready deployment without exposing any sensitive information.
