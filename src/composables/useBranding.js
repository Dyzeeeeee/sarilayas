import { ref } from 'vue'
import { settingsService } from '../firebase/firestore'

const defaultBranding = {
  siteName: 'Sarilaya',
  siteDescription: '',
  logoUrl: '/MainSarilayaLogo.png',
  compactLogoUrl: '/SarilayaLogo.png',
  primaryColor: '#9333ea',
}

const branding = ref({ ...defaultBranding })
let initialized = false
let initializing = false
let unsubscribe = null

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function hexToHsl(hex) {
  let normalized = hex.replace('#', '')
  if (normalized.length === 3) {
    normalized = normalized.split('').map(char => char + char).join('')
  }

  const r = parseInt(normalized.substring(0, 2), 16) / 255
  const g = parseInt(normalized.substring(2, 4), 16) / 255
  const b = parseInt(normalized.substring(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h
  const l = (max + min) / 2
  const d = max - min

  if (d === 0) {
    h = 0
  } else {
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0))
        break
      case g:
        h = ((b - r) / d + 2)
        break
      default:
        h = ((r - g) / d + 4)
        break
    }
    h /= 6
  }

  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function hslToHex(h, s, l) {
  h /= 360
  s /= 100
  l /= 100

  const hueToRgb = (p, q, t) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }

  let r, g, b

  if (s === 0) {
    r = g = b = l
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hueToRgb(p, q, h + 1 / 3)
    g = hueToRgb(p, q, h)
    b = hueToRgb(p, q, h - 1 / 3)
  }

  const toHex = x => {
    const hex = Math.round(x * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function generatePalette(baseColor) {
  const adjustments = {
    50: 46,
    100: 38,
    200: 30,
    300: 20,
    400: 10,
    500: 0,
    600: -6,
    700: -14,
    800: -22,
    900: -30,
    950: -38,
  }

  let hsl
  try {
    hsl = hexToHsl(baseColor)
  } catch (error) {
    console.error('Invalid base color provided for branding palette:', error)
    hsl = hexToHsl(defaultBranding.primaryColor)
  }

  const palette = {}
  Object.entries(adjustments).forEach(([key, delta]) => {
    const lightness = clamp(hsl[2] + delta, 4, 96)
    palette[key] = hslToHex(hsl[0], hsl[1], lightness)
  })
  return palette
}

function ensureFaviconLink() {
  if (typeof document === 'undefined') return null
  const existing =
    document.querySelector('link[rel="icon"]') ||
    document.querySelector('link[rel="shortcut icon"]')
  if (existing) return existing
  const link = document.createElement('link')
  link.rel = 'icon'
  document.head.appendChild(link)
  return link
}

function updateDocumentBranding(settings) {
  if (typeof document === 'undefined') return

  if (settings.siteName) {
    document.title = settings.siteName
  }

  const faviconHref =
    settings.compactLogoUrl ||
    settings.logoUrl ||
    defaultBranding.compactLogoUrl ||
    defaultBranding.logoUrl

  const faviconLink = ensureFaviconLink()
  if (faviconLink && faviconHref) {
    faviconLink.type = 'image/png'
    faviconLink.href = faviconHref
  }
}

function applyBranding(settings = {}) {
  const normalized = {
    ...defaultBranding,
    ...settings,
  }
  branding.value = normalized

  if (typeof window !== 'undefined') {
    const palette = generatePalette(normalized.primaryColor || defaultBranding.primaryColor)
    const root = document.documentElement
    Object.entries(palette).forEach(([tone, value]) => {
      root.style.setProperty(`--color-primary-${tone}`, value)
    })
    updateDocumentBranding(normalized)
  }
}

export function useBranding() {
  const initBranding = async () => {
    if (initialized || initializing) return
    initializing = true
    try {
      const settings = await settingsService.getSettings()
      applyBranding(settings)
      unsubscribe = settingsService.subscribeToSettings((liveSettings) => {
        applyBranding(liveSettings)
      })
      initialized = true
    } catch (error) {
      console.error('Failed to initialize branding:', error)
      applyBranding(defaultBranding)
    } finally {
      initializing = false
    }
  }

  const refreshBranding = async () => {
    try {
      const settings = await settingsService.getSettings()
      applyBranding(settings)
    } catch (error) {
      console.error('Failed to refresh branding:', error)
    }
  }

  const disposeBranding = () => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
    initialized = false
  }

  return {
    branding,
    initBranding,
    refreshBranding,
    disposeBranding,
  }
}


