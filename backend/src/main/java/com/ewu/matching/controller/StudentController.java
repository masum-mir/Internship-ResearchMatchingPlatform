package com.ewu.matching.controller;

import com.ewu.matching.dto.request.CertificationRequest;
import com.ewu.matching.dto.request.ProjectRequest;
import com.ewu.matching.dto.request.SkillRequest;
import com.ewu.matching.dto.request.StudentProfileRequest;
import com.ewu.matching.dto.response.*;
import com.ewu.matching.security.access.CanViewPortfolio;
import com.ewu.matching.security.access.IsStudent;
import com.ewu.matching.service.FileStorageService;
import com.ewu.matching.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Tag(name = "Students", description = "Student profile, skills, projects, certifications, portfolio")
@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;
    private final FileStorageService fileStorageService;

    @IsStudent
    @Operation(summary = "Get my student profile")
    @GetMapping("/me")
    public ResponseEntity<StudentProfileResponse> getMyProfile() {
        return ResponseEntity.ok(studentService.getMyProfile());
    }

    /** Existing JSON endpoint remains supported. */
    @IsStudent
    @Operation(summary = "Update my student profile using JSON")
    @PutMapping(value = "/me", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<StudentProfileResponse> updateMyProfile(
            @Valid @RequestBody StudentProfileRequest request) {
        return ResponseEntity.ok(studentService.updateMyProfile(request));
    }

    /**
     * Preferred frontend endpoint: update profile data and upload profile/cover/resume in one request.
     * multipart fields:
     * - data: application/json
     * - profilePicture: optional image
     * - coverPicture: optional image
     * - resume: optional PDF/DOC/DOCX
     */
    @IsStudent
    @Operation(summary = "Update my student profile with profile picture, cover picture and resume")
    @PutMapping(value = "/me", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<StudentProfileResponse> updateMyProfileWithFiles(
            @Valid @RequestPart("data") StudentProfileRequest request,
            @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture,
            @RequestPart(value = "coverPicture", required = false) MultipartFile coverPicture,
            @RequestPart(value = "resume", required = false) MultipartFile resume) throws IOException {

        String profileUrl = request.profilePicture();
        String coverUrl = request.coverPicture();
        String resumeUrl = request.resumeUrl();

        if (hasFile(profilePicture)) profileUrl = fileStorageService.saveProfileImage(profilePicture);
        if (hasFile(coverPicture)) coverUrl = fileStorageService.saveCoverImage(coverPicture);
        if (hasFile(resume)) resumeUrl = fileStorageService.saveResume(resume);

        StudentProfileRequest merged = new StudentProfileRequest(
                request.name(),
                request.studentId(),
                request.department(),
                request.batch(),
                request.cgpa(),
                request.headline(),
                request.bio(),
                request.contactNumber(),
                request.address(),
                profileUrl,
                coverUrl,
                resumeUrl,
                request.portfolioUrl(),
                request.university(),
                request.githubUrl(),
                request.linkedinUrl(),
                request.openToWork()

        );

        return ResponseEntity.ok(studentService.updateMyProfile(merged));
    }

    @IsStudent
    @Operation(summary = "List my skills")
    @GetMapping("/me/skills")
    public ResponseEntity<List<SkillResponse>> listSkills() {
        return ResponseEntity.ok(studentService.listMySkills());
    }

    @IsStudent
    @Operation(summary = "Add a skill to my profile")
    @PostMapping("/me/skills")
    public ResponseEntity<List<SkillResponse>> addSkill(@Valid @RequestBody SkillRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(studentService.addSkill(request));
    }

    @IsStudent
    @Operation(summary = "Remove a skill from my profile")
    @DeleteMapping("/me/skills/{skillId}")
    public ResponseEntity<List<SkillResponse>> removeSkill(@PathVariable Long skillId) {
        return ResponseEntity.ok(studentService.removeSkill(skillId));
    }

    @IsStudent
    @Operation(summary = "List my projects")
    @GetMapping("/me/projects")
    public ResponseEntity<List<ProjectResponse>> listProjects() {
        return ResponseEntity.ok(studentService.listMyProjects());
    }

    @IsStudent
    @Operation(summary = "Add a project")
    @PostMapping("/me/projects")
    public ResponseEntity<ProjectResponse> addProject(@Valid @RequestBody ProjectRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(studentService.addProject(request));
    }

    @IsStudent
    @Operation(summary = "Update a project")
    @PutMapping("/me/projects/{projectId}")
    public ResponseEntity<ProjectResponse> updateProject(@PathVariable Long projectId,
                                                         @Valid @RequestBody ProjectRequest request) {
        return ResponseEntity.ok(studentService.updateProject(projectId, request));
    }

    @IsStudent
    @Operation(summary = "Delete a project")
    @DeleteMapping("/me/projects/{projectId}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long projectId) {
        studentService.deleteProject(projectId);
        return ResponseEntity.noContent().build();
    }

    @IsStudent
    @Operation(summary = "List my certifications")
    @GetMapping("/me/certifications")
    public ResponseEntity<List<CertificationResponse>> listCertifications() {
        return ResponseEntity.ok(studentService.listMyCertifications());
    }

    @IsStudent
    @Operation(summary = "Add a certification")
    @PostMapping("/me/certifications")
    public ResponseEntity<CertificationResponse> addCertification(@Valid @RequestBody CertificationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(studentService.addCertification(request));
    }

    @IsStudent
    @Operation(summary = "Update a certification")
    @PutMapping("/me/certifications/{certificationId}")
    public ResponseEntity<CertificationResponse> updateCertification(@PathVariable Long certificationId,
                                                                     @Valid @RequestBody CertificationRequest request) {
        return ResponseEntity.ok(studentService.updateCertification(certificationId, request));
    }

    @IsStudent
    @Operation(summary = "Delete a certification")
    @DeleteMapping("/me/certifications/{certificationId}")
    public ResponseEntity<Void> deleteCertification(@PathVariable Long certificationId) {
        studentService.deleteCertification(certificationId);
        return ResponseEntity.noContent().build();
    }

    @CanViewPortfolio
    @Operation(summary = "View a student's full portfolio (COMPANY, FACULTY, ADMIN)")
    @GetMapping("/{id}/portfolio")
    public ResponseEntity<PortfolioResponse> getPortfolio(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getPortfolio(id));
    }

    private boolean hasFile(MultipartFile file) {
        return file != null && !file.isEmpty();
    }
}
