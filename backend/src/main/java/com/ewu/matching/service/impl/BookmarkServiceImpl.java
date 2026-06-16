package com.ewu.matching.service.impl;

import com.ewu.matching.dto.request.BookmarkRequest;
import com.ewu.matching.dto.response.BookmarkResponse;
import com.ewu.matching.entity.Bookmark;
import com.ewu.matching.entity.Internship;
import com.ewu.matching.entity.ResearchOpportunity;
import com.ewu.matching.entity.Student;
import com.ewu.matching.enums.OpportunityType;
import com.ewu.matching.exception.BadRequestException;
import com.ewu.matching.exception.DuplicateResourceException;
import com.ewu.matching.exception.ForbiddenOperationException;
import com.ewu.matching.exception.ResourceNotFoundException;
import com.ewu.matching.mapper.ActivityMapper;
import com.ewu.matching.repository.BookmarkRepository;
import com.ewu.matching.repository.InternshipRepository;
import com.ewu.matching.repository.ResearchOpportunityRepository;
import com.ewu.matching.security.CurrentUserProvider;
import com.ewu.matching.service.BookmarkService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookmarkServiceImpl implements BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final InternshipRepository internshipRepository;
    private final ResearchOpportunityRepository researchRepository;
    private final CurrentUserProvider currentUser;

    @Override
    @Transactional
    public BookmarkResponse add(BookmarkRequest req) {
        if (req.targetType() == null || req.targetId() == null) {
            throw new BadRequestException("targetType and targetId are required");
        }
        Student student = currentUser.currentStudent();
        Bookmark bookmark = Bookmark.builder().student(student).targetType(req.targetType()).build();

        if (req.targetType() == OpportunityType.INTERNSHIP) {
            if (bookmarkRepository.existsByStudent_IdAndInternship_Id(student.getId(), req.targetId())) {
                throw new DuplicateResourceException("Internship already bookmarked");
            }
            Internship internship = internshipRepository.findById(req.targetId())
                    .orElseThrow(() -> ResourceNotFoundException.of("Internship", req.targetId()));
            bookmark.setInternship(internship);
        } else {
            if (bookmarkRepository.existsByStudent_IdAndResearch_Id(student.getId(), req.targetId())) {
                throw new DuplicateResourceException("Research post already bookmarked");
            }
            ResearchOpportunity research = researchRepository.findById(req.targetId())
                    .orElseThrow(() -> ResourceNotFoundException.of("Research opportunity", req.targetId()));
            bookmark.setResearch(research);
        }
        return ActivityMapper.toBookmarkResponse(bookmarkRepository.save(bookmark));
    }

    @Override
    @Transactional
    public void remove(Long bookmarkId) {
        Bookmark bookmark = bookmarkRepository.findById(bookmarkId)
                .orElseThrow(() -> ResourceNotFoundException.of("Bookmark", bookmarkId));
        if (!bookmark.getStudent().getId().equals(currentUser.currentStudent().getId())) {
            throw new ForbiddenOperationException("You can only remove your own bookmarks");
        }
        bookmarkRepository.delete(bookmark);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookmarkResponse> listMine() {
        return bookmarkRepository.findByStudent_Id(currentUser.currentStudent().getId())
                .stream().map(ActivityMapper::toBookmarkResponse).toList();
    }
}
