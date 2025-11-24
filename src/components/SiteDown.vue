<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-100 via-primary-50 to-primary-200 flex items-center justify-center px-4">
    <div class="text-center max-w-md w-full">
      <!-- Logo -->
      <div class="mb-8">
        <img
          :src="primaryLogo"
          :alt="`${siteName} Logo`"
          class="h-24 md:h-32 w-auto mx-auto object-contain"
        />
      </div>

      <!-- Main Message -->
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Website Temporarily Down
      </h1>
      <p class="text-lg md:text-xl text-gray-600 mb-8">
        We're currently performing maintenance. Please check back soon.
      </p>

      <!-- Decorative Elements -->
      <div class="flex justify-center items-center gap-4 mb-8">
        <span class="text-2xl md:text-3xl font-bold text-pink-600">KASARIAN</span>
        <span class="text-primary-400 text-xl md:text-2xl">•</span>
        <span class="text-2xl md:text-3xl font-bold text-green-600">KALAYAAN</span>
      </div>

      <!-- Loading Animation -->
      <div class="flex justify-center items-center gap-2">
        <div class="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style="animation-delay: 0s"></div>
        <div class="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        <div class="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useBranding } from '../composables/useBranding'

const { branding, initBranding } = useBranding()
initBranding()

const siteName = computed(() => branding.value.siteName || 'Sarilaya')
const primaryLogo = computed(() => branding.value.logoUrl || '/MainSarilayaLogo.png')
</script>

<style scoped>
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
    opacity: 1;
  }
  50% {
    transform: translateY(-12px);
    opacity: 0.7;
  }
}

.animate-bounce {
  animation: bounce 1.4s ease-in-out infinite;
}
</style>

