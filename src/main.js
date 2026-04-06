import './style.css'

const THEME_KEY = 'mysite-theme-preference'
const root = document.documentElement
const body = document.body
const themeButtons = document.querySelectorAll('[data-theme-toggle]')
const themeLabels = document.querySelectorAll('[data-theme-label]')
const revealItems = document.querySelectorAll('[data-reveal]')
const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: light)')

const getStoredTheme = () => {
  try {
    const savedTheme = localStorage.getItem(THEME_KEY)
    return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : null
  } catch {
    return null
  }
}

const getPreferredTheme = () => getStoredTheme() ?? (colorSchemeQuery.matches ? 'light' : 'dark')

const applyTheme = (theme, { persist = false } = {}) => {
  const nextTheme = theme === 'light' ? 'light' : 'dark'
  const isLight = nextTheme === 'light'

  root.classList.toggle('theme-light', isLight)
  root.dataset.theme = nextTheme

  themeButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(isLight))
    button.setAttribute(
      'aria-label',
      isLight ? 'Переключить сайт на тёмную тему' : 'Переключить сайт на светлую тему',
    )
  })

  themeLabels.forEach((label) => {
    label.textContent = isLight ? 'светлая' : 'тёмная'
  })

  if (persist) {
    try {
      localStorage.setItem(THEME_KEY, nextTheme)
    } catch {}
  }
}

const syncHeaderState = () => {
  body.dataset.scrolled = String(window.scrollY > 12)
}

applyTheme(getPreferredTheme())

themeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const nextTheme = root.classList.contains('theme-light') ? 'dark' : 'light'
    applyTheme(nextTheme, { persist: true })
  })
})

const syncThemeWithSystem = (event) => {
  if (!getStoredTheme()) {
    applyTheme(event.matches ? 'light' : 'dark')
  }
}

if (typeof colorSchemeQuery.addEventListener === 'function') {
  colorSchemeQuery.addEventListener('change', syncThemeWithSystem)
} else if (typeof colorSchemeQuery.addListener === 'function') {
  colorSchemeQuery.addListener(syncThemeWithSystem)
}

syncHeaderState()
window.addEventListener('scroll', syncHeaderState, { passive: true })

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.14,
      rootMargin: '0px 0px -8% 0px',
    },
  )

  revealItems.forEach((item) => observer.observe(item))
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'))
}
