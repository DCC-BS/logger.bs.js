/**
 * Custom Logger implementation that emulates Winston's API for browser environments
 */
import type { ILogger } from "./ILogger.js";
export declare const logLevels: {
    error: number;
    warn: number;
    info: number;
    http: number;
    verbose: number;
    debug: number;
    silly: number;
    help: number;
    data: number;
    prompt: number;
    input: number;
};
export type LogLevel = keyof typeof logLevels;
export type LogFunction = (message: string, context?: Record<string, unknown>) => void;
export type LogMeta = Record<string, unknown>;
/**
 * Browser-compatible logger class that supports structured logging
 * with a Winston-like API
 */
export declare class BrowserLogger implements ILogger {
    private level;
    private defaultContext;
    private includeStackTrace;
    private stackTraceLimit;
    /**
     * Creates a new browser-compatible logger instance
     * @param options Configuration options for the logger
     * @param options.level The log level to use for the logger
     * @param options.defaultContext Additional metadata to include in log messages
     * @param options.includeStackTrace Whether to include stack traces in log messages
     * @param options.stackTraceLimit Maximum number of stack frames to include (default: 10)
     */
    constructor(options?: {
        level?: LogLevel;
        defaultContext?: unknown[];
        includeStackTrace?: boolean;
        stackTraceLimit?: number;
    });
    /**
     * Captures and formats the current stack trace
     * @returns A formatted stack trace string
     */
    private captureStackTrace;
    /**
     * Creates a formatted message with timestamp
     * @param level Log level
     * @param message Message content
     * @param meta Additional metadata or context
     * @returns Formatted log objects for console output
     */
    private formatLog;
    /**
     * Log a message with the specified level
     * Supports multiple parameter variations:
     * - (level, message, ...meta)
     * - (entry: LogEntry)
     * - (level, object)
     *
     * @param levelOrEntry Log level string or LogEntry object
     * @param messageOrObject Message string or any object
     * @param meta Additional metadata
     * @returns The logger instance for chaining
     */
    log(levelOrEntry: string | Record<string, unknown>, messageOrObject?: unknown, ...meta: unknown[]): ILogger;
    /**
     * Internal method to perform the actual console logging
     * @param level Log level
     * @param message Message string
     * @param meta Additional metadata
     * @returns The logger instance for chaining
     */
    private logToConsole;
    /**
     * Log an error message
     * @param messageOrObject Message content or object
     * @param meta Optional metadata
     * @returns The logger instance for chaining
     */
    error(messageOrObject: string | object, ...meta: unknown[]): ILogger;
    /**
     * Log a warning message
     * @param messageOrObject Message content or object
     * @param meta Optional metadata
     * @returns The logger instance for chaining
     */
    warn(messageOrObject: string | object, ...meta: unknown[]): ILogger;
    /**
     * Log an info message
     * @param messageOrObject Message content or object
     * @param meta Optional metadata
     * @returns The logger instance for chaining
     */
    info(messageOrObject: string | object, ...meta: unknown[]): ILogger;
    /**
     * Log an HTTP message
     * @param messageOrObject Message content or object
     * @param meta Optional metadata
     * @returns The logger instance for chaining
     */
    http(messageOrObject: string | object, ...meta: unknown[]): ILogger;
    /**
     * Log a verbose message
     * @param messageOrObject Message content or object
     * @param meta Optional metadata
     * @returns The logger instance for chaining
     */
    verbose(messageOrObject: string | object, ...meta: unknown[]): ILogger;
    /**
     * Log a debug message
     * @param messageOrObject Message content or object
     * @param meta Optional metadata
     * @returns The logger instance for chaining
     */
    debug(messageOrObject: string | object, ...meta: unknown[]): ILogger;
    /**
     * Log a silly message
     * @param messageOrObject Message content or object
     * @param meta Optional metadata
     * @returns The logger instance for chaining
     */
    silly(messageOrObject: string | object, ...meta: unknown[]): ILogger;
    /**
     * Log a help message
     * @param messageOrObject Message content or object
     * @param meta Optional metadata
     * @returns The logger instance for chaining
     */
    help(messageOrObject: string | object, ...meta: unknown[]): ILogger;
    /**
     * Log data information
     * @param messageOrObject Message content or object
     * @param meta Optional metadata
     * @returns The logger instance for chaining
     */
    data(messageOrObject: string | object, ...meta: unknown[]): ILogger;
    /**
     * Log prompt information
     * @param messageOrObject Message content or object
     * @param meta Optional metadata
     * @returns The logger instance for chaining
     */
    prompt(messageOrObject: string | object, ...meta: unknown[]): ILogger;
    /**
     * Log input information
     * @param messageOrObject Message content or object
     * @param meta Optional metadata
     * @returns The logger instance for chaining
     */
    input(messageOrObject: string | object, ...meta: unknown[]): ILogger;
    /**
     * Set the logging level for this logger instance
     * @param level New log level
     */
    setLevel(level: LogLevel): void;
    /**
     * Add persistent context data to all logs from this logger
     * @param context Context object to merge with all logs
     * @returns The logger instance for chaining
     */
    addContext(context: LogMeta): this;
    /**
     * Create a child logger with additional default context
     * @param options Additional context for the child logger
     * @returns A new logger instance with combined context
     */
    child(options: object): this;
    /**
     * Clear the logger (not applicable in browser environment)
     * @returns The logger instance for chaining
     */
    clear(): this;
    /**
     * Close the logger (not applicable in browser environment)
     * @returns The logger instance for chaining
     */
    close(): this;
    /**
     * Start a timer (not implemented in browser environment)
     * @throws NotImplementedError
     */
    startTimer(): any;
    /**
     * Profile execution time (not implemented in browser environment)
     * @throws Error
     */
    profile(_: string | number, __?: Record<string, unknown>): this;
    /**
     * Public method to check if a log level is enabled
     * @param level The log level to check
     * @returns True if the level should be logged, false otherwise
     */
    isLevelEnabled(level: string): boolean;
    /**
     * Check if error level is enabled
     * @returns True if error logs are enabled
     */
    isErrorEnabled(): boolean;
    /**
     * Check if warn level is enabled
     * @returns True if warn logs are enabled
     */
    isWarnEnabled(): boolean;
    /**
     * Check if info level is enabled
     * @returns True if info logs are enabled
     */
    isInfoEnabled(): boolean;
    /**
     * Check if verbose level is enabled
     * @returns True if verbose logs are enabled
     */
    isVerboseEnabled(): boolean;
    /**
     * Check if debug level is enabled
     * @returns True if debug logs are enabled
     */
    isDebugEnabled(): boolean;
    /**
     * Check if silly level is enabled
     * @returns True if silly logs are enabled
     */
    isSillyEnabled(): boolean;
    /**
     * Enable stack trace in log messages
     * @param limit Optional number of stack frames to include (default: keeps current setting)
     * @returns The logger instance for chaining
     */
    enableStackTrace(limit?: number): this;
    /**
     * Disable stack trace in log messages
     * @returns The logger instance for chaining
     */
    disableStackTrace(): this;
    /**
     * Set the maximum number of stack frames to include in stack traces
     * @param limit Maximum number of stack frames to include
     * @returns The logger instance for chaining
     */
    setStackTraceLimit(limit: number): this;
}
