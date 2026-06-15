/**
 * Centralized Google Labs API Endpoints
 * All API URLs in one place for easy maintenance
 */

export const LABS_BASE_URL = process.env.LABS_BASE_URL || "https://aisandbox-pa.googleapis.com";

export const LABS_ENDPOINTS = {
  // Video Generation
  VIDEO_TEXT: "/v1/video:batchAsyncGenerateVideoText",
  VIDEO_START_IMAGE: "/v1/video:batchAsyncGenerateVideoStartImage",
  VIDEO_START_END_IMAGE: "/v1/video:batchAsyncGenerateVideoStartAndEndImage",
  VIDEO_EXTEND: "/v1/video:batchAsyncGenerateVideoExtendVideo",
  VIDEO_OBJECT_REMOVAL: "/v1/video:batchAsyncGenerateVideoObjectRemoval",
  
  // Status Checking
  CHECK_STATUS_OPS: "/v1/operations:batchCheckAsyncVideoGenerationStatus",
  CHECK_STATUS_VIDEO: "/v1/video:batchCheckAsyncVideoGenerationStatus",
  
  // Media Upload
  UPLOAD_IMAGE: "/v1:uploadUserImage",
  USER_MEDIA: "/v1/userMedia:create",
  
  // Image Generation
  IMAGE_GENERATE: "/v1/imagen:batchAsyncGenerateImage",
};

/**
 * Get full URL for a Labs endpoint
 * @param {string} endpoint - Key from LABS_ENDPOINTS or relative path
 * @returns {string} Full URL
 */
export function getLabsUrl(endpoint) {
  // If it's a key in LABS_ENDPOINTS, use that
  if (LABS_ENDPOINTS[endpoint]) {
    return LABS_BASE_URL + LABS_ENDPOINTS[endpoint];
  }
  // Otherwise assume it's a path
  return LABS_BASE_URL + endpoint;
}

/**
 * Default URLs for common operations
 */
export const DEFAULT_URLS = {
  generate: getLabsUrl("VIDEO_TEXT"),
  checkStatus: getLabsUrl("CHECK_STATUS_OPS"),
  uploadImage: getLabsUrl("UPLOAD_IMAGE"),
};

export default {
  LABS_BASE_URL,
  LABS_ENDPOINTS,
  getLabsUrl,
  DEFAULT_URLS,
};
