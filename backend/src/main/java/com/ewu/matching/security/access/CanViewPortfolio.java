package com.ewu.matching.security.access;

import org.springframework.security.access.prepost.PreAuthorize;

import java.lang.annotation.*;

/** Full student portfolios are visible to companies, faculty, and admins. */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@PreAuthorize("hasAnyRole('COMPANY', 'FACULTY', 'ADMIN')")
public @interface CanViewPortfolio {
}
