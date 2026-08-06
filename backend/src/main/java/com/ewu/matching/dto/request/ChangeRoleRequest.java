package com.ewu.matching.dto.request;

import com.ewu.matching.enums.RoleType;
import jakarta.validation.constraints.NotNull;

public record ChangeRoleRequest(
        @NotNull(message = "Role is required")
        RoleType role
) {}
