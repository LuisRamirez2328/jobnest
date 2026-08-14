import { ref } from 'vue'
import { defineStore } from 'pinia'

type Theme = 'light' | 'dark'

function initialTheme(): Theme {
  const stored = localStorage.getItem('jobnest-theme')
  if (stored === 'dark' || stored === 'light') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>(initialTheme())

  function apply() {
    document.documentElement.classList.toggle('dark', theme.value === 'dark')
  }

  function toggle() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    localStorage.setItem('jobnest-theme', theme.value)
    apply()
  }

  return { theme, toggle, apply }
})
