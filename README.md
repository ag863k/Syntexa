# Syntexa: Coding Notes Hub

**Coding Notes Hub** is a collaborative platform where developers come together to share coding problem topics along with their notes, solutions, and various approaches. This pull request represents a major architectural pivot for the Syntexa application—from a "Personalized Coding Challenge Curator" to a more community-driven "Coding Notes Hub."

---

## Overview

This major refactor includes:

- **Collaborative Topics:**  
  Developers can create topics for coding problems and contribute notes, solutions, and different approaches.

- **Refactored Data Model & API:**  
  The backend data model, services, and API endpoints have been redesigned to support multi-user collaboration on coding topics and notes.

- **Enhanced Endpoints:**  
  New API routes accommodate creating topics, adding notes, updating contributions, and retrieving community-driven content.

---

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



