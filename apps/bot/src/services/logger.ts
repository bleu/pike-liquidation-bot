import winston from "winston";
const { createLogger, format, transports } = winston;

// Create the logger with all configurations
const baseLogger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    // Write all errors to error log
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  ],
  silent: process.env.NODE_ENV === "test",
});

// Export logger and additional utility functions
export const logger = {
  // Base logger methods
  log: (level: string, message: any, ...meta: any[]) => {
    baseLogger.log(level, message, ...meta);
  },
  info: (message: any, ...meta: any[]) => {
    baseLogger.info(message, ...meta);
  },
  warn: (message: any, ...meta: any[]) => {
    baseLogger.warn(message, ...meta);
  },
  error: (message: any, ...meta: any[]) => {
    baseLogger.error(message, ...meta);
  },
  debug: (message: any, ...meta: any[]) => {
    baseLogger.debug(message, ...meta);
  },
};
