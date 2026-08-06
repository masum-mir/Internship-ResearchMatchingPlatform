package com.ewu.matching.service;

import com.ewu.matching.dto.request.AdminProfileRequest;
import com.ewu.matching.dto.request.AdminSetPasswordRequest;
import com.ewu.matching.dto.request.ChangeEmailRequest;
import com.ewu.matching.dto.request.ChangeNameRequest;
import com.ewu.matching.dto.request.ChangeRoleRequest;
import com.ewu.matching.dto.response.UserResponse;
import com.ewu.matching.enums.OpportunityType;

import java.util.List;

public interface AdminService {
    List<UserResponse> listUsers();
    UserResponse blockUser(Long userId);
    UserResponse unblockUser(Long userId);
    void deletePost(OpportunityType type, Long postId);
    UserResponse getMyProfile();
    UserResponse updateMyProfile(AdminProfileRequest req);
    UserResponse changeUserEmail(Long userId, ChangeEmailRequest req);
    UserResponse changeUserName(Long userId, ChangeNameRequest req);
    UserResponse changeUserRole(Long userId, ChangeRoleRequest req);
    UserResponse changeUserPassword(Long userId, AdminSetPasswordRequest req);
}
