import { defineNuxtPlugin } from "#app";
export default defineNuxtPlugin(async (nuxtApp) => {
  const logger = (await import("../services/browserLoggerFactory.js")).getBrowserLogger();
  nuxtApp.provide("logger", logger);
});
