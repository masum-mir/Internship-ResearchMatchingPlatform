//package com.ewu.matching.dto.response;
//import java.util.List;
//public record PublicProfileResponse(ProfileSummaryResponse profile, String bio, String coverPicture,
//                                    String website, boolean openToWork, boolean availableForSupervision,
//                                    boolean verifiedCompany, List<SkillResponse> skills,
//                                    List<EducationResponse> education, List<ExperienceResponse> experience,
//                                    long followerCount, long connectionCount) {}

package com.ewu.matching.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record PublicProfileResponse(

        Long userId,
        String role,

        // Common
        String name,
        String headline,
        String bio,
        String profilePicture,
        String coverPicture,

        // ================= STUDENT =================
        String university,
        String department,
        String batch,
        String studentId,
        BigDecimal cgpa,
        String contactNumber,
        String address,
        String resumeUrl,
        String portfolioUrl,
        String githubUrl,
        String linkedinUrl,
        Boolean openToWork,

        List<SkillResponse> skills,
        List<ProjectResponse> projects,
        List<CertificationResponse> certifications,

        // ================= FACULTY =================
        String designation,
        String specialization,
        String researchInterests,
        String location,
        String googleScholarUrl,
        String orcidId,
        String researchgateUrl,
        String universityProfileUrl,
        Boolean availableForSupervision,

        // ================= COMPANY =================
        String companyName,
        String description,
        String website,
        String industry,
        String companySize,
        LocalDate foundedDate,
        String companyEmail,
        Boolean verified
) {}