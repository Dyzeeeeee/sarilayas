import { ref, watch, onUnmounted } from 'vue'

// Global modal counter to track how many modals are open
const modalCount = ref(0)
const originalOverflow = ref('')

export function useBodyScrollLock() {
  const lock = () => {
    if (modalCount.value === 0) {
      // Save original overflow value
      originalOverflow.value = document.body.style.overflow
      // Lock scroll
      document.body.style.overflow = 'hidden'
    }
    modalCount.value++
  }

  const unlock = () => {
    modalCount.value--
    if (modalCount.value <= 0) {
      modalCount.value = 0
      // Restore original overflow
      document.body.style.overflow = originalOverflow.value || ''
    }
  }

  // Auto lock/unlock based on a reactive value
  const useLock = (isOpen) => {
    watch(
      () => isOpen.value,
      (open) => {
        if (open) {
          lock()
        } else {
          unlock()
        }
      },
      { immediate: true }
    )

    onUnmounted(() => {
      if (isOpen.value) {
        unlock()
      }
    })
  }

  return {
    lock,
    unlock,
    useLock
  }
}

