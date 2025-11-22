<template>
  <AdminLayout>
    <div class="space-y-4 md:space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-xl md:text-2xl font-semibold text-gray-900 tracking-tight">Videos</h1>
          <p class="text-xs md:text-sm text-gray-500 mt-1">Manage YouTube video links</p>
        </div>
        <button
          @click="showVideoModal = true; editingVideo = null; form = { title: '', description: '', url: '' }"
          class="px-3 py-1.5 text-xs font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
        >
          <Plus class="h-4 w-4" />
          Add Video
        </button>
      </div>

      <!-- Videos Grid -->
      <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div class="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-base md:text-lg font-semibold text-gray-900">All Videos</h2>
          <div class="flex items-center gap-2">
            <button
              @click="viewMode = 'grid'"
              class="p-2 rounded-lg transition-colors"
              :class="viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-500 hover:bg-gray-100'"
              title="Grid view"
            >
              <Grid3x3 class="h-4 w-4" />
            </button>
            <button
              @click="viewMode = 'list'"
              class="p-2 rounded-lg transition-colors"
              :class="viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-500 hover:bg-gray-100'"
              title="List view"
            >
              <List class="h-4 w-4" />
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loadingData" class="p-4 md:p-6">
          <div :class="viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3' : 'space-y-3'">
            <div v-for="i in 10" :key="i" class="animate-pulse" :class="viewMode === 'list' ? 'flex gap-3' : ''">
              <div :class="viewMode === 'grid' ? 'aspect-video bg-gray-200 rounded-lg mb-2' : 'w-32 h-20 bg-gray-200 rounded-lg shrink-0'"></div>
              <div class="flex-1">
                <div class="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                <div class="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Videos Grid View -->
        <div v-else-if="videos.length > 0 && viewMode === 'grid'" class="p-4 md:p-6">
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            <div
              v-for="video in videos"
              :key="video.id"
              class="group relative border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors"
            >
              <!-- Video Thumbnail -->
              <div class="aspect-video bg-gray-100 relative">
                <img
                  :src="getYouTubeThumbnail(video.url)"
                  :alt="video.title"
                  class="w-full h-full object-cover"
                />
                <!-- Overlay Actions -->
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div class="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                    <button
                      @click.stop="handleEdit(video)"
                      class="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                      title="Edit video"
                    >
                      <Edit class="h-4 w-4 text-gray-700" />
                    </button>
                    <button
                      @click.stop="handleDelete(video.id)"
                      class="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                      title="Delete video"
                    >
                      <Trash2 class="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Video Info -->
              <div class="p-2 md:p-3">
                <h3 class="text-xs md:text-sm font-semibold text-gray-900 mb-1 line-clamp-2">{{ video.title || 'Untitled' }}</h3>
                <p v-if="video.description" class="text-[10px] md:text-xs text-gray-600 line-clamp-2 mb-1">{{ video.description }}</p>
                <p class="text-[10px] text-gray-500">{{ formatDate(video.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Videos List View -->
        <div v-else-if="videos.length > 0 && viewMode === 'list'" class="divide-y divide-gray-200">
          <div
            v-for="video in videos"
            :key="video.id"
            class="group p-3 md:p-4 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center gap-3 md:gap-4">
              <!-- Video Thumbnail -->
              <div class="w-24 md:w-32 h-16 md:h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0 relative">
                <img
                  :src="getYouTubeThumbnail(video.url)"
                  :alt="video.title"
                  class="w-full h-full object-cover"
                />
              </div>

              <!-- Video Info -->
              <div class="flex-1 min-w-0">
                <h3 class="text-sm md:text-base font-semibold text-gray-900 mb-1 line-clamp-1">{{ video.title || 'Untitled' }}</h3>
                <p v-if="video.description" class="text-xs md:text-sm text-gray-600 line-clamp-2 mb-1">{{ video.description }}</p>
                <div class="flex items-center gap-2 text-xs text-gray-500">
                  <span>{{ formatDate(video.createdAt) }}</span>
                  <span>•</span>
                  <span class="truncate">{{ video.url }}</span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  @click="handleEdit(video)"
                  class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Edit video"
                >
                  <Edit class="h-4 w-4 text-gray-700" />
                </button>
                <button
                  @click="handleDelete(video.id)"
                  class="p-2 rounded-lg hover:bg-red-50 transition-colors"
                  title="Delete video"
                >
                  <Trash2 class="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="p-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <h3 class="text-sm md:text-base font-medium text-gray-900 mb-1">No videos yet</h3>
          <p class="text-xs md:text-sm text-gray-500">Add your first video to get started</p>
        </div>
      </div>
    </div>

    <!-- Video Add/Edit Modal -->
    <Teleport to="body">
      <div
        v-if="showVideoModal"
        class="fixed inset-0 z-60 flex items-center justify-center p-4"
        @click.self="closeVideoModal"
        @keydown.esc="closeVideoModal"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        
        <!-- Modal Content -->
        <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
            <h2 class="text-lg font-semibold text-gray-900">
              {{ editingVideo ? 'Edit Video' : 'Add New Video' }}
            </h2>
            <button
              @click="closeVideoModal"
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X class="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <!-- Modal Body (Two Columns) -->
          <div class="flex-1 overflow-hidden flex flex-col md:flex-row">
            <!-- Preview Column - Hidden on mobile -->
            <div class="hidden md:block w-1/2 border-r border-gray-200 overflow-y-auto p-6 bg-gray-50">
              <p class="text-sm font-semibold text-gray-700 mb-4">Preview</p>
              <div class="space-y-4">
                <div
                  v-for="(url, index) in getUrlList()"
                  :key="index"
                  class="bg-white rounded-lg border border-gray-200 p-4"
                >
                  <div v-if="getYouTubeEmbedUrl(url)" class="aspect-video rounded-lg overflow-hidden bg-gray-100 mb-3">
                    <iframe
                      :src="getYouTubeEmbedUrl(url)"
                      class="w-full h-full"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowfullscreen
                    ></iframe>
                  </div>
                  <div v-else class="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                    <p class="text-xs text-gray-500 text-center px-4">Invalid YouTube URL</p>
                  </div>
                  <div class="space-y-2">
                    <h3 class="text-sm font-semibold text-gray-900">{{ form.title || 'Video Title' }}</h3>
                    <p v-if="form.description" class="text-xs text-gray-600">{{ form.description }}</p>
                  </div>
                </div>
                <div v-if="getUrlList().length === 0" class="bg-white rounded-lg border border-gray-200 p-4">
                  <p class="text-xs text-gray-500 text-center">Enter YouTube URL(s) to see preview</p>
                </div>
              </div>
            </div>

            <!-- Editor Column -->
            <div class="w-full md:w-1/2 overflow-y-auto p-6 space-y-4">
              <!-- Preview Button - Mobile Only -->
              <button
                @click="showPreviewModal = true"
                type="button"
                class="md:hidden w-full px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 transition-colors flex items-center justify-center gap-2 mb-4"
              >
                <Eye class="h-4 w-4" />
                Preview
              </button>
              <form @submit.prevent="saveVideoAndClose" class="space-y-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    YouTube URL(s) *
                  </label>
                  <textarea
                    v-model="form.url"
                    rows="6"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm resize-none font-mono"
                    placeholder="https://youtube.com/watch?v=...&#10;https://youtube.com/watch?v=...&#10;https://youtube.com/watch?v=..."
                  ></textarea>
                  <p class="text-xs text-gray-500 mt-1">
                    Paste one or more YouTube URLs (one per line). Titles and descriptions will be fetched automatically after adding.
                    <span v-if="getUrlList().length > 0" class="block mt-1 text-primary-600 font-medium">
                      {{ getUrlList().length }} URL{{ getUrlList().length > 1 ? 's' : '' }} detected
                    </span>
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Title (optional - will be fetched automatically if left empty)
                    <span v-if="getUrlList().length > 1" class="text-xs text-gray-500 font-normal">(disabled for multiple uploads)</span>
                  </label>
                  <input
                    v-model="form.title"
                    type="text"
                    :disabled="fetchingMetadata || getUrlList().length > 1"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Video title (leave empty to auto-fetch)"
                  />
                  <p v-if="fetchingMetadata" class="text-xs text-primary-600 mt-1 flex items-center gap-1">
                    <svg class="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Fetching title...
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    v-model="form.description"
                    rows="4"
                    :disabled="fetchingMetadata"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Video description"
                  ></textarea>
                  <p v-if="fetchingMetadata" class="text-xs text-primary-600 mt-1 flex items-center gap-1">
                    <svg class="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Fetching description...
                  </p>
                </div>
              </form>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 shrink-0">
            <button
              @click="closeVideoModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="saveVideoAndClose"
              :disabled="loading || !form.url || getUrlList().length === 0"
              class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="loading">Saving...</span>
              <span v-else-if="editingVideo">Update Video</span>
              <span v-else>Add {{ getUrlList().length > 1 ? `${getUrlList().length} Videos` : 'Video' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Preview Modal - Mobile Only -->
    <Teleport to="body">
      <div
        v-if="showPreviewModal"
        @click.self="showPreviewModal = false"
        @keydown.esc="showPreviewModal = false"
        class="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4"
        tabindex="-1"
      >
        <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
            <h2 class="text-lg font-semibold text-gray-900">Preview</h2>
            <button
              @click="showPreviewModal = false"
              class="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
            >
              <X class="h-5 w-5" />
            </button>
          </div>

          <!-- Preview Content -->
          <div class="flex-1 overflow-y-auto p-6 bg-gray-50">
            <div class="space-y-4">
              <div
                v-for="(url, index) in getUrlList()"
                :key="index"
                class="bg-white rounded-lg border border-gray-200 p-4"
              >
                <div v-if="getYouTubeEmbedUrl(url)" class="aspect-video rounded-lg overflow-hidden bg-gray-100 mb-3">
                  <iframe
                    :src="getYouTubeEmbedUrl(url)"
                    class="w-full h-full"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                </div>
                <div v-else class="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                  <p class="text-xs text-gray-500 text-center px-4">Invalid YouTube URL</p>
                </div>
                <div class="space-y-2">
                  <h3 class="text-sm font-semibold text-gray-900">{{ form.title || 'Video Title' }}</h3>
                  <p v-if="form.description" class="text-xs text-gray-600">{{ form.description }}</p>
                </div>
              </div>
              <div v-if="getUrlList().length === 0" class="bg-white rounded-lg border border-gray-200 p-4">
                <p class="text-xs text-gray-500 text-center">Enter YouTube URL(s) to see preview</p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-200 flex justify-end shrink-0">
            <button
              @click="showPreviewModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted, Teleport } from 'vue'
import AdminLayout from '../../layouts/AdminLayout.vue'
import { mediaService } from '../../firebase/firestore'
import { useToast } from '../../composables/useToast'
import { useConfirm } from '../../composables/useConfirm'
import { useBodyScrollLock } from '../../composables/useBodyScrollLock'
import { Plus, Edit, Trash2, X, Grid3x3, List, Eye } from 'lucide-vue-next'

const { success: showSuccess, error: showError } = useToast()
const { confirm } = useConfirm()
const { useLock } = useBodyScrollLock()

const loading = ref(false)
const loadingData = ref(true)
const videos = ref([])
const editingVideo = ref(null)
const showVideoModal = ref(false)
const showPreviewModal = ref(false)
const fetchingMetadata = ref(false)
const viewMode = ref('grid') // 'grid' or 'list'
const backgroundTasks = ref(new Set()) // Track background tasks

// Lock body scroll when modal is open
useLock(showVideoModal)
useLock(showPreviewModal)

const form = ref({
  title: '',
  description: '',
  url: ''
})

function getYouTubeVideoId(url) {
  if (!url) return null
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }
  
  return null
}

function getYouTubeEmbedUrl(url) {
  const videoId = getYouTubeVideoId(url)
  if (!videoId) return null
  return `https://www.youtube.com/embed/${videoId}`
}

function getYouTubeThumbnail(url) {
  const videoId = getYouTubeVideoId(url)
  if (!videoId) return 'https://via.placeholder.com/320x180?text=No+Video'
  // Use high quality thumbnail (hqdefault or maxresdefault)
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
}

async function fetchVideoMetadata() {
  const videoId = getYouTubeVideoId(form.value.url)
  if (!videoId || !form.value.url) {
    return
  }

  // Only fetch if title is empty
  if (form.value.title && form.value.title.trim()) {
    return
  }

  fetchingMetadata.value = true

  try {
    // Use YouTube oEmbed API (no authentication required) for title
    const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(form.value.url)}&format=json`
    const oEmbedResponse = await fetch(oEmbedUrl)
    
    if (oEmbedResponse.ok) {
      const oEmbedData = await oEmbedResponse.json()
      // Only set title if it's empty
      if (!form.value.title || !form.value.title.trim()) {
        form.value.title = oEmbedData.title || ''
      }
    } else {
      throw new Error('Failed to fetch video title')
    }

    // Try to get description from YouTube page using a CORS proxy
    // Only fetch description if title was successfully fetched (meaning we're auto-filling)
    if (!form.value.title || !form.value.title.trim()) {
      return // Don't fetch description if title fetch failed
    }

    try {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(form.value.url)}`
      const proxyResponse = await fetch(proxyUrl)
      
      if (proxyResponse.ok) {
        const proxyData = await proxyResponse.json()
        const html = proxyData.contents
        
        // Extract description from meta tag
        const descriptionMatch = html.match(/<meta name="description" content="([^"]+)"/)
        if (descriptionMatch && descriptionMatch[1]) {
          // YouTube descriptions can be very long, so truncate if needed
          let description = descriptionMatch[1]
          // Remove common YouTube suffixes
          description = description.replace(/\s*Subscribe.*$/i, '')
          description = description.replace(/\s*Watch.*$/i, '')
          // Only set description if it's empty
          if (!form.value.description || !form.value.description.trim()) {
            form.value.description = description.substring(0, 500) // Limit to 500 chars
          }
        }
      }
    } catch (proxyError) {
      console.warn('Could not fetch description:', proxyError)
      // Don't show error, just silently fail
    }
  } catch (error) {
    console.error('Error fetching video metadata:', error)
    // Don't show error if title is already filled (user might have entered it manually)
    if (!form.value.title || !form.value.title.trim()) {
      showError('Failed to fetch video metadata. Please enter title and description manually.')
    }
  } finally {
    fetchingMetadata.value = false
  }
}

async function loadVideos() {
  loadingData.value = true
  try {
    const allVideos = await mediaService.getVideos()
    // Sort by newest first
    videos.value = allVideos.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : (a.createdAt ? new Date(a.createdAt) : new Date(0))
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : (b.createdAt ? new Date(b.createdAt) : new Date(0))
      return dateB - dateA // Newest first
    })
  } catch (error) {
    console.error('Error loading videos:', error)
    showError('Failed to load videos')
  } finally {
    loadingData.value = false
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
    return `${diffMinutes}m ago`
  } else if (diffHours < 24) {
    return `${diffHours}h ago`
  } else if (diffDays < 7) {
    return `${diffDays}d ago`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks}w ago`
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `${months}mo ago`
  } else {
    const years = Math.floor(diffDays / 365)
    return `${years}y ago`
  }
}

function handleEdit(video) {
  editingVideo.value = video
  form.value = {
    title: video.title || '',
    description: video.description || '',
    url: video.url
  }
  showVideoModal.value = true
}

function closeVideoModal() {
  showVideoModal.value = false
  editingVideo.value = null
  form.value = { title: '', description: '', url: '' }
}

function getUrlList() {
  if (!form.value.url) return []
  return form.value.url
    .split('\n')
    .map(url => url.trim())
    .filter(url => url.length > 0)
}

async function handleSubmit() {
  loading.value = true

  try {
    const urls = getUrlList()
    
    if (urls.length === 0) {
      showError('Please enter at least one YouTube URL')
      loading.value = false
      return
    }

    if (editingVideo.value) {
      // Editing mode - only handle first URL
      const mediaData = {
        title: form.value.title || '',
        description: form.value.description || '',
        url: urls[0]
      }
      await mediaService.updateVideo(editingVideo.value.id, mediaData)
      
      // If title is empty, fetch metadata in the background
      if (!form.value.title || !form.value.title.trim()) {
        fetchVideoMetadataInBackground(editingVideo.value.id, urls[0])
      }
      
      showSuccess('Video updated successfully!')
    } else {
      // Adding mode - handle multiple URLs
      const videoIds = []
      
      for (const url of urls) {
        const mediaData = {
          title: form.value.title || '',
          description: form.value.description || '',
          url: url
        }
        const videoId = await mediaService.addVideo(mediaData)
        videoIds.push(videoId)
        
        // If title is empty, fetch metadata in the background for each video
        if (!form.value.title || !form.value.title.trim()) {
          fetchVideoMetadataInBackground(videoId, url)
        }
      }
      
      showSuccess(`${urls.length} video${urls.length > 1 ? 's' : ''} added successfully!`)
    }
    
    closeVideoModal()
    await loadVideos()
  } catch (error) {
    console.error('Error saving video:', error)
    showError('Failed to save video')
  } finally {
    loading.value = false
  }
}

async function fetchVideoMetadataInBackground(videoId, url) {
  const taskId = `${videoId}-${Date.now()}`
  backgroundTasks.value.add(taskId)
  
  try {
    const videoId_youtube = getYouTubeVideoId(url)
    if (!videoId_youtube) {
      backgroundTasks.value.delete(taskId)
      return
    }

    // Use YouTube oEmbed API (no authentication required) for title
    const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
    const oEmbedResponse = await fetch(oEmbedUrl)
    
    if (oEmbedResponse.ok) {
      const oEmbedData = await oEmbedResponse.json()
      const title = oEmbedData.title || ''
      
      // Try to get description from YouTube page using a CORS proxy
      let description = ''
      try {
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
        const proxyResponse = await fetch(proxyUrl)
        
        if (proxyResponse.ok) {
          const proxyData = await proxyResponse.json()
          const html = proxyData.contents
          
          // Extract description from meta tag
          const descriptionMatch = html.match(/<meta name="description" content="([^"]+)"/)
          if (descriptionMatch && descriptionMatch[1]) {
            let desc = descriptionMatch[1]
            // Remove common YouTube suffixes
            desc = desc.replace(/\s*Subscribe.*$/i, '')
            desc = desc.replace(/\s*Watch.*$/i, '')
            description = desc.substring(0, 500) // Limit to 500 chars
          }
        }
      } catch (proxyError) {
        console.warn('Could not fetch description:', proxyError)
      }

      // Update the video with fetched metadata
      if (title) {
        await mediaService.updateVideo(videoId, {
          title: title,
          description: description,
          url: url
        })
        // Reload videos to show updated title
        await loadVideos()
      }
    }
  } catch (error) {
    console.error('Error fetching video metadata in background:', error)
    // Silently fail - video was already added
  } finally {
    backgroundTasks.value.delete(taskId)
  }
}

async function saveVideoAndClose() {
  await handleSubmit()
  if (!loading.value) {
    showVideoModal.value = false
  }
}

async function handleDelete(id) {
  const confirmed = await confirm('Are you sure you want to delete this video?', {
    title: 'Delete Video',
    confirmText: 'Delete'
  })
  
  if (!confirmed) return

  try {
    await mediaService.deleteVideo(id)
    showSuccess('Video deleted successfully!')
    await loadVideos()
  } catch (error) {
    console.error('Error deleting video:', error)
    showError('Failed to delete video')
  }
}

// Prevent page unload when background tasks are running
const handleBeforeUnload = (e) => {
  if (backgroundTasks.value.size > 0) {
    e.preventDefault()
    e.returnValue = 'Background tasks are still running. Are you sure you want to leave?'
    return e.returnValue
  }
}

onMounted(() => {
  loadVideos()
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
</script>
