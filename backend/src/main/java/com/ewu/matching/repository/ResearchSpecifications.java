package com.ewu.matching.repository;

import com.ewu.matching.entity.ResearchOpportunity;
import com.ewu.matching.enums.PostStatus;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

/** Composable predicates for dynamic research search (topic, area, faculty). */
public final class ResearchSpecifications {

    private ResearchSpecifications() {}

    public static Specification<ResearchOpportunity> topicContains(String topic) {
        if (!StringUtils.hasText(topic)) return null;
        return (root, q, cb) -> cb.like(cb.lower(root.get("topic")), like(topic));
    }

    public static Specification<ResearchOpportunity> areaContains(String area) {
        if (!StringUtils.hasText(area)) return null;
        return (root, q, cb) -> cb.like(cb.lower(root.get("researchArea")), like(area));
    }

    public static Specification<ResearchOpportunity> facultyNameContains(String faculty) {
        if (!StringUtils.hasText(faculty)) return null;
        return (root, q, cb) -> {
            Join<Object, Object> facultyJoin = root.join("faculty");
            return cb.like(cb.lower(facultyJoin.get("name")), like(faculty));
        };
    }

    public static Specification<ResearchOpportunity> isActive() {
        return (root, q, cb) -> cb.equal(root.get("status"), PostStatus.ACTIVE);
    }

    private static String like(String v) {
        return "%" + v.toLowerCase().trim() + "%";
    }
}
