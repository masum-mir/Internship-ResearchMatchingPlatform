package com.ewu.matching.service.impl;

import com.ewu.matching.dto.request.AdminProfileRequest;
import com.ewu.matching.dto.request.AdminSetPasswordRequest;
import com.ewu.matching.dto.request.ChangeEmailRequest;
import com.ewu.matching.dto.request.ChangeNameRequest;
import com.ewu.matching.dto.request.ChangeRoleRequest;
import com.ewu.matching.dto.response.UserResponse;
import com.ewu.matching.entity.Company;
import com.ewu.matching.entity.Faculty;
import com.ewu.matching.entity.Role;
import com.ewu.matching.entity.Student;
import com.ewu.matching.entity.User;
import com.ewu.matching.enums.OpportunityType;
import com.ewu.matching.enums.RoleType;
import com.ewu.matching.exception.BadRequestException;
import com.ewu.matching.exception.DuplicateResourceException;
import com.ewu.matching.exception.ResourceNotFoundException;
import com.ewu.matching.mapper.ProfileMapper;
import com.ewu.matching.repository.CompanyRepository;
import com.ewu.matching.repository.FacultyRepository;
import com.ewu.matching.repository.InternshipRepository;
import com.ewu.matching.repository.RefreshTokenRepository;
import com.ewu.matching.repository.ResearchOpportunityRepository;
import com.ewu.matching.repository.RoleRepository;
import com.ewu.matching.repository.StudentRepository;
import com.ewu.matching.repository.UserRepository;
import com.ewu.matching.security.CurrentUserProvider;
import com.ewu.matching.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final InternshipRepository internshipRepository;
    private final ResearchOpportunityRepository researchRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final CompanyRepository companyRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final CurrentUserProvider currentUser;

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> listUsers() {
        return userRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional
    public UserResponse blockUser(Long userId) {
        return setBlocked(userId, true);
    }

    @Override
    @Transactional
    public UserResponse unblockUser(Long userId) {
        return setBlocked(userId, false);
    }

    private UserResponse setBlocked(Long userId, boolean blocked) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ResourceNotFoundException.of("User", userId));
        user.setBlocked(blocked);
        return toResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public void deletePost(OpportunityType type, Long postId) {
        if (type == OpportunityType.INTERNSHIP) {
            if (!internshipRepository.existsById(postId)) {
                throw ResourceNotFoundException.of("Internship", postId);
            }
            internshipRepository.deleteById(postId);
        } else {
            if (!researchRepository.existsById(postId)) {
                throw ResourceNotFoundException.of("Research opportunity", postId);
            }
            researchRepository.deleteById(postId);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getMyProfile() {
        return toResponse(currentUser.currentUser());
    }

    @Override
    @Transactional
    public UserResponse updateMyProfile(AdminProfileRequest req) {
        User u = currentUser.currentUser();
        return toResponse(userRepository.save(u));
    }

    @Override
    @Transactional
    public UserResponse changeUserEmail(Long userId, ChangeEmailRequest req) {
        User u = userRepository.findById(userId)
                .orElseThrow(() -> ResourceNotFoundException.of("User", userId));
        String newEmail = req.email().trim();
        if (!newEmail.equalsIgnoreCase(u.getEmail()) && userRepository.existsByEmail(newEmail)) {
            throw new DuplicateResourceException("Email already in use: " + newEmail);
        }
        u.setEmail(newEmail);
        return toResponse(userRepository.save(u));
    }

    @Override
    @Transactional
    public UserResponse changeUserName(Long userId, ChangeNameRequest req) {
        User u = userRepository.findById(userId)
                .orElseThrow(() -> ResourceNotFoundException.of("User", userId));
        String newName = req.name().trim();

        // The display name lives on the role-specific profile row (Student /
        // Faculty / Company), not on User itself — update whichever exists.
        var student = studentRepository.findByUser_Id(userId);
        var faculty = facultyRepository.findByUser_Id(userId);
        var company = companyRepository.findByUser_Id(userId);

        if (student.isPresent()) {
            student.get().setName(newName);
            studentRepository.save(student.get());
        } else if (faculty.isPresent()) {
            faculty.get().setName(newName);
            facultyRepository.save(faculty.get());
        } else if (company.isPresent()) {
            company.get().setCompanyName(newName);
            companyRepository.save(company.get());
        } else {
            throw new BadRequestException("This user has no editable profile (no student, faculty, or company record).");
        }
        return toResponse(u);
    }

    @Override
    @Transactional
    public UserResponse changeUserRole(Long userId, ChangeRoleRequest req) {
        User u = userRepository.findById(userId)
                .orElseThrow(() -> ResourceNotFoundException.of("User", userId));
        RoleType newRoleType = req.role();

        boolean wasAdmin = u.getRoles().stream().anyMatch(r -> r.getName() == RoleType.ADMIN);
        if (wasAdmin && newRoleType != RoleType.ADMIN && userRepository.countByRoles_Name(RoleType.ADMIN) <= 1) {
            throw new BadRequestException("Cannot change the role of the last remaining admin.");
        }

        // Carry the existing display name over to the new role's profile row,
        // if one doesn't already exist for it, so it doesn't come out blank.
        String existingName = resolveName(u);

        Role role = roleRepository.findByName(newRoleType)
                .orElseGet(() -> roleRepository.save(Role.builder().name(newRoleType).build()));
        u.setRoles(new HashSet<>(Set.of(role)));
        userRepository.save(u);

        switch (newRoleType) {
            case STUDENT -> {
                if (studentRepository.findByUser_Id(userId).isEmpty()) {
                    studentRepository.save(Student.builder().user(u).name(existingName).build());
                }
            }
            case FACULTY -> {
                if (facultyRepository.findByUser_Id(userId).isEmpty()) {
                    facultyRepository.save(Faculty.builder().user(u).name(existingName).build());
                }
            }
            case COMPANY -> {
                if (companyRepository.findByUser_Id(userId).isEmpty()) {
                    companyRepository.save(Company.builder().user(u).companyName(existingName).build());
                }
            }
            case ADMIN -> { /* no dedicated profile row for admins */ }
        }

        return toResponse(u);
    }

    @Override
    @Transactional
    public UserResponse changeUserPassword(Long userId, AdminSetPasswordRequest req) {
        User u = userRepository.findById(userId)
                .orElseThrow(() -> ResourceNotFoundException.of("User", userId));
        u.setPassword(passwordEncoder.encode(req.newPassword()));
        userRepository.save(u);
        // Force re-authentication everywhere by revoking all refresh tokens.
        refreshTokenRepository.deleteByUser(u);
        return toResponse(u);
    }

    // ---------- helpers ----------

    private UserResponse toResponse(User u) {
        return ProfileMapper.toUserResponse(u, resolveName(u));
    }

    private String resolveName(User u) {
        return studentRepository.findByUser_Id(u.getId()).map(Student::getName)
                .or(() -> facultyRepository.findByUser_Id(u.getId()).map(Faculty::getName))
                .or(() -> companyRepository.findByUser_Id(u.getId()).map(Company::getCompanyName))
                .orElse(null);
    }
}
