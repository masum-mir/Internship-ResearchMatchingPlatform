# API Testing Guide

Base URL: `http://localhost:8080`
Interactive docs (Swagger UI): `http://localhost:8080/swagger-ui.html`

All protected endpoints require: `Authorization: Bearer <accessToken>`.

---

## 1. Auth

### Register a student
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@ewu.edu","password":"Pass@123","role":"STUDENT","name":"Alice Rahman"}'
```
Response contains `accessToken` and `refreshToken`. Register a company and faculty the same way with `"role":"COMPANY"` / `"role":"FACULTY"`.

### Login (e.g. the seeded admin)
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ewu.edu","password":"Admin@12345"}'
```

### Refresh tokens (rotation)
```bash
curl -X POST http://localhost:8080/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refreshToken>"}'
```

### Change password (authenticated)
```bash
curl -X PUT http://localhost:8080/api/auth/password \
  -H "Authorization: Bearer <accessToken>" -H "Content-Type: application/json" \
  -d '{"currentPassword":"Pass@123","newPassword":"NewPass@123"}'
```

### Logout
```bash
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refreshToken>"}'
```

---

## 2. Student: complete profile & add skills
```bash
# Update profile (CGPA drives the matching score)
curl -X PUT http://localhost:8080/api/students/me \
  -H "Authorization: Bearer <studentToken>" -H "Content-Type: application/json" \
  -d '{"studentId":"2021-1-60-001","department":"CSE","batch":"2021","cgpa":3.6,"contactNumber":"0170000000"}'

# Add skills
curl -X POST http://localhost:8080/api/students/me/skills \
  -H "Authorization: Bearer <studentToken>" -H "Content-Type: application/json" \
  -d '{"name":"Java","category":"LANGUAGE"}'
curl -X POST http://localhost:8080/api/students/me/skills \
  -H "Authorization: Bearer <studentToken>" -H "Content-Type: application/json" \
  -d '{"name":"Spring Boot","category":"FRAMEWORK"}'

# Add a project
curl -X POST http://localhost:8080/api/students/me/projects \
  -H "Authorization: Bearer <studentToken>" -H "Content-Type: application/json" \
  -d '{"title":"Matching Platform","description":"REST API","techStack":"Spring, React"}'
```

---

## 3. Company: post an internship
```bash
curl -X POST http://localhost:8080/api/internships \
  -H "Authorization: Bearer <companyToken>" -H "Content-Type: application/json" \
  -d '{
        "title":"Backend Intern",
        "description":"Spring Boot internship",
        "requiredSkills":[{"name":"Java","category":"LANGUAGE"},
                          {"name":"Spring Boot","category":"FRAMEWORK"},
                          {"name":"React","category":"FRAMEWORK"}],
        "requiredCgpa":3.0,
        "location":"Dhaka",
        "deadline":"2026-12-31",
        "vacancies":2,
        "targetDepartments":["CSE"]
      }'
```

---

## 4. Student: view match-ranked internships & apply
```bash
# Ranked by match score, highest first
curl http://localhost:8080/api/internships/matched \
  -H "Authorization: Bearer <studentToken>"

# Apply (match score is computed & stored at apply time)
curl -X POST http://localhost:8080/api/applications \
  -H "Authorization: Bearer <studentToken>" -H "Content-Type: application/json" \
  -d '{"targetType":"INTERNSHIP","targetId":1}'

# Bookmark for later
curl -X POST http://localhost:8080/api/bookmarks \
  -H "Authorization: Bearer <studentToken>" -H "Content-Type: application/json" \
  -d '{"targetType":"INTERNSHIP","targetId":1}'

# My applications
curl http://localhost:8080/api/applications/me -H "Authorization: Bearer <studentToken>"
```

With the data above the matching breakdown for this student is:
`skill = 2/3 = 0.667`, `cgpa = min(3.6/3.0, 1.0) = 1.0`, `department = 1.0`
→ `finalScore = (0.667*0.60 + 1.0*0.25 + 1.0*0.15) * 100 = 80.0`.

---

## 5. Company: review applicants & decide
```bash
# Applicants for my internship #1, sorted by match score desc
curl http://localhost:8080/api/applications/internships/1 \
  -H "Authorization: Bearer <companyToken>"

# View an applicant's full portfolio
curl http://localhost:8080/api/students/5/portfolio \
  -H "Authorization: Bearer <companyToken>"

# Shortlist / accept / reject
curl -X PUT http://localhost:8080/api/applications/1/status \
  -H "Authorization: Bearer <companyToken>" -H "Content-Type: application/json" \
  -d '{"status":"SHORTLISTED"}'
```

---

## 6. Search & filter (any authenticated user)
```bash
curl "http://localhost:8080/api/internships?skill=Java&location=Dhaka" \
  -H "Authorization: Bearer <token>"
curl "http://localhost:8080/api/research?area=Machine%20Learning" \
  -H "Authorization: Bearer <token>"
```

---

## 7. Dashboards
```bash
curl http://localhost:8080/api/dashboard/student -H "Authorization: Bearer <studentToken>"
curl http://localhost:8080/api/dashboard/company -H "Authorization: Bearer <companyToken>"
curl http://localhost:8080/api/dashboard/faculty -H "Authorization: Bearer <facultyToken>"
curl http://localhost:8080/api/dashboard/admin   -H "Authorization: Bearer <adminToken>"
```

---

## 8. Admin
```bash
curl http://localhost:8080/api/admin/users   -H "Authorization: Bearer <adminToken>"
curl -X PUT http://localhost:8080/api/admin/users/5/block   -H "Authorization: Bearer <adminToken>"
curl -X PUT http://localhost:8080/api/admin/users/5/unblock -H "Authorization: Bearer <adminToken>"
curl -X DELETE http://localhost:8080/api/admin/posts/INTERNSHIP/1 -H "Authorization: Bearer <adminToken>"
curl http://localhost:8080/api/admin/reports -H "Authorization: Bearer <adminToken>"
```

## Expected error responses
- `400` validation/bad request (body includes `fieldErrors`)
- `401` missing/invalid token
- `403` wrong role or not the owner
- `404` resource not found
- `409` duplicate (already applied / already bookmarked / email taken)
