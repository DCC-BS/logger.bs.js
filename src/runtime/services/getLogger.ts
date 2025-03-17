import type { ILogger } from './ILogger';

/**
 * Returns a new logger instance based on the current environment.
 * Uses appropriate logger implementation for server and client contexts.
 */
export async function getNewLogger(): Promise<ILogger> {
    if (import.meta.server) {
        const { getWinstonLogger } = await import('./winstonLogger.server');
        // Use Winston logger for server-side
        return getWinstonLogger();
    } else {
        // Use browser logger for client-side
        return (await import('./browserLoggerFactory')).getBrowserLogger();
    }
}