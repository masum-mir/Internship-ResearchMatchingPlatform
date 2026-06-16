package com.ewu.matching.config;

import com.ewu.matching.entity.Role;
import com.ewu.matching.entity.User;
import com.ewu.matching.enums.RoleType;
import com.ewu.matching.repository.RoleRepository;
import com.ewu.matching.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

/**
 * Bootstraps reference data on startup: the four roles and a single admin
 * account (only if no admin already exists). Idempotent — safe to run every boot.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        seedRoles();
        seedAdmin();
    }

    private void seedRoles() {
        for (RoleType type : RoleType.values()) {
            roleRepository.findByName(type)
                    .orElseGet(() -> roleRepository.save(Role.builder().name(type).build()));
        }
    }

    private void seedAdmin() {
        if (userRepository.countByRoles_Name(RoleType.ADMIN) > 0) {
            return;
        }
        Role adminRole = roleRepository.findByName(RoleType.ADMIN)
                .orElseGet(() -> roleRepository.save(Role.builder().name(RoleType.ADMIN).build()));

        User admin = User.builder()
                .email(adminEmail)
                .password(passwordEncoder.encode(adminPassword))
                .enabled(true)
                .blocked(false)
                .roles(new HashSet<>(Set.of(adminRole)))
                .build();
        userRepository.save(admin);
        log.info("Seeded initial ADMIN account: {} (change the default password!)", adminEmail);
    }
}
