package com.ewu.matching.controller;

import com.ewu.matching.dto.request.AdminProfileRequest;
import com.ewu.matching.dto.request.AdminSetPasswordRequest;
import com.ewu.matching.dto.request.ChangeEmailRequest;
import com.ewu.matching.dto.request.ChangeNameRequest;
import com.ewu.matching.dto.request.ChangeRoleRequest;
import com.ewu.matching.dto.response.CommentResponse;
import com.ewu.matching.dto.response.ContentReportResponse;
import com.ewu.matching.dto.response.ConversationResponse;
import com.ewu.matching.dto.response.MessageResponse;
import com.ewu.matching.dto.response.PostResponse;
import com.ewu.matching.dto.response.ReportResponse;
import com.ewu.matching.dto.response.UserResponse;
import com.ewu.matching.enums.OpportunityType;
import com.ewu.matching.security.access.IsAdmin;
import com.ewu.matching.service.AdminService;
import com.ewu.matching.service.ContentReportService;
import com.ewu.matching.service.FileStorageService;
import com.ewu.matching.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import java.util.List;

@Tag(name = "Admin", description = "User & post management, reports and statistics")
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@IsAdmin
public class AdminController {

    private final AdminService adminService;
    private final ReportService reportService;
    private final ContentReportService contentReportService;
    private final FileStorageService fileStorageService;

    @Operation(summary = "Get my admin profile")
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMyProfile() {
        return ResponseEntity.ok(adminService.getMyProfile());
    }

    @Operation(summary = "Update my admin profile using JSON")
    @PutMapping(value = "/me", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserResponse> updateMyProfile(@Valid @RequestBody AdminProfileRequest request) {
        return ResponseEntity.ok(adminService.updateMyProfile(request));
    }

    @Operation(summary = "Update admin profile and images in one request")
    @PutMapping(value = "/me", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserResponse> updateMyProfileWithFiles(
            @Valid @RequestPart("data") AdminProfileRequest request,
            @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture,
            @RequestPart(value = "coverPicture", required = false) MultipartFile coverPicture) throws IOException {

        String profileUrl = request.profilePicture();
        String coverUrl = request.coverPicture();
        if (profilePicture != null && !profilePicture.isEmpty()) {
            profileUrl = fileStorageService.saveProfileImage(profilePicture);
        }
        if (coverPicture != null && !coverPicture.isEmpty()) {
            coverUrl = fileStorageService.saveCoverImage(coverPicture);
        }

        return ResponseEntity.ok(adminService.updateMyProfile(new AdminProfileRequest(profileUrl, coverUrl)));
    }

    @Operation(summary = "List all users (ADMIN)")
    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> listUsers() {
        return ResponseEntity.ok(adminService.listUsers());
    }

    @Operation(summary = "Monitor: list every post on the platform (ADMIN)")
    @GetMapping("/posts")
    public ResponseEntity<List<PostResponse>> listAllPosts() {
        return ResponseEntity.ok(adminService.listAllPosts());
    }

    @Operation(summary = "Monitor: view a single social post regardless of visibility (ADMIN)")
    @GetMapping("/social-posts/{id}")
    public ResponseEntity<PostResponse> getSocialPost(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getSocialPost(id));
    }

    @Operation(summary = "Monitor: view a single comment regardless of the parent post's visibility (ADMIN)")
    @GetMapping("/comments/{id}")
    public ResponseEntity<CommentResponse> getComment(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getComment(id));
    }

    @Operation(summary = "Monitor: list every conversation on the platform (ADMIN)")
    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationResponse>> listAllConversations() {
        return ResponseEntity.ok(adminService.listAllConversations());
    }

    @Operation(summary = "Monitor: read the messages inside any conversation (ADMIN)")
    @GetMapping("/conversations/{id}/messages")
    public ResponseEntity<List<MessageResponse>> conversationMessages(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.listConversationMessages(id));
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

    @Operation(summary = "Delete/soft-delete an abusive social post (ADMIN)")
    @DeleteMapping("/social-posts/{id}")
    public ResponseEntity<Void> deleteSocialPost(@PathVariable Long id) {
        adminService.deleteSocialPost(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Platform reports & statistics, incl. chart data (ADMIN)")
    @GetMapping("/reports")
    public ResponseEntity<ReportResponse> reports() {
        return ResponseEntity.ok(reportService.getReport());
    }

    @Operation(summary = "List user-submitted content reports, optionally filtered by status (ADMIN)")
    @GetMapping("/content-reports")
    public ResponseEntity<List<ContentReportResponse>> contentReports(
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(contentReportService.list(status));
    }

    @Operation(summary = "Mark a content report resolved, e.g. after taking action (ADMIN)")
    @PutMapping("/content-reports/{id}/resolve")
    public ResponseEntity<ContentReportResponse> resolveContentReport(@PathVariable Long id) {
        return ResponseEntity.ok(contentReportService.resolve(id));
    }

    @Operation(summary = "Dismiss a content report as not requiring action (ADMIN)")
    @PutMapping("/content-reports/{id}/dismiss")
    public ResponseEntity<ContentReportResponse> dismissContentReport(@PathVariable Long id) {
        return ResponseEntity.ok(contentReportService.dismiss(id));
    }
}
