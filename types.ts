export enum Platform {
  Instagram = 'Instagram',
  Twitter = 'Twitter',
  Facebook = 'Facebook',
  LinkedIn = 'LinkedIn',
  TikTok = 'TikTok',
}

export enum AppStep {
  // FIX: Corrected typo in enum member name from SELECT_PLATPLATFORM to SELECT_PLATFORM.
  SELECT_PLATFORM,
  PROVIDE_CONTEXT, // New step for first-time context entry
  ENTER_TOPIC,
  GENERATING,
  SHOW_RESULTS,
  SHOW_SAVED,
  SHOW_CALENDAR,
  EDIT_BRAND_CONTEXT, // New step for editing the context
}

export interface PostSuggestion {
  caption: string;
  imageSuggestion: string;
  hashtags: string[];
}

export interface SavedPost extends PostSuggestion {
  id: string;
  platform: Platform;
  handle: string;
  topic: string;
  savedAt: string;
  scheduledFor?: string; // Full ISO 8601 datetime string (e.g., "2024-12-31T10:00:00.000Z")
}

export interface BrandContext {
  brandName: string;
  bio: string;
  postExamples: string[];
  brandVoice: string;
}