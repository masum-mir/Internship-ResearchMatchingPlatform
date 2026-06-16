package com.ewu.matching.controller;

import com.ewu.matching.dto.request.CompanyProfileRequest;
import com.ewu.matching.dto.response.CompanyProfileResponse;
import com.ewu.matching.security.access.IsCompany;
import com.ewu.matching.service.CompanyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Companies", description = "Company profile management")
@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
@IsCompany
public class CompanyController {

    private final CompanyService companyService;

    @Operation(summary = "Get my company profile")
    @GetMapping("/me")
    public ResponseEntity<CompanyProfileResponse> getMyProfile() {
        return ResponseEntity.ok(companyService.getMyProfile());
    }

    @Operation(summary = "Update my company profile")
    @PutMapping("/me")
    public ResponseEntity<CompanyProfileResponse> updateMyProfile(@Valid @RequestBody CompanyProfileRequest request) {
        return ResponseEntity.ok(companyService.updateMyProfile(request));
    }
}
