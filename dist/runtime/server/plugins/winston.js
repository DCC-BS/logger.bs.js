import { defineNitroPlugin } from "#imports";
import { getWinstonLogger } from "../../services/winstonLogger.server.js";
export default defineNitroPlugin((nitroApp) => {
  const logger = getWinstonLogger();
  nitroApp.hooks.hook("error", (error) => {
    logger.error("An error occurred:", error);
  });
  nitroApp.hooks.hook("request", (event) => {
    event.context.logger = logger;
  });
  logger.info("Winston logger initialized");
});
