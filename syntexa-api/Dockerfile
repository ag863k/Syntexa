# --- Stage 1: Build the application with Maven ---
FROM maven:3.9.6-eclipse-temurin-17 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the Maven wrapper and pom.xml to leverage Docker cache
COPY ./.mvn/ ./.mvn
COPY ./mvnw ./mvnw
COPY ./pom.xml ./pom.xml

# Add execute permission to the mvnw script
RUN chmod +x ./mvnw  # <-- YEH NAYI LINE ADD KARNI HAI

# Download all dependencies
RUN ./mvnw dependency:go-offline

# Copy the project source code
COPY ./src ./src

# Package the application using Maven, skipping tests
RUN ./mvnw package -DskipTests

# --- Stage 2: Create the final, smaller image ---
FROM openjdk:17-jdk-slim

# Set the working directory
WORKDIR /app

# Copy only the built JAR from the 'build' stage
COPY --from=build /app/target/syntexa-api-0.0.1-SNAPSHOT.jar app.jar

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application when the container starts
ENTRYPOINT ["java", "-jar", "app.jar"]