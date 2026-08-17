package com.ewu.matching.service;

import com.ewu.matching.dto.request.ContentReportRequest;
import com.ewu.matching.dto.response.ContentReportResponse;

import java.util.List;

public interface ContentReportService {

    ContentReportResponse reportPost(Long postId, ContentReportRequest request);

    ContentReportResponse reportComment(Long commentId, ContentReportRequest request);

    ContentReportResponse reportMessage(Long messageId, ContentReportRequest request);

    ContentReportResponse reportProfile(Long userId, ContentReportRequest request);

    List<ContentReportResponse> list(String status);

    ContentReportResponse resolve(Long reportId);

    ContentReportResponse dismiss(Long reportId);
}
