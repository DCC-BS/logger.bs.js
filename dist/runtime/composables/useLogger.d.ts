import type { ILogger } from "../services/ILogger.js";
/**
 * Composable to access the logger throughout the application
 *
 * @returns The Winston logger instance
 */
export declare function useLogger(): ILogger;
