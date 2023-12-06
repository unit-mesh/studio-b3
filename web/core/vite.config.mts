// https://dev.to/receter/how-to-create-a-react-component-library-using-vites-library-mode-4lma

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import checker from 'vite-plugin-checker';
import dts from 'vite-plugin-dts';
import { externalizeDeps } from 'vite-plugin-externalize-deps';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'lib'),
    },
  },
  plugins: [
    checker({
      typescript: true,
    }),
    externalizeDeps(),
    dts({
      outDir: './dist-types',
    }),
    libInjectCss(),
    react(),
  ],
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        dir: 'dist',
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: '[name].js',
      },
    },
  },
});
