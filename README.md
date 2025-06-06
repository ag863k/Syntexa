# Syntexa: A RESTful API for a Personalized Coding Challenge Platform

Welcome to **Syntexa**! This project is a secure, and feature-rich backend service built with **Java 17** and the **Spring Boot 3** framework. It serves as the foundation for a platform where users can find curated coding challenges, track their progress, and improve their problem-solving skills.

---

##  Core Features

- **🔐 Secure User Authentication**  
  Complete user management system featuring secure registration with password hashing (BCrypt) and a login endpoint that provides a JSON Web Token (JWT) for session management.

- **🔑 Token-Based Authorization**  
  Stateless security model where protected endpoints are secured using a `JwtAuthenticationFilter`. This filter validates the JWT from the `Authorization` header on every request.

- **🧠 Challenge Management (CRUD)**  
  A full suite of RESTful endpoints to **Create**, **Read**, **Update**, and **Delete** coding challenges.

- **💻 Clean Architecture**  
  Built with a clear separation of concerns:
  - `Controllers` handle HTTP requests.
  - `Services` encapsulate business logic.
  - `Repositories` handle data persistence.

- **⚙️ Robust Configuration**  
  - Environment-specific configurations (PostgreSQL for dev/prod, H2 for testing)
  - Centralized exception handling for consistent API error responses.

---

## 🛠️ Tech Stack & Dependencies

| Category         | Technologies                                                                 |
|------------------|------------------------------------------------------------------------------|
| Language & Framework | Java 17, Spring Boot 3                                                    |
| Security         | Spring Security (JWT-based)                                                 |
| Data Persistence | Spring Data JPA, Hibernate                                                  |
| Databases        | PostgreSQL (Dev/Prod), H2 (Testing)                                         |
| API Layer        | Spring Web (REST APIs)                                                      |
| Validation       | Jakarta Bean Validation                                                     |
| Build Tool       | Apache Maven                                                                |
| Utilities        | Project Lombok                                                              |
| Deployment       | Containerized with Docker, compatible with Render or similar platforms      |

---

## 📚 API Endpoint Documentation

> **Base URL**: `/api/v1`

### 🔐 Authentication (`/auth`)

| Method | Endpoint       | Description                     |
|--------|----------------|---------------------------------|
| POST   | `/auth/signup` | Registers a new user. Expects JSON with `username`, `email`, and `password`. Returns `201 Created` on success. |
| POST   | `/auth/login`  | Authenticates a user. Expects JSON with `username` and `password`. Returns `200 OK` with JWT and user details. |

### 🧠 Challenges (`/challenges`)

> These endpoints require a valid JWT token in the `Authorization: Bearer <token>` header.

| Method | Endpoint               | Description                             |
|--------|------------------------|-----------------------------------------|
| POST   | `/challenges`          | Creates a new coding challenge.         |
| GET    | `/challenges`          | Retrieves all coding challenges.        |
| GET    | `/challenges/{id}`     | Retrieves a challenge by ID.            |
| PUT    | `/challenges/{id}`     | Updates an existing challenge.          |
| DELETE | `/challenges/{id}`     | Deletes a challenge by ID.              |

---

## 💻 Local Setup & Installation

### ✅ Prerequisites

- Java (JDK) 17+
- Apache Maven
- PostgreSQL Server

---

### 📦 Installation Guide

#### 1. Clone the Repository

```bash
git clone https://github.com/ag863k/Syntexa.git
cd Syntexa/syntexa-api
```

### 2. Setup PostgreSQL Database

1. Create a new PostgreSQL database named `syntexa_db`.
2. Create a new user (e.g. `syntexa_app_user`) with a secure password.
3. Grant all privileges on `syntexa_db` to your user.

Example SQL:
```sql
CREATE DATABASE syntexa_db;
CREATE USER syntexa_app_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE syntexa_db TO syntexa_app_user;
```

### 3. Configure Environment Variables (VS Code)

Create a `.vscode/launch.json` file in the root of the project:

```json
{
  "configurations": [
    {
      "type": "java",
      "name": "Launch SyntexaApplication",
      "request": "launch",
      "mainClass": "com.syntexa.api.SyntexaApplication",
      "projectName": "syntexa-api",
      "env": {
        "DB_USERNAME": "your_postgres_user",
        "DB_PASSWORD": "your_postgres_password"
      }
    }
  ]
}
```

> ⚠️ **Important**: Add `/.vscode/` to your `.gitignore` to avoid committing local configuration files.

---

### 4. Build the Project

Use Maven to build and download all dependencies:

```bash
mvn clean install
```

### 5. Run the Application

Run the application from VS Code using the **Launch SyntexaApplication** configuration.

The API server will be available at:

🌐 http://localhost:8080

Test your endpoints using Postman, `curl`, or any REST client.

---

### 🐳 Docker Deployment

To build and run the application using Docker:

```bash
docker build -t syntexa-api .

docker run -p 8080:8080 \
  -e DB_USERNAME=your_user \
  -e DB_PASSWORD=your_password \
  syntexa-api
```
✅ Ensure PostgreSQL is accessible from your Docker container and the credentials are correct.
