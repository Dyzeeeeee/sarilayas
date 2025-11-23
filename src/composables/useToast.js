import { ref } from 'vue'

const toasts = ref([])

export function useToast() {
  const showToast = (message, type = 'success', duration = 3000, options = {}) => {
    const id = Date.now() + Math.random()
    const toast = {
      id,
      message,
      type, // 'success', 'error', 'info', 'warning'
      duration,
      image: options.image || null,
      notificationType: options.type || null
    }
    
    toasts.value.push(toast)
    
    setTimeout(() => {
      removeToast(id)
    }, duration)
    
    return id
  }
  
  const removeToast = (id) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }
  
  const success = (message, duration, options) => showToast(message, 'success', duration, options)
  const error = (message, duration, options) => showToast(message, 'error', duration, options)
  const info = (message, duration, options) => showToast(message, 'info', duration, options)
  const warning = (message, duration, options) => showToast(message, 'warning', duration, options)
  
  return {
    toasts,
    showToast,
    removeToast,
    success,
    error,
    info,
    warning
  }
}

