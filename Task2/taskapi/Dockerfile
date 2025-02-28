# Use an official OpenJDK runtime as a parent image
FROM openjdk:11-jre-slim

# Add a volume pointing to /tmp
VOLUME /tmp

# Copy the jar file to the container
COPY target/taskapi-0.0.1-SNAPSHOT.jar app.jar

# Expose port 8080
EXPOSE 8080

# Run the jar file
ENTRYPOINT ["java", "-jar", "/app.jar"]
