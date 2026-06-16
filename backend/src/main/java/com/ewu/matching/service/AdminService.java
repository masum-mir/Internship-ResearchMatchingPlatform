package com.ewu.matching.service;

import com.ewu.matching.dto.response.UserResponse;
import com.ewu.matching.enums.OpportunityType;

import java.util.List;

public interface AdminService {
    List<UserResponse> listUsers();
    UserResponse blockUser(Long userId);
    UserResponse unblockUser(Long userId);
    void deletePost(OpportunityType type, Long postId);
}
