package com.ewu.matching.service;

import com.ewu.matching.entity.User;
import com.ewu.matching.enums.RoleType;
import com.ewu.matching.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserVisibilityService {

    public boolean isAdmin(User user) {
        return user != null && user.getRoles().stream().anyMatch(role -> role.getName() == RoleType.ADMIN);
    }

    public void requirePublicUser(User user) {
        if (isAdmin(user)) {
            // Return the same result as an unknown account so administrator accounts
            // cannot be discovered by probing public endpoints.
            throw ResourceNotFoundException.of("User", user.getId());
        }
    }
}
