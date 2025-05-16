/**
 * Server middleware that logs information about incoming requests
 * Logs all requests in development mode, but only failed requests in production
 *
 * @param event - The H3 event object containing request information
 */
declare const _default: import("h3").EventHandler<import("h3").EventHandlerRequest, Promise<void>>;
export default _default;
