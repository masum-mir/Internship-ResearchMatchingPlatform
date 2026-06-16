package com.ewu.matching.controller;

import com.ewu.matching.dto.response.*;
import com.ewu.matching.security.access.IsAdmin;
import com.ewu.matching.security.access.IsCompany;
import com.ewu.matching.security.access.IsFaculty;
import com.ewu.matching.security.access.IsStudent;
import com.ewu.matching.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Dashboards", description = "Role-specific summary counts")
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @Operation(summary = "Student dashboard (STUDENT)")
    @IsStudent
    @GetMapping("/student")
    public ResponseEntity<StudentDashboardResponse> student() {
        return ResponseEntity.ok(dashboardService.studentDashboard());
    }

    @Operation(summary = "Company dashboard (COMPANY)")
    @IsCompany
    @GetMapping("/company")
    public ResponseEntity<CompanyDashboardResponse> company() {
        return ResponseEntity.ok(dashboardService.companyDashboard());
    }

    @Operation(summary = "Faculty dashboard (FACULTY)")
    @IsFaculty
    @GetMapping("/faculty")
    public ResponseEntity<FacultyDashboardResponse> faculty() {
        return ResponseEntity.ok(dashboardService.facultyDashboard());
    }

    @Operation(summary = "Admin dashboard (ADMIN)")
    @IsAdmin
    @GetMapping("/admin")
    public ResponseEntity<AdminDashboardResponse> admin() {
        return ResponseEntity.ok(dashboardService.adminDashboard());
    }
}
