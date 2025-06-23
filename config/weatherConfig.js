// Central configuration for weather thresholds
export const WIND_SPEED_MIN_KMH = 10;
export const WIND_SPEED_MAX_KMH = 30;
// export const CLOUD_COVER_MAX_PERCENT = 50; // Original simple threshold, replaced by graded scoring
export const PRECIPITATION_MAX_MM = 0;     // Hard limit, no rain
export const CAPE_MAX_JKG = 500;           // Hard limit, low risk of storm

// Cloud Cover thresholds for scoring
export const CLOUD_COVER_IDEAL_MAX_PERCENT = 50; // Ideal for "sunny"
export const CLOUD_COVER_ACCEPTABLE_MAX_PERCENT = 85; // Acceptable for sailing if other conditions are good

// Temperature thresholds for scoring (°C)
export const TEMP_IDEAL_MIN_C = 18;
export const TEMP_IDEAL_MAX_C = 28;
export const TEMP_ACCEPTABLE_MIN_C = 15;
export const TEMP_ACCEPTABLE_MAX_C = 30;

// Weights for the weighted average score
export const WEIGHT_WIND = 0.4; // Wind quality (assumed good if in range for now)
export const WEIGHT_CLOUD_COVER = 0.3;
export const WEIGHT_TEMPERATURE = 0.3;

// Minimum weighted score (0 to 1) to decide "Pływamy!"
// Parameter scores: 0 (bad), 0.5 (acceptable), 1 (ideal)
export const SAILING_SCORE_THRESHOLD = 0.65; // e.g. average of "acceptable" leaning towards "good"