import { defineNuxtModule, createResolver, addImportsDir, addPlugin, addServerImportsDir, addServerPlugin, addServerHandler } from '@nuxt/kit';

const module = defineNuxtModule({
  meta: {
    name: "logger.bs.js",
    configKey: "logger.bs.js"
  },
  defaults(nuxt) {
    const isDev = nuxt.options.dev;
    return {
      loglevel: "info",
      meta: [],
      includeStackTrace: isDev,
      stackTraceLimit: 10
    };
  },
  setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url);
    nuxt.options.runtimeConfig.public.logger_bs = defu(
      nuxt.options.runtimeConfig.public.logger_bs,
      {
        loglevel: _options.loglevel,
        meta: _options.meta
      }
    );
    nuxt.options.build = nuxt.options.build || {};
    nuxt.options.build.transpile = nuxt.options.build.transpile || [];
    nuxt.options.build.transpile.push(({ isServer }) => {
      if (isServer) {
        return resolver.resolve(
          "./runtime/services/logger/winstonLogger.server"
        );
      }
      return false;
    });
    addImportsDir(resolver.resolve("./runtime/composables"));
    addPlugin({
      src: resolver.resolve("./runtime/plugins/loggerPlugin.client"),
      mode: "client"
    });
    addPlugin({
      src: resolver.resolve("./runtime/plugins/loggerPlugin.server"),
      mode: "server"
    });
    addServerImportsDir(resolver.resolve("./runtime/server/utils"));
    addServerPlugin(resolver.resolve("./runtime/server/plugins/winston"));
    addServerHandler({
      handler: resolver.resolve(
        "./runtime/server/middleware/requestLogger"
      ),
      middleware: true
    });
  }
});
function defu(object, defaults) {
  const result = { ...object };
  for (const key in defaults) {
    if (result[key] === void 0) {
      result[key] = defaults[key];
    } else if (defaults[key] && typeof defaults[key] === "object" && result[key] && typeof result[key] === "object") {
      result[key] = defu(
        result[key],
        defaults[key]
      );
    }
  }
  return result;
}

export { module as default };
