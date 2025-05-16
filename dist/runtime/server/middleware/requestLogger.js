import { defineEventHandler, getRequestHeader } from "h3";
import { getEventLogger } from "../utils/eventLogger.js";
const logAllRequest = false;
export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const url = event.node.req.url;
  const remoteAddress = event.node.req.socket.remoteAddress;
  const userAgent = getRequestHeader(event, "user-agent");
  const logger = getEventLogger(event);
  const requestInfo = {
    method,
    url,
    remoteAddress,
    userAgent,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
  if (logAllRequest) {
    logger.info("Incoming request", requestInfo);
    return;
  }
  event.node.res.on("finish", () => {
    const statusCode = event.node.res.statusCode;
    if (statusCode >= 400) {
      logger.error(`Failed request (${statusCode})`, {
        ...requestInfo,
        statusCode
      });
    }
  });
});
