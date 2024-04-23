// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   manifest: {
    //     name: 'The Love Universe 💜',
    //     short_name: 'The Love Universe 💜',
    //     description: 'The Love Universe app',
    //     theme_color: '#ffffff',
    //     icons: [
    //       {
    //         src: 'logo.png',
    //         type: 'image/png',
    //       },
    //     ],
    //   },
    // }),
  ],
});
