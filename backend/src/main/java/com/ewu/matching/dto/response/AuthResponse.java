package com.ewu.matching.dto.response;

import com.ewu.matching.enums.RoleType;

import java.util.Set;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        Long userId,
        String email,
        Set<RoleType> roles
) {
    public static AuthResponse of(String access, String refresh, Long userId,
                                  String email, Set<RoleType> roles) {
        return new AuthResponse(access, refresh, "Bearer", userId, email, roles);
    }
}
