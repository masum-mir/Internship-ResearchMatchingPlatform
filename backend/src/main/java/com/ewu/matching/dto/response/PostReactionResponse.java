package com.ewu.matching.dto.response;

import com.ewu.matching.enums.ReactionType;

public record PostReactionResponse(Long userId, String name, String profilePicture, ReactionType type) {}
