import type { ILogger } from "./ILogger.js";
/**
 * Get or create a logger with the specified name
 * @param name Logger name/category
 * @returns A logger instance
 */
export declare function getBrowserLogger(name?: string): ILogger;
