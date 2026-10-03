import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// Long-lived vendor chunks: these change rarely, so browsers keep them cached
// across deploys while the app code updates.
const vendorChunks = {
  'react-vendor': ['react', 'react-dom', 'react-router-dom', 'scheduler'],
  'state-vendor': ['@reduxjs/toolkit', 'react-redux', 'redux-persist', 'immer'],
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          for (const [chunk, pkgs] of Object.entries(vendorChunks)) {
            if (pkgs.some((pkg) => id.includes(`/node_modules/${pkg}/`))) return chunk
          }
        },
      },
    },
  },
})
