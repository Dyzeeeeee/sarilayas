<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Backdrop -->
        <div
          class="fixed inset-0 transition-opacity backdrop-overlay"
          @click="handleCancel"
        ></div>

        <!-- Modal -->
        <div class="flex min-h-full items-center justify-center p-4">
          <div
            class="relative bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all"
            @click.stop
          >
            <!-- Header -->
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-semibold text-gray-900">
                {{ title }}
              </h3>
            </div>

            <!-- Body -->
            <div class="px-6 py-4">
              <p class="text-sm text-gray-600">
                {{ message }}
              </p>
            </div>

            <!-- Footer -->
            <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                @click="handleCancel"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                @click="handleConfirm"
                class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors text-sm font-semibold"
              >
                {{ confirmText }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirm Action'
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  }
})

const emit = defineEmits(['confirm', 'cancel', 'update:isOpen'])

const handleConfirm = () => {
  emit('confirm')
  emit('update:isOpen', false)
}

const handleCancel = () => {
  emit('cancel')
  emit('update:isOpen', false)
}

// Close on Escape key
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleCancel()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }
})
</script>

<style scoped>
.backdrop-overlay {
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.95);
  opacity: 0;
}

.modal-enter-from .backdrop-overlay,
.modal-leave-to .backdrop-overlay {
  opacity: 0;
}
</style>

