# Multi-stage Dockerfile for Campus Placement Spring Boot Backend
# Stage 1: Build Spring Boot JAR with Maven
FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /workspace

COPY backend/pom.xml backend/pom.xml
RUN mvn -f backend/pom.xml dependency:go-offline -B

COPY backend/src backend/src
RUN mvn -f backend/pom.xml clean package -DskipTests

# Stage 2: Production JRE runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Ensure uploads directory exists and is writable
RUN mkdir -p /app/uploads/resumes && chmod -R 777 /app/uploads

COPY --from=builder /workspace/backend/target/*.jar app.jar

ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=mysql
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -XX:+UseSerialGC -Xss512k -XX:MaxRAMPercentage=70.0 -Dserver.port=${PORT:-8080} -Djava.security.egd=file:/dev/./urandom -jar app.jar"]
