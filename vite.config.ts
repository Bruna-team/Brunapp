import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    rollupOptions: {
      moduleContext: {
        './node_modules/pdfmake/build/vfs_fonts.js': 'window',
      },
    }
  },
  optimizeDeps: {
    include: ["quill-blot-formatter"],
  },
})
