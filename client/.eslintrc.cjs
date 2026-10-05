module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    // Plain JavaScript project without PropTypes; props are documented in code.
    'react/prop-types': 'off',
    // The default JSX import is harmless; `fetchpriority` must stay lowercase for React 18.
    'no-unused-vars': ['error', { varsIgnorePattern: '^React$', ignoreRestSiblings: true }],
    'react/no-unknown-property': ['error', { ignore: ['fetchpriority'] }],
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
  overrides: [
    {
      // Older admin pages and form helpers still carry unused imports; shown as
      // warnings until they are cleaned up, so new code is held to the strict rule.
      files: ['src/Pages/Dashboard/Admin/**', 'src/components/Form/**', 'src/components/ErrorHandling/**', 'src/components/SectionTitle/**'],
      rules: { 'no-unused-vars': 'warn' },
    },
  ],
}
