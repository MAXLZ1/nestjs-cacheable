import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['dotenv-flow/config'],
    include: ['test/e2e/**/*.e2e-spec.ts'],
  },
  plugins: [swc.vite()],
});
