<template>
  <AdminLayout>
    <div class="space-y-4">
      <!-- Header -->
      <div>
        <h1 class="text-xl font-semibold text-gray-900 tracking-tight">News</h1>
        <p class="text-xs text-gray-500 mt-1">Manage news articles and announcements</p>
      </div>

      <!-- Two Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Left Column: Add/Edit Form -->
        <div class="bg-white rounded-lg border border-gray-200/80 p-4">
        <h2 class="text-sm font-semibold text-gray-900 mb-3">
          {{ editingArticle ? 'Edit Article' : 'Add New Article' }}
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
              placeholder="Article title"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">
              Description *
            </label>
            <textarea
              v-model="form.description"
              rows="4"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
              placeholder="Article description or summary"
            ></textarea>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">
              Content *
            </label>
            <textarea
              v-model="form.content"
              rows="6"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
              placeholder="Full article content"
            ></textarea>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">
              Featured Image (optional)
            </label>
            <div class="space-y-2">
              <div>
                <input
                  @change="handleFileSelect"
                  type="file"
                  accept="image/*"
                  ref="fileInput"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
                <p class="text-xs text-gray-500 mt-1">Or enter image URL below</p>
              </div>
              <input
                v-model="form.image"
                type="url"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div v-if="form.image && !uploadingImage" class="mt-2 flex items-center space-x-2">
              <img :src="form.image" alt="Preview" class="w-20 h-20 rounded-lg object-cover ring-2 ring-gray-100" />
              <button
                type="button"
                @click="removeImage"
                class="text-xs text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>
            <div v-if="uploadingImage" class="mt-2 flex items-center space-x-2 text-xs text-gray-500">
              <svg class="animate-spin h-4 w-4 text-primary-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Processing image...</span>
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">
              Publish Date & Time *
            </label>
            <input
              v-model="form.publishDate"
              type="datetime-local"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
            />
          </div>
          <div class="flex space-x-2">
            <Button
              type="submit"
              :loading="loading || uploadingImage"
              :loading-text="loading ? 'Saving...' : ''"
              size="xs"
            >
              {{ editingArticle ? 'Update' : 'Add' }} Article
            </Button>
            <Button
              v-if="editingArticle"
              type="button"
              variant="outline"
              size="xs"
              @click="cancelEdit"
            >
              Cancel
            </Button>
          </div>
        </form>
        </div>

        <!-- Right Column: News List -->
        <div class="bg-white rounded-lg border border-gray-200/80 flex flex-col">
        <div class="px-4 py-3 border-b border-gray-200/80">
          <h2 class="text-sm font-semibold text-gray-900">Current Articles</h2>
        </div>
        <div class="p-4 flex-1 overflow-y-auto max-h-[600px]">
          <Skeleton
            v-if="loadingData"
            v-for="i in 3"
            :key="i"
            type="list"
            :lines="1"
            :show-avatar="false"
            custom-class="border border-gray-200 rounded-lg p-3"
          />
          <div v-else-if="articles.length === 0" class="text-gray-500 text-center py-6 text-xs">
            No articles added yet
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="article in articles"
              :key="article.id"
              class="border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors"
            >
              <div class="flex items-start space-x-3">
                <div v-if="article.image" class="flex-shrink-0">
                  <img
                    :src="article.image"
                    :alt="article.title"
                    class="w-16 h-16 rounded-lg object-cover ring-2 ring-gray-100"
                  />
                </div>
                <div v-else class="flex-shrink-0 w-16 h-16 rounded-lg bg-primary-100 flex items-center justify-center ring-2 ring-gray-100">
                  <svg class="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-gray-900 text-xs truncate">{{ article.title }}</h3>
                  <p class="text-gray-600 text-xs mt-1 line-clamp-2">{{ article.description }}</p>
                  <p class="text-gray-500 text-xs mt-1">
                    {{ formatDate(article.publishDate) }}
                  </p>
                </div>
                <div class="flex space-x-1.5">
                  <Button
                    variant="ghost"
                    size="xs"
                    @click="handleEdit(article)"
                    custom-class="text-primary-600 hover:bg-primary-50"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    @click="handleDelete(article.id)"
                    custom-class="text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                </div>
              </div>
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
import Button from '../../components/Button.vue'
import Skeleton from '../../components/Skeleton.vue'
import { newsService } from '../../firebase/firestore'
import { useToast } from '../../composables/useToast'
import { useConfirm } from '../../composables/useConfirm'

const { success: showSuccess, error: showError } = useToast()
const { confirm } = useConfirm()

const loading = ref(false)
const loadingData = ref(true)
const articles = ref([])
const editingArticle = ref(null)
const uploadingImage = ref(false)
const fileInput = ref(null)

const form = ref({
  title: '',
  description: '',
  content: '',
  image: '',
  publishDate: ''
})

function compressImage(file, maxWidth = 800, maxHeight = 800, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }
        
        canvas.width = width
        canvas.height = height
        
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
        resolve(compressedDataUrl)
      }
      
      img.onerror = reject
      img.src = e.target.result
    }
    
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function handleFileSelect(event) {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    showError('Please select an image file')
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    showError('Image size must be less than 5MB')
    return
  }

  uploadingImage.value = true

  try {
    const compressedDataUrl = await compressImage(file, 800, 800, 0.75)
    
    const base64Size = compressedDataUrl.length * 0.75
    if (base64Size > 900000) {
      const moreCompressed = await compressImage(file, 600, 600, 0.6)
      form.value.image = moreCompressed
    } else {
      form.value.image = compressedDataUrl
    }
  } catch (error) {
    console.error('Error processing image:', error)
    showError('Failed to process image file')
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  } finally {
    uploadingImage.value = false
  }
}

function removeImage() {
  form.value.image = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

async function loadArticles() {
  loadingData.value = true
  try {
    articles.value = await newsService.getNews()
    // Sort by publish date (newest first)
    articles.value.sort((a, b) => {
      const dateA = new Date(a.publishDate || a.createdAt)
      const dateB = new Date(b.publishDate || b.createdAt)
      return dateB - dateA
    })
  } catch (error) {
    console.error('Error loading articles:', error)
    showError('Failed to load articles')
  } finally {
    loadingData.value = false
  }
}

function handleEdit(article) {
  editingArticle.value = article
  // Convert date to datetime-local format (YYYY-MM-DDTHH:mm)
  let dateTimeLocal = ''
  if (article.publishDate) {
    const date = new Date(article.publishDate)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    dateTimeLocal = `${year}-${month}-${day}T${hours}:${minutes}`
  }
  form.value = {
    title: article.title || '',
    description: article.description || '',
    content: article.content || '',
    image: article.image || '',
    publishDate: dateTimeLocal
  }
}

function cancelEdit() {
  editingArticle.value = null
  form.value = {
    title: '',
    description: '',
    content: '',
    image: '',
    publishDate: ''
  }
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

async function handleSubmit() {
  loading.value = true

  try {
    const articleData = {
      title: form.value.title,
      description: form.value.description,
      content: form.value.content,
      image: form.value.image || '',
      publishDate: form.value.publishDate
    }
    if (editingArticle.value) {
      await newsService.updateArticle(editingArticle.value.id, articleData)
      showSuccess('Article updated successfully!')
    } else {
      await newsService.addArticle(articleData)
      showSuccess('Article added successfully!')
    }
    cancelEdit()
    await loadArticles()
  } catch (error) {
    console.error('Error saving article:', error)
    showError('Failed to save article')
  } finally {
    loading.value = false
  }
}

async function handleDelete(id) {
  const confirmed = await confirm('Are you sure you want to delete this article?', {
    title: 'Delete Article',
    confirmText: 'Delete'
  })
  
  if (!confirmed) return

  try {
    await newsService.deleteArticle(id)
    showSuccess('Article deleted successfully!')
    await loadArticles()
  } catch (error) {
    console.error('Error deleting article:', error)
    showError('Failed to delete article')
  }
}

onMounted(() => {
  loadArticles()
})
</script>

