<template>
  <Transition name="page-loader">
    <div
      v-if="isLoading"
      class="fixed inset-0 bg-gradient-to-br from-primary-100 via-primary-50 to-primary-200 z-[9999] flex items-center justify-center"
    >
      <div class="text-center">
        <!-- Words with animation -->
        <div class="mb-8 flex justify-center items-center">
          <span class="text-2xl md:text-3xl lg:text-4xl font-bold text-pink-600 animate-word-slide-in-left">
            Kasarian Kalayaan Inc.
          </span>
        </div>
        
        <!-- Logo with scale animation -->
        <div class="mb-12 transform transition-all duration-500">
          <img
            :src="primaryLogo"
            :alt="`${siteName} Logo`"
            class="h-32 md:h-40 w-auto mx-auto object-contain animate-logo-float"
            style="opacity: 1;"
          />
        </div>
        
        <!-- Loading Dots Animation -->
        <div class="flex justify-center items-center gap-2 mb-6">
          <div class="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style="animation-delay: 0s"></div>
          <div class="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          <div class="w-3 h-3 bg-primary-600 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
        </div>
        
        <!-- Loading Text with fade animation -->
        <p class="text-primary-700 font-medium text-lg animate-pulse">Loading {{ siteName }}...</p>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useBranding } from '../composables/useBranding'

const isLoading = ref(true)
const { branding, initBranding } = useBranding()
initBranding()

const siteName = computed(() => branding.value.siteName || 'Sarilaya')
const primaryLogo = computed(() => branding.value.logoUrl || '/MainSarilayaLogo.png')

onMounted(() => {
  // Hide loader after a short delay to ensure smooth transition
  // The actual page content will handle its own loading states
  setTimeout(() => {
    isLoading.value = false
  }, 300)
})

// Expose method to control loader from parent
defineExpose({
  show: () => { isLoading.value = true },
  hide: () => { isLoading.value = false }
})
</script>

<style scoped>
/* Page loader transition */
.page-loader-enter-active {
  transition: opacity 0.4s ease-out;
}

.page-loader-leave-active {
  transition: opacity 0.3s ease-in;
}

.page-loader-enter-from,
.page-loader-leave-to {
  opacity: 0;
}

/* Word slide in animation */
@keyframes word-slide-in {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-word-slide-in-left {
  animation: word-slide-in 0.8s ease-out forwards;
  animation-delay: 0.2s;
  opacity: 0;
}

/* Logo float animation */
@keyframes logo-float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-logo-float {
  animation: logo-float 2s ease-in-out infinite, logo-fade-in 0.6s ease-out forwards;
  animation-delay: 0.6s, 0.6s;
}

@keyframes logo-fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

/* Bounce animation for dots */
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

