// https://dev.to/receter/how-to-create-a-react-component-library-using-vites-library-mode-4lma

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import dts from 'vite-plugin-dts'
import { libInjectCss } from 'vite-plugin-lib-inject-css'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'lib'),
    },
  },
  plugins: [react(), libInjectCss(), dts({ include: ['lib'] })],
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      formats: ['es']
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'styled-components', 'react/jsx-runtime'],
      output: {
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: '[name].js',
      }
    }
  }
})
