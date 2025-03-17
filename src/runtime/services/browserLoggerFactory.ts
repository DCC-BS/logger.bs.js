import { BrowserLogger, type LogLevel } from "./BrowserLogger";
import type { ILogger } from "./ILogger";

// Store loggers by name for reuse
const loggers: Record<string, BrowserLogger> = {};

/**
 * Get or create a logger with the specified name
 * @param name Logger name/category
 * @param options Optional configuration for new loggers
 * @returns A logger instance
 */
export function getBrowserLogger(name?: string, options?: { level?: LogLevel; meta: any[] }): ILogger {
    const loggername = name ?? 'default';
    if (!loggers[loggername]) {
        // Create a new logger with the specified name in the context
        loggers[loggername] = new BrowserLogger({
            level: options?.level ?? 'info',
            defaultContext: options?.meta || [],
        });
    }

    return loggers[loggername];
}