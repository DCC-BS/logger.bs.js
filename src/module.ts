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
        nuxt.options.build.transpile.push(resolver.resolve('./runtime/services/logger/winstonLogger.server'));

        addImportsDir(resolver.resolve('./runtime/composables'));
        addPlugin(resolver.resolve('./runtime/plugins/loggerPlugin.ts'));

        addServerImportsDir(resolver.resolve('./runtime/server/utils'));
        addServerPlugin(resolver.resolve('./runtime/server/plugins/winston.ts'));

        addServerHandler({
            handler: resolver.resolve('./runtime/server/middleware/requestLogger.ts'),
            middleware: true,
        });

        // examples: 
        // addImportsDir(resolver.resolve('./runtime/composables'));
        // addTypeTemplate({ filename: 'types/commands.d.ts', src: resolver.resolve('./runtime/models/commands.d.ts') });
    },
})