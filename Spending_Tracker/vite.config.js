import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/spending_tracker/Spending_Tracker/',
  plugins: [react()],

})
