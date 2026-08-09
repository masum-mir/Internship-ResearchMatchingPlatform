package com.ewu.matching.repository;

import com.ewu.matching.entity.Experience;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExperienceRepository extends JpaRepository<Experience, Long> {
    List<Experience> findByUser_IdOrderByStartDateDesc(Long userId);
}
