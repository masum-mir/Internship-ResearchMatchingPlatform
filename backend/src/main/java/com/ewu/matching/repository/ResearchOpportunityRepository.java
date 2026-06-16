package com.ewu.matching.repository;

import com.ewu.matching.entity.ResearchOpportunity;
import com.ewu.matching.enums.PostStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResearchOpportunityRepository
        extends JpaRepository<ResearchOpportunity, Long>, JpaSpecificationExecutor<ResearchOpportunity> {

    List<ResearchOpportunity> findByFaculty_Id(Long facultyId);

    long countByFaculty_Id(Long facultyId);

    long countByStatus(PostStatus status);

    @EntityGraph(attributePaths = {"requiredSkills", "targetDepartments", "faculty"})
    Optional<ResearchOpportunity> findWithDetailsById(Long id);

    @EntityGraph(attributePaths = {"requiredSkills", "targetDepartments", "faculty"})
    List<ResearchOpportunity> findAllByStatus(PostStatus status);
}
