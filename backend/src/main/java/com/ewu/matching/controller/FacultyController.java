package com.ewu.matching.controller;

import com.ewu.matching.dto.request.FacultyProfileRequest;
import com.ewu.matching.dto.response.FacultyProfileResponse;
import com.ewu.matching.security.access.IsFaculty;
import com.ewu.matching.service.FacultyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Faculty", description = "Faculty profile management")
@RestController
@RequestMapping("/api/faculty")
@RequiredArgsConstructor
@IsFaculty
public class FacultyController {

    private final FacultyService facultyService;

    @Operation(summary = "Get my faculty profile")
    @GetMapping("/me")
    public ResponseEntity<FacultyProfileResponse> getMyProfile() {
        return ResponseEntity.ok(facultyService.getMyProfile());
    }

    @Operation(summary = "Update my faculty profile")
    @PutMapping("/me")
    public ResponseEntity<FacultyProfileResponse> updateMyProfile(@Valid @RequestBody FacultyProfileRequest request) {
        return ResponseEntity.ok(facultyService.updateMyProfile(request));
    }
}
