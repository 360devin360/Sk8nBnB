import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    eslint({
      lintOnStart: true,
      failOnError: mode === "production"
    })
  ],
  // To automatically open the app in the browser whenever the server starts,
  // uncomment the following lines:
  server: {
    open: true,
    proxy:{
      '/api':'postgresql://aa_projects_i77m_user:2CJcesp2jhoEUHMSXKOm4eD2JfObesjW@dpg-cptkjvo8fa8c738m7fk0-a/aa_projects_i77m'
    }
  }
}));
