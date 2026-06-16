package com.ewu.matching.service;

import com.ewu.matching.dto.request.*;
import com.ewu.matching.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refresh(RefreshTokenRequest request);
    void logout(RefreshTokenRequest request);
    void changePassword(ChangePasswordRequest request);
}
