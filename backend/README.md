# Oppzy Backend

Spring Boot 3 · Spring Security · JWT · MySQL · Hibernate

The Oppzy backend provides the REST API, authentication, authorization, opportunity management, application processing, profile management, and matching services for the platform.

---

## Backend Structure

```text
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/ewu/matching/
│   │   │       ├── config/
│   │   │       ├── controller/
│   │   │       ├── dto/
│   │   │       ├── entity/
│   │   │       ├── repository/
│   │   │       ├── security/
│   │   │       ├── service/
│   │   │       └── MatchingPlatformApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── uploads/
├── Dockerfile
├── .dockerignore
├── pom.xml
├── API_TESTING.md
└── README.md
```

---

## Prerequisites

- JDK 17+
- Maven 3.9+
- MySQL 8+

---

## Configuration

The backend uses environment variables/application properties for database, JWT, CORS, and admin configuration.

Important variables:

```env
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/oppzy
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=your_mysql_password

JWT_SECRET=your_long_jwt_secret
JWT_ACCESS_EXPIRATION_MS=900000
JWT_REFRESH_EXPIRATION_MS=604800000

CORS_ORIGINS=http://localhost:5173,http://localhost:3000

ADMIN_EMAIL=admin@ewubd.edu
ADMIN_PASSWORD=your_admin_password
```

The development configuration uses:

```properties
spring.jpa.hibernate.ddl-auto=update
```

---

## Run Backend Locally

Open the backend directory:

```bash
cd backend
```

Start the application:

```bash
mvn spring-boot:run
```

Backend:

```text
http://localhost:8080
```

API base:

```text
http://localhost:8080/api
```

Swagger UI:

```text
http://localhost:8080/swagger-ui.html
```

---

## Build Backend

```bash
mvn clean package -DskipTests
```

The generated JAR will be available under:

```text
target/
```

---

## Matching Formula

```text
finalScore = skillMatch*0.60 + cgpaMatch*0.25 + departmentMatch*0.15
```

- `skillMatch` = matched required skills / total required skills
- `cgpaMatch` = `min(studentCgpa / requiredCgpa, 1.0)`
- `departmentMatch` = `1.0` when the student's department matches the target department

---

## API Testing

See:

```text
API_TESTING.md
```

for the end-to-end API testing walkthrough.
