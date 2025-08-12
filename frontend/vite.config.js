import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // fallback if VITE_BACKEND_URL is missing
  const backendUrl = env.VITE_BACKEND_URL || 'http://localhost:4000/api/v1'

  return {
    plugins: [react()],
    define: {
      'process.env': { ...env, VITE_BACKEND_URL: backendUrl },
    },
  }
})
