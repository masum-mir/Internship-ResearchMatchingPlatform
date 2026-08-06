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

    List<ApplicantResponse> getApplicantsForInternship(Long internshipId);
    List<ApplicantResponse> getApplicantsForResearch(Long researchId);

    ApplicationResponse updateStatus(Long applicationId, ApplicationStatusRequest request);
}
