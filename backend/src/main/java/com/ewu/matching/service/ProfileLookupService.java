package com.ewu.matching.service;

import com.ewu.matching.dto.response.ProfileSummaryResponse;
import com.ewu.matching.entity.User;

public interface ProfileLookupService {
    ProfileSummaryResponse summary(User user);

    ProfileSummaryResponse summary(Long userId);

    String displayName(User user);

    String profilePicture(User user);

    String role(User user);
}
