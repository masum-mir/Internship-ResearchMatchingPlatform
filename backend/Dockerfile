 
FROM maven:3.9.9-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml .

RUN mvn dependency:go-offline -B

COPY src ./src

RUN mvn clean package -DskipTests && \
    cp $(find target -maxdepth 1 -type f -name "*.jar" ! -name "*.original" | head -n 1) /tmp/app.jar
 
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

RUN mkdir -p /app/uploads

COPY --from=build /tmp/app.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
