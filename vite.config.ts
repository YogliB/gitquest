import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import { resolve } from 'path'

export default defineConfig({
  base: '/gitquest/',
  plugins: [
    vanillaExtractPlugin(),
    react(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
