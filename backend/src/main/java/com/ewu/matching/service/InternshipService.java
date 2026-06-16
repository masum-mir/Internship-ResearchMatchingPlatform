package com.ewu.matching.service;

import com.ewu.matching.dto.request.InternshipRequest;
import com.ewu.matching.dto.response.InternshipResponse;
import com.ewu.matching.dto.response.MatchedInternshipResponse;

import java.util.List;

public interface InternshipService {
    InternshipResponse create(InternshipRequest request);
    InternshipResponse update(Long id, InternshipRequest request);
    void delete(Long id);
    InternshipResponse getById(Long id);

    List<InternshipResponse> search(String title, String company, String skill, String location);
    List<InternshipResponse> listMine();

    /** Active internships ranked by match score for the logged-in student. */
    List<MatchedInternshipResponse> getMatchedForCurrentStudent();
}
