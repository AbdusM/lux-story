import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'off',
    },
    ignores: ['scripts/**', '.next/**', 'node_modules/**'],
  },
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript'],
    rules: {
      '@typescript-eslint/no-explicit-any': [
        'error',
        {
          fixToUnknown: false,
          ignoreRestArgs: true,
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'no-console': 'off',
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      'prefer-const': [
        'warn',
        {
          destructuring: 'all',
          ignoreReadBeforeAssign: true,
        },
      ],
    },
  }),
  {
    files: ['tests/e2e/fixtures/**/*.ts'],
    rules: {
      // Playwright fixture callbacks conventionally receive a `use` continuation
      // parameter, which trips this React-specific rule despite no React hook usage.
      'react-hooks/rules-of-hooks': 'off',
    },
  },
]
