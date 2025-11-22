<template>
  <AdminLayout>
    <div class="space-y-4 md:space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl md:text-2xl font-semibold text-gray-900 tracking-tight">Messages</h1>
          <p class="text-xs md:text-sm text-gray-500 mt-1">View and manage contact form submissions</p>
        </div>
        <button
          @click="loadMessages"
          class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title="Refresh messages"
        >
          <RefreshCw class="h-4 w-4 text-gray-500" />
        </button>
      </div>

      <!-- Messages List -->
      <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div class="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-base md:text-lg font-semibold text-gray-900">All Messages</h2>
          <div class="flex items-center gap-2">
            <button
              @click="filter = 'all'"
              class="px-2 py-0.5 text-xs font-medium rounded-full transition-colors"
              :class="filter === 'all' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
            >
              {{ messages.length }} Total
            </button>
            <button
              @click="filter = 'unread'"
              class="px-2 py-0.5 text-xs font-medium rounded-full transition-colors"
              :class="filter === 'unread' 
                ? 'bg-primary-600 text-white' 
                : 'bg-primary-100 text-primary-700 hover:bg-primary-200'"
            >
              {{ unreadCount }} Unread
            </button>
            <button
              @click="filter = 'read'"
              class="px-2 py-0.5 text-xs font-medium rounded-full transition-colors"
              :class="filter === 'read' 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
            >
              {{ readCount }} Read
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="p-4 md:p-6 space-y-3">
          <div v-for="n in 5" :key="n" class="flex items-center gap-4 animate-pulse">
            <div class="w-10 h-10 rounded-full bg-gray-200"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 rounded w-1/4"></div>
              <div class="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>

        <!-- Messages -->
        <div v-else-if="filteredMessages.length > 0" class="divide-y divide-gray-200">
          <div
            v-for="message in filteredMessages"
            :key="message.id"
            @click="openMessageModal(message)"
            class="px-4 md:px-6 py-3 md:py-4 hover:bg-gray-50 transition-colors cursor-pointer"
            :class="{ 'bg-primary-50/30': !message.read }"
          >
            <div class="flex items-center gap-4">
              <!-- Avatar/Icon -->
              <div class="shrink-0">
                <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <Mail class="h-5 w-5 text-primary-600" />
                </div>
              </div>

              <!-- Message Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="text-sm font-semibold text-gray-900">{{ message.name }}</h3>
                  <span
                    v-if="!message.read"
                    class="px-1.5 py-0.5 text-[10px] font-medium bg-primary-600 text-white rounded-full"
                  >
                    New
                  </span>
                  <span class="text-xs text-gray-400">•</span>
                  <span class="text-xs text-primary-600">{{ message.email }}</span>
                  <span class="text-xs text-gray-400">•</span>
                  <span class="text-xs text-gray-500">{{ formatDate(message.createdAt) }}</span>
                </div>
                <div class="text-sm font-medium text-gray-700 mb-1">{{ message.subject }}</div>
                <p class="text-xs text-gray-600 line-clamp-2">{{ message.message }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="p-12 text-center">
          <Mail class="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 class="text-sm md:text-base font-medium text-gray-900 mb-1">No messages</h3>
          <p class="text-xs md:text-sm text-gray-500">
            {{ filter === 'all' ? 'No messages yet' : filter === 'unread' ? 'No unread messages' : 'No read messages' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Message Detail Modal -->
    <Teleport to="body">
      <div
        v-if="showMessageModal && selectedMessage"
        class="fixed inset-0 z-60 flex items-center justify-center p-4"
        @click.self="closeMessageModal"
        @keydown.esc="closeMessageModal"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        
        <!-- Modal Content -->
        <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <Mail class="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">{{ selectedMessage.name }}</h2>
                <p class="text-sm text-gray-500">{{ selectedMessage.email }}</p>
              </div>
            </div>
            <button
              @click="closeMessageModal"
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X class="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <!-- Modal Body -->
          <div class="flex-1 overflow-y-auto p-6 space-y-4">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <span class="text-sm font-semibold text-gray-700">Subject:</span>
                <span
                  v-if="!selectedMessage.read"
                  class="px-2 py-0.5 text-xs font-medium bg-primary-600 text-white rounded-full"
                >
                  New
                </span>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ selectedMessage.subject }}</h3>
            </div>

            <div>
              <span class="text-sm font-semibold text-gray-700">Message:</span>
              <p class="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap mt-2">{{ selectedMessage.message }}</p>
            </div>

            <div class="pt-4 border-t border-gray-200">
              <span class="text-xs text-gray-500">{{ formatDate(selectedMessage.createdAt) }}</span>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between shrink-0">
            <button
              @click="toggleRead(selectedMessage)"
              class="px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
              :class="selectedMessage.read 
                ? 'text-gray-600 bg-gray-100 hover:bg-gray-200' 
                : 'text-primary-600 bg-primary-100 hover:bg-primary-200'"
            >
              <MailOpen v-if="selectedMessage.read" class="h-4 w-4" />
              <Mail v-else class="h-4 w-4" />
              {{ selectedMessage.read ? 'Mark as Unread' : 'Mark as Read' }}
            </button>
            <div class="flex items-center gap-2">
              <a
                :href="getGmailReplyUrl(selectedMessage)"
                target="_blank"
                rel="noopener noreferrer"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Reply class="h-4 w-4" />
                Reply
              </a>
              <button
                @click="deleteMessage(selectedMessage)"
                class="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 class="h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted, Teleport } from 'vue'
import AdminLayout from '../../layouts/AdminLayout.vue'
import { contactService } from '../../firebase/firestore'
import { useToast } from '../../composables/useToast'
import { useConfirm } from '../../composables/useConfirm'
import { useBodyScrollLock } from '../../composables/useBodyScrollLock'
import { Mail, MailOpen, Reply, Trash2, RefreshCw, X } from 'lucide-vue-next'

const { success: showSuccess, error: showError } = useToast()
const { confirm } = useConfirm()
const { useLock } = useBodyScrollLock()

const loading = ref(true)
const messages = ref([])
const selectedMessage = ref(null)
const filter = ref('all')
const showMessageModal = ref(false)

// Lock body scroll when modal is open
useLock(showMessageModal)

const unreadCount = computed(() => {
  return messages.value.filter(m => !m.read).length
})

const readCount = computed(() => {
  return messages.value.filter(m => m.read).length
})

const filteredMessages = computed(() => {
  if (filter.value === 'unread') {
    return messages.value.filter(m => !m.read)
  } else if (filter.value === 'read') {
    return messages.value.filter(m => m.read)
  }
  return messages.value
})

function openMessageModal(message) {
  selectedMessage.value = message
  showMessageModal.value = true
  // Mark as read when opening
  if (!message.read) {
    toggleRead(message)
  }
}

function closeMessageModal() {
  selectedMessage.value = null
  showMessageModal.value = false
}

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
    // Dispatch event to update sidebar badge
    window.dispatchEvent(new Event('messages-updated'))
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
      if (selectedMessage.value?.id === message.id) {
        closeMessageModal()
      }
      showSuccess('Message deleted successfully')
      // Dispatch event to update sidebar badge
      window.dispatchEvent(new Event('messages-updated'))
    } catch (error) {
      console.error('Error deleting message:', error)
      showError('Failed to delete message')
    }
  }
}

function getGmailReplyUrl(message) {
  const to = encodeURIComponent(message.email)
  const subject = encodeURIComponent(`Re: ${message.subject}`)
  
  // Format date for email
  let dateStr = 'Unknown date'
  if (message.createdAt) {
    let dateObj
    if (message.createdAt.toDate) {
      dateObj = message.createdAt.toDate()
    } else if (message.createdAt instanceof Date) {
      dateObj = message.createdAt
    } else if (typeof message.createdAt === 'string' || typeof message.createdAt === 'number') {
      dateObj = new Date(message.createdAt)
    }
    
    if (dateObj) {
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
      dateStr = dateObj.toLocaleDateString('en-US', options)
    }
  }
  
  const body = encodeURIComponent(
    `\n\n---\nOn ${dateStr}, ${message.name} wrote:\n${message.message}`
  )
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`
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
    return `${diffMinutes}m ago`
  } else if (diffHours < 24) {
    return `${diffHours}h ago`
  } else if (diffDays < 7) {
    return `${diffDays}d ago`
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
