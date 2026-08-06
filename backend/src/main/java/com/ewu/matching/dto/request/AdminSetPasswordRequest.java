package com.ewu.matching.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AdminSetPasswordRequest(
        @NotBlank(message = "New password is required")
        @Size(min = 6, max = 100, message = "Password must be 6-100 characters")
        String newPassword
) {}
