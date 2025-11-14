import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  modules: ['shadcn-nuxt','@nuxtjs/supabase', '@pinia/nuxt'],
  app: {
    baseURL: '/yellow-developer-project/', // Base URL for GitHub Project Pages deployment
  },
  supabase: {
    url: "https://iocxmzbjyguvhodcyqtt.supabase.co",
    key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvY3htemJqeWd1dmhvZGN5cXR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5OTYxODMsImV4cCI6MjA3ODU3MjE4M30.HDH-BpQDzDlRn-F-_tdH6KQbWbq6NMIHa9vs6RXnl0M",
    redirect: false,
    cookieOptions: {
      maxAge: 0
    }
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
})