import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,        // ✅ change to any port you want
    strictPort: true,  // optional (prevents auto port switching)
  }
})
