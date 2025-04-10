import { BrowserLogger, type LogLevel } from "./BrowserLogger";
import type { ILogger } from "./ILogger";

// Store loggers by name for reuse
const loggers: Record<string, BrowserLogger> = {};

interface LoggerOptions {
	loglevel?: LogLevel;
	meta?: unknown[];
}

/**
 * Get or create a logger with the specified name
 * @param name Logger name/category
 * @returns A logger instance
 */
export function getBrowserLogger(name?: string): ILogger {
	const loggername = name ?? "default";

	const config = useRuntimeConfig().public.logger_bs as LoggerOptions;

	if (!loggers[loggername]) {
		// Create a new logger with the specified name in the context
		loggers[loggername] = new BrowserLogger({
			level: config?.loglevel ?? "info",
			defaultContext: config?.meta || [],
		});
	}

	return loggers[loggername];
}
