package com.ewu.matching.service;

import com.ewu.matching.dto.request.ApplicationRequest;
import com.ewu.matching.dto.request.ApplicationStatusRequest;
import com.ewu.matching.dto.response.ApplicantResponse;
import com.ewu.matching.dto.response.ApplicationResponse;

import java.util.List;

public interface ApplicationService {
    ApplicationResponse apply(ApplicationRequest request);
    void withdraw(Long applicationId);
    List<ApplicationResponse> myApplications();

    /** Applicants for one of my internships / research posts, sorted by match score desc. */
    List<ApplicantResponse> getApplicantsForInternship(Long internshipId);
    List<ApplicantResponse> getApplicantsForResearch(Long researchId);

    ApplicationResponse updateStatus(Long applicationId, ApplicationStatusRequest request);
}
