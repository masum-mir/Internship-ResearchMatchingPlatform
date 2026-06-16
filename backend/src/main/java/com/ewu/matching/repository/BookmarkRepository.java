package com.ewu.matching.repository;

import com.ewu.matching.entity.Bookmark;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {

    @EntityGraph(attributePaths = {"internship", "internship.company", "research", "research.faculty"})
    List<Bookmark> findByStudent_Id(Long studentId);

    boolean existsByStudent_IdAndInternship_Id(Long studentId, Long internshipId);

    boolean existsByStudent_IdAndResearch_Id(Long studentId, Long researchId);
}
