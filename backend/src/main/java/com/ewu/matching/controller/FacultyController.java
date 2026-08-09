package com.ewu.matching.controller;

import com.ewu.matching.dto.request.FacultyProfileRequest;
import com.ewu.matching.dto.response.FacultyProfileResponse;
import com.ewu.matching.security.access.IsFaculty;
import com.ewu.matching.service.FacultyService;
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

@Tag(name = "Faculty", description = "Faculty profile management")
@RestController
@RequestMapping("/api/faculty")
@RequiredArgsConstructor
@IsFaculty
public class FacultyController {

    private final FacultyService facultyService;
    private final FileStorageService fileStorageService;

    @Operation(summary = "Get my faculty profile")
    @GetMapping("/me")
    public ResponseEntity<FacultyProfileResponse> getMyProfile() {
        return ResponseEntity.ok(facultyService.getMyProfile());
    }

    @Operation(summary = "Update my faculty profile using JSON")
    @PutMapping(value = "/me", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<FacultyProfileResponse> updateMyProfile(
            @Valid @RequestBody FacultyProfileRequest request) {
        return ResponseEntity.ok(facultyService.updateMyProfile(request));
    }

    @Operation(summary = "Update faculty profile and images in one request")
    @PutMapping(value = "/me", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FacultyProfileResponse> updateMyProfileWithFiles(
            @Valid @RequestPart("data") FacultyProfileRequest request,
            @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture,
            @RequestPart(value = "coverPicture", required = false) MultipartFile coverPicture) throws IOException {

        String profileUrl = request.profilePicture();
        String coverUrl = request.coverPicture();
        if (hasFile(profilePicture)) profileUrl = fileStorageService.saveProfileImage(profilePicture);
        if (hasFile(coverPicture)) coverUrl = fileStorageService.saveCoverImage(coverPicture);

        FacultyProfileRequest merged = new FacultyProfileRequest(
                request.name(), request.department(), request.designation(), request.bio(),
                request.specialization(), request.researchInterests(), request.contactNumber(), request.university(),
                request.location(), profileUrl, coverUrl, request.googleScholarUrl(), request.orcidId(),
                request.researchgateUrl(), request.linkedinUrl(), request.universityProfileUrl(),
                request.availableForSupervision()
        );
        return ResponseEntity.ok(facultyService.updateMyProfile(merged));
    }

    private boolean hasFile(MultipartFile file) {
        return file != null && !file.isEmpty();
    }
}
