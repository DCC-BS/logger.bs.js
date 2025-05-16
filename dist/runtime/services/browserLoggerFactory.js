import { useRuntimeConfig } from "#imports";
import { BrowserLogger } from "./BrowserLogger.js";
const loggers = {};
export function getBrowserLogger(name) {
  const loggername = name ?? "default";
  const config = useRuntimeConfig().public.logger_bs;
  if (!loggers[loggername]) {
    loggers[loggername] = new BrowserLogger({
      level: config?.loglevel ?? "info",
      defaultContext: config?.meta || [],
      includeStackTrace: config?.includeStackTrace ?? true,
      stackTraceLimit: config?.stackTraceLimit ?? 10
    });
  }
  return loggers[loggername];
}
