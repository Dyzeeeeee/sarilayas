<template>
  <PublicLayout>
    <div class="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div class="text-center max-w-md w-full">
        <!-- Logo -->
        <div class="mb-8">
          <img
            :src="primaryLogo"
            :alt="`${siteName} Logo`"
            class="h-20 md:h-24 w-auto mx-auto object-contain"
          />
        </div>

        <!-- 404 Text -->
        <h1 class="text-6xl md:text-8xl font-bold text-primary-600 mb-4">404</h1>
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
        <p class="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <!-- Decorative Elements -->
        <div class="flex justify-center items-center gap-4 mb-8">
          <span class="text-xl md:text-2xl font-bold text-pink-600">KASARIAN</span>
          <span class="text-primary-400 text-lg md:text-xl">•</span>
          <span class="text-xl md:text-2xl font-bold text-green-600">KALAYAAN</span>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link
            to="/"
            class="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Go to Home
          </router-link>
          <button
            @click="$router.go(-1)"
            class="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  </PublicLayout>
</template>

<script setup>
import { computed } from 'vue'
import PublicLayout from '../layouts/PublicLayout.vue'
import { useBranding } from '../composables/useBranding'

const { branding, initBranding } = useBranding()
initBranding()

const siteName = computed(() => branding.value.siteName || 'Sarilaya')
const primaryLogo = computed(() => branding.value.logoUrl || '/MainSarilayaLogo.png')
</script>

<style scoped>
/* No additional styles needed */
</style>

