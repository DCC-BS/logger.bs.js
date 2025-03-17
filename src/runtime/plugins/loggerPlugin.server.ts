export default defineNuxtPlugin(async (nuxtApp) => {
    const { getWinstonLogger } = await import('../services/winstonLogger.server');
    // Use Winston logger for server-side
    const logger = getWinstonLogger();
    nuxtApp.provide('logger', logger);
});
