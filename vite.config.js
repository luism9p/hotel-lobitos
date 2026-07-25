import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // This project's Vite build runs on Rolldown, whose manualChunks
        // only accepts the function form (the classic Rollup object-map
        // form throws "manualChunks is not a function" here).
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (/node_modules\/(react|react-dom)\//.test(id)) return 'vendor-react'
          if (/node_modules\/(gsap|@gsap\/react)\//.test(id)) return 'vendor-gsap'
          return undefined
        },
      },
    },
  },
})
