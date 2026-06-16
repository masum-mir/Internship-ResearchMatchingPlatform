package com.ewu.matching.service.impl;

import com.ewu.matching.dto.request.*;
import com.ewu.matching.dto.response.AuthResponse;
import com.ewu.matching.entity.*;
import com.ewu.matching.enums.RoleType;
import com.ewu.matching.exception.BadRequestException;
import com.ewu.matching.exception.DuplicateResourceException;
import com.ewu.matching.exception.ResourceNotFoundException;
import com.ewu.matching.repository.*;
import com.ewu.matching.security.CurrentUserProvider;
import com.ewu.matching.security.JwtTokenProvider;
import com.ewu.matching.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final CompanyRepository companyRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final CurrentUserProvider currentUser;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (req.role() == null) {
            throw new BadRequestException("role is required");
        }
        if (req.role() == RoleType.ADMIN) {
            throw new BadRequestException("Admin accounts cannot be self-registered");
        }
        if (userRepository.existsByEmail(req.email())) {
            throw new DuplicateResourceException("Email already registered: " + req.email());
        }

        Role role = roleRepository.findByName(req.role())
                .orElseGet(() -> roleRepository.save(Role.builder().name(req.role()).build()));

        User user = User.builder()
                .email(req.email())
                .password(passwordEncoder.encode(req.password()))
                .enabled(true)
                .blocked(false)
                .roles(new HashSet<>(Set.of(role)))
                .build();
        user = userRepository.save(user);

        createProfile(user, req.role(), req.name());

        return issueTokens(user);
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest req) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.email(), req.password()));
        } catch (BadCredentialsException ex) {
            throw new BadRequestException("Invalid email or password");
        }
        User user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + req.email()));
        return issueTokens(user);
    }

    @Override
    @Transactional
    public AuthResponse refresh(RefreshTokenRequest req) {
        RefreshToken stored = refreshTokenRepository.findByToken(req.refreshToken())
                .orElseThrow(() -> new BadRequestException("Invalid refresh token"));

        if (stored.isRevoked() || stored.getExpiry().isBefore(Instant.now())) {
            refreshTokenRepository.delete(stored);
            throw new BadRequestException("Refresh token expired or revoked, please log in again");
        }

        User user = stored.getUser();
        // Rotation: invalidate the used refresh token and issue a fresh pair.
        refreshTokenRepository.delete(stored);
        return issueTokens(user);
    }

    @Override
    @Transactional
    public void logout(RefreshTokenRequest req) {
        refreshTokenRepository.findByToken(req.refreshToken())
                .ifPresent(refreshTokenRepository::delete);
    }

    @Override
    @Transactional
    public void changePassword(ChangePasswordRequest req) {
        User user = currentUser.currentUser();
        if (!passwordEncoder.matches(req.currentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(req.newPassword()));
        userRepository.save(user);
        // Force re-authentication everywhere by revoking all refresh tokens.
        refreshTokenRepository.deleteByUser(user);
    }

    // ---------- helpers ----------

    private void createProfile(User user, RoleType role, String name) {
        switch (role) {
            case STUDENT -> studentRepository.save(Student.builder().user(user).name(name).build());
            case FACULTY -> facultyRepository.save(Faculty.builder().user(user).name(name).build());
            case COMPANY -> companyRepository.save(Company.builder().user(user).companyName(name).build());
            default -> throw new BadRequestException("Unsupported role for profile creation: " + role);
        }
    }

    private AuthResponse issueTokens(User user) {
        String accessToken = tokenProvider.generateAccessToken(user.getEmail());
        String refreshToken = createRefreshToken(user);
        Set<RoleType> roles = user.getRoles().stream().map(Role::getName).collect(Collectors.toSet());
        return AuthResponse.of(accessToken, refreshToken, user.getId(), user.getEmail(), roles);
    }

    private String createRefreshToken(User user) {
        String token = UUID.randomUUID().toString();
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(token)
                .expiry(Instant.now().plusMillis(tokenProvider.getRefreshExpirationMs()))
                .revoked(false)
                .build();
        refreshTokenRepository.save(refreshToken);
        return token;
    }
}
