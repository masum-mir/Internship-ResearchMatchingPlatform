package com.ewu.matching.repository;

import com.ewu.matching.entity.Education;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EducationRepository extends JpaRepository<Education, Long> {
    List<Education> findByUser_IdOrderByStartDateDesc(Long userId);
}
