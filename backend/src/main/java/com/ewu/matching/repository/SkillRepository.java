package com.ewu.matching.repository;

import com.ewu.matching.entity.Skill;
import com.ewu.matching.enums.SkillCategory;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {

    Optional<Skill> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);

    List<Skill> findByCategory(SkillCategory category);

    /**
     * Report: most popular skill(s) among students.
     * Returns rows of [skillName, studentCount] ordered by count desc.
     */
    @Query("""
           SELECT sk.name, COUNT(st)
           FROM Student st JOIN st.skills sk
           GROUP BY sk.id, sk.name
           ORDER BY COUNT(st) DESC
           """)
    List<Object[]> findMostPopularSkills(Pageable pageable);
}
