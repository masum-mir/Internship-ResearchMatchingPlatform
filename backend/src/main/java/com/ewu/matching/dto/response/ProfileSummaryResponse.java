package com.ewu.matching.dto.response;
public record ProfileSummaryResponse(Long userId, String role, String name, String headline,
                                     String profilePicture, String location, String organization) {}
