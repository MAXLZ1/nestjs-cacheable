import swc from 'unplugin-swc';
import { defineConfig, coverageConfigDefaults } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/unit/**/*.spec.ts'],
    coverage: {
      exclude: [
        'commitlint.config.mjs',
        'src/interfaces/**',
        ...coverageConfigDefaults.exclude,
      ],
    },
  },
  plugins: [swc.vite()],
});
