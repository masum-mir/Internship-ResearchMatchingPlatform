package com.ewu.matching.service;

import com.ewu.matching.dto.request.ResearchRequest;
import com.ewu.matching.dto.response.MatchedResearchResponse;
import com.ewu.matching.dto.response.ResearchResponse;

import java.util.List;

public interface ResearchService {
    ResearchResponse create(ResearchRequest request);
    ResearchResponse update(Long id, ResearchRequest request);
    void delete(Long id);
    ResearchResponse getById(Long id);

    List<ResearchResponse> search(String topic, String area, String faculty);
    List<ResearchResponse> listMine();

    List<MatchedResearchResponse> getMatchedForCurrentStudent();
}
