<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from './composables/useAuth'
import { useBranding } from './composables/useBranding'
import PageLoader from './components/PageLoader.vue'
import { settingsService } from './firebase/firestore'

const router = useRouter()
const auth = useAuth()
const { initBranding } = useBranding()
const isInitialLoad = ref(false) // Start as false, only show if loader is enabled
const showPageLoader = ref(false) // Start as false, will be set based on setting

onMounted(async () => {
  try {
    initBranding()
    // Check if page loader is enabled FIRST
    try {
      const settings = await settingsService.getSettings()
      showPageLoader.value = settings.pageLoaderEnabled !== false // Default to true if undefined
    } catch (error) {
      console.error('Error loading page loader setting:', error)
      showPageLoader.value = true // Default to enabled on error
    }

    // If page loader is disabled, skip loading state entirely
    if (!showPageLoader.value) {
      // Still need to initialize auth and router, but don't show loader
      auth.init()
      await Promise.all([
        router.isReady(),
        auth.waitForAuth()
      ])
      return
    }

    // Page loader is enabled, show it
    isInitialLoad.value = true

    // Initialize auth
    auth.init()
    
    // Wait for both router and auth to be ready
    await Promise.all([
      router.isReady(),
      auth.waitForAuth()
    ])
    
    // Wait for next tick to ensure router-view is ready, then add small delay for smooth transition
    await nextTick()
    setTimeout(() => {
      isInitialLoad.value = false
    }, 100)
  } catch (error) {
    console.error('Error during initial load:', error)
    // Hide loader even on error
    isInitialLoad.value = false
  }
})
</script>

<template>
  <PageLoader v-if="isInitialLoad && showPageLoader" />
  <router-view v-if="!isInitialLoad" />
</template>

<!-- <style scoped>
/* Optional: global styles for all pages */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}
</style> -->