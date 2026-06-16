package com.ewu.matching.matching;

import com.ewu.matching.dto.response.MatchBreakdownResponse;
import com.ewu.matching.entity.Skill;
import com.ewu.matching.entity.Student;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Concrete implementation of the matching formula:
 *
 *   finalScore = (skillMatch * 0.60) + (cgpaMatch * 0.25) + (departmentMatch * 0.15)
 *
 * Component rules (per spec + agreed clarifications):
 *  - skillMatch       = matchedRequiredSkills / totalRequiredSkills   (1.0 if no skills required)
 *  - cgpaMatch        = min(studentCgpa / requiredCgpa, 1.0)          (1.0 if no CGPA required)
 *  - departmentMatch  = 1.0 if student's department is in the post's targetDepartments,
 *                       else 0.0  (1.0 if the post targets no specific department)
 *
 * Component scores are reported on a 0.0-1.0 scale; finalScore is a 0-100 percentage
 * rounded to two decimals.
 */
@Component
public class MatchingEngineImpl implements MatchingEngine {

    static final double SKILL_WEIGHT = 0.60;
    static final double CGPA_WEIGHT = 0.25;
    static final double DEPARTMENT_WEIGHT = 0.15;

    @Override
    public MatchBreakdownResponse score(Student student,
                                        Set<Skill> requiredSkills,
                                        BigDecimal requiredCgpa,
                                        Set<String> targetDepartments) {

        SkillScore skillScore = computeSkillScore(student, requiredSkills);
        double cgpaMatch = computeCgpaMatch(student.getCgpa(), requiredCgpa);
        double departmentMatch = computeDepartmentMatch(student.getDepartment(), targetDepartments);

        double weighted = (skillScore.score * SKILL_WEIGHT)
                + (cgpaMatch * CGPA_WEIGHT)
                + (departmentMatch * DEPARTMENT_WEIGHT);
        double finalScore = round2(weighted * 100.0);

        return new MatchBreakdownResponse(
                round2(skillScore.score),
                round2(cgpaMatch),
                round2(departmentMatch),
                finalScore,
                skillScore.matched,
                skillScore.missing
        );
    }

    private SkillScore computeSkillScore(Student student, Set<Skill> requiredSkills) {
        List<String> matched = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        if (requiredSkills == null || requiredSkills.isEmpty()) {
            return new SkillScore(1.0, matched, missing);
        }

        Set<String> studentSkills = student.getSkills() == null ? Set.of()
                : student.getSkills().stream()
                    .map(s -> s.getName().toLowerCase().trim())
                    .collect(Collectors.toSet());

        for (Skill required : requiredSkills) {
            String name = required.getName();
            if (studentSkills.contains(name.toLowerCase().trim())) {
                matched.add(name);
            } else {
                missing.add(name);
            }
        }
        double score = (double) matched.size() / requiredSkills.size();
        return new SkillScore(score, matched, missing);
    }

    private double computeCgpaMatch(BigDecimal studentCgpa, BigDecimal requiredCgpa) {
        if (requiredCgpa == null || requiredCgpa.signum() <= 0) {
            return 1.0; // no CGPA requirement -> full credit
        }
        if (studentCgpa == null || studentCgpa.signum() <= 0) {
            return 0.0;
        }
        double ratio = studentCgpa.doubleValue() / requiredCgpa.doubleValue();
        return Math.min(ratio, 1.0);
    }

    private double computeDepartmentMatch(String studentDepartment, Set<String> targetDepartments) {
        if (targetDepartments == null || targetDepartments.isEmpty()) {
            return 1.0; // open to all departments
        }
        if (studentDepartment == null || studentDepartment.isBlank()) {
            return 0.0;
        }
        boolean inTarget = targetDepartments.stream()
                .anyMatch(d -> d != null && d.equalsIgnoreCase(studentDepartment.trim()));
        return inTarget ? 1.0 : 0.0;
    }

    private double round2(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    /** Internal carrier for the skill-component result. */
    private record SkillScore(double score, List<String> matched, List<String> missing) {
    }
}
