import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    testTimeout: 15000,
    fileParallelism: false,
    globalSetup: './tests/setup/globalSetup.ts',
    setupFiles: ['./tests/setup/loadTestEnv.ts'],
  },
});
