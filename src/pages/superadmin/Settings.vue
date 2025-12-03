<template>
  <SuperAdminLayout>
    <div class="space-y-5 md:space-y-8">
      <!-- Page Header -->
      <div class="flex flex-col gap-2">
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Brand & Platform Settings</h1>
        <p class="text-sm md:text-base text-gray-600">Control availability, branding, and primary color used across the experience.</p>
      </div>

      <!-- Brand Snapshot -->
      <div class="grid gap-4 md:gap-6 lg:grid-cols-3">
        <section class="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm lg:col-span-2">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-4">
              <div class="h-16 w-16 rounded-2xl bg-primary-50 flex items-center justify-center border border-primary-100">
                <img :src="previewCompactLogo" alt="Brand mark" class="h-12 w-12 object-contain" />
              </div>
              <div>
                <p class="text-lg font-semibold text-gray-900">{{ siteName || 'Your Website' }}</p>
                <p class="text-sm text-gray-500">Primary color {{ primaryColor.toUpperCase() }}</p>
              </div>
            </div>
            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                @click="copyPrimaryColor"
              >
                <svg class="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8l6 6v8a2 2 0 01-2 2h-2" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16h8a2 2 0 002-2V8" />
                </svg>
                {{ colorCopied ? 'Copied!' : 'Copy HEX' }}
              </button>
              <button
                type="button"
                class="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-primary-200 text-sm font-medium text-primary-700 hover:bg-primary-50 transition"
                @click="resetBrandingToDefaults"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582M20 20v-5h-.581M4.582 9A7.5 7.5 0 0112 4.5c3.038 0 5.67 1.751 6.897 4.3M19.418 15A7.5 7.5 0 0112 19.5c-3.038 0-5.67-1.751-6.897-4.3" />
                </svg>
                Reset to live values
              </button>
            </div>
          </div>
          <dl class="grid gap-4 mt-6 sm:grid-cols-3">
            <div class="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <dt class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Public site</dt>
              <dd class="mt-1 flex items-center gap-2">
                <span
                  :class="siteEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'"
                  class="px-2 py-0.5 text-xs font-semibold rounded-full"
                >
                  {{ siteEnabled ? 'Live' : 'Maintenance' }}
                </span>
              </dd>
            </div>
            <div class="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <dt class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Loader</dt>
              <dd class="mt-1 text-sm font-medium text-gray-900">
                {{ pageLoaderEnabled ? 'Enabled' : 'Disabled' }}
              </dd>
              <p class="text-xs text-gray-500">Controls first-paint experience</p>
            </div>
            <div class="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <dt class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Color (HSL)</dt>
              <dd class="mt-1 text-sm font-medium text-gray-900">
                {{ colorDetails.h }}°, {{ colorDetails.s }}%, {{ colorDetails.l }}%
              </dd>
              <p class="text-xs text-gray-500">Derived palette brightness</p>
            </div>
          </dl>
        </section>
        <section class="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <p class="text-sm font-semibold text-gray-900">Color presets</p>
            <span class="text-xs text-gray-500">Click to apply</span>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="preset in colorPresets"
              :key="preset.value"
              type="button"
              class="relative px-3 py-2 rounded-lg text-xs font-semibold text-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2"
              :style="{ backgroundColor: preset.value }"
              @click="applyColorPreset(preset.value)"
            >
              {{ preset.label }}
              <span
                v-if="primaryColor.toLowerCase() === preset.value.toLowerCase()"
                class="absolute -top-1 -right-1 h-4 w-4 bg-white text-primary-600 rounded-full flex items-center justify-center text-[10px]"
              >
                ✓
              </span>
            </button>
          </div>
        </section>
      </div>
      
      <!-- Visits Snapshot -->
      <section class="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Recent Visits</h2>
            <p class="text-sm text-gray-500">Last {{ visitSummaryLimit }} recorded visits</p>
          </div>
          <button
            @click="refreshVisitSummary"
            :disabled="visitSummaryLoading"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >
            <svg :class="['h-4 w-4', visitSummaryLoading && 'animate-spin']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v6h6M20 20v-6h-6M5 13a7 7 0 0012 4M19 11a7 7 0 00-12-4" />
            </svg>
            Refresh
          </button>
        </div>
        <div v-if="visitSummaryLoading" class="space-y-3">
          <div v-for="n in 4" :key="n" class="h-12 rounded-lg bg-gray-100 animate-pulse"></div>
        </div>
        <div v-else-if="visitSummary.length === 0" class="text-center py-8 text-sm text-gray-500">
          No visit data recorded yet.
        </div>
        <div v-else class="space-y-3">
          <div
            v-for="visit in visitSummary"
            :key="visit.id"
            class="p-3 rounded-xl border border-gray-200 hover:border-primary-300 transition"
          >
            <div class="flex items-center justify-between text-sm text-gray-600">
              <span class="font-semibold text-gray-900">{{ visit.route }}</span>
              <span>{{ formatVisitDate(visit.createdAt) }}</span>
            </div>
            <div class="mt-1 text-xs text-gray-500 flex flex-wrap gap-2">
              <span>Referrer: {{ visit.referrer || 'Direct' }}</span>
              <span>UA: {{ truncateUserAgent(visit.userAgent) }}</span>
              <span>Status: {{ visit.siteEnabled ? 'Live' : 'Down' }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Site Controls -->
      <div class="grid gap-4 md:gap-6 lg:grid-cols-2">
        <section class="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-base md:text-lg font-semibold text-gray-900">Public Site Status</p>
              <p class="text-sm text-gray-500 mt-1">
                {{ siteEnabled ? 'Visitors can access the public site' : 'All users (including admins) are redirected to the Site Down page. Only superadmins can access when disabled.' }}
              </p>
            </div>
            <label class="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                class="sr-only"
                :checked="siteEnabled"
                @change="updateSiteStatus"
                :disabled="updatingSiteStatus"
              />
              <span
                class="relative inline-flex h-7 w-12 items-center rounded-full transition bg-gray-200"
                :class="{ 'bg-primary-600': siteEnabled }"
              >
                <span
                  class="inline-block h-6 w-6 transform rounded-full bg-white shadow transition"
                  :class="{ 'translate-x-5': siteEnabled, 'translate-x-1': !siteEnabled }"
                ></span>
              </span>
            </label>
          </div>
        </section>

        <section class="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-base md:text-lg font-semibold text-gray-900">Page Loader</p>
              <p class="text-sm text-gray-500 mt-1">
                {{ pageLoaderEnabled ? 'Branded loader is shown on initial load' : 'Loader is disabled for faster entry' }}
              </p>
            </div>
            <label class="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                class="sr-only"
                :checked="pageLoaderEnabled"
                @change="updatePageLoaderStatus"
                :disabled="updatingPageLoaderStatus"
              />
              <span
                class="relative inline-flex h-7 w-12 items-center rounded-full transition bg-gray-200"
                :class="{ 'bg-primary-600': pageLoaderEnabled }"
              >
                <span
                  class="inline-block h-6 w-6 transform rounded-full bg-white shadow transition"
                  :class="{ 'translate-x-5': pageLoaderEnabled, 'translate-x-1': !pageLoaderEnabled }"
                ></span>
              </span>
            </label>
          </div>
        </section>
      </div>

      <!-- Branding Controls -->
      <section class="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm">
        <div class="flex flex-col gap-2 mb-6">
          <h2 class="text-xl font-semibold text-gray-900">Branding Controls</h2>
          <p class="text-sm text-gray-500">Update the logo, primary title, and color palette applied to headers, layouts, and notifications.</p>
        </div>

        <div class="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <form class="space-y-5" @submit.prevent="saveBranding">
            <div class="grid gap-4 md:grid-cols-[1.1fr,0.9fr,1fr] items-end">
              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Website Name
                </label>
                <input
                  v-model="siteName"
                  type="text"
                  required
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition text-sm"
                  placeholder="Enter website name"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Primary Color
                </label>
                <div class="flex items-center gap-2">
                  <input
                    v-model="primaryColor"
                    type="color"
                    class="h-11 w-14 rounded-lg border border-gray-200 cursor-pointer"
                    aria-label="Select primary color"
                  />
                  <input
                    v-model="primaryColor"
                    type="text"
                    maxlength="7"
                    class="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition text-sm uppercase"
                    placeholder="#9333EA"
                  />
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="flex-1 inline-flex items-center justify-center px-3 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                  @click="resetBrandingToDefaults"
                >
                  Reset
                </button>
                <button
                  type="button"
                  class="flex-1 inline-flex items-center justify-center px-3 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition"
                  @click="copyPrimaryColor"
                >
                  {{ colorCopied ? 'Copied!' : 'Copy HEX' }}
                </button>
              </div>
            </div>

            <div class="grid gap-4 md:grid-cols-2">
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <label class="text-sm font-semibold text-gray-700">
                    Primary Logo
                  </label>
                  <span class="text-xs text-gray-400">Desktop & print</span>
                </div>
                <div
                  class="border border-dashed border-gray-200 rounded-2xl p-3 flex items-center gap-3 hover:border-primary-300 transition"
                  @dragover.prevent
                  @drop.prevent="handleLogoDrop('primary', $event)"
                >
                  <div class="flex-1 flex items-center gap-3">
                    <div class="h-14 w-14 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                      <img :src="previewLogo" alt="Primary logo preview" class="max-h-12 max-w-12 object-contain" />
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-gray-900 truncate">{{ primaryLogoMeta ? 'Inline asset' : 'Upload a logo' }}</p>
                      <p class="text-xs text-gray-500 truncate">{{ primaryLogoMeta || LOGO_HELP_TEXT }}</p>
                    </div>
                  </div>
                  <div class="flex flex-col gap-2">
                    <button
                      type="button"
                      class="px-3 py-1.5 rounded-lg bg-primary-600 text-white text-xs font-semibold hover:bg-primary-700 transition"
                      @click="triggerLogoUpload('primary')"
                      :disabled="uploadingLogo"
                    >
                      {{ uploadingLogo ? 'Processing...' : 'Upload' }}
                    </button>
                    <button
                      type="button"
                      class="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition"
                      @click="resetLogo('primary')"
                      :disabled="uploadingLogo"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <label class="text-sm font-semibold text-gray-700">
                    Compact Logo
                  </label>
                  <span class="text-xs text-gray-400">Mobile & favicons</span>
                </div>
                <div
                  class="border border-dashed border-gray-200 rounded-2xl p-3 flex items-center gap-3 hover:border-primary-300 transition"
                  @dragover.prevent
                  @drop.prevent="handleLogoDrop('compact', $event)"
                >
                  <div class="flex-1 flex items-center gap-3">
                    <div class="h-14 w-14 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                      <img :src="previewCompactLogo" alt="Compact logo preview" class="max-h-12 max-w-12 object-contain" />
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-gray-900 truncate">{{ compactLogoMeta ? 'Inline asset' : 'Upload a logo' }}</p>
                      <p class="text-xs text-gray-500 truncate">{{ compactLogoMeta || LOGO_HELP_TEXT }}</p>
                    </div>
                  </div>
                  <div class="flex flex-col gap-2">
                    <button
                      type="button"
                      class="px-3 py-1.5 rounded-lg bg-primary-600 text-white text-xs font-semibold hover:bg-primary-700 transition"
                      @click="triggerLogoUpload('compact')"
                      :disabled="uploadingCompactLogo"
                    >
                      {{ uploadingCompactLogo ? 'Processing...' : 'Upload' }}
                    </button>
                    <button
                      type="button"
                      class="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition"
                      @click="resetLogo('compact')"
                      :disabled="uploadingCompactLogo"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-end pt-2">
              <button
                type="submit"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 text-white font-semibold text-sm shadow hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="savingBranding"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ savingBranding ? 'Saving...' : 'Save Branding' }}
              </button>
            </div>
          </form>

          <div class="bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-5 md:p-6">
            <p class="text-sm font-semibold text-gray-700 mb-4">Live Preview</p>
            <div class="space-y-4">
              <div class="bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 rounded-2xl p-4 text-white shadow">
                <div class="flex items-center gap-3">
                  <img :src="previewCompactLogo" alt="preview" class="h-10 w-10 object-contain bg-white/20 rounded-xl p-1" />
                  <div>
                    <p class="text-sm uppercase tracking-wide text-white/70">Topbar</p>
                    <p class="text-xl font-semibold">{{ siteName || 'Your Website' }}</p>
                  </div>
                </div>
              </div>
              <div class="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                <p class="text-sm font-semibold text-gray-700 mb-2">Palette Snapshot</p>
                <div class="grid grid-cols-5 gap-2">
                  <div
                    v-for="tone in paletteTones"
                    :key="tone"
                    class="rounded-lg h-12 border border-gray-100"
                    :style="{ backgroundColor: palettePreview[tone] }"
                  >
                    <span class="sr-only">Tone {{ tone }}</span>
                  </div>
                </div>
                <p class="text-xs text-gray-400 mt-3">Applies instantly to tailwind classes using the primary scale.</p>
              </div>
            </div>
          </div>
        </div>

        <input
          ref="logoInput"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          class="hidden"
          @change="handleLogoChange('primary', $event)"
        />
        <input
          ref="compactLogoInput"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          class="hidden"
          @change="handleLogoChange('compact', $event)"
        />
      </section>
    </div>
  </SuperAdminLayout>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import SuperAdminLayout from '../../layouts/SuperAdminLayout.vue'
import { settingsService } from '../../firebase/firestore'
import { useToast } from '../../composables/useToast'
import { useBranding } from '../../composables/useBranding'
import { useVisitors } from '../../composables/useVisitors'

const FALLBACK_PRIMARY_LOGO = '/MainSarilayaLogo.png'
const FALLBACK_COMPACT_LOGO = '/SarilayaLogo.png'

const siteEnabled = ref(true)
const pageLoaderEnabled = ref(true)
const siteName = ref('')
const primaryColor = ref('#9333ea')
const logoUrl = ref('')
const compactLogoUrl = ref('')

const updatingSiteStatus = ref(false)
const updatingPageLoaderStatus = ref(false)
const uploadingLogo = ref(false)
const uploadingCompactLogo = ref(false)
const savingBranding = ref(false)
const colorCopied = ref(false)

const logoInput = ref(null)
const compactLogoInput = ref(null)

const { success: showSuccess, error: showError } = useToast()
const { branding } = useBranding()
const { getVisitSummary } = useVisitors()

const paletteTones = [100, 300, 500, 700, 900]
const colorPresets = [
  { label: 'Royal Violet', value: '#9333EA' },
  { label: 'Sunset Amber', value: '#ea580c' },
  { label: 'Ocean Mist', value: '#0ea5e9' },
  { label: 'Emerald Bloom', value: '#059669' },
  { label: 'Slate Noir', value: '#0f172a' },
]

const palettePreview = computed(() => {
  const preview = {}
  paletteTones.forEach((tone) => {
    preview[tone] = getToneColor(primaryColor.value, tone)
  })
  return preview
})

const previewLogo = computed(() => logoUrl.value || branding.value.logoUrl)
const previewCompactLogo = computed(() => compactLogoUrl.value || branding.value.compactLogoUrl)
const colorDetails = computed(() => {
  const [h, s, l] = hexToHsl(primaryColor.value || '#9333ea')
  return { h, s, l }
})

const primaryLogoMeta = computed(() => getLogoMetaSummary(logoUrl.value))
const compactLogoMeta = computed(() => getLogoMetaSummary(compactLogoUrl.value))
const LOGO_HELP_TEXT = 'PNG, JPG, or WEBP up to ~512KB. Click or drag & drop to replace.'
const visitSummary = ref([])
const visitSummaryLimit = 25
const visitSummaryLoading = ref(false)

const clipboardAvailable = typeof navigator !== 'undefined' && !!navigator.clipboard
let copyTimeoutId = null

function normalizeColor(value) {
  if (!value) return '#9333ea'
  if (!value.startsWith('#')) {
    return `#${value}`
  }
  return value.length === 7 ? value : '#9333ea'
}

function getToneColor(baseHex, tone) {
  const adjustments = {
    100: 38,
    300: 20,
    500: 0,
    700: -14,
    900: -30,
  }

  const [h, s, l] = hexToHsl(baseHex || '#9333ea')
  const lightness = clamp(l + (adjustments[tone] || 0), 4, 96)
  return hslToHex(h, s, lightness)
}

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

  const toHex = (x) => {
    const hex = Math.round(x * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function getLogoMetaSummary(value) {
  if (!value) return null
  if (!value.startsWith('data:')) {
    return 'Linked asset URL'
  }
  const approxKb = Math.max(1, Math.round((value.length * 3) / 4 / 1024))
  return `Inline asset • ~${approxKb}KB`
}

function applyColorPreset(color) {
  primaryColor.value = normalizeColor(color)
}

async function copyPrimaryColor() {
  if (!clipboardAvailable) {
    showError('Clipboard not available')
    return
  }
  try {
    await navigator.clipboard.writeText(primaryColor.value.toUpperCase())
    colorCopied.value = true
    if (copyTimeoutId) clearTimeout(copyTimeoutId)
    copyTimeoutId = setTimeout(() => {
      colorCopied.value = false
    }, 1500)
  } catch (error) {
    console.error('Clipboard error:', error)
    showError('Failed to copy color')
  }
}

function resetBrandingToDefaults() {
  siteName.value = branding.value.siteName || 'Sarilaya'
  primaryColor.value = normalizeColor(branding.value.primaryColor || '#9333ea')
  logoUrl.value = ''
  compactLogoUrl.value = ''
  showSuccess('Reverted to live branding (unsaved)')
}

function formatVisitDate(date) {
  if (!date) return 'Unknown'
  let dateObj = date
  if (date.toDate) {
    dateObj = date.toDate()
  } else if (!(date instanceof Date)) {
    dateObj = new Date(date)
  }
  return dateObj.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function truncateUserAgent(agent = '') {
  if (!agent) return 'Unknown device'
  return agent.length > 50 ? agent.slice(0, 47) + '...' : agent
}

async function loadSettings() {
  try {
    const settings = await settingsService.getSettings()
    siteEnabled.value = settings.siteEnabled !== false
    pageLoaderEnabled.value = settings.pageLoaderEnabled !== false
    siteName.value = settings.siteName || branding.value.siteName
    primaryColor.value = normalizeColor(settings.primaryColor || branding.value.primaryColor)
    logoUrl.value = settings.logoUrl && settings.logoUrl !== FALLBACK_PRIMARY_LOGO ? settings.logoUrl : ''
    compactLogoUrl.value = settings.compactLogoUrl && settings.compactLogoUrl !== FALLBACK_COMPACT_LOGO ? settings.compactLogoUrl : ''
  } catch (error) {
    console.error('Error loading settings:', error)
    showError('Unable to load settings')
  }
}

async function loadVisitSummary() {
  visitSummaryLoading.value = true
  try {
    visitSummary.value = await getVisitSummary(visitSummaryLimit)
  } catch (error) {
    console.error('Error loading visit summary:', error)
  } finally {
    visitSummaryLoading.value = false
  }
}

async function updateSiteStatus(event) {
  updatingSiteStatus.value = true
  try {
    siteEnabled.value = event.target.checked
    await settingsService.updateSettings({ siteEnabled: siteEnabled.value })
    showSuccess(siteEnabled.value ? 'Site is now live' : 'Site is now down')
  } catch (error) {
    console.error('Error updating site status:', error)
    showError('Failed to update site status')
    siteEnabled.value = !siteEnabled.value
  } finally {
    updatingSiteStatus.value = false
  }
}

async function updatePageLoaderStatus(event) {
  updatingPageLoaderStatus.value = true
  try {
    pageLoaderEnabled.value = event.target.checked
    await settingsService.updateSettings({ pageLoaderEnabled: pageLoaderEnabled.value })
    showSuccess(pageLoaderEnabled.value ? 'Page loader enabled' : 'Page loader disabled')
  } catch (error) {
    console.error('Error updating page loader status:', error)
    showError('Failed to update page loader status')
    pageLoaderEnabled.value = !pageLoaderEnabled.value
  } finally {
    updatingPageLoaderStatus.value = false
  }
}

function triggerLogoUpload(type) {
  if (type === 'primary') {
    logoInput.value?.click()
  } else {
    compactLogoInput.value?.click()
  }
}

async function handleLogoChange(type, event) {
  const files = event.target.files || []
  if (!files.length) return
  const file = files[0]

  const readAsDataUrl = () =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

  try {
    if (type === 'primary') {
      uploadingLogo.value = true
    } else {
      uploadingCompactLogo.value = true
    }

    const dataUrl = await readAsDataUrl()

    if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
      throw new Error('Unsupported file type')
    }

    if (type === 'primary') {
      logoUrl.value = dataUrl
    } else {
      compactLogoUrl.value = dataUrl
    }
    showSuccess('Logo converted to inline data URL. Remember to save changes.')
  } catch (error) {
    console.error('Error processing logo:', error)
    showError('Failed to process logo')
  } finally {
    if (type === 'primary') {
      uploadingLogo.value = false
      if (logoInput.value) logoInput.value.value = ''
    } else {
      uploadingCompactLogo.value = false
      if (compactLogoInput.value) compactLogoInput.value.value = ''
    }
  }
}

function handleLogoDrop(type, event) {
  const files = event?.dataTransfer?.files
  if (!files || !files.length) return
  handleLogoChange(type, { target: { files } })
}

function resetLogo(type) {
  if (type === 'primary') {
    logoUrl.value = ''
  } else {
    compactLogoUrl.value = ''
  }
}

async function saveBranding() {
  if (!siteName.value.trim()) {
    showError('Website name is required')
    return
  }

  savingBranding.value = true
  try {
    await settingsService.updateSettings({
      siteName: siteName.value.trim(),
      primaryColor: normalizeColor(primaryColor.value),
      logoUrl: logoUrl.value,
      compactLogoUrl: compactLogoUrl.value,
    })
    showSuccess('Branding updated')
  } catch (error) {
    console.error('Error updating branding:', error)
    showError('Failed to save branding')
  } finally {
    savingBranding.value = false
  }
}

async function refreshVisitSummary() {
  await loadVisitSummary()
}

onMounted(() => {
  loadSettings()
  loadVisitSummary()
})

onBeforeUnmount(() => {
  if (copyTimeoutId) {
    clearTimeout(copyTimeoutId)
  }
})
</script>


