import * as _nuxt_schema from '@nuxt/schema';
import { LogLevel } from '../dist/runtime/services/BrowserLogger.js';
export { LogLevel } from '../dist/runtime/services/BrowserLogger.js';
export { ILogger } from '../dist/runtime/services/ILogger.js';

interface LoggerModuleOptions {
    loglevel?: LogLevel;
    meta?: unknown[];
    includeStackTrace?: boolean;
    stackTraceLimit?: number;
}
declare const _default: _nuxt_schema.NuxtModule<LoggerModuleOptions, LoggerModuleOptions, false>;

export { _default as default };
export type { LoggerModuleOptions };
