# Internship & Research Matching Platform — Backend

Spring Boot 3 · Spring Security · JWT · MySQL · JPA/Hibernate

## Prerequisites
- JDK 17+
- Maven 3.9+
- MySQL 8 running locally

## Configuration
Defaults are in `src/main/resources/application.yml`. Override via environment variables:

| Variable | Default | Purpose |
|---|---|---|
| `DB_USERNAME` / `DB_PASSWORD` | root / root | MySQL credentials |
| `JWT_SECRET` | dev default | HMAC signing key (use 32+ random chars in prod) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | admin@ewu.edu / Admin@12345 | Seeded admin |
| `CORS_ORIGINS` | localhost:5173, localhost:3000 | Allowed frontend origins |

The schema is created automatically (`spring.jpa.hibernate.ddl-auto=update`) and the
database is created on first connect (`createDatabaseIfNotExist=true`).

## Run
```bash
mvn spring-boot:run
```
On first boot the four roles and an admin account are seeded automatically.

- API base: `http://localhost:8080/api`
- Swagger UI: `http://localhost:8080/swagger-ui.html`

## Matching formula
`finalScore = skillMatch*0.60 + cgpaMatch*0.25 + departmentMatch*0.15`
- skillMatch = matched required skills / total required skills
- cgpaMatch  = min(studentCgpa / requiredCgpa, 1.0)
- departmentMatch = 1.0 if the student's department is in the post's target departments

See `API_TESTING.md` for an end-to-end walkthrough.
