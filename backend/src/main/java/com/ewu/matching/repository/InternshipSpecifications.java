package com.ewu.matching.repository;

import com.ewu.matching.entity.Internship;
import com.ewu.matching.enums.PostStatus;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

/** Composable predicates for dynamic internship search (title, company, skill, location). */
public final class InternshipSpecifications {

    private InternshipSpecifications() {}

    public static Specification<Internship> titleContains(String title) {
        if (!StringUtils.hasText(title)) return null;
        return (root, q, cb) -> cb.like(cb.lower(root.get("title")), like(title));
    }

    public static Specification<Internship> companyNameContains(String company) {
        if (!StringUtils.hasText(company)) return null;
        return (root, q, cb) -> {
            Join<Object, Object> companyJoin = root.join("company");
            return cb.like(cb.lower(companyJoin.get("companyName")), like(company));
        };
    }

    public static Specification<Internship> locationContains(String location) {
        if (!StringUtils.hasText(location)) return null;
        return (root, q, cb) -> cb.like(cb.lower(root.get("location")), like(location));
    }

    public static Specification<Internship> hasSkill(String skill) {
        if (!StringUtils.hasText(skill)) return null;
        return (root, q, cb) -> {
            q.distinct(true);
            Join<Object, Object> skills = root.join("requiredSkills");
            return cb.like(cb.lower(skills.get("name")), like(skill));
        };
    }

    public static Specification<Internship> isActive() {
        return (root, q, cb) -> cb.equal(root.get("status"), PostStatus.ACTIVE);
    }

    private static String like(String v) {
        return "%" + v.toLowerCase().trim() + "%";
    }
}
