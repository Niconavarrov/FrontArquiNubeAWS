import { defineConfig } from 'vite'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, existsSync } from 'fs'

export default defineConfig({
  root: 'public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'public/Scripts/main.js'),
        index: resolve(__dirname, 'Index.html'),
        callback: resolve(__dirname, 'public/Views/callback.html'),
      },
      output: {
        entryFileNames: 'Scripts/[name].js',
        chunkFileNames: 'Scripts/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'Styles/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    },
    // Copiar archivos estáticos después del build
    copyPublicDir: true,
  },
  publicDir: false,
  plugins: [
    {
      name: 'copy-static-files',
      closeBundle() {
        // Copiar archivos HTML a la raíz del dist
        const distPath = resolve(__dirname, 'dist')
        const viewsPath = resolve(__dirname, 'public/Views')
        const stylesPath = resolve(__dirname, 'public/Styles')
        
        // Copiar Index.html a index.html en la raíz
        if (existsSync(resolve(__dirname, 'Index.html'))) {
          copyFileSync(
            resolve(__dirname, 'Index.html'),
            resolve(distPath, 'index.html')
          )
        }
        
        // Copiar callback.html
        if (existsSync(resolve(viewsPath, 'callback.html'))) {
          copyFileSync(
            resolve(viewsPath, 'callback.html'),
            resolve(distPath, 'callback.html')
          )
        }
        
        // Copiar CSS
        if (existsSync(resolve(stylesPath, 'Styles.css'))) {
          if (!existsSync(resolve(distPath, 'Styles'))) {
            mkdirSync(resolve(distPath, 'Styles'), { recursive: true })
          }
          copyFileSync(
            resolve(stylesPath, 'Styles.css'),
            resolve(distPath, 'Styles/Styles.css')
          )
        }
      }
    }
  ]
})
