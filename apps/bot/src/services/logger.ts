// src/services/logger.ts

import winston from "winston";
import path from "path";

// Get log level from environment variable, default to 'info'
const logLevel = (process.env.LOG_LEVEL || "info").toLowerCase();

// Custom format to include metadata
const customFormat = winston.format.printf(
  ({ level, message, timestamp, ...metadata }) => {
    let fileInfo = "";
    if (metadata.file) {
      fileInfo = `[${metadata.file}${
        metadata.class ? `::${metadata.class}` : ""
      }${metadata.function ? `::${metadata.function}` : ""}] `;
    }

    return `${timestamp} ${level
      .toUpperCase()
      .padEnd(7)} ${fileInfo}${message}`;
  }
);

// Helper function to get calling file and function names
const getCallerInfo = () => {
  const err = new Error();
  const stack = err.stack?.split("\n")[3]; // Get the caller's stack frame
  const caller =
    stack?.match(/at\s+(.*)\s+\((.*):(\d+):(\d+)\)/) ||
    stack?.match(/at\s+()(.*):(\d+):(\d+)/);

  if (!caller) return {};

  const [, fnName, filePath] = caller;
  return {
    file: path.basename(filePath || ""),
    function: fnName || "anonymous",
  };
};

// Create base logger
const baseLogger = winston.createLogger({
  level: logLevel,
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  },
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.metadata({ fillExcept: ["message", "level", "timestamp"] }),
    customFormat
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), customFormat),
    }),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});

// Create wrapper with automatic caller info
export const logger = {
  error: (message: string, metadata: Record<string, any> = {}) => {
    baseLogger.error(message, { ...getCallerInfo(), ...metadata });
  },
  warn: (message: string, metadata: Record<string, any> = {}) => {
    baseLogger.warn(message, { ...getCallerInfo(), ...metadata });
  },
  info: (message: string, metadata: Record<string, any> = {}) => {
    baseLogger.info(message, { ...getCallerInfo(), ...metadata });
  },
  debug: (message: string, metadata: Record<string, any> = {}) => {
    baseLogger.debug(message, { ...getCallerInfo(), ...metadata });
  },
};
