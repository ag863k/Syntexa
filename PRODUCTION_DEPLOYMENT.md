# 🚀 Syntexa Production Deployment Guide

## 📋 Prerequisites
- Netlify account (for frontend)
- Render account (for backend)
- PostgreSQL database (can use Render's PostgreSQL)

## 🔧 Backend Deployment (Render)

### 1. Database Setup
1. Create a PostgreSQL database on Render
2. Note the DATABASE_URL (internal connection string)

### 2. Backend Service Setup
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Configure the service:
   - **Root Directory**: `syntexa-api`
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -jar target/*.jar`
   - **Runtime**: `Java 17`

### 3. Environment Variables (Set in Render Dashboard)
```
DATABASE_URL=<your-postgresql-connection-string>
JWT_SECRET=<generate-a-secure-base64-secret>
JWT_EXPIRATION_MS=7200000
PORT=8080
FRONTEND_URL=https://your-netlify-app.netlify.app
```

### 4. Generate JWT Secret
```bash
# Generate a secure JWT secret
echo -n "YourSecretKeyHere$(date +%s)" | base64
```

## 🌐 Frontend Deployment (Netlify)

### 1. Site Setup
1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - **Base directory**: `syntexa-frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `syntexa-frontend/build`

### 2. Environment Variables (Set in Netlify Dashboard)
```
REACT_APP_API_BASE_URL=https://your-render-service.onrender.com/api/v1/
REACT_APP_AUTH_API_URL=https://your-render-service.onrender.com/api/v1/auth/
```

### 3. Custom Domain (Optional)
1. Add your custom domain in Netlify
2. Update CORS settings in backend with your domain

## 🔐 Security Checklist

### ✅ Backend Security
- [x] JWT secret moved to environment variables
- [x] Database credentials secured
- [x] Error messages sanitized (no stack traces in production)
- [x] CORS configured for production domains
- [x] SQL injection protection (JPA/Hibernate)
- [x] Connection pooling configured

### ✅ Frontend Security
- [x] API URLs use environment variables
- [x] No sensitive data in client-side code
- [x] HTTPS enforced in production
- [x] Token expiration handling

## 🧪 Testing Deployment

### Backend Health Check
```bash
curl https://your-render-service.onrender.com/actuator/health
```

### Frontend Test
1. Visit your Netlify URL
2. Test signup/login flow
3. Verify API communication
4. Check browser developer tools for errors

## 🚨 Troubleshooting

### Common Issues
1. **CORS Errors**: Check backend CORS configuration includes your frontend URL
2. **Database Connection**: Verify DATABASE_URL environment variable
3. **JWT Errors**: Ensure JWT_SECRET is properly set and Base64 encoded
4. **Build Failures**: Check build logs in Render/Netlify dashboards

### Debug Commands
```bash
# Check backend logs
curl https://your-render-service.onrender.com/actuator/health

# Test authentication
curl -X POST https://your-render-service.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}'
```

## 📝 Post-Deployment
1. Test all authentication flows
2. Verify database connections
3. Check application performance
4. Monitor error logs
5. Set up monitoring/alerts (optional)

## 🔄 Future Updates
- Push to main branch for automatic deployment
- Use feature branches for testing
- Monitor application logs regularly
- Keep dependencies updated
