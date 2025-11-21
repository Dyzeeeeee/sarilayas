<template>
  <AdminLayout>
    <div class="space-y-4">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl font-semibold text-gray-900 tracking-tight">Messages</h1>
          <p class="text-xs text-gray-500 mt-1">View and manage contact form submissions</p>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="loadMessages"
            class="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-white rounded-lg border border-gray-200/80 p-4">
          <div class="text-xs text-gray-500 mb-1">Total Messages</div>
          <div class="text-2xl font-bold text-gray-900">{{ messages.length }}</div>
        </div>
        <div class="bg-white rounded-lg border border-gray-200/80 p-4">
          <div class="text-xs text-gray-500 mb-1">Unread</div>
          <div class="text-2xl font-bold text-primary-600">{{ unreadCount }}</div>
        </div>
        <div class="bg-white rounded-lg border border-gray-200/80 p-4">
          <div class="text-xs text-gray-500 mb-1">Read</div>
          <div class="text-2xl font-bold text-gray-600">{{ readCount }}</div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-lg border border-gray-200/80 p-4 space-y-4">
        <div v-for="n in 5" :key="n" class="space-y-3 animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-1/4"></div>
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>

      <!-- Messages List -->
      <div v-else-if="messages.length > 0" class="space-y-3">
        <div
          v-for="message in messages"
          :key="message.id"
          class="bg-white rounded-lg border border-gray-200/80 p-4 hover:shadow-md transition-shadow"
          :class="{ 'border-primary-300 bg-primary-50/30': !message.read }"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-2">
                <h3 class="text-sm font-semibold text-gray-900">{{ message.name }}</h3>
                <span
                  v-if="!message.read"
                  class="px-2 py-0.5 text-xs font-medium bg-primary-600 text-white rounded-full"
                >
                  New
                </span>
                <a
                  :href="`mailto:${message.email}`"
                  class="text-xs text-primary-600 hover:text-primary-700 hover:underline"
                >
                  {{ message.email }}
                </a>
              </div>
              <div class="text-sm font-medium text-gray-700 mb-2">{{ message.subject }}</div>
              <p class="text-sm text-gray-600 leading-relaxed mb-3 whitespace-pre-wrap">{{ message.message }}</p>
              <div class="text-xs text-gray-500">
                {{ formatDate(message.createdAt) }}
              </div>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <button
                @click="toggleRead(message)"
                class="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
                :class="message.read 
                  ? 'text-gray-600 bg-gray-100 hover:bg-gray-200' 
                  : 'text-primary-600 bg-primary-100 hover:bg-primary-200'"
              >
                {{ message.read ? 'Mark Unread' : 'Mark Read' }}
              </button>
              <button
                @click="deleteMessage(message)"
                class="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white rounded-lg border border-gray-200/80 p-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <h3 class="text-sm font-medium text-gray-900 mb-1">No messages yet</h3>
        <p class="text-xs text-gray-500">Contact form submissions will appear here</p>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '../../layouts/AdminLayout.vue'
import { contactService } from '../../firebase/firestore'
import { useToast } from '../../composables/useToast'
import { useConfirm } from '../../composables/useConfirm'

const { success: showSuccess, error: showError } = useToast()
const { confirm } = useConfirm()

const loading = ref(true)
const messages = ref([])

const unreadCount = computed(() => {
  return messages.value.filter(m => !m.read).length
})

const readCount = computed(() => {
  return messages.value.filter(m => m.read).length
})

async function loadMessages() {
  loading.value = true
  try {
    const data = await contactService.getMessages()
    messages.value = data || []
  } catch (error) {
    console.error('Error loading messages:', error)
    showError('Failed to load messages')
  } finally {
    loading.value = false
  }
}

async function toggleRead(message) {
  try {
    const newReadStatus = !message.read
    await contactService.updateMessage(message.id, { read: newReadStatus })
    message.read = newReadStatus
    showSuccess(newReadStatus ? 'Message marked as read' : 'Message marked as unread')
  } catch (error) {
    console.error('Error updating message:', error)
    showError('Failed to update message')
  }
}

async function deleteMessage(message) {
  const confirmed = await confirm(
    `Are you sure you want to delete this message from ${message.name}?`,
    {
      title: 'Delete Message',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    }
  )

  if (confirmed) {
    try {
      await contactService.deleteMessage(message.id)
      messages.value = messages.value.filter(m => m.id !== message.id)
      showSuccess('Message deleted successfully')
    } catch (error) {
      console.error('Error deleting message:', error)
      showError('Failed to delete message')
    }
  }
}

function formatDate(date) {
  if (!date) return 'Unknown date'
  
  let dateObj
  if (date.toDate) {
    dateObj = date.toDate()
  } else if (date instanceof Date) {
    dateObj = date
  } else if (typeof date === 'string' || typeof date === 'number') {
    dateObj = new Date(date)
  } else {
    return 'Unknown date'
  }
  
  const now = new Date()
  const diffMs = now - dateObj
  const diffMinutes = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffMinutes < 1) {
    return 'Just now'
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  }
  
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  return dateObj.toLocaleDateString('en-US', options)
}

onMounted(() => {
  loadMessages()
})
</script>

