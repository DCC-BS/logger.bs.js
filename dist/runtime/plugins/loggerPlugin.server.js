import { defineNuxtPlugin } from "#app";
export default defineNuxtPlugin(async (nuxtApp) => {
  const { getWinstonLogger } = await import("../services/winstonLogger.server.js");
  const logger = getWinstonLogger();
  nuxtApp.provide("logger", logger);
});
