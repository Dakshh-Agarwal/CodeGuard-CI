import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(() => {
  const isVitest = process.env.VITEST === 'true';

  return {
    plugins: [react({ jsxRuntime: 'automatic' })],
    esbuild: isVitest
      ? {
          jsx: 'automatic',
        }
      : undefined,
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/test/setup.js',
    },
  };
})
