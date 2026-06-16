package com.ewu.matching.matching;

import com.ewu.matching.dto.response.MatchBreakdownResponse;
import com.ewu.matching.entity.Skill;
import com.ewu.matching.entity.Student;

import java.math.BigDecimal;
import java.util.Set;

/**
 * Core matching contract. A single generic method scores a student against the
 * requirements of any opportunity (internship or research), keeping the formula
 * in one place. The concrete implementation is delivered in Step 13.
 *
 * Formula (per the specification + agreed clarifications):
 *   finalScore = (skillMatch * 0.60) + (cgpaMatch * 0.25) + (departmentMatch * 0.15)
 */
public interface MatchingEngine {

    MatchBreakdownResponse score(Student student,
                                 Set<Skill> requiredSkills,
                                 BigDecimal requiredCgpa,
                                 Set<String> targetDepartments);
}
