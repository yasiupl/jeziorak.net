// Central configuration for weather thresholds
export const WIND_SPEED_MIN_KMH = 10;
export const WIND_SPEED_MAX_KMH = 30;
// export const CLOUD_COVER_MAX_PERCENT = 50; // Original simple threshold, replaced by graded scoring
export const PRECIPITATION_MAX_MM = 0;     // Hard limit, no rain
export const CAPE_MAX_JKG = 500;           // Hard limit, low risk of storm

// Temperature thresholds for scoring (°C)
// Cloud Cover thresholds (CLOUD_COVER_IDEAL_MAX_PERCENT, CLOUD_COVER_ACCEPTABLE_MAX_PERCENT) removed as cloud cover is no longer in algorithm.
export const TEMP_IDEAL_MIN_C = 18;
export const TEMP_IDEAL_MAX_C = 28;
export const TEMP_ACCEPTABLE_MIN_C = 15;
export const TEMP_ACCEPTABLE_MAX_C = 30;

// Weights for the weighted average score
// WEIGHT_CLOUD_COVER removed. WEIGHT_WIND and WEIGHT_TEMPERATURE adjusted to sum to 1.0.
export const WEIGHT_WIND = 0.5; // Wind quality (assumed good if in range for now)
export const WEIGHT_TEMPERATURE = 0.5;

// Minimum weighted score (0 to 1) to decide "Pływamy!"
// Parameter scores: 0 (bad), 0.5 (acceptable), 1 (ideal)
export const SAILING_SCORE_THRESHOLD = 0.65; // e.g. average of "acceptable" leaning towards "good"