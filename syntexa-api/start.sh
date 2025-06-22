#!/bin/bash
# Start script for Render deployment
set -e

echo "Starting Syntexa API..."

# Ensure we're in the right directory
cd /opt/render/project/src/syntexa-api

# Find the JAR file
JAR_FILE=$(find target -name "*.jar" -not -name "*sources*" -not -name "*javadoc*" | head -1)

if [ -z "$JAR_FILE" ]; then
    echo "Error: No JAR file found in target directory"
    exit 1
fi

echo "Starting application with JAR: $JAR_FILE"

# Run the Spring Boot application
java -jar "$JAR_FILE"
