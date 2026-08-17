package com.ewu.matching.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

// At least one of email/password must be present — enforced in the service
// layer rather than here, since "at least one of two optional fields" isn't
// expressible with simple bean-validation annotations on a record.
// currentPassword is required whenever email and/or password is present
// (verified in the service layer, same as the direct /auth/password flow) so
// a hijacked but not-yet-expired session can't silently take over the
// account's login credentials.
public record CredentialChangeRequestPayload(
        @Email(message = "Must be a valid email address") String email,
        @Size(min = 6, max = 100, message = "Password must be 6-100 characters") String password,
        String currentPassword
) {}
