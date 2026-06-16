package com.ewu.matching.repository;

import com.ewu.matching.entity.Internship;
import com.ewu.matching.enums.PostStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * JpaSpecificationExecutor enables dynamic filtering (title, company, skill,
 * location) built in the service layer via Specifications.
 */
@Repository
public interface InternshipRepository
        extends JpaRepository<Internship, Long>, JpaSpecificationExecutor<Internship> {

    List<Internship> findByCompany_Id(Long companyId);

    long countByCompany_Id(Long companyId);

    long countByStatus(PostStatus status);

    @EntityGraph(attributePaths = {"requiredSkills", "targetDepartments", "company"})
    Optional<Internship> findWithDetailsById(Long id);

    @EntityGraph(attributePaths = {"requiredSkills", "targetDepartments", "company"})
    List<Internship> findAllByStatus(PostStatus status);
}
