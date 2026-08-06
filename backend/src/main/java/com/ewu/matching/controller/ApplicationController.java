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
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Applications", description = "Student applications + post-owner applicant management")
@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @Operation(summary = "Apply to an internship or research post (STUDENT). Match score is computed and stored.")
    @IsStudent
    @PostMapping
    public ResponseEntity<ApplicationResponse> apply(@Valid @RequestBody ApplicationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(applicationService.apply(request));
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

    // ---------- Post owners: applicant inbox ----------

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
