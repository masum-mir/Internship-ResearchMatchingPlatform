package com.ewu.matching.repository;

import com.ewu.matching.entity.Student;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByUser_Id(Long userId);

    Optional<Student> findByUser_Email(String email);

    Optional<Student> findByStudentId(String studentId);

    boolean existsByStudentId(String studentId);

    // Eagerly load skills when we need them for matching/portfolio.
    @EntityGraph(attributePaths = {"skills"})
    Optional<Student> findWithSkillsByUser_Id(Long userId);

    @EntityGraph(attributePaths = {"skills", "projects", "certifications"})
    Optional<Student> findWithDetailsById(Long id);
}
