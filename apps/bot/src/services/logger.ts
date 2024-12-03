import winston from "winston";
import path from "path";

// Get log level from environment variable, default to 'info'
const logLevel = (process.env.LOG_LEVEL || "info").toLowerCase();

// Check if we're in test environment
const isTest = process.env.NODE_ENV === "test";

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

// Create transports array based on environment
const transports = isTest
  ? [] // No transports in test mode
  : [
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
    ];

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
  transports,
  silent: isTest, // This will completely silence the logger in test mode
});

// Create wrapper with automatic caller info
export const logger = {
  error: (message: string, metadata: Record<string, any> = {}) => {
    if (!isTest) baseLogger.error(message, { ...getCallerInfo(), ...metadata });
  },
  warn: (message: string, metadata: Record<string, any> = {}) => {
    if (!isTest) baseLogger.warn(message, { ...getCallerInfo(), ...metadata });
  },
  info: (message: string, metadata: Record<string, any> = {}) => {
    if (!isTest) baseLogger.info(message, { ...getCallerInfo(), ...metadata });
  },
  debug: (message: string, metadata: Record<string, any> = {}) => {
    if (!isTest) baseLogger.debug(message, { ...getCallerInfo(), ...metadata });
  },
};
