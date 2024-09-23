import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: { globals: {...globals.browser, ...globals.node} },
    plugins: {prettier},rules: {
      'no-unused-vars': 'warn', // Disable the no-unused-vars rule
      'indent': [
        'error',
        'tab',
      ],
      'linebreak-style': [
        'error',
        'unix',
      ],
      'quotes': [
        'error',
        'single',
      ],
      'semi': [
        'error',
        'never',
      ],
      'arrow-body-style': 'off',
      'prettier/prettier': ['error'], // Enforce Prettier formatting rules
    },
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      'docs/swagger-ui/',
      'logs/',
      'coverage/',
      'lib/',
      'out/',
      'compiled/',
      'database/',
      '.babelrc',
      '*.log',
      '*.config.js',
      '*.config.cjs',
      '*.config.mjs',
      '.env',
      '.env.*',
      'package-lock.json',
      'yarn.lock',
      '.eslintcache',
    ],
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig, 
];