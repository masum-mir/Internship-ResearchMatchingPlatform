# Integrated uploads

The separate `/api/upload/**` controller has been removed.
Files now travel with the resource they belong to.

## Student profile

`PUT /api/students/me` with `multipart/form-data`

Parts:
- `data`: JSON `StudentProfileRequest`
- `profilePicture`: optional image
- `coverPicture`: optional image
- `resume`: optional PDF/DOC/DOCX

## Faculty profile

`PUT /api/faculty/me` with `multipart/form-data`

Parts:
- `data`: JSON `FacultyProfileRequest`
- `profilePicture`: optional image
- `coverPicture`: optional image

## Company profile

`PUT /api/companies/me` with `multipart/form-data`

Parts:
- `data`: JSON `CompanyProfileRequest`
- `profilePicture`: optional image
- `coverPicture`: optional image

## Admin profile

`PUT /api/admin/me` with `multipart/form-data`

Parts:
- `data`: JSON `AdminProfileRequest`
- `profilePicture`: optional image
- `coverPicture`: optional image

## Social post

`POST /api/posts` or `PUT /api/posts/{id}` with `multipart/form-data`

Parts:
- `data`: JSON `PostCreateRequest` / `PostUpdateRequest`
- `media`: optional image/video

## Application

`POST /api/applications` with `multipart/form-data`

Parts:
- `data`: JSON `ApplicationRequest`
- `resume`: optional PDF/DOC/DOCX

## Message

`POST /api/messages/conversations/{id}` with `multipart/form-data`

Parts:
- `data`: JSON `SendMessageRequest`
- `attachment`: optional image/document/text file

## React example

```js
const fd = new FormData();
fd.append(
  "data",
  new Blob([JSON.stringify(profileData)], { type: "application/json" })
);

if (profilePicture) fd.append("profilePicture", profilePicture);
if (coverPicture) fd.append("coverPicture", coverPicture);
if (resume) fd.append("resume", resume);

await api.put("/api/students/me", fd);
```

Do not manually set `Content-Type` in Axios/fetch for FormData. The browser must add the multipart boundary.

Existing `application/json` endpoints remain available for backward compatibility when there is no file to upload.

## Server size limit

`FileUploadConfig.java` sets:
- maximum single file: 25 MB
- maximum multipart request: 35 MB

The service applies stricter limits depending on the file type (for example profile images are limited to 8 MB).
