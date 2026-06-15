/**
 * Standardized error response helper
 * Ensures consistent error format across all API endpoints
 */

/**
 * Standard error codes for common scenarios
 */
export const ERROR_CODES = {
  // Auth errors
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  INVALID_TOKEN: "INVALID_TOKEN",
  SESSION_EXPIRED: "SESSION_EXPIRED",
  
  // Validation errors
  BAD_REQUEST: "BAD_REQUEST",
  MISSING_FIELD: "MISSING_FIELD",
  INVALID_INPUT: "INVALID_INPUT",
  
  // Resource errors
  NOT_FOUND: "NOT_FOUND",
  ALREADY_EXISTS: "ALREADY_EXISTS",
  
  // Rate limiting
  RATE_LIMITED: "RATE_LIMITED",
  QUOTA_EXCEEDED: "QUOTA_EXCEEDED",
  
  // Server errors
  INTERNAL_ERROR: "INTERNAL_ERROR",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  EXTERNAL_API_ERROR: "EXTERNAL_API_ERROR",
  
  // Business logic
  INSUFFICIENT_CREDITS: "INSUFFICIENT_CREDITS",
  PLAN_NOT_ALLOWED: "PLAN_NOT_ALLOWED",
  BEARER_EXPIRED: "BEARER_EXPIRED",
};

/**
 * Send standardized error response
 * @param {Response} res - Express response object
 * @param {number} status - HTTP status code
 * @param {string} message - Human-readable error message
 * @param {Object} options - Additional options
 * @param {string} options.code - Error code from ERROR_CODES
 * @param {any} options.detail - Additional error details
 * @returns {Response}
 */
export function errorResponse(res, status, message, options = {}) {
  const { code = null, detail = null, ...rest } = options;
  
  const body = {
    ok: false,
    error: message,
  };
  
  if (code) body.code = code;
  if (detail !== null) body.detail = detail;
  
  // Merge any additional fields
  Object.assign(body, rest);
  
  return res.status(status).json(body);
}

/**
 * Convenience methods for common error types
 */
export const errors = {
  badRequest: (res, message, detail = null) => 
    errorResponse(res, 400, message, { code: ERROR_CODES.BAD_REQUEST, detail }),
    
  unauthorized: (res, message = "Unauthorized") => 
    errorResponse(res, 401, message, { code: ERROR_CODES.UNAUTHORIZED }),
    
  forbidden: (res, message = "Forbidden") => 
    errorResponse(res, 403, message, { code: ERROR_CODES.FORBIDDEN }),
    
  notFound: (res, message = "Not found") => 
    errorResponse(res, 404, message, { code: ERROR_CODES.NOT_FOUND }),
    
  rateLimited: (res, message, remainingSeconds = null) => 
    errorResponse(res, 429, message, { 
      code: ERROR_CODES.RATE_LIMITED, 
      remainingSeconds 
    }),
    
  internal: (res, message = "Internal server error", detail = null) => 
    errorResponse(res, 500, message, { code: ERROR_CODES.INTERNAL_ERROR, detail }),
};

export default {
  ERROR_CODES,
  errorResponse,
  errors,
};
