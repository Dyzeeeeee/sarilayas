<template>
  <AdminLayout>
    <div class="space-y-4">
      <!-- Header -->
      <div>
        <h1 class="text-xl font-semibold text-gray-900 tracking-tight">Photos</h1>
        <p class="text-xs text-gray-500 mt-1">Manage photo gallery</p>
      </div>

      <!-- Two Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Left Column: Add/Edit Form -->
        <div class="bg-white rounded-lg border border-gray-200/80 p-4">
        <h2 class="text-sm font-semibold text-gray-900 mb-3">
          {{ editingPhoto ? 'Edit Photo' : 'Add New Photo' }}
        </h2>
        <form @submit.prevent="handleSubmit" class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">
              Title (optional)
            </label>
            <input
              v-model="form.title"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
              placeholder="Photo title"
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
              placeholder="Photo description"
            ></textarea>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">
              Photo *
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
                v-model="form.url"
                type="url"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                placeholder="https://example.com/photo.jpg"
              />
            </div>
            <div v-if="form.url && !uploadingPhoto" class="mt-2 flex items-center space-x-2">
              <img :src="form.url" alt="Preview" class="w-20 h-20 rounded-lg object-cover ring-2 ring-gray-100" />
              <button
                type="button"
                @click="removePhoto"
                class="text-xs text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>
            <div v-if="uploadingPhoto" class="mt-2 flex items-center space-x-2 text-xs text-gray-500">
              <svg class="animate-spin h-4 w-4 text-primary-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Processing image...</span>
            </div>
          </div>
          <div class="flex space-x-2">
            <Button
              type="submit"
              :loading="loading || uploadingPhoto"
              :loading-text="loading ? 'Saving...' : ''"
              size="xs"
            >
              {{ editingPhoto ? 'Update' : 'Add' }} Photo
            </Button>
            <Button
              v-if="editingPhoto"
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

        <!-- Right Column: Photos List -->
        <div class="bg-white rounded-lg border border-gray-200/80 flex flex-col">
        <div class="px-4 py-3 border-b border-gray-200/80">
          <h2 class="text-sm font-semibold text-gray-900">Current Photos</h2>
        </div>
        <div class="p-4 flex-1 overflow-y-auto max-h-[600px]">
          <Skeleton
            v-if="loadingData"
            v-for="i in 4"
            :key="i"
            type="card"
            variant="default"
            image-aspect="square"
            :show-description="false"
            custom-class="border border-gray-200 rounded-lg p-3"
          />
          <div v-else-if="photos.length === 0" class="text-gray-500 text-center py-6 text-xs">
            No photos added yet
          </div>
          <div v-else class="grid grid-cols-2 gap-3">
            <div
              v-for="photo in photos"
              :key="photo.id"
              class="border border-gray-200 rounded-lg p-2 hover:border-gray-300 transition-colors"
            >
              <div class="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2">
                <img
                  :src="photo.url"
                  :alt="photo.title || 'Photo'"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="space-y-1">
                <div class="flex justify-between items-start">
                  <div class="flex-1 min-w-0">
                    <p v-if="photo.title" class="text-xs font-medium text-gray-900 truncate">{{ photo.title }}</p>
                    <p v-if="photo.description" class="text-xs text-gray-600 line-clamp-2 mt-0.5">{{ photo.description }}</p>
                  </div>
                  <div class="flex space-x-1 ml-2">
                    <Button
                      variant="ghost"
                      size="xs"
                      @click="handleEdit(photo)"
                      custom-class="text-primary-600 hover:bg-primary-50"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="xs"
                      @click="handleDelete(photo.id)"
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
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '../../layouts/AdminLayout.vue'
import Button from '../../components/Button.vue'
import Skeleton from '../../components/Skeleton.vue'
import { mediaService } from '../../firebase/firestore'
import { useToast } from '../../composables/useToast'
import { useConfirm } from '../../composables/useConfirm'

const { success: showSuccess, error: showError } = useToast()
const { confirm } = useConfirm()

const loading = ref(false)
const loadingData = ref(true)
const photos = ref([])
const editingPhoto = ref(null)
const uploadingPhoto = ref(false)
const fileInput = ref(null)

const form = ref({
  title: '',
  description: '',
  url: ''
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

  uploadingPhoto.value = true

  try {
    const compressedDataUrl = await compressImage(file, 800, 800, 0.75)
    
    const base64Size = compressedDataUrl.length * 0.75
    if (base64Size > 900000) {
      const moreCompressed = await compressImage(file, 600, 600, 0.6)
      form.value.url = moreCompressed
    } else {
      form.value.url = compressedDataUrl
    }
  } catch (error) {
    console.error('Error processing image:', error)
    showError('Failed to process image file')
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  } finally {
    uploadingPhoto.value = false
  }
}

function removePhoto() {
  form.value.url = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

async function loadPhotos() {
  loadingData.value = true
  try {
    photos.value = await mediaService.getPhotos()
  } catch (error) {
    console.error('Error loading photos:', error)
    showError('Failed to load photos')
  } finally {
    loadingData.value = false
  }
}

function handleEdit(photo) {
  editingPhoto.value = photo
  form.value = {
    title: photo.title || '',
    description: photo.description || '',
    url: photo.url
  }
}

function cancelEdit() {
  editingPhoto.value = null
  form.value = { title: '', description: '', url: '' }
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

async function handleSubmit() {
  if (!form.value.url) {
    showError('Please add a photo')
    return
  }

  loading.value = true

  try {
    const mediaData = {
      title: form.value.title,
      description: form.value.description || '',
      url: form.value.url
    }
    if (editingPhoto.value) {
      await mediaService.updatePhoto(editingPhoto.value.id, mediaData)
      showSuccess('Photo updated successfully!')
    } else {
      await mediaService.addPhoto(mediaData)
      showSuccess('Photo added successfully!')
    }
    cancelEdit()
    await loadPhotos()
  } catch (error) {
    console.error('Error saving photo:', error)
    showError('Failed to save photo')
  } finally {
    loading.value = false
  }
}

async function handleDelete(id) {
  const confirmed = await confirm('Are you sure you want to delete this photo?', {
    title: 'Delete Photo',
    confirmText: 'Delete'
  })
  
  if (!confirmed) return

  try {
    await mediaService.deletePhoto(id)
    showSuccess('Photo deleted successfully!')
    await loadPhotos()
  } catch (error) {
    console.error('Error deleting photo:', error)
    showError('Failed to delete photo')
  }
}

onMounted(() => {
  loadPhotos()
})
</script>

