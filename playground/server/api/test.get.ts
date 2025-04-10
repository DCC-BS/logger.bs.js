export default defineEventHandler(async (event) => {
	const logger = getEventLogger(event);
	logger.info("Test event received");
	logger.warn("This is a warning message");
	logger.error("Test event received");

	throw new Error("Test error");
});
