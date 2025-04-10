import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createLogger, format, transports } from "winston";
import {
	getDevelopmentLogger,
	getProductionLogger,
} from "../src/runtime/services/winstonLogger.server";

// Mock winston
vi.mock("winston", () => {
	// Create spy implementations
	const createLoggerMock = vi.fn().mockReturnValue({
		info: vi.fn(),
		error: vi.fn(),
		warn: vi.fn(),
		debug: vi.fn(),
		verbose: vi.fn(),
		log: vi.fn(),
	});

	return {
		createLogger: createLoggerMock,
		format: {
			combine: vi.fn(),
			timestamp: vi.fn(),
			logstash: vi.fn(),
			simple: vi.fn(),
		},
		transports: {
			Console: vi.fn(),
			File: vi.fn(),
		},
	};
});

// Mock path
vi.mock("path", () => {
	return {
		default: {
			resolve: vi.fn().mockReturnValue("/mock/path/logs"),
			join: vi.fn().mockImplementation((dir, file) => `${dir}/${file}`),
		},
		resolve: vi.fn().mockReturnValue("/mock/path/logs"),
		join: vi.fn().mockImplementation((dir, file) => `${dir}/${file}`),
	};
});

// Mock import.meta.server
vi.stubGlobal("import", {
	meta: {
		server: true,
	},
});

describe("winstonLogger.server", () => {
	// Store original environment
	const originalEnv = process.env.NODE_ENV;

	// Setup/teardown
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		// Restore original environment
		process.env.NODE_ENV = originalEnv;
	});

	describe("getProductionLogger", () => {
		it("should create a logger with production configuration", () => {
			// Call the function
			getProductionLogger();

			// Verify winston's createLogger was called with expected parameters
			expect(createLogger).toHaveBeenCalledTimes(1);

			// Verify format configuration
			expect(format.timestamp).toHaveBeenCalled();
			expect(format.logstash).toHaveBeenCalled();
			expect(format.combine).toHaveBeenCalled();

			// Verify transports
			expect(transports.Console).toHaveBeenCalledTimes(1);
			expect(transports.File).toHaveBeenCalledTimes(2);

			// Verify error log configuration
			expect(transports.File).toHaveBeenCalledWith(
				expect.objectContaining({
					level: "error",
					filename: "/var/log/error.log",
				}),
			);
		});
	});

	describe("getDevelopmentLogger", () => {
		it("should throw an error when running on client side", () => {
			// Mock import.meta.server as false to simulate client side
			vi.stubGlobal("import", {
				meta: {
					server: false,
				},
			});

			// Expect error when running on client side
			expect(() => getDevelopmentLogger()).toThrow(
				"Path module is not available on client side",
			);

			// Restore the server flag
			vi.stubGlobal("import", {
				meta: {
					server: true,
				},
			});
		});
	});
});
