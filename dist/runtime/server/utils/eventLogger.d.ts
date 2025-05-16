import type { H3Event } from "h3";
import type { Logger } from "winston";
/**
 * Retrieves the logger from the event context or returns a new logger instance
 *
 * @param event - The H3 event object containing the context
 * @returns A Winston Logger instance
 */
export declare function getEventLogger(event: H3Event): Logger;
