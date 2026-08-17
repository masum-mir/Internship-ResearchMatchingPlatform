// Mirrors backend enum com.ewu.matching.enums.ReportCategory — keep labels/hints
// here in sync with any new values added there.
const DEFINITIONS = {
  SPAM: { label: 'Spam', hint: 'Misleading, repetitive, or unwanted commercial content' },
  HARASSMENT_OR_BULLYING: { label: 'Harassment or bullying', hint: 'Targeting someone with abuse or intimidation' },
  HATE_SPEECH: { label: 'Hate speech', hint: 'Attacks based on identity, e.g. race, religion, gender' },
  VIOLENCE_OR_DANGEROUS_ORGANIZATIONS: { label: 'Violence or dangerous organizations', hint: 'Threats, incitement, or support for harmful groups' },
  NUDITY_OR_SEXUAL_CONTENT: { label: 'Nudity or sexual content', hint: '' },
  UNWANTED_SEXUAL_ADVANCES: { label: 'Unwanted sexual advances', hint: 'Sexual comments or propositions you didn\u2019t ask for' },
  FALSE_INFORMATION: { label: 'False information', hint: 'Misleading claims presented as fact' },
  SCAM_OR_FRAUD: { label: 'Scam or fraud', hint: 'Attempts to deceive for money or data' },
  SELF_HARM: { label: 'Self-harm', hint: 'Content that encourages or depicts self-harm' },
  INTELLECTUAL_PROPERTY_VIOLATION: { label: 'Intellectual property violation', hint: 'Unauthorized use of copyrighted or trademarked material' },
  OFF_TOPIC_OR_DISRUPTIVE: { label: 'Off-topic or disruptive', hint: 'Derailing the conversation rather than contributing to it' },
  FAKE_ACCOUNT_OR_IMPERSONATION: { label: 'Fake account or impersonation', hint: 'Pretending to be someone else, or not a real person' },
  MISLEADING_CREDENTIALS_OR_AFFILIATION: { label: 'Misleading credentials or affiliation', hint: 'False claims about a university, company, or title' },
  INAPPROPRIATE_PROFILE_CONTENT: { label: 'Inappropriate profile content', hint: 'Offensive photo, bio, or other profile content' },
  OTHER: { label: 'Something else', hint: '' }
};

// Which categories a reporter is offered depends on what they're reporting —
// mirrors backend ReportCategoryRules. Keep both in sync when a category is
// added, removed, or moved between target types.
const ALLOWED_BY_TARGET = {
  POST: [
    'SPAM', 'HARASSMENT_OR_BULLYING', 'HATE_SPEECH', 'VIOLENCE_OR_DANGEROUS_ORGANIZATIONS',
    'NUDITY_OR_SEXUAL_CONTENT', 'FALSE_INFORMATION', 'SCAM_OR_FRAUD', 'SELF_HARM',
    'INTELLECTUAL_PROPERTY_VIOLATION', 'OTHER'
  ],
  COMMENT: [
    'SPAM', 'HARASSMENT_OR_BULLYING', 'HATE_SPEECH', 'NUDITY_OR_SEXUAL_CONTENT',
    'FALSE_INFORMATION', 'SELF_HARM', 'OFF_TOPIC_OR_DISRUPTIVE', 'OTHER'
  ],
  MESSAGE: [
    'SPAM', 'HARASSMENT_OR_BULLYING', 'VIOLENCE_OR_DANGEROUS_ORGANIZATIONS', 'UNWANTED_SEXUAL_ADVANCES',
    'SCAM_OR_FRAUD', 'SELF_HARM', 'FAKE_ACCOUNT_OR_IMPERSONATION', 'OTHER'
  ],
  PROFILE: [
    'FAKE_ACCOUNT_OR_IMPERSONATION', 'MISLEADING_CREDENTIALS_OR_AFFILIATION', 'INAPPROPRIATE_PROFILE_CONTENT',
    'HARASSMENT_OR_BULLYING', 'HATE_SPEECH', 'SCAM_OR_FRAUD', 'OTHER'
  ]
};

// Back-compat flat list (every category, used only as a fallback/label lookup).
export const REPORT_CATEGORIES = Object.entries(DEFINITIONS).map(([value, def]) => ({ value, ...def }));

// The list to actually show in the report modal for a given target type.
export function reportCategoriesFor(targetType) {
  const values = ALLOWED_BY_TARGET[targetType] || ALLOWED_BY_TARGET.POST;
  return values.map((value) => ({ value, ...DEFINITIONS[value] }));
}

export function reportCategoryLabel(value) {
  return DEFINITIONS[value]?.label || value;
}
