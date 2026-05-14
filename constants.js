/**
 * Global constants for the application.
 * In a production environment, these should be moved to a .env file.
 */

export const SERVER_CONFIG = {
  PORT: process.env.PORT || 5000,
  HOST: process.env.HOST || "localhost",
};

export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const RESPONSE_MESSAGES = {
  SUCCESS: "success",
  FAIL: "fail",
  ERROR: "error",
};
