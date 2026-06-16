package com.ewu.matching.dto.request;

import com.ewu.matching.enums.RoleType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank @Email String email,
        @NotBlank @Size(min = 6, max = 100, message = "Password must be 6-100 characters") String password,
        @NotNull(message = "role is required") RoleType role,
        @NotBlank String name
) {}
