package com.ewu.matching.security.access;

import org.springframework.security.access.prepost.PreAuthorize;

import java.lang.annotation.*;

/** Restricts access to authenticated users holding the COMPANY role. */
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@PreAuthorize("hasRole('COMPANY')")
public @interface IsCompany {
}
