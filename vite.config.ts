import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },

  // Task 40: Performance Optimization
  build: {
    // Output directory
    outDir: 'dist',
    
    // Enable minification
    minify: 'esbuild',
    
    // Target modern browsers for better optimization
    target: 'es2020',
    
    // Sourcemap for debugging (disable in production for smaller bundle)
    sourcemap: false,
    
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        // Manual chunks for better caching
        manualChunks: (id) => {
          // Node modules
          if (id.includes('node_modules')) {
            // React ecosystem
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
            // Animation library
            if (id.includes('framer-motion')) {
              return 'vendor-animation';
            }
            // UI icons
            if (id.includes('lucide-react')) {
              return 'vendor-ui';
            }
            // State management
            if (id.includes('zustand')) {
              return 'vendor-state';
            }
            // DnD library
            if (id.includes('@dnd-kit')) {
              return 'vendor-dnd';
            }
            // Other vendor code
            return 'vendor-other';
          }
          
          // Application code
          if (id.includes('/src/store/')) {
            return 'core-stores';
          }
          if (id.includes('/src/api/')) {
            return 'core-api';
          }
          if (id.includes('/src/components/ui/')) {
            return 'ui-components';
          }
          if (id.includes('/src/components/screens/')) {
            return 'app-screens';
          }
          if (id.includes('/src/animations/')) {
            return 'app-animations';
          }
        },
        
        // Asset file naming
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || '';
          
          // Group by asset type
          if (/\.(png|jpe?g|svg|gif|webp|ico)$/.test(name)) {
            return 'assets/images/[name]-[hash][extname]';
          } else if (/\.(woff2?|eot|ttf|otf)$/.test(name)) {
            return 'assets/fonts/[name]-[hash][extname]';
          } else if (/\.(mp3|wav|ogg|m4a)$/.test(name)) {
            return 'assets/sounds/[name]-[hash][extname]';
          }
          
          return 'assets/[name]-[hash][extname]';
        },
        
        // Chunk file naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    
    // Chunk size warning limit (500 KB)
    chunkSizeWarningLimit: 500,
    
    // CSS code splitting
    cssCodeSplit: true,
    
    // Optimize dependencies
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },

  // Path alias for cleaner imports
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@screens': resolve(__dirname, './src/components/screens'),
      '@ui': resolve(__dirname, './src/components/ui'),
      '@api': resolve(__dirname, './src/api'),
      '@store': resolve(__dirname, './src/store'),
      '@utils': resolve(__dirname, './src/utils'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@services': resolve(__dirname, './src/services'),
      '@types': resolve(__dirname, './src/types'),
      '@animations': resolve(__dirname, './src/animations'),
      '@assets': resolve(__dirname, './src/assets'),
    },
  },

  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'lucide-react',
      'zustand',
    ],
    exclude: [
      '@tauri-apps/api',
      '@tauri-apps/plugin-dialog',
      '@tauri-apps/plugin-fs',
      '@tauri-apps/plugin-opener',
    ],
  },
});
