# Use an OpenJDK base image
FROM openjdk:17-jdk-slim

# Add a volume for the application logs
VOLUME /tmp

# Set the working directory
WORKDIR /app

# Copy the application's JAR file
COPY target/demo-1.jar app.jar

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]

# Expose the application port
EXPOSE 8080
