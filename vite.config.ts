import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'BoardSdk',
      fileName: 'index'
    },
    rollupOptions: {
      output: {
        exports: 'named'
      }
    },
    sourcemap: true,
    target: 'es2020'
  }
}) 