import { getWinstonLogger } from "../../services/winstonLogger.server.js";
export function getEventLogger(event) {
  if (!event.context.logger) {
    event.context.logger = getWinstonLogger();
  }
  return event.context.logger;
}
