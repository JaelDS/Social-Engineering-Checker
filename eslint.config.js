import js from '@eslint/js';
import ts from 'typescript-eslint';
export default ts.config(
  { ignores: ['dist/**', 'node_modules/**', '.wrangler/**', 'graphify-out/**', 'presentations/**', 'docs/**', 'test-results/**', 'playwright-report/**'] },
  js.configs.recommended,
  ...ts.configs.recommended,
  { languageOptions: { globals: { document: 'readonly', window: 'readonly', URL: 'readonly', Blob: 'readonly', fetch: 'readonly', console: 'readonly', Response: 'readonly', File: 'readonly', HTMLInputElement: 'readonly', HTMLTextAreaElement: 'readonly', HTMLSelectElement: 'readonly', HTMLElement: 'readonly', Image: 'readonly', setTimeout: 'readonly', clearTimeout: 'readonly', AbortController: 'readonly' } } },
);
