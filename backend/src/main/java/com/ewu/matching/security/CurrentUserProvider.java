package com.ewu.matching.security;

import com.ewu.matching.entity.Company;
import com.ewu.matching.entity.Faculty;
import com.ewu.matching.entity.Student;
import com.ewu.matching.entity.User;
import com.ewu.matching.exception.ForbiddenOperationException;
import com.ewu.matching.exception.ResourceNotFoundException;
import com.ewu.matching.repository.CompanyRepository;
import com.ewu.matching.repository.FacultyRepository;
import com.ewu.matching.repository.StudentRepository;
import com.ewu.matching.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Resolves the authenticated principal (set by the JWT filter in Step 7) into
 * the corresponding domain entity. Centralizes "who am I" logic so services
 * stay free of SecurityContext plumbing.
 */
@Component
@RequiredArgsConstructor
public class CurrentUserProvider {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final CompanyRepository companyRepository;

    public String currentEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new ForbiddenOperationException("No authenticated user in the security context");
        }
        return auth.getName();
    }

    public User currentUser() {
        String email = currentEmail();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found: " + email));
    }

    public Student currentStudent() {
        return studentRepository.findByUser_Email(currentEmail())
                .orElseThrow(() -> new ForbiddenOperationException("Current user has no student profile"));
    }

    public Faculty currentFaculty() {
        return facultyRepository.findByUser_Email(currentEmail())
                .orElseThrow(() -> new ForbiddenOperationException("Current user has no faculty profile"));
    }

    public Company currentCompany() {
        return companyRepository.findByUser_Email(currentEmail())
                .orElseThrow(() -> new ForbiddenOperationException("Current user has no company profile"));
    }
}
