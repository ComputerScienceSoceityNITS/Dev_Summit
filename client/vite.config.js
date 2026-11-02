import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// In development the React app talks to the API server (npm run server) through this proxy.
const api = { '/api': 'http://localhost:5000' }
export default defineConfig({ plugins: [react()], server: { proxy: api }, preview: { proxy: api } })
