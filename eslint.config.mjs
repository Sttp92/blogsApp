import js from '@eslint/js'
import globals from 'globals'
import stylistic from '@stylistic/eslint-plugin-js'

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  { languageOptions: { globals: globals.node } },
  { plugins: { stylistic } },
  {
    rules: {
      'stylistic/indent': [
        'error',
        2
      ],
      'stylistic/linebreak-style': [
        'error',
        'unix'
      ],
      'stylistic/quotes': [
        'error',
        'single'
      ],
      'stylistic/semi': [
        'error',
        'never'
      ],
      'eqeqeq': 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': [
        'error', 'always'
      ],
      'arrow-spacing': [
        'error', { 'before': true, 'after': true }
      ],
      'no-console': 0
    }
  },
  { ignores: ['node_modules/'] }
]