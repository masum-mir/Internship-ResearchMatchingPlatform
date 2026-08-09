package com.ewu.matching.controller;

import com.ewu.matching.dto.request.ApplicationRequest;
import com.ewu.matching.dto.request.ApplicationStatusRequest;
import com.ewu.matching.dto.response.ApplicantResponse;
import com.ewu.matching.dto.response.ApplicationResponse;
import com.ewu.matching.security.access.IsCompany;
import com.ewu.matching.security.access.IsCompanyOrFaculty;
import com.ewu.matching.security.access.IsFaculty;
import com.ewu.matching.security.access.IsStudent;
import com.ewu.matching.service.ApplicationService;
import com.ewu.matching.service.FileStorageService;
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

@Tag(name = "Applications", description = "Student applications + post-owner applicant management")
@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;
    private final FileStorageService fileStorageService;

    @Operation(summary = "Apply using JSON; saved profile resume URL can be supplied")
    @IsStudent
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApplicationResponse> apply(@Valid @RequestBody ApplicationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(applicationService.apply(request));
    }

    @Operation(summary = "Apply and upload a resume in the same request")
    @IsStudent
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApplicationResponse> applyWithResume(
            @Valid @RequestPart("data") ApplicationRequest request,
            @RequestPart(value = "resume", required = false) MultipartFile resume) throws IOException {

        String resumeUrl = request.resumeUrl();
        if (resume != null && !resume.isEmpty()) {
            resumeUrl = fileStorageService.saveResume(resume);
        }

        ApplicationRequest merged = new ApplicationRequest(
                request.targetType(),
                request.targetId(),
                resumeUrl,
                request.coverLetter(),
                request.applicantNote()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(applicationService.apply(merged));
    }

    @Operation(summary = "Withdraw one of my applications (STUDENT)")
    @IsStudent
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> withdraw(@PathVariable Long id) {
        applicationService.withdraw(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "List my applications with their statuses (STUDENT)")
    @IsStudent
    @GetMapping("/me")
    public ResponseEntity<List<ApplicationResponse>> myApplications() {
        return ResponseEntity.ok(applicationService.myApplications());
    }

    @Operation(summary = "Applicants for one of my internships, sorted by match score (COMPANY)")
    @IsCompany
    @GetMapping("/internships/{internshipId}")
    public ResponseEntity<List<ApplicantResponse>> internshipApplicants(@PathVariable Long internshipId) {
        return ResponseEntity.ok(applicationService.getApplicantsForInternship(internshipId));
    }

    @Operation(summary = "Applicants for one of my research posts, sorted by match score (FACULTY)")
    @IsFaculty
    @GetMapping("/research/{researchId}")
    public ResponseEntity<List<ApplicantResponse>> researchApplicants(@PathVariable Long researchId) {
        return ResponseEntity.ok(applicationService.getApplicantsForResearch(researchId));
    }

    @Operation(summary = "Accept / shortlist / reject an applicant (COMPANY or FACULTY, own posts)")
    @IsCompanyOrFaculty
    @PutMapping("/{id}/status")
    public ResponseEntity<ApplicationResponse> updateStatus(@PathVariable Long id,
                                                            @Valid @RequestBody ApplicationStatusRequest request) {
        return ResponseEntity.ok(applicationService.updateStatus(id, request));
    }
}
