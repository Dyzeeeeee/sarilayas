<template>
  <AdminLayout>
    <div class="space-y-4 md:space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-xl md:text-2xl font-semibold text-gray-900 tracking-tight">Chapters</h1>
        <p class="text-xs md:text-sm text-gray-500 mt-1">Manage local chapters</p>
      </div>

      <!-- Two Column Layout: Background Image Preview & Chapters List -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <!-- Column 1: Background Image Preview -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div class="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 class="text-base md:text-lg font-semibold text-gray-900">Background Image</h2>
              <p class="text-xs text-gray-500 mt-0.5">Image for the chapters card in explore section</p>
            </div>
            <button
              @click="showImageModal = true"
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Pencil class="h-4 w-4 text-gray-500" />
            </button>
          </div>
          <div class="p-4 md:p-6">
            <p class="text-xs font-semibold text-gray-700 mb-2">Preview</p>
            <div class="relative rounded-xl overflow-hidden h-[400px] bg-gradient-to-br from-primary-700 to-primary-900">
              <img
                v-if="chaptersImage"
                :src="chaptersImage"
                alt="Chapters Background"
                class="absolute inset-0 w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-800/60 to-primary-700/40"></div>
              <div class="relative h-full flex flex-col justify-end p-6 text-white">
                <h3 class="text-2xl font-bold mb-3">Chapters</h3>
                <p class="text-sm text-white/90 leading-relaxed mb-4">
                  Explore our local chapters across different regions.
                </p>
                <div class="flex items-center text-white opacity-80">
                  <span class="text-sm font-semibold">Learn more</span>
                  <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Column 2: Chapters List -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div class="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 class="text-base md:text-lg font-semibold text-gray-900">Chapters</h2>
              <p class="text-xs text-gray-500 mt-0.5">Manage local chapters</p>
            </div>
            <button
              @click="showChapterModal = true; editingChapter = null; form = { chapterName: '', region: '', province: '', municipality: '', membersCount: 0 }"
              class="px-3 py-1.5 text-xs font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
              <Plus class="h-4 w-4" />
              Add Chapter
            </button>
          </div>
          <div class="p-4 md:p-6">
            <div v-if="loadingData" class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Chapter Name</th>
                    <th class="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Region</th>
                    <th class="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Province</th>
                    <th class="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Municipality</th>
                    <th class="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Members</th>
                    <th class="px-3 py-2 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="i in 3" :key="i" class="animate-pulse">
                    <td class="px-3 py-2"><div class="h-4 bg-gray-200 rounded w-24"></div></td>
                    <td class="px-3 py-2"><div class="h-4 bg-gray-200 rounded w-20"></div></td>
                    <td class="px-3 py-2"><div class="h-4 bg-gray-200 rounded w-20"></div></td>
                    <td class="px-3 py-2"><div class="h-4 bg-gray-200 rounded w-24"></div></td>
                    <td class="px-3 py-2"><div class="h-4 bg-gray-200 rounded w-12"></div></td>
                    <td class="px-3 py-2 text-right"><div class="h-4 bg-gray-200 rounded w-16 ml-auto"></div></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else-if="chapters.length === 0" class="text-gray-500 text-center py-6 text-xs">
              No chapters added yet
            </div>
            <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Chapter Name
                    </th>
                    <th class="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Region
                    </th>
                    <th class="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Province
                    </th>
                    <th class="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Municipality
                    </th>
                    <th class="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Members
                    </th>
                    <th class="px-3 py-2 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="chapter in chapters" :key="chapter.id" class="hover:bg-gray-50 transition-colors">
                    <td class="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">
                      {{ chapter.chapterName }}
                    </td>
                    <td class="px-3 py-2 whitespace-nowrap text-xs text-gray-600">
                      {{ chapter.region }}
                    </td>
                    <td class="px-3 py-2 whitespace-nowrap text-xs text-gray-600">
                      {{ chapter.province }}
                    </td>
                    <td class="px-3 py-2 whitespace-nowrap text-xs text-gray-600">
                      {{ chapter.municipality }}
                    </td>
                    <td class="px-3 py-2 whitespace-nowrap text-xs text-gray-600">
                      {{ chapter.membersCount }}
                    </td>
                    <td class="px-3 py-2 whitespace-nowrap text-right">
                      <div class="flex items-center justify-end gap-2">
                        <button
                          @click="handleEdit(chapter)"
                          class="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit chapter"
                        >
                          <Edit class="h-4 w-4" />
                        </button>
                        <button
                          @click="handleDelete(chapter.id)"
                          class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete chapter"
                        >
                          <Trash2 class="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chapter Add/Edit Modal -->
    <Teleport to="body">
      <div
        v-if="showChapterModal"
        class="fixed inset-0 z-[60] flex items-center justify-center p-4"
        @click.self="showChapterModal = false"
        @keydown.esc="showChapterModal = false"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        
        <!-- Modal Content -->
        <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
            <h2 class="text-lg font-semibold text-gray-900">
              {{ editingChapter ? 'Edit Chapter' : 'Add New Chapter' }}
            </h2>
            <button
              @click="showChapterModal = false; cancelEdit()"
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X class="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <!-- Modal Body -->
          <div class="flex-1 overflow-y-auto p-6 space-y-4">
            <form @submit.prevent="saveChapterAndClose" class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Chapter Name *
                </label>
                <input
                  v-model="form.chapterName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                  placeholder="Enter chapter name"
                />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Region *
                  </label>
                  <input
                    v-model="form.region"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                    placeholder="Enter region"
                  />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Province *
                  </label>
                  <input
                    v-model="form.province"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                    placeholder="Enter province"
                  />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Municipality *
                  </label>
                  <input
                    v-model="form.municipality"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                    placeholder="Enter municipality"
                  />
                </div>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Members Count *
                </label>
                <input
                  v-model.number="form.membersCount"
                  type="number"
                  min="0"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                  placeholder="Enter members count"
                />
              </div>
            </form>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 shrink-0">
            <button
              @click="showChapterModal = false; cancelEdit()"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="saveChapterAndClose"
              :disabled="loading"
              class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ loading ? 'Saving...' : editingChapter ? 'Update' : 'Add' }} Chapter
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Background Image Modal -->
    <Teleport to="body">
      <div
        v-if="showImageModal"
        class="fixed inset-0 z-[60] flex items-center justify-center p-4"
        @click.self="showImageModal = false"
        @keydown.esc="showImageModal = false"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        
        <!-- Modal Content -->
        <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
            <h2 class="text-lg font-semibold text-gray-900">Edit Background Image</h2>
            <button
              @click="showImageModal = false"
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X class="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <!-- Modal Body (Two Columns) -->
          <div class="flex-1 overflow-hidden flex">
            <!-- Preview Column -->
            <div class="w-1/2 border-r border-gray-200 overflow-y-auto p-6 bg-gray-50">
              <p class="text-sm font-semibold text-gray-700 mb-4">Preview</p>
              <div class="relative rounded-xl overflow-hidden h-[400px] bg-gradient-to-br from-primary-700 to-primary-900">
                <img
                  v-if="chaptersImage"
                  :src="chaptersImage"
                  alt="Chapters Background"
                  class="absolute inset-0 w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-800/60 to-primary-700/40"></div>
                <div class="relative h-full flex flex-col justify-end p-6 text-white">
                  <h3 class="text-2xl font-bold mb-3">Chapters</h3>
                  <p class="text-sm text-white/90 leading-relaxed mb-4">
                    Explore our local chapters across different regions.
                  </p>
                  <div class="flex items-center text-white opacity-80">
                    <span class="text-sm font-semibold">Learn more</span>
                    <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Editor Column -->
            <div class="w-1/2 overflow-y-auto p-6 space-y-6">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Background Image (optional)</label>
                <div class="space-y-2">
                  <input
                    @change="handleImageFileSelect"
                    type="file"
                    accept="image/*"
                    ref="imageFileInput"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                  <p class="text-xs text-gray-500">Or enter image URL</p>
                  <input
                    v-model="chaptersImage"
                    type="url"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                    placeholder="https://example.com/chapters-image.jpg"
                  />
                </div>
                <div v-if="chaptersImage && !uploadingImage" class="mt-2 flex items-center gap-2">
                  <img :src="chaptersImage" alt="Preview" class="w-24 h-16 rounded-lg object-cover border border-gray-200" />
                  <button
                    type="button"
                    @click="removeImage"
                    class="text-xs text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                <div v-if="uploadingImage" class="mt-2 flex items-center gap-2 text-xs text-gray-500">
                  <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing image...</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 shrink-0">
            <button
              @click="showImageModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="saveImageAndClose"
              :disabled="loading"
              class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ loading ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, Teleport } from 'vue'
import AdminLayout from '../../../layouts/AdminLayout.vue'
import { aboutUsService } from '../../../firebase/firestore'
import { useToast } from '../../../composables/useToast'
import { useConfirm } from '../../../composables/useConfirm'
import { useBodyScrollLock } from '../../../composables/useBodyScrollLock'
import { Pencil, X, Plus, Edit, Trash2 } from 'lucide-vue-next'

const { success: showSuccess, error: showError } = useToast()
const { confirm } = useConfirm()
const { useLock } = useBodyScrollLock()

const loading = ref(false)
const loadingData = ref(true)
const chapters = ref([])
const editingChapter = ref(null)
const showImageModal = ref(false)
const showChapterModal = ref(false)
const chaptersImage = ref('')
const uploadingImage = ref(false)
const imageFileInput = ref(null)

// Lock body scroll when modals are open
useLock(showImageModal)
useLock(showChapterModal)

const form = ref({
  chapterName: '',
  region: '',
  province: '',
  municipality: '',
  membersCount: 0
})

async function loadChapters() {
  loadingData.value = true
  try {
    chapters.value = await aboutUsService.getChapters()
    const aboutData = await aboutUsService.getAboutUs()
    chaptersImage.value = aboutData?.chaptersImage || ''
  } catch (error) {
    console.error('Error loading chapters:', error)
    showError('Failed to load chapters')
  } finally {
    loadingData.value = false
  }
}

function handleEdit(chapter) {
  editingChapter.value = chapter
  form.value = {
    chapterName: chapter.chapterName,
    region: chapter.region,
    province: chapter.province,
    municipality: chapter.municipality,
    membersCount: chapter.membersCount
  }
  showChapterModal.value = true
}

function cancelEdit() {
  editingChapter.value = null
  form.value = {
    chapterName: '',
    region: '',
    province: '',
    municipality: '',
    membersCount: 0
  }
  showChapterModal.value = false
}

function compressImage(file, maxWidth = 1920, maxHeight = 1080, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        
        // Calculate new dimensions
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
        
        // Convert to base64 with compression
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

async function handleSubmit() {
  loading.value = true

  try {
    if (editingChapter.value) {
      await aboutUsService.updateChapter(editingChapter.value.id, form.value)
      showSuccess('Chapter updated successfully!')
    } else {
      await aboutUsService.addChapter(form.value)
      showSuccess('Chapter added successfully!')
    }
    cancelEdit()
    await loadChapters()
  } catch (error) {
    console.error('Error saving chapter:', error)
    showError('Failed to save chapter')
  } finally {
    loading.value = false
  }
}

async function saveChapterAndClose() {
  await handleSubmit()
  if (!loading.value) {
    showChapterModal.value = false
  }
}

async function handleDelete(id) {
  const confirmed = await confirm('Are you sure you want to delete this chapter?', {
    title: 'Delete Chapter',
    confirmText: 'Delete'
  })
  
  if (!confirmed) return

  try {
    await aboutUsService.deleteChapter(id)
    showSuccess('Chapter deleted successfully!')
    await loadChapters()
  } catch (error) {
    console.error('Error deleting chapter:', error)
    showError('Failed to delete chapter')
  }
}

async function handleImageFileSelect(event) {
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
    const compressedDataUrl = await compressImage(file, 1920, 1080, 0.8)
    const base64Size = compressedDataUrl.length * 0.75
    if (base64Size > 900000) {
      const moreCompressed = await compressImage(file, 1600, 900, 0.7)
      chaptersImage.value = moreCompressed
    } else {
      chaptersImage.value = compressedDataUrl
    }
  } catch (error) {
    console.error('Error processing image:', error)
    showError('Failed to process image file')
    if (imageFileInput.value) {
      imageFileInput.value.value = ''
    }
  } finally {
    uploadingImage.value = false
  }
}

function removeImage() {
  chaptersImage.value = ''
  if (imageFileInput.value) {
    imageFileInput.value.value = ''
  }
}

async function saveImageAndClose() {
  loading.value = true
  try {
    const aboutData = await aboutUsService.getAboutUs()
    await aboutUsService.updateAboutUs({
      ...aboutData,
      chaptersImage: chaptersImage.value
    })
    showSuccess('Background image updated successfully!')
    showImageModal.value = false
  } catch (error) {
    console.error('Error saving image:', error)
    showError('Failed to save image')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadChapters()
})
</script>
