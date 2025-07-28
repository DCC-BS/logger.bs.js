import type { NuxtModule } from '@nuxt/schema'

import type { default as Module } from './module.mjs'

export type ModuleOptions = typeof Module extends NuxtModule<infer O> ? Partial<O> : Record<string, any>

export { type LogLevel } from '../dist/runtime/services/BrowserLogger.js'

export { type ILogger } from '../dist/runtime/services/ILogger.js'

export { default } from './module.mjs'

export { type LoggerModuleOptions } from './module.mjs'
