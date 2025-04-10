import {
	type MockedFunction,
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";
import { BrowserLogger } from "../src/runtime/services/BrowserLogger";

describe("BrowserLogger", () => {
	// Create console mocks
	const originalConsole = { ...console };
	const consoleMock = {
		log: vi.fn(),
		error: vi.fn(),
		warn: vi.fn(),
		info: vi.fn(),
	};

	// Setup and teardown
	beforeEach(() => {
		// Mock console methods before each test
		console.log = consoleMock.log;
		console.error = consoleMock.error;
		console.warn = consoleMock.warn;

		// Reset mock call history
		vi.clearAllMocks();
	});

	afterEach(() => {
		// Restore original console methods after each test
		console.log = originalConsole.log;
		console.error = originalConsole.error;
		console.warn = originalConsole.warn;
	});

	// Helper to get the first argument of the mock call
	const getFirstCallArg = (
		mockFn: MockedFunction<(...args: unknown[]) => unknown>,
	) => {
		return mockFn.mock.calls[0]?.[0];
	};

	describe("initialization", () => {
		it("should initialize with default options", () => {
			// Create logger with defaults
			const logger = new BrowserLogger();

			// Check default level is 'info'
			expect(logger["level"]).toBe("info");
			expect(logger["defaultContext"]).toEqual([]);
		});

		it("should initialize with custom options", () => {
			// Create logger with custom options
			const logger = new BrowserLogger({
				level: "debug",
				defaultContext: [{ app: "test-app" }],
			});

			// Verify the options were applied
			expect(logger["level"]).toBe("debug");
			expect(logger["defaultContext"]).toEqual([{ app: "test-app" }]);
		});
	});

	describe("log methods", () => {
		it("should log messages with the correct level", () => {
			const logger = new BrowserLogger();

			logger.info("Info message");
			logger.error("Error message");
			logger.warn("Warning message");

			// Check that console methods were called with appropriate formatting
			expect(consoleMock.log).toHaveBeenCalledTimes(1);
			expect(getFirstCallArg(consoleMock.log)).toMatch(
				/%c\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z\] \[INFO\]: Info message/,
			);

			expect(consoleMock.error).toHaveBeenCalledTimes(1);
			expect(getFirstCallArg(consoleMock.error)).toMatch(
				/%c\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z\] \[ERROR\]: Error message/,
			);

			expect(consoleMock.warn).toHaveBeenCalledTimes(1);
			expect(getFirstCallArg(consoleMock.warn)).toMatch(
				/%c\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z\] \[WARN\]: Warning message/,
			);
		});

		it("should respect log level filtering", () => {
			// Create logger with 'warn' level - should only show warn and error
			const logger = new BrowserLogger({ level: "warn" });

			logger.info("This should not be logged");
			logger.warn("This warning should be logged");
			logger.error("This error should be logged");

			// Info shouldn't be logged
			expect(consoleMock.log).not.toHaveBeenCalled();

			// Warn and error should be logged
			expect(consoleMock.warn).toHaveBeenCalledTimes(1);
			expect(consoleMock.error).toHaveBeenCalledTimes(1);
		});

		it("should handle objects as message", () => {
			const logger = new BrowserLogger();
			const testObj = { name: "Test Object", value: 42 };

			logger.info(testObj);

			// Check that the object was stringified
			expect(consoleMock.log).toHaveBeenCalledTimes(1);
			expect(getFirstCallArg(consoleMock.log)).toContain(
				'{"name":"Test Object","value":42}',
			);
		});

		it("should pass context metadata to console", () => {
			const logger = new BrowserLogger();

			logger.info("Message with context", { userId: 123, action: "login" });

			// Verify context is passed as the third argument
			expect(consoleMock.log).toHaveBeenCalledTimes(1);
			expect(consoleMock.log.mock.calls[0][2]).toEqual({
				userId: 123,
				action: "login",
			});
		});

		it("should handle object entry format", () => {
			const logger = new BrowserLogger();

			logger.log({
				level: "error",
				message: "Error from object entry",
				userId: 456,
			});

			expect(consoleMock.error).toHaveBeenCalledTimes(1);
			expect(getFirstCallArg(consoleMock.error)).toContain(
				"[ERROR]: Error from object entry",
			);
			expect(consoleMock.error.mock.calls[0][2]).toEqual({ userId: 456 });
		});
	});

	describe("utility methods", () => {
		it("should correctly identify enabled log levels", () => {
			const logger = new BrowserLogger({ level: "info" });

			// These should be enabled at info level
			expect(logger.isErrorEnabled()).toBe(true);
			expect(logger.isWarnEnabled()).toBe(true);
			expect(logger.isInfoEnabled()).toBe(true);

			// These should be disabled at info level
			expect(logger.isVerboseEnabled()).toBe(false);
			expect(logger.isDebugEnabled()).toBe(false);
			expect(logger.isSillyEnabled()).toBe(false);

			// Check generic isLevelEnabled method
			expect(logger.isLevelEnabled("error")).toBe(true);
			expect(logger.isLevelEnabled("debug")).toBe(false);
		});

		it("should change log level with setLevel", () => {
			const logger = new BrowserLogger({ level: "info" });

			// Initially debug should be disabled
			expect(logger.isDebugEnabled()).toBe(false);

			// Change level to debug
			logger.setLevel("debug");

			// Now debug should be enabled
			expect(logger.isDebugEnabled()).toBe(true);
		});

		it("should merge context with addContext", () => {
			const logger = new BrowserLogger();

			logger.addContext({ app: "test-app" });
			logger.info("Message with default context");

			// Check the context was added
			expect(consoleMock.log).toHaveBeenCalledTimes(1);
			expect(consoleMock.log.mock.calls[0][2]).toEqual({ app: "test-app" });
		});

		it("should create child logger with combined context", () => {
			const parent = new BrowserLogger({ level: "debug" });
			parent.addContext({ app: "parent-app" });

			const child = parent.child({ component: "child-component" });
			child.info("Child logger message");

			// Child logger should have both contexts
			expect(consoleMock.log).toHaveBeenCalledTimes(1);
			expect(consoleMock.log.mock.calls[0][2]).toEqual({
				app: "parent-app",
				component: "child-component",
			});
		});
	});

	describe("error handling", () => {
		it("should throw NotImplementedError for unsupported methods", () => {
			const logger = new BrowserLogger();

			// These methods should throw Error
			expect(() => logger.startTimer()).toThrow(Error);
			expect(() => logger.profile("test")).toThrow(Error);
		});
	});
});
