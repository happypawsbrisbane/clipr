import { defineConfig } from 'vitest/config';
import path from 'node:path';

// The app targets Australian eastern time (AEST/AEDT) and the mock data uses
// +10:00 offsets, so run the suite in that timezone for deterministic
// calendar/date assertions. Set before workers are forked so they inherit it.
process.env.TZ = 'Australia/Sydney';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
