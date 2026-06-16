package com.ewu.matching.mapper;

import com.ewu.matching.dto.response.ApplicantResponse;
import com.ewu.matching.dto.response.ApplicationResponse;
import com.ewu.matching.dto.response.BookmarkResponse;
import com.ewu.matching.entity.Application;
import com.ewu.matching.entity.Bookmark;
import com.ewu.matching.entity.Student;
import com.ewu.matching.enums.OpportunityType;

/** Entity -> response mapping for applications and bookmarks. */
public final class ActivityMapper {

    private ActivityMapper() {}

    public static ApplicationResponse toApplicationResponse(Application a) {
        Long opportunityId;
        String title;
        if (a.getTargetType() == OpportunityType.INTERNSHIP) {
            opportunityId = a.getInternship() != null ? a.getInternship().getId() : null;
            title = a.getInternship() != null ? a.getInternship().getTitle() : null;
        } else {
            opportunityId = a.getResearch() != null ? a.getResearch().getId() : null;
            title = a.getResearch() != null ? a.getResearch().getTopic() : null;
        }
        return new ApplicationResponse(
                a.getId(), a.getTargetType(), opportunityId, title,
                a.getStatus(), a.getMatchScore(), a.getAppliedAt()
        );
    }

    public static ApplicantResponse toApplicantResponse(Application a) {
        Student s = a.getStudent();
        return new ApplicantResponse(
                a.getId(),
                a.getStatus(),
                a.getMatchScore(),
                a.getAppliedAt(),
                s.getId(),
                s.getName(),
                s.getStudentId(),
                s.getDepartment(),
                s.getCgpa()
        );
    }

    public static BookmarkResponse toBookmarkResponse(Bookmark b) {
        Long opportunityId;
        String title;
        if (b.getTargetType() == OpportunityType.INTERNSHIP) {
            opportunityId = b.getInternship() != null ? b.getInternship().getId() : null;
            title = b.getInternship() != null ? b.getInternship().getTitle() : null;
        } else {
            opportunityId = b.getResearch() != null ? b.getResearch().getId() : null;
            title = b.getResearch() != null ? b.getResearch().getTopic() : null;
        }
        return new BookmarkResponse(b.getId(), b.getTargetType(), opportunityId, title, b.getCreatedAt());
    }
}
