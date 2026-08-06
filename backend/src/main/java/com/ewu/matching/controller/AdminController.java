package com.ewu.matching.controller;

import com.ewu.matching.dto.request.AdminProfileRequest;
import com.ewu.matching.dto.request.AdminSetPasswordRequest;
import com.ewu.matching.dto.request.ChangeEmailRequest;
import com.ewu.matching.dto.request.ChangeNameRequest;
import com.ewu.matching.dto.request.ChangeRoleRequest;
import com.ewu.matching.dto.response.ReportResponse;
import com.ewu.matching.dto.response.UserResponse;
import com.ewu.matching.enums.OpportunityType;
import com.ewu.matching.security.access.IsAdmin;
import com.ewu.matching.service.AdminService;
import com.ewu.matching.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Admin", description = "User & post management, reports and statistics")
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@IsAdmin
public class AdminController {

    private final AdminService adminService;
    private final ReportService reportService;

    @Operation(summary = "Get my admin profile")
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMyProfile() {
        return ResponseEntity.ok(adminService.getMyProfile());
    }

    @Operation(summary = "Update my admin profile (profile/cover picture)")
    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateMyProfile(@Valid @RequestBody AdminProfileRequest request) {
        return ResponseEntity.ok(adminService.updateMyProfile(request));
    }

    @Operation(summary = "List all users (ADMIN)")
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> listUsers() {
        return ResponseEntity.ok(adminService.listUsers());
    }

    @Operation(summary = "Block a user (ADMIN)")
    @PutMapping("/users/{id}/block")
    public ResponseEntity<UserResponse> block(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.blockUser(id));
    }

    @Operation(summary = "Unblock a user (ADMIN)")
    @PutMapping("/users/{id}/unblock")
    public ResponseEntity<UserResponse> unblock(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.unblockUser(id));
    }

    @Operation(summary = "Change a user's login email (ADMIN)")
    @PutMapping("/users/{id}/email")
    public ResponseEntity<UserResponse> changeEmail(@PathVariable Long id, @Valid @RequestBody ChangeEmailRequest request) {
        return ResponseEntity.ok(adminService.changeUserEmail(id, request));
    }

    @Operation(summary = "Change a user's display name (ADMIN)")
    @PutMapping("/users/{id}/name")
    public ResponseEntity<UserResponse> changeName(@PathVariable Long id, @Valid @RequestBody ChangeNameRequest request) {
        return ResponseEntity.ok(adminService.changeUserName(id, request));
    }

    @Operation(summary = "Change a user's role (ADMIN)")
    @PutMapping("/users/{id}/role")
    public ResponseEntity<UserResponse> changeRole(@PathVariable Long id, @Valid @RequestBody ChangeRoleRequest request) {
        return ResponseEntity.ok(adminService.changeUserRole(id, request));
    }

    @Operation(summary = "Directly set a user's password (ADMIN)")
    @PutMapping("/users/{id}/password")
    public ResponseEntity<UserResponse> changePassword(@PathVariable Long id, @Valid @RequestBody AdminSetPasswordRequest request) {
        return ResponseEntity.ok(adminService.changeUserPassword(id, request));
    }

    @Operation(summary = "Delete a fake/abusive post by type and id (ADMIN)")
    @DeleteMapping("/posts/{type}/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable OpportunityType type, @PathVariable Long id) {
        adminService.deletePost(type, id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Platform reports & statistics, incl. chart data (ADMIN)")
    @GetMapping("/reports")
    public ResponseEntity<ReportResponse> reports() {
        return ResponseEntity.ok(reportService.getReport());
    }
}
