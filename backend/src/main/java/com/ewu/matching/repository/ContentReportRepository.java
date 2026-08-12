package com.ewu.matching.repository;

import com.ewu.matching.entity.ContentReport;
import com.ewu.matching.enums.ContentReportStatus;
import com.ewu.matching.enums.ReportTargetType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContentReportRepository extends JpaRepository<ContentReport, Long> {
    List<ContentReport> findAllByOrderByCreatedAtDesc();

    List<ContentReport> findByStatusOrderByCreatedAtDesc(ContentReportStatus status);

    boolean existsByReporter_IdAndTargetTypeAndTargetIdAndStatus(
            Long reporterId, ReportTargetType targetType, Long targetId, ContentReportStatus status);
}
