# New API Summary

## Social
- POST `/api/posts`
- PUT `/api/posts/{id}`
- DELETE `/api/posts/{id}`
- GET `/api/posts/feed`
- GET `/api/posts/mine`
- GET `/api/posts/search?q=...`
- GET `/api/posts/saved`
- GET `/api/posts/{id}`
- PUT `/api/posts/{id}/reaction`
- PUT `/api/posts/{id}/like`
- DELETE `/api/posts/{id}/reaction`
- POST `/api/posts/{id}/comments`
- GET `/api/posts/{id}/comments`
- DELETE `/api/posts/comments/{id}`
- POST `/api/posts/{id}/share`
- PUT `/api/posts/{id}/save`
- DELETE `/api/posts/{id}/save`

## Network
- POST `/api/network/connections`
- PUT `/api/network/connections/{id}/accept`
- PUT `/api/network/connections/{id}/reject`
- DELETE `/api/network/connections/{id}`
- GET `/api/network/connections`
- GET `/api/network/connections/pending`
- PUT `/api/network/block/{userId}`
- DELETE `/api/network/block/{userId}`
- POST `/api/network/follow`
- DELETE `/api/network/follow/{userId}`
- GET `/api/network/followers`
- GET `/api/network/following`

## Messaging
- POST `/api/messages/conversations`
- GET `/api/messages/conversations`
- POST `/api/messages/conversations/{id}`
- GET `/api/messages/conversations/{id}`
- PUT `/api/messages/conversations/{id}/read`

## Notifications
- GET `/api/notifications`
- GET `/api/notifications/unread-count`
- PUT `/api/notifications/{id}/read`
- PUT `/api/notifications/read-all`

## Professional Profile
- GET `/api/profiles/users/{userId}`
- GET `/api/profiles/users/{userId}/education`
- GET `/api/profiles/users/{userId}/experience`
- GET `/api/profiles/me`
- POST `/api/profiles/me/education`
- PUT `/api/profiles/me/education/{id}`
- DELETE `/api/profiles/me/education/{id}`
- POST `/api/profiles/me/experience`
- PUT `/api/profiles/me/experience/{id}`
- DELETE `/api/profiles/me/experience/{id}`

## Endorsements / Directory
- POST `/api/endorsements`
- DELETE `/api/endorsements/students/{studentId}/skills/{skillId}`
- GET `/api/endorsements/students/{studentId}/skills/{skillId}`
- GET `/api/directory/search?q=...`

## Uploads

## Admin
- DELETE `/api/admin/social-posts/{id}`

## Integrated file uploads

Separate upload endpoints were removed. Profile images, post media, resumes and message attachments are now uploaded through the resource endpoint itself. See `INTEGRATED_UPLOADS.md`.

