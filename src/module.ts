import { defineNuxtModule, addImportsDir, addPlugin, addServerPlugin, addServerImportsDir, createResolver, addServerHandler } from '@nuxt/kit'

export default defineNuxtModule({
    meta: {
        name: 'logger.bs.js',
        configKey: 'logger.bs.js',
    },
    // Default configuration options of the Nuxt module
    defaults: {
    },
    setup(_options, nuxt) {
        const resolver = createResolver(import.meta.url);

        // Add build configuration to transpile the logger service
        // Using the resolver to get the absolute path ensures it works when the module is used in other projects
        nuxt.options.build = nuxt.options.build || {};
        nuxt.options.build.transpile = nuxt.options.build.transpile || [];
        nuxt.options.build.transpile.push(
            ({ isServer }) => {
                if (isServer) {
                    return resolver.resolve('./runtime/services/logger/winstonLogger.server')
                }
                return false;
            });

        addImportsDir(resolver.resolve('./runtime/composables'));
        addPlugin({
            src: resolver.resolve('./runtime/plugins/loggerPlugin.client.js'),
            mode: 'client'
        });
        addPlugin({
            src: resolver.resolve('./runtime/plugins/loggerPlugin.server.js'),
            mode: 'server'
        });

        addServerImportsDir(resolver.resolve('./runtime/server/utils'));
        addServerPlugin(resolver.resolve('./runtime/server/plugins/winston.js'));

        addServerHandler({
            handler: resolver.resolve('./runtime/server/middleware/requestLogger.js'),
            middleware: true,
        });
    },
})