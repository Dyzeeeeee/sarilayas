<template>
  <AdminLayout>
    <div class="space-y-3 md:space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Settings</h1>
        <p class="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">Manage site settings and preferences</p>
      </div>

      <!-- Site Status Toggle -->
      <div class="bg-white rounded-xl border border-gray-200 p-4 md:p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <h3 class="text-base md:text-lg font-semibold text-gray-900 mb-1">Public Site Status</h3>
            <p class="text-xs md:text-sm text-gray-500">
              {{ siteEnabled ? 'Public site is currently live' : 'Public site is currently disabled' }}
            </p>
            <p class="text-xs text-gray-400 mt-1">
              When disabled, public users will see a "Website Temporarily Down" message. Admin users can still access all pages.
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              v-model="siteEnabled"
              @change="updateSiteStatus"
              :disabled="updatingSiteStatus"
              class="sr-only peer"
            />
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>
      </div>

      <!-- Page Loader Toggle -->
      <div class="bg-white rounded-xl border border-gray-200 p-4 md:p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <h3 class="text-base md:text-lg font-semibold text-gray-900 mb-1">Page Loader</h3>
            <p class="text-xs md:text-sm text-gray-500">
              {{ pageLoaderEnabled ? 'Page loader is currently enabled' : 'Page loader is currently disabled' }}
            </p>
            <p class="text-xs text-gray-400 mt-1">
              When enabled, a branded loading screen will display during initial page load.
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              v-model="pageLoaderEnabled"
              @change="updatePageLoaderStatus"
              :disabled="updatingPageLoaderStatus"
              class="sr-only peer"
            />
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
          </label>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '../../layouts/AdminLayout.vue'
import { settingsService } from '../../firebase/firestore'
import { useToast } from '../../composables/useToast'

const { success: showSuccess, error: showError } = useToast()
const siteEnabled = ref(true)
const pageLoaderEnabled = ref(true)
const updatingSiteStatus = ref(false)
const updatingPageLoaderStatus = ref(false)

async function loadSettings() {
  try {
    const settings = await settingsService.getSettings()
    siteEnabled.value = settings.siteEnabled !== false // Default to true if undefined
    pageLoaderEnabled.value = settings.pageLoaderEnabled !== false // Default to true if undefined
  } catch (error) {
    console.error('Error loading settings:', error)
    siteEnabled.value = true // Default to enabled on error
    pageLoaderEnabled.value = true
  }
}

async function updateSiteStatus() {
  updatingSiteStatus.value = true
  try {
    await settingsService.updateSettings({ siteEnabled: siteEnabled.value })
    showSuccess(siteEnabled.value ? 'Public site is now live' : 'Public site has been disabled')
  } catch (error) {
    console.error('Error updating site status:', error)
    showError('Failed to update site status')
    // Revert the toggle on error
    siteEnabled.value = !siteEnabled.value
  } finally {
    updatingSiteStatus.value = false
  }
}

async function updatePageLoaderStatus() {
  updatingPageLoaderStatus.value = true
  try {
    await settingsService.updateSettings({ pageLoaderEnabled: pageLoaderEnabled.value })
    showSuccess(pageLoaderEnabled.value ? 'Page loader is now enabled' : 'Page loader has been disabled')
  } catch (error) {
    console.error('Error updating page loader status:', error)
    showError('Failed to update page loader status')
    // Revert the toggle on error
    pageLoaderEnabled.value = !pageLoaderEnabled.value
  } finally {
    updatingPageLoaderStatus.value = false
  }
}

onMounted(() => {
  loadSettings()
})
</script>

