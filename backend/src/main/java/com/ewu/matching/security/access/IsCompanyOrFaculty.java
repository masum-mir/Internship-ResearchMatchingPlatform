package com.ewu.matching.security.access;

import org.springframework.security.access.prepost.PreAuthorize;

import java.lang.annotation.*;

/**
 * For applicant-management endpoints shared by post owners. Row-level ownership
 * (this company/faculty owns this specific post) is enforced in the service layer.
 */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@PreAuthorize("hasAnyRole('COMPANY', 'FACULTY')")
public @interface IsCompanyOrFaculty {
}
