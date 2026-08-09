package com.ewu.matching.repository;
import com.ewu.matching.entity.SkillEndorsement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface SkillEndorsementRepository extends JpaRepository<SkillEndorsement, Long> {
    Optional<SkillEndorsement> findByStudent_IdAndSkill_IdAndEndorsedBy_Id(Long studentId, Long skillId, Long endorsedById);
    List<SkillEndorsement> findByStudent_IdAndSkill_IdOrderByCreatedAtDesc(Long studentId, Long skillId);
}
