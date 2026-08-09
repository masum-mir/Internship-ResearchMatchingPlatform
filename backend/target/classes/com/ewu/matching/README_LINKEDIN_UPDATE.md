# LinkedIn-style Update for EWU Matching Backend

This update was applied directly to the uploaded `matching` source package and follows its existing architecture:
controller -> service -> service/impl -> repository -> entity -> DTO/mapper.

## Existing functionality preserved

- JWT authentication and role security
- Student / Faculty / Company / Admin roles
- Student profile, skills, projects, certifications
- Company internship CRUD/search/matching
- Faculty research opportunity CRUD/search/matching
- Student application and bookmark flows
- Company/Faculty applicant review
- Role dashboards and admin reports

## Added professional/social features

### Social feed
- Any authenticated Student, Faculty, Company, or Admin can create social posts
- Public / connections-only / private visibility
- Text and media post support
- Edit and soft-delete
- Feed and post search
- Reactions: LIKE, CELEBRATE, SUPPORT, LOVE, INSIGHTFUL
- Comments and comment replies
- Share activity
- Save/unsave social posts
- Admin soft-delete for abusive social posts

### Network
- Connection requests
- Accept / reject / remove
- Follow / unfollow
- Followers / following
- User block / unblock
- Connections-only post visibility checks
- Block checks for follow/feed/messaging

### Messaging
- Direct conversations
- Text and attachment messages
- Conversation list
- Read status
- Block-aware message access

### Notifications
- Connection request / accepted
- New follower
- Post reaction / comment / share
- New message
- Application submitted
- Application status changed
- New opportunity from followed Company/Faculty
- Skill endorsement
- Read/unread and unread count

### Professional profile
- Public role-aware profile summary
- Education CRUD
- Experience CRUD
- Directory search across students, faculty, and companies
- Student skill endorsements

## Expanded existing entities

### Student
Added batch, headline, bio, resume, portfolio, GitHub, LinkedIn, open-to-work.

### Faculty
Added location and available-for-supervision while preserving existing academic links.

### Company
Added industry, company size, founded date, company email, verified flag.

### Internship / Company opportunity
Added responsibilities, requirements, benefits, work mode, employment type, salary range/currency, experience level and updated timestamp.
`EmploymentType` lets the existing internship post model also represent internship/full-time/part-time/contract/freelance style company opportunities without replacing existing APIs.

### Research opportunity
Added description request support, eligibility, responsibilities, positions, deadline, location, work mode, funding and stipend fields.

### Application
Added resume URL, cover letter, applicant note, reviewer note and review/withdraw timestamps.
Withdraw now keeps history using `WITHDRAWN` instead of hard-deleting the row.

### Project / Certification
Added repository/date fields for projects and expiry/credential fields for certifications.

## Important API groups

- `/api/posts/**`
- `/api/network/**`
- `/api/messages/**`
- `/api/notifications/**`
- `/api/profiles/**`
- `/api/endorsements/**`
- `/api/directory/search?q=...`

Existing internship/research/application endpoints remain under their original routes.

## Security change


## Database note

The update adds multiple tables and columns. In a development database using Hibernate `ddl-auto=update`, Hibernate can create most of these automatically. If you already have important production data, use a proper Flyway/Liquibase migration and back up the database before applying the new entity model. Some newly added non-null/default fields may need explicit defaults when migrating an existing populated schema.

## Build-validation note

The uploaded ZIP contains the Java package source but no `pom.xml`, `build.gradle`, or dependency metadata. Therefore a real Spring Boot dependency-aware compile could not be run here. The updated package was checked for internal package/import consistency and Java syntax-level errors. Copy it into the same project that supplies the existing Spring Boot, Spring Security, JPA, Lombok, Swagger, and validation dependencies, then run your normal Maven/Gradle build.

## Integrated file uploads

Separate upload endpoints were removed. Profile images, post media, resumes and message attachments are now uploaded through the resource endpoint itself. See `INTEGRATED_UPLOADS.md`.

