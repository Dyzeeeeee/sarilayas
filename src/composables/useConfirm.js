import { ref } from 'vue'

const confirmState = ref({
  isOpen: false,
  title: 'Confirm Action',
  message: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  resolve: null
})

export function useConfirm() {
  const confirm = (message, options = {}) => {
    return new Promise((resolve) => {
      confirmState.value = {
        isOpen: true,
        title: options.title || 'Confirm Action',
        message,
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        resolve
      }
    })
  }
  
  const handleConfirm = () => {
    if (confirmState.value.resolve) {
      confirmState.value.resolve(true)
    }
    confirmState.value.isOpen = false
  }
  
  const handleCancel = () => {
    if (confirmState.value.resolve) {
      confirmState.value.resolve(false)
    }
    confirmState.value.isOpen = false
  }
  
  return {
    confirmState,
    confirm,
    handleConfirm,
    handleCancel
  }
}

