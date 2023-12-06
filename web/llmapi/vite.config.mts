import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import dts from 'vite-plugin-dts';
import { externalizeDeps } from 'vite-plugin-externalize-deps';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    checker({
      typescript: true,
    }),
    externalizeDeps(),
    dts({
      outDir: './dist-types',
    }),
  ],
  build: {
    copyPublicDir: false,
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        dir: 'dist',
        exports: 'named',
        entryFileNames: '[name].mjs',
        chunkFileNames: '[name].mjs',
      },
    },
  },
});
