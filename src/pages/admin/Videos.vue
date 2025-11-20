<template>
  <AdminLayout>
    <div class="space-y-4">
      <!-- Header -->
      <div>
        <h1 class="text-xl font-semibold text-gray-900 tracking-tight">Videos</h1>
        <p class="text-xs text-gray-500 mt-1">Manage YouTube video links</p>
      </div>

      <!-- Two Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Left Column: Add/Edit Form -->
        <div class="bg-white rounded-lg border border-gray-200/80 p-4">
        <h2 class="text-sm font-semibold text-gray-900 mb-3">
          {{ editingVideo ? 'Edit Video' : 'Add New Video' }}
        </h2>
        <form @submit.prevent="handleSubmit" class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">
              Title *
            </label>
            <input
              v-model="form.title"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
              placeholder="Video title"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">
              Description (optional)
            </label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
              placeholder="Video description"
            ></textarea>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">
              YouTube URL *
            </label>
            <input
              v-model="form.url"
              type="url"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
              placeholder="https://youtube.com/watch?v=..."
            />
            <p class="text-xs text-gray-500 mt-1">Paste the full YouTube URL</p>
          </div>
          <div class="flex space-x-2">
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 transition-colors text-xs font-semibold flex items-center space-x-2"
            >
              <svg v-if="loading" class="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ loading ? 'Saving...' : editingVideo ? 'Update' : 'Add' }} Video</span>
            </button>
            <button
              v-if="editingVideo"
              type="button"
              @click="cancelEdit"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
        </div>

        <!-- Right Column: Videos List -->
        <div class="bg-white rounded-lg border border-gray-200/80 flex flex-col">
        <div class="px-4 py-3 border-b border-gray-200/80">
          <h2 class="text-sm font-semibold text-gray-900">Current Videos</h2>
        </div>
        <div class="p-4 flex-1 overflow-y-auto max-h-[600px]">
          <div v-if="loadingData" class="space-y-2">
            <div v-for="i in 3" :key="i" class="border border-gray-200 rounded-lg p-3 animate-pulse">
              <div class="space-y-2">
                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                <div class="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
          <div v-else-if="videos.length === 0" class="text-gray-500 text-center py-6 text-xs">
            No videos added yet
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="video in videos"
              :key="video.id"
              class="border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors"
            >
              <div class="flex justify-between items-start mb-2">
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-gray-900 text-xs">{{ video.title }}</h3>
                  <p v-if="video.description" class="text-gray-600 text-xs mt-1 line-clamp-2">{{ video.description }}</p>
                </div>
                <div class="flex space-x-1.5 ml-3">
                  <button
                    @click="handleEdit(video)"
                    class="px-2.5 py-1 text-xs text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium"
                  >
                    Edit
                  </button>
                  <button
                    @click="handleDelete(video.id)"
                    class="px-2.5 py-1 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div v-if="getYouTubeEmbedUrl(video.url)" class="aspect-video rounded-lg overflow-hidden bg-gray-100">
                <iframe
                  :src="getYouTubeEmbedUrl(video.url)"
                  class="w-full h-full"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </div>
              <p v-else class="text-gray-500 text-xs mt-2 truncate">{{ video.url }}</p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '../../layouts/AdminLayout.vue'
import { mediaService } from '../../firebase/firestore'
import { useToast } from '../../composables/useToast'
import { useConfirm } from '../../composables/useConfirm'

const { success: showSuccess, error: showError } = useToast()
const { confirm } = useConfirm()

const loading = ref(false)
const loadingData = ref(true)
const videos = ref([])
const editingVideo = ref(null)

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

async function loadVideos() {
  loadingData.value = true
  try {
    videos.value = await mediaService.getVideos()
  } catch (error) {
    console.error('Error loading videos:', error)
    showError('Failed to load videos')
  } finally {
    loadingData.value = false
  }
}

function handleEdit(video) {
  editingVideo.value = video
  form.value = {
    title: video.title || '',
    description: video.description || '',
    url: video.url
  }
}

function cancelEdit() {
  editingVideo.value = null
  form.value = { title: '', description: '', url: '' }
}

async function handleSubmit() {
  loading.value = true

  try {
    const mediaData = {
      title: form.value.title,
      description: form.value.description || '',
      url: form.value.url
    }
    if (editingVideo.value) {
      await mediaService.updateVideo(editingVideo.value.id, mediaData)
      showSuccess('Video updated successfully!')
    } else {
      await mediaService.addVideo(mediaData)
      showSuccess('Video added successfully!')
    }
    cancelEdit()
    await loadVideos()
  } catch (error) {
    console.error('Error saving video:', error)
    showError('Failed to save video')
  } finally {
    loading.value = false
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

onMounted(() => {
  loadVideos()
})
</script>

