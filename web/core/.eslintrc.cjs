// @ts-check
const { defineConfig } = require('eslint-define-config')

module.exports = defineConfig({
  root: true,
  env: {
    node: true,
    browser: true,
    es2022: true
  },
  extends: [
    'eslint:recommended',
  ],
  plugins: ['import'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
  ignorePatterns: ['dist', 'dist-types'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],  // Added *.tsx
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'plugin:react/recommended'  // Added React plugin
      ],
      plugins: ['@typescript-eslint', 'import', 'react-refresh', 'react'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        },
        project: './tsconfig.json'  // Add reference to your tsconfig
      },
      settings: {
        react: {
          version: 'detect'
        }
      },
      rules: {
        'react-refresh/only-export-components': [
          'warn',
          { allowConstantExport: true },
        ],
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'off'
      },
    },
    {
      files: ['test', '__test__', '*.{spec,test}.ts'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        "@typescript-eslint/no-unused-vars": "off",
        'tsdoc/syntax': 'off',
      },
    },
  ]
})
