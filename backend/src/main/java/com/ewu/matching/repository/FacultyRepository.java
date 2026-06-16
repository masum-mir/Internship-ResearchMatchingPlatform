package com.ewu.matching.repository;

import com.ewu.matching.entity.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FacultyRepository extends JpaRepository<Faculty, Long> {

    Optional<Faculty> findByUser_Id(Long userId);

    Optional<Faculty> findByUser_Email(String email);
}
