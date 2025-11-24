<template>
  <AdminLayout>
    <div class="space-y-4 md:space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
      <div>
          <h1 class="text-xl md:text-2xl font-semibold text-gray-900 tracking-tight">Photos</h1>
          <p class="text-xs md:text-sm text-gray-500 mt-1">Manage photo gallery</p>
        </div>
        <button
          @click="showPhotoModal = true; editingPhoto = null; form = { title: '', description: '', url: '' }"
          class="px-3 py-1.5 text-xs font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
        >
          <Plus class="h-4 w-4" />
          Add Photo
        </button>
      </div>

      <!-- Photos Grid -->
      <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div class="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-base md:text-lg font-semibold text-gray-900">All Photos</h2>
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
              <div :class="viewMode === 'grid' ? 'aspect-square bg-gray-200 rounded-lg mb-2' : 'w-24 h-24 bg-gray-200 rounded-lg shrink-0'"></div>
              <div class="flex-1">
                <div class="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                <div class="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Photos Grid View -->
        <div v-else-if="photos.length > 0 && viewMode === 'grid'" class="p-4 md:p-6">
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            <div
              v-for="photo in photos"
              :key="photo.id"
              class="group relative border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors"
            >
              <!-- Photo Thumbnail -->
              <div class="aspect-square bg-gray-100 relative">
                <img
                  :src="photo.url"
                  :alt="photo.title || 'Photo'"
                  class="w-full h-full object-cover"
                />
                <!-- Overlay Actions -->
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div class="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center gap-2">
                    <button
                      @click.stop="handleEdit(photo)"
                      class="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                      title="Edit photo"
                    >
                      <Edit class="h-4 w-4 text-gray-700" />
                    </button>
                    <button
                      @click.stop="handleDelete(photo.id)"
                      class="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                      title="Delete photo"
                    >
                      <Trash2 class="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Photo Info -->
              <div class="p-2 md:p-3">
                <h3 class="text-xs md:text-sm font-semibold text-gray-900 mb-1 line-clamp-2">{{ photo.title || 'Untitled' }}</h3>
                <p v-if="photo.description" class="text-[10px] md:text-xs text-gray-600 line-clamp-2 mb-1">{{ photo.description }}</p>
                <p class="text-[10px] text-gray-500">{{ formatDate(photo.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Photos List View -->
        <div v-else-if="photos.length > 0 && viewMode === 'list'" class="divide-y divide-gray-200 overflow-hidden">
          <div
            v-for="photo in photos"
            :key="photo.id"
            class="group p-3 md:p-4 hover:bg-gray-50 transition-colors min-w-0"
          >
            <div class="flex items-center gap-3 md:gap-4 min-w-0 w-full">
              <!-- Photo Thumbnail -->
              <div class="w-24 md:w-32 h-24 md:h-32 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                <img
                  :src="photo.url"
                  :alt="photo.title || 'Photo'"
                  class="w-full h-full object-cover"
                />
              </div>

              <!-- Photo Info -->
              <div class="flex-1 min-w-0 max-w-[35vw] overflow-hidden">
                <h3 class="text-sm md:text-base font-semibold text-gray-900 mb-1 line-clamp-1 min-w-0">{{ photo.title || 'Untitled' }}</h3>
                <p v-if="photo.description" class="text-xs md:text-sm text-gray-600 mb-1 line-clamp-2 min-w-0">{{ photo.description }}</p>
                <p class="text-[10px] md:text-xs text-gray-500 flex items-center gap-1 min-w-0">
                  <Clock class="h-3 w-3 shrink-0" />
                  <span class="truncate">{{ formatDate(photo.createdAt) }}</span>
                </p>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button
                  @click="handleEdit(photo)"
                  class="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="Edit photo"
                >
                  <Edit class="h-4 w-4" />
                </button>
                <button
                  @click="handleDelete(photo.id)"
                  class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete photo"
                >
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="p-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 class="text-sm md:text-base font-medium text-gray-900 mb-1">No photos yet</h3>
          <p class="text-xs md:text-sm text-gray-500">Add your first photo to get started</p>
        </div>
      </div>
    </div>

    <!-- Photo Add/Edit Modal -->
    <Teleport to="body">
      <div
        v-if="showPhotoModal"
        class="fixed inset-0 z-60 flex items-center justify-center p-4"
        @click.self="closePhotoModal"
        @keydown.esc="closePhotoModal"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        
        <!-- Modal Content -->
        <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
            <h2 class="text-lg font-semibold text-gray-900">
              {{ editingPhoto ? 'Edit Photo' : 'Add New Photo' }}
            </h2>
            <button
              @click="closePhotoModal"
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
                <!-- Single URL preview (for editing or URL input) -->
                <div v-if="form.url && selectedFiles.length === 0" class="bg-white rounded-lg border border-gray-200 p-4">
                  <div class="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
                    <img
                      :src="form.url"
                      :alt="form.title || 'Photo'"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div v-if="form.title || form.description" class="space-y-2">
                    <h3 class="text-sm font-semibold text-gray-900">{{ form.title || 'Photo Title' }}</h3>
                    <p v-if="form.description" class="text-xs text-gray-600">{{ form.description }}</p>
                  </div>
                </div>
                <!-- Multiple file previews -->
                <div
                  v-for="(file, index) in selectedFiles"
                  :key="index"
                  class="bg-white rounded-lg border border-gray-200 p-4"
                >
                  <div class="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
                    <img
                      :src="file.preview"
                      :alt="file.name"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div class="space-y-2">
                    <h3 class="text-sm font-semibold text-gray-900">{{ file.nameWithoutExt }}</h3>
                    <p v-if="form.description" class="text-xs text-gray-600">{{ form.description }}</p>
                  </div>
                </div>
                <div v-if="!form.url && selectedFiles.length === 0" class="bg-white rounded-lg border border-gray-200 p-4">
                  <p class="text-xs text-gray-500 text-center">Upload photos or enter an image URL to see preview</p>
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
              <form @submit.prevent="savePhotoAndClose" class="space-y-4">
          <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Photo(s) *
            </label>
            <div class="space-y-2">
                <input
                  @change="handleFileSelect"
                  type="file"
                  accept="image/*"
                      multiple
                  ref="fileInput"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
                    <p class="text-xs text-gray-500">Or enter image URL (single photo only)</p>
              <input
                v-model="form.url"
                type="url"
                      @input="selectedFiles = []"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                placeholder="https://example.com/photo.jpg"
              />
            </div>
                  <div v-if="selectedFiles.length > 0" class="mt-2">
                    <p class="text-xs text-gray-600 mb-2">{{ selectedFiles.length }} photo(s) selected</p>
                    <button
                      type="button"
                      @click="clearSelectedFiles"
                      class="text-xs text-red-600 hover:text-red-700"
                    >
                      Clear all
                    </button>
                  </div>
                  <div v-if="form.url && selectedFiles.length === 0 && !uploadingPhoto" class="mt-2 flex items-center gap-2">
                    <img :src="form.url" alt="Preview" class="w-20 h-20 rounded-lg object-cover border border-gray-200" />
              <button
                type="button"
                @click="removePhoto"
                class="text-xs text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>
                  <div v-if="uploadingPhoto" class="mt-2 flex items-center gap-2 text-xs text-gray-500">
                    <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
                    <span>Processing {{ selectedFiles.length > 1 ? `${selectedFiles.length} images` : 'image' }}...</span>
            </div>
          </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Title (optional)
                    <span v-if="selectedFiles.length > 1" class="text-xs text-gray-500 font-normal">(disabled for multiple uploads)</span>
                  </label>
                  <input
                    v-model="form.title"
                    type="text"
                    :disabled="selectedFiles.length > 1"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Photo title"
                  />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    v-model="form.description"
                    rows="4"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm resize-none"
                    placeholder="Photo description"
                  ></textarea>
          </div>
        </form>
        </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 shrink-0">
            <button
              @click="closePhotoModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="savePhotoAndClose"
              :disabled="loading || uploadingPhoto || (selectedFiles.length === 0 && !form.url)"
              class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span v-if="loading">Saving...</span>
              <span v-else-if="editingPhoto">Update Photo</span>
              <span v-else>Add {{ selectedFiles.length > 1 ? `${selectedFiles.length} Photos` : selectedFiles.length === 1 || form.url ? 'Photo' : 'Photos' }}</span>
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
              <!-- Single URL preview (for editing or URL input) -->
              <div v-if="form.url && selectedFiles.length === 0" class="bg-white rounded-lg border border-gray-200 p-4">
                <div class="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
                  <img
                    :src="form.url"
                    :alt="form.title || 'Photo'"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div v-if="form.title || form.description" class="space-y-2">
                  <h3 class="text-sm font-semibold text-gray-900">{{ form.title || 'Photo Title' }}</h3>
                  <p v-if="form.description" class="text-xs text-gray-600">{{ form.description }}</p>
                </div>
              </div>
              <!-- Multiple file previews -->
              <div
                v-for="(file, index) in selectedFiles"
                :key="index"
                class="bg-white rounded-lg border border-gray-200 p-4"
              >
                <div class="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
                  <img
                    :src="file.preview"
                    :alt="file.name"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="space-y-2">
                  <h3 class="text-sm font-semibold text-gray-900">{{ file.nameWithoutExt }}</h3>
                  <p v-if="form.description" class="text-xs text-gray-600">{{ form.description }}</p>
                </div>
              </div>
              <div v-if="!form.url && selectedFiles.length === 0" class="bg-white rounded-lg border border-gray-200 p-4">
                <p class="text-xs text-gray-500 text-center">Upload photos or enter an image URL to see preview</p>
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
import { Plus, Edit, Trash2, X, Grid3x3, List, Eye, Clock } from 'lucide-vue-next'

const { success: showSuccess, error: showError } = useToast()
const { confirm } = useConfirm()
const { useLock } = useBodyScrollLock()

const loading = ref(false)
const loadingData = ref(true)
const photos = ref([])
const editingPhoto = ref(null)
const showPhotoModal = ref(false)
const showPreviewModal = ref(false)
const uploadingPhoto = ref(false)
const fileInput = ref(null)
const viewMode = ref('grid') // 'grid' or 'list'
const selectedFiles = ref([]) // For multiple file uploads

// Lock body scroll when modal is open
useLock(showPhotoModal)
useLock(showPreviewModal)

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
  const files = Array.from(event.target.files || [])
  if (files.length === 0) return

  // Clear URL input when files are selected
  form.value.url = ''

  // Validate all files
  for (const file of files) {
  if (!file.type.startsWith('image/')) {
      showError('Please select only image files')
      if (fileInput.value) {
        fileInput.value.value = ''
      }
      selectedFiles.value = []
    return
  }

  if (file.size > 5 * 1024 * 1024) {
      showError('All images must be less than 5MB')
      if (fileInput.value) {
        fileInput.value.value = ''
      }
      selectedFiles.value = []
    return
    }
  }

  uploadingPhoto.value = true
  selectedFiles.value = []

  try {
    // Process all files
    for (const file of files) {
    const compressedDataUrl = await compressImage(file, 800, 800, 0.75)
    
    const base64Size = compressedDataUrl.length * 0.75
      let finalDataUrl = compressedDataUrl
    if (base64Size > 900000) {
        finalDataUrl = await compressImage(file, 600, 600, 0.6)
      }

      // Extract filename without extension
      const fileName = file.name
      const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '')

      // Create preview object
      selectedFiles.value.push({
        file: file,
        preview: finalDataUrl,
        dataUrl: finalDataUrl,
        name: fileName,
        nameWithoutExt: nameWithoutExt
      })
    }
  } catch (error) {
    console.error('Error processing images:', error)
    showError('Failed to process image files')
    selectedFiles.value = []
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  } finally {
    uploadingPhoto.value = false
  }
}

function clearSelectedFiles() {
  selectedFiles.value = []
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function removePhoto() {
  form.value.url = ''
  selectedFiles.value = []
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

let unsubscribePhotos = null

async function loadPhotos() {
  loadingData.value = true
  let initialLoadComplete = false
  
  try {
    // Set up real-time listener with pagination (20 items)
    unsubscribePhotos = mediaService.subscribeToPhotos((photosList) => {
      // Sort by newest first
      photos.value = photosList.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : (a.createdAt ? new Date(a.createdAt) : new Date(0))
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : (b.createdAt ? new Date(b.createdAt) : new Date(0))
        return dateB - dateA // Newest first
      })
      if (!initialLoadComplete) {
        initialLoadComplete = true
        loadingData.value = false
      }
    }, 20)
  } catch (error) {
    console.error('Error setting up photos subscription:', error)
    showError('Failed to load photos')
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
  showPhotoModal.value = true
}

function closePhotoModal() {
  showPhotoModal.value = false
  editingPhoto.value = null
  form.value = { title: '', description: '', url: '' }
  selectedFiles.value = []
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

async function handleSubmit() {
  // Check if we have files or URL
  if (selectedFiles.value.length === 0 && !form.value.url) {
    showError('Please add at least one photo')
    return
  }

  loading.value = true

  try {
    if (editingPhoto.value) {
      // Editing mode - only handle single photo (URL or first file)
      const url = form.value.url || (selectedFiles.value.length > 0 ? selectedFiles.value[0].dataUrl : '')
      const title = form.value.title || (selectedFiles.value.length > 0 ? selectedFiles.value[0].nameWithoutExt : '')
      
      const mediaData = {
        title: title,
        description: form.value.description || '',
        url: url
      }
      await mediaService.updatePhoto(editingPhoto.value.id, mediaData)
      showSuccess('Photo updated successfully!')
    } else {
      // Adding mode - handle multiple photos
      const photosToAdd = []
      
      if (form.value.url) {
        // Single URL photo
        photosToAdd.push({
          title: form.value.title || '',
          description: form.value.description || '',
          url: form.value.url
        })
      } else if (selectedFiles.value.length > 0) {
        // Multiple file photos
        for (const fileData of selectedFiles.value) {
          photosToAdd.push({
            title: form.value.title || fileData.nameWithoutExt,
            description: form.value.description || '',
            url: fileData.dataUrl
          })
        }
      }

      // Add all photos
      for (const photoData of photosToAdd) {
        await mediaService.addPhoto(photoData)
      }
      
      showSuccess(`${photosToAdd.length} photo${photosToAdd.length > 1 ? 's' : ''} added successfully!`)
    }
    
    closePhotoModal()
    await loadPhotos()
  } catch (error) {
    console.error('Error saving photo:', error)
    showError('Failed to save photo')
  } finally {
    loading.value = false
  }
}

async function savePhotoAndClose() {
  await handleSubmit()
  if (!loading.value) {
    showPhotoModal.value = false
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

onMounted(() => {
  loadPhotos()
})

onUnmounted(() => {
  if (unsubscribePhotos) {
    unsubscribePhotos()
  }
})
</script>
