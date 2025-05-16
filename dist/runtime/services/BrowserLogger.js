export const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
  help: 7,
  data: 8,
  prompt: 9,
  input: 10
};
const levelColors = {
  error: "color: #fb2c36",
  // Red
  warn: "color: #ff6900",
  // Orange
  info: "color: #8ec5ff",
  // Blue
  http: "color: #1f1f1f",
  // Teal
  verbose: "color: #800080",
  // Purple
  debug: "color: #c27aff",
  // Gray
  silly: "color: #05df72",
  // Green
  help: "color: #FFC0CB",
  data: "color: #FFD700",
  prompt: "color: #C0C0C0",
  input: "color: #FFFFFF"
};
export class BrowserLogger {
  level;
  defaultContext;
  includeStackTrace;
  stackTraceLimit;
  /**
   * Creates a new browser-compatible logger instance
   * @param options Configuration options for the logger
   * @param options.level The log level to use for the logger
   * @param options.defaultContext Additional metadata to include in log messages
   * @param options.includeStackTrace Whether to include stack traces in log messages
   * @param options.stackTraceLimit Maximum number of stack frames to include (default: 10)
   */
  constructor(options) {
    this.level = options?.level ?? "info";
    this.defaultContext = options?.defaultContext || [];
    this.includeStackTrace = options?.includeStackTrace ?? false;
    this.stackTraceLimit = options?.stackTraceLimit ?? 10;
  }
  /**
   * Captures and formats the current stack trace
   * @returns A formatted stack trace string
   */
  captureStackTrace() {
    if (!this.includeStackTrace) {
      return void 0;
    }
    try {
      const err = new Error();
      const stack = err.stack;
      if (!stack) {
        return void 0;
      }
      const stackLines = stack.split("\n").slice(2).filter(
        (line) => !line.includes("at BrowserLogger.") || line.includes("at BrowserLogger.log")
      ).slice(1, this.stackTraceLimit + 1);
      if (stackLines.length === 0) {
        return void 0;
      }
      return stackLines.map((line) => line.trim()).join("\n");
    } catch (e) {
      return void 0;
    }
  }
  /**
   * Creates a formatted message with timestamp
   * @param level Log level
   * @param message Message content
   * @param meta Additional metadata or context
   * @returns Formatted log objects for console output
   */
  formatLog(level, message, meta) {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    let context = {};
    if (meta && meta.length > 0) {
      meta.forEach((item) => {
        if (item && typeof item === "object") {
          context = { ...context, ...item };
        }
      });
    }
    const combinedContext = {
      ...this.defaultContext
    };
    Object.keys(context).forEach((key) => {
      combinedContext[key] = context[key];
    });
    const stackTrace = this.captureStackTrace();
    if (stackTrace) {
      combinedContext.stackTrace = stackTrace;
    }
    const formattedMessage = `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
    return [formattedMessage, combinedContext];
  }
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
  log(levelOrEntry, messageOrObject, ...meta) {
    if (typeof levelOrEntry === "object" && levelOrEntry !== null) {
      const entry = levelOrEntry;
      const level2 = entry.level;
      const message2 = String(entry.message ?? "[Object]");
      if (!this.isLevelEnabled(level2)) {
        return this;
      }
      const { level: _, message: __, ...entryMeta } = entry;
      return this.logToConsole(level2, message2, [entryMeta]);
    }
    const level = levelOrEntry;
    if (!this.isLevelEnabled(level)) {
      return this;
    }
    if (typeof messageOrObject === "object" && messageOrObject !== null) {
      return this.logToConsole(
        level,
        JSON.stringify(messageOrObject),
        meta
      );
    }
    const message = String(messageOrObject ?? "");
    return this.logToConsole(level, message, meta);
  }
  /**
   * Internal method to perform the actual console logging
   * @param level Log level
   * @param message Message string
   * @param meta Additional metadata
   * @returns The logger instance for chaining
   */
  logToConsole(level, message, meta) {
    const [formattedMessage, combinedContext] = this.formatLog(
      level,
      message,
      meta
    );
    const hasContext = Object.keys(combinedContext).length > 0;
    switch (level) {
      case "error":
        if (hasContext) {
          console.error(
            `%c${formattedMessage}`,
            levelColors.error,
            combinedContext
          );
        } else {
          console.error(`%c${formattedMessage}`, levelColors.error);
        }
        break;
      case "warn":
        if (hasContext) {
          console.warn(
            `%c${formattedMessage}`,
            levelColors.warn,
            combinedContext
          );
        } else {
          console.warn(`%c${formattedMessage}`, levelColors.warn);
        }
        break;
      default:
        if (hasContext) {
          console.log(
            `%c${formattedMessage}`,
            levelColors[level] || "color: inherit",
            combinedContext
          );
        } else {
          console.log(
            `%c${formattedMessage}`,
            levelColors[level] || "color: inherit"
          );
        }
    }
    return this;
  }
  // Simplified convenience methods for different log levels
  /**
   * Log an error message
   * @param messageOrObject Message content or object
   * @param meta Optional metadata
   * @returns The logger instance for chaining
   */
  error(messageOrObject, ...meta) {
    return this.log("error", messageOrObject, ...meta);
  }
  /**
   * Log a warning message
   * @param messageOrObject Message content or object
   * @param meta Optional metadata
   * @returns The logger instance for chaining
   */
  warn(messageOrObject, ...meta) {
    return this.log("warn", messageOrObject, ...meta);
  }
  /**
   * Log an info message
   * @param messageOrObject Message content or object
   * @param meta Optional metadata
   * @returns The logger instance for chaining
   */
  info(messageOrObject, ...meta) {
    return this.log("info", messageOrObject, ...meta);
  }
  /**
   * Log an HTTP message
   * @param messageOrObject Message content or object
   * @param meta Optional metadata
   * @returns The logger instance for chaining
   */
  http(messageOrObject, ...meta) {
    return this.log("http", messageOrObject, ...meta);
  }
  /**
   * Log a verbose message
   * @param messageOrObject Message content or object
   * @param meta Optional metadata
   * @returns The logger instance for chaining
   */
  verbose(messageOrObject, ...meta) {
    return this.log("verbose", messageOrObject, ...meta);
  }
  /**
   * Log a debug message
   * @param messageOrObject Message content or object
   * @param meta Optional metadata
   * @returns The logger instance for chaining
   */
  debug(messageOrObject, ...meta) {
    return this.log("debug", messageOrObject, ...meta);
  }
  /**
   * Log a silly message
   * @param messageOrObject Message content or object
   * @param meta Optional metadata
   * @returns The logger instance for chaining
   */
  silly(messageOrObject, ...meta) {
    return this.log("silly", messageOrObject, ...meta);
  }
  /**
   * Log a help message
   * @param messageOrObject Message content or object
   * @param meta Optional metadata
   * @returns The logger instance for chaining
   */
  help(messageOrObject, ...meta) {
    return this.log("help", messageOrObject, ...meta);
  }
  /**
   * Log data information
   * @param messageOrObject Message content or object
   * @param meta Optional metadata
   * @returns The logger instance for chaining
   */
  data(messageOrObject, ...meta) {
    return this.log("data", messageOrObject, ...meta);
  }
  /**
   * Log prompt information
   * @param messageOrObject Message content or object
   * @param meta Optional metadata
   * @returns The logger instance for chaining
   */
  prompt(messageOrObject, ...meta) {
    return this.log("prompt", messageOrObject, ...meta);
  }
  /**
   * Log input information
   * @param messageOrObject Message content or object
   * @param meta Optional metadata
   * @returns The logger instance for chaining
   */
  input(messageOrObject, ...meta) {
    return this.log("input", messageOrObject, ...meta);
  }
  /**
   * Set the logging level for this logger instance
   * @param level New log level
   */
  setLevel(level) {
    this.level = level;
  }
  /**
   * Add persistent context data to all logs from this logger
   * @param context Context object to merge with all logs
   * @returns The logger instance for chaining
   */
  addContext(context) {
    this.defaultContext = { ...this.defaultContext, ...context };
    return this;
  }
  /**
   * Create a child logger with additional default context
   * @param options Additional context for the child logger
   * @returns A new logger instance with combined context
   */
  child(options) {
    return new BrowserLogger({
      level: this.level,
      defaultContext: { ...this.defaultContext, ...options },
      includeStackTrace: this.includeStackTrace,
      stackTraceLimit: this.stackTraceLimit
    });
  }
  /**
   * Clear the logger (not applicable in browser environment)
   * @returns The logger instance for chaining
   */
  clear() {
    return this;
  }
  /**
   * Close the logger (not applicable in browser environment)
   * @returns The logger instance for chaining
   */
  close() {
    return this;
  }
  /**
   * Start a timer (not implemented in browser environment)
   * @throws NotImplementedError
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  startTimer() {
    throw new Error("startTimer is not implemented in browser environment");
  }
  /**
   * Profile execution time (not implemented in browser environment)
   * @throws Error
   */
  profile(_, __) {
    throw new Error("profile is not implemented in browser environment");
  }
  /**
   * Public method to check if a log level is enabled
   * @param level The log level to check
   * @returns True if the level should be logged, false otherwise
   */
  isLevelEnabled(level) {
    return level in logLevels && logLevels[level] <= logLevels[this.level];
  }
  /**
   * Check if error level is enabled
   * @returns True if error logs are enabled
   */
  isErrorEnabled() {
    return this.isLevelEnabled("error");
  }
  /**
   * Check if warn level is enabled
   * @returns True if warn logs are enabled
   */
  isWarnEnabled() {
    return this.isLevelEnabled("warn");
  }
  /**
   * Check if info level is enabled
   * @returns True if info logs are enabled
   */
  isInfoEnabled() {
    return this.isLevelEnabled("info");
  }
  /**
   * Check if verbose level is enabled
   * @returns True if verbose logs are enabled
   */
  isVerboseEnabled() {
    return this.isLevelEnabled("verbose");
  }
  /**
   * Check if debug level is enabled
   * @returns True if debug logs are enabled
   */
  isDebugEnabled() {
    return this.isLevelEnabled("debug");
  }
  /**
   * Check if silly level is enabled
   * @returns True if silly logs are enabled
   */
  isSillyEnabled() {
    return this.isLevelEnabled("silly");
  }
  /**
   * Enable stack trace in log messages
   * @param limit Optional number of stack frames to include (default: keeps current setting)
   * @returns The logger instance for chaining
   */
  enableStackTrace(limit) {
    this.includeStackTrace = true;
    if (limit !== void 0) {
      this.stackTraceLimit = limit;
    }
    return this;
  }
  /**
   * Disable stack trace in log messages
   * @returns The logger instance for chaining
   */
  disableStackTrace() {
    this.includeStackTrace = false;
    return this;
  }
  /**
   * Set the maximum number of stack frames to include in stack traces
   * @param limit Maximum number of stack frames to include
   * @returns The logger instance for chaining
   */
  setStackTraceLimit(limit) {
    this.stackTraceLimit = limit;
    return this;
  }
}
