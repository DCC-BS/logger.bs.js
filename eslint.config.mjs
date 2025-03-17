// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

// Run `npx @eslint/config-inspector` to inspect the resolved config interactively
export default createConfigForNuxt({
    features: {
        // Rules for module authors
        tooling: true,
        // Rules for formatting
        stylistic: false,
    },
    dirs: {
        src: [
            './playground',
        ],
    },
})
    .append({
        rules: {
            'indent': ['error', 4, { 'SwitchCase': 1 }],
            // Disable the unified-signatures rule that's complaining about function overloads
            '@typescript-eslint/unified-signatures': 'off',
        }
    }
    );