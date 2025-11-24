<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from './composables/useAuth'
import PageLoader from './components/PageLoader.vue'

const router = useRouter()
const auth = useAuth()
const isInitialLoad = ref(true)

onMounted(async () => {
  try {
    // Initialize auth
    auth.init()
    
    // Wait for both router and auth to be ready
    await Promise.all([
      router.isReady(),
      auth.waitForAuth()
    ])
    
    // Small delay to ensure smooth transition
    setTimeout(() => {
      isInitialLoad.value = false
    }, 300)
  } catch (error) {
    console.error('Error during initial load:', error)
    // Hide loader even on error
    setTimeout(() => {
      isInitialLoad.value = false
    }, 500)
  }
})
</script>

<template>
  <PageLoader v-if="isInitialLoad" />
  <router-view v-show="!isInitialLoad" />
</template>

<!-- <style scoped>
/* Optional: global styles for all pages */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}
</style> -->