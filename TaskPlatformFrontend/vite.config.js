import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true  // ← THIS FIXES 404 ON LOCALHOST
  },
  build: {
    rollupOptions: {
      output: {
        // keeps your build clean
      }
    }
  }
})