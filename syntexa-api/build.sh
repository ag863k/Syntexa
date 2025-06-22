#!/bin/bash
# Build script for Render deployment
set -e

echo "Starting build process..."

# Ensure we're in the right directory
cd /opt/render/project/src/syntexa-api

# Make mvnw executable
chmod +x ./mvnw

# Run Maven build
echo "Building with Maven..."
./mvnw clean package -DskipTests

echo "Build completed successfully!"
