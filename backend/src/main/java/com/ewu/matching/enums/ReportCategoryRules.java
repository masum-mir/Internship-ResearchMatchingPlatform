package com.ewu.matching.enums;

import java.util.EnumMap;
import java.util.EnumSet;
import java.util.Map;
import java.util.Set;

/**
 * Which {@link ReportCategory} values are legal for each {@link ReportTargetType}.
 * A report against a comment shouldn't offer "intellectual property violation" as
 * a reason, and a report against a profile shouldn't offer "off-topic" — so this
 * is the backend-enforced source of truth. The frontend's reportCategories.js
 * mirrors these lists (with friendlier labels/hints per context); keep both in
 * sync when a category is added, removed, or moved between target types.
 */
public final class ReportCategoryRules {

    private static final Map<ReportTargetType, Set<ReportCategory>> ALLOWED = new EnumMap<>(ReportTargetType.class);

    static {
        // A public post can carry media/links, so it's the only target where an
        // IP claim makes sense; it's also the one place "false information" and
        // "hate speech" are worth their own top-level options.
        ALLOWED.put(ReportTargetType.POST, EnumSet.of(
                ReportCategory.SPAM,
                ReportCategory.HARASSMENT_OR_BULLYING,
                ReportCategory.HATE_SPEECH,
                ReportCategory.VIOLENCE_OR_DANGEROUS_ORGANIZATIONS,
                ReportCategory.NUDITY_OR_SEXUAL_CONTENT,
                ReportCategory.FALSE_INFORMATION,
                ReportCategory.SCAM_OR_FRAUD,
                ReportCategory.SELF_HARM,
                ReportCategory.INTELLECTUAL_PROPERTY_VIOLATION,
                ReportCategory.OTHER));

        // Comments are short replies in an existing thread — the categories that
        // matter are conduct within that thread, not standalone content claims
        // like IP violation.
        ALLOWED.put(ReportTargetType.COMMENT, EnumSet.of(
                ReportCategory.SPAM,
                ReportCategory.HARASSMENT_OR_BULLYING,
                ReportCategory.HATE_SPEECH,
                ReportCategory.NUDITY_OR_SEXUAL_CONTENT,
                ReportCategory.FALSE_INFORMATION,
                ReportCategory.SELF_HARM,
                ReportCategory.OFF_TOPIC_OR_DISRUPTIVE,
                ReportCategory.OTHER));

        // DMs are private and 1:1, so the concerns shift toward unwanted
        // contact and personal safety rather than public-content issues like
        // hate speech or IP.
        ALLOWED.put(ReportTargetType.MESSAGE, EnumSet.of(
                ReportCategory.SPAM,
                ReportCategory.HARASSMENT_OR_BULLYING,
                ReportCategory.VIOLENCE_OR_DANGEROUS_ORGANIZATIONS,
                ReportCategory.UNWANTED_SEXUAL_ADVANCES,
                ReportCategory.SCAM_OR_FRAUD,
                ReportCategory.SELF_HARM,
                ReportCategory.FAKE_ACCOUNT_OR_IMPERSONATION,
                ReportCategory.OTHER));

        // A profile isn't a single piece of content — the concerns are about
        // the account itself: is it who it claims to be, and is it safe to
        // trust on a platform built around internships and research.
        ALLOWED.put(ReportTargetType.PROFILE, EnumSet.of(
                ReportCategory.FAKE_ACCOUNT_OR_IMPERSONATION,
                ReportCategory.MISLEADING_CREDENTIALS_OR_AFFILIATION,
                ReportCategory.INAPPROPRIATE_PROFILE_CONTENT,
                ReportCategory.HARASSMENT_OR_BULLYING,
                ReportCategory.HATE_SPEECH,
                ReportCategory.SCAM_OR_FRAUD,
                ReportCategory.OTHER));
    }

    private ReportCategoryRules() {
    }

    public static boolean isAllowed(ReportTargetType type, ReportCategory category) {
        return ALLOWED.getOrDefault(type, Set.of()).contains(category);
    }

    public static Set<ReportCategory> allowedFor(ReportTargetType type) {
        return ALLOWED.getOrDefault(type, Set.of());
    }
}
