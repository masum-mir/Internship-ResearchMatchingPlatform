package com.ewu.matching.service;

import com.ewu.matching.dto.response.*;

public interface DashboardService {
    StudentDashboardResponse studentDashboard();
    CompanyDashboardResponse companyDashboard();
    FacultyDashboardResponse facultyDashboard();
    AdminDashboardResponse adminDashboard();
}
