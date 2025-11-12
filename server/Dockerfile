FROM maven:3.9.9-eclipse-temurin-21

WORKDIR /app

COPY . .

# mvn clean package -DskipTests = target/server1.0.0-SNAPSHOT.jar
RUN mvn clean package -DskipTests && cp target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]