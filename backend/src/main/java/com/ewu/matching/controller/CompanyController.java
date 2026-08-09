package com.ewu.matching.controller;

import com.ewu.matching.dto.request.CompanyProfileRequest;
import com.ewu.matching.dto.response.CompanyProfileResponse;
import com.ewu.matching.security.access.IsCompany;
import com.ewu.matching.service.CompanyService;
import com.ewu.matching.service.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Tag(name = "Companies", description = "Company profile management")
@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
@IsCompany
public class CompanyController {

    private final CompanyService companyService;
    private final FileStorageService fileStorageService;

    @Operation(summary = "Get my company profile")
    @GetMapping("/me")
    public ResponseEntity<CompanyProfileResponse> getMyProfile() {
        return ResponseEntity.ok(companyService.getMyProfile());
    }

    @Operation(summary = "Update my company profile using JSON")
    @PutMapping(value = "/me", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CompanyProfileResponse> updateMyProfile(
            @Valid @RequestBody CompanyProfileRequest request) {
        return ResponseEntity.ok(companyService.updateMyProfile(request));
    }

    @Operation(summary = "Update company profile and images in one request")
    @PutMapping(value = "/me", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CompanyProfileResponse> updateMyProfileWithFiles(
            @Valid @RequestPart("data") CompanyProfileRequest request,
            @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture,
            @RequestPart(value = "coverPicture", required = false) MultipartFile coverPicture) throws IOException {

        String profileUrl = request.profilePicture();
        String coverUrl = request.coverPicture();
        if (hasFile(profilePicture)) profileUrl = fileStorageService.saveProfileImage(profilePicture);
        if (hasFile(coverPicture)) coverUrl = fileStorageService.saveCoverImage(coverPicture);

        CompanyProfileRequest merged = new CompanyProfileRequest(
                request.companyName(), request.description(), request.website(), request.location(),
                request.industry(), request.companySize(), request.foundedDate(), request.contactNumber(),
                request.companyEmail(), profileUrl, coverUrl
        );
        return ResponseEntity.ok(companyService.updateMyProfile(merged));
    }

    private boolean hasFile(MultipartFile file) {
        return file != null && !file.isEmpty();
    }
}
