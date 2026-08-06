package com.ewu.matching.dto.response;

import com.ewu.matching.enums.RoleType;

import java.time.LocalDateTime;
import java.util.Set;

public record UserResponse(
        Long id,
        String email,
        String name,
        Set<RoleType> roles,
        boolean enabled,
        boolean blocked,
        LocalDateTime createdAt
) {}
