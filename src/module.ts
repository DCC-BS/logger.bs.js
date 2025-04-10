import {
	addImportsDir,
	addPlugin,
	addServerHandler,
	addServerImportsDir,
	addServerPlugin,
	createResolver,
	defineNuxtModule,
} from "@nuxt/kit";
import type { LogLevel } from "./runtime/services/BrowserLogger";
import type { ILogger } from "./runtime/services/ILogger";

// Re-export types
export { type LogLevel, type ILogger };

interface LoggerOptions {
	loglevel?: LogLevel;
	meta?: unknown[];
}

export default defineNuxtModule<LoggerOptions>({
	meta: {
		name: "logger.bs.js",
		configKey: "logger.bs.js",
	},
	// Default configuration options of the Nuxt module
	defaults: {
		loglevel: "info",
		meta: [] as unknown[],
	},
	setup(_options, nuxt) {
		const resolver = createResolver(import.meta.url);

		nuxt.options.runtimeConfig.public.logger_bs = defu(
			nuxt.options.runtimeConfig.public.logger_bs!,
			{
				loglevel: _options.loglevel,
				meta: _options.meta,
			},
		);

		// Add build configuration to transpile the logger service
		// Using the resolver to get the absolute path ensures it works when the module is used in other projects
		nuxt.options.build = nuxt.options.build || {};
		nuxt.options.build.transpile = nuxt.options.build.transpile || [];
		nuxt.options.build.transpile.push(({ isServer }) => {
			if (isServer) {
				return resolver.resolve(
					"./runtime/services/logger/winstonLogger.server",
				);
			}
			return false;
		});

		addImportsDir(resolver.resolve("./runtime/composables"));
		addPlugin({
			src: resolver.resolve("./runtime/plugins/loggerPlugin.client"),
			mode: "client",
		});
		addPlugin({
			src: resolver.resolve("./runtime/plugins/loggerPlugin.server"),
			mode: "server",
		});

		addServerImportsDir(resolver.resolve("./runtime/server/utils"));
		addServerPlugin(resolver.resolve("./runtime/server/plugins/winston"));

		addServerHandler({
			handler: resolver.resolve("./runtime/server/middleware/requestLogger"),
			middleware: true,
		});
	},
});

function defu<T extends Record<string, any>>(
	object: T,
	defaults: Record<string, any>,
): T {
	const result = { ...object };

	for (const key in defaults) {
		if (result[key] === undefined) {
			(result as Record<string, any>)[key] = defaults[key];
		} else if (
			defaults[key] &&
			typeof defaults[key] === "object" &&
			result[key] &&
			typeof result[key] === "object"
		) {
			(result as Record<string, any>)[key] = defu(
				(result as Record<string, any>)[key],
				defaults[key],
			);
		}
	}

	return result;
}
