package com.ewu.matching.service;

import com.ewu.matching.dto.response.ProfileSummaryResponse;
import java.util.List;

public interface DirectoryService {
    List<ProfileSummaryResponse> search(String query);
}
