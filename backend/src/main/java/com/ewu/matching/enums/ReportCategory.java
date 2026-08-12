package com.ewu.matching.enums;

/**
 * Reasons a user can report content for. Not every reason applies to every
 * kind of content — an intellectual-property claim doesn't make sense on a
 * DM, and "unwanted sexual advances" is a message-specific concern, not a
 * post one — so {@link ReportCategoryRules} scopes each of these to the
 * {@link ReportTargetType}(s) it's actually relevant for.
 */
public enum ReportCategory {
    SPAM,
    HARASSMENT_OR_BULLYING,
    HATE_SPEECH,
    VIOLENCE_OR_DANGEROUS_ORGANIZATIONS,
    NUDITY_OR_SEXUAL_CONTENT,
    UNWANTED_SEXUAL_ADVANCES,
    FALSE_INFORMATION,
    SCAM_OR_FRAUD,
    SELF_HARM,
    INTELLECTUAL_PROPERTY_VIOLATION,
    OFF_TOPIC_OR_DISRUPTIVE,
    FAKE_ACCOUNT_OR_IMPERSONATION,
    MISLEADING_CREDENTIALS_OR_AFFILIATION,
    INAPPROPRIATE_PROFILE_CONTENT,
    OTHER
}
