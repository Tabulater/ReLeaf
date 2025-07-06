import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  
  console.log('Environment variables loaded:', {
    // API keys no longer needed - using fallback data
    // VITE_NASA_API_KEY: env.VITE_NASA_API_KEY ? '✅ Present' : '❌ Missing',
    // VITE_EIA_API_KEY: env.VITE_EIA_API_KEY ? '✅ Present' : '❌ Missing'
  });

  return {
    base: '/',
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    define: {
      // Explicitly define environment variables
      // API keys no longer needed - using fallback data
      // 'import.meta.env.VITE_NASA_API_KEY': JSON.stringify(env.VITE_NASA_API_KEY),
      // 'import.meta.env.VITE_EIA_API_KEY': JSON.stringify(env.VITE_EIA_API_KEY),
    }
  };
});
