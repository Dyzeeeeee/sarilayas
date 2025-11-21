<template>
  <AdminLayout>
    <div class="space-y-4">
      <!-- Header -->
      <div>
        <h1 class="text-xl font-semibold text-gray-900 tracking-tight">General Info</h1>
        <p class="text-xs text-gray-500 mt-1">Manage description, mission, vision, and statistics</p>
      </div>

      <div v-if="loadingData" class="bg-white rounded-lg border border-gray-200/80 p-4 space-y-4">
        <div class="space-y-3 animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-20"></div>
          <div class="h-24 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded w-16"></div>
          <div class="h-20 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded w-14"></div>
          <div class="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
      <form v-else @submit.prevent="handleSubmit" class="bg-white rounded-lg border border-gray-200/80 p-4 space-y-4">
        <!-- Hero Image -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5">
            Hero Image (optional)
          </label>
          <div class="space-y-2">
            <div>
              <input
                @change="(e) => handleFileSelect(e, 'heroImage')"
                type="file"
                accept="image/*"
                ref="fileInput"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              />
              <p class="text-xs text-gray-500 mt-1">Or enter image URL below</p>
            </div>
            <input
              v-model="form.heroImage"
              type="url"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
              placeholder="https://example.com/hero-image.jpg"
            />
          </div>
          <div v-if="form.heroImage && !uploadingImage" class="mt-2 flex items-center space-x-2">
            <img :src="form.heroImage" alt="Preview" class="w-32 h-20 rounded-lg object-cover ring-2 ring-gray-100" />
            <button
              type="button"
              @click="removeImage"
              class="text-xs text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>
          <div v-if="uploadingImage" class="mt-2 flex items-center space-x-2 text-xs text-gray-500">
            <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Processing image...</span>
          </div>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5">
            Description
          </label>
          <textarea
            v-model="form.description"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
            placeholder="Short explanation of who you are and what you do"
          ></textarea>
        </div>

        <!-- Mission -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5">
            Mission
          </label>
          <textarea
            v-model="form.mission"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
            placeholder="One clear statement of your purpose"
          ></textarea>
        </div>

        <!-- Vision -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5">
            Vision
          </label>
          <textarea
            v-model="form.vision"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
            placeholder="One clear statement of your future goal"
          ></textarea>
        </div>

        <!-- Statistics -->
        <div class="pt-3 border-t border-gray-200">
          <h3 class="text-sm font-semibold text-gray-900 mb-3">Where We Are</h3>
          <div class="mb-3">
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">
              Description (optional)
            </label>
            <textarea
              v-model="form.statsDescription"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
              placeholder="Brief description about your organization's reach"
            ></textarea>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">
                Regions
              </label>
              <input
                v-model.number="form.stats.regions"
                type="number"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">
                Provinces
              </label>
              <input
                v-model.number="form.stats.provinces"
                type="number"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">
                Municipalities
              </label>
              <input
                v-model.number="form.stats.municipalities"
                type="number"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">
                Members
              </label>
              <input
                v-model.number="form.stats.members"
                type="number"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
              />
            </div>
          </div>
        </div>

        <!-- Values Description -->
        <div class="pt-3 border-t border-gray-200">
          <h3 class="text-sm font-semibold text-gray-900 mb-3">Values Section</h3>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">
              Description (optional)
            </label>
            <textarea
              v-model="form.valuesDescription"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
              placeholder="Brief description about your organization's values"
            ></textarea>
          </div>
        </div>

        <!-- Explore Section Images -->
        <div class="pt-3 border-t border-gray-200">
          <h3 class="text-sm font-semibold text-gray-900 mb-3">Explore Section Background Images</h3>
          
          <!-- Officers Image -->
          <div class="mb-4">
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">
              Officers Background Image (optional)
            </label>
            <div class="space-y-2">
              <div>
                <input
                  @change="(e) => handleFileSelect(e, 'officersImage')"
                  type="file"
                  accept="image/*"
                  :ref="el => fileInputs.officers = el"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
                <p class="text-xs text-gray-500 mt-1">Or enter image URL below</p>
              </div>
              <input
                v-model="form.officersImage"
                type="url"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                placeholder="https://example.com/officers-image.jpg"
              />
            </div>
            <div v-if="form.officersImage && !uploadingImages.officers" class="mt-2 flex items-center space-x-2">
              <img :src="form.officersImage" alt="Preview" class="w-32 h-20 rounded-lg object-cover ring-2 ring-gray-100" />
              <button
                type="button"
                @click="removeImage('officersImage')"
                class="text-xs text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>
            <div v-if="uploadingImages.officers" class="mt-2 flex items-center space-x-2 text-xs text-gray-500">
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Processing image...</span>
            </div>
          </div>

          <!-- National Council Image -->
          <div class="mb-4">
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">
              National Council Background Image (optional)
            </label>
            <div class="space-y-2">
              <div>
                <input
                  @change="(e) => handleFileSelect(e, 'nationalCouncilImage')"
                  type="file"
                  accept="image/*"
                  :ref="el => fileInputs.nationalCouncil = el"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
                <p class="text-xs text-gray-500 mt-1">Or enter image URL below</p>
              </div>
              <input
                v-model="form.nationalCouncilImage"
                type="url"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                placeholder="https://example.com/council-image.jpg"
              />
            </div>
            <div v-if="form.nationalCouncilImage && !uploadingImages.nationalCouncil" class="mt-2 flex items-center space-x-2">
              <img :src="form.nationalCouncilImage" alt="Preview" class="w-32 h-20 rounded-lg object-cover ring-2 ring-gray-100" />
              <button
                type="button"
                @click="removeImage('nationalCouncilImage')"
                class="text-xs text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>
            <div v-if="uploadingImages.nationalCouncil" class="mt-2 flex items-center space-x-2 text-xs text-gray-500">
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Processing image...</span>
            </div>
          </div>

          <!-- Chapters Image -->
          <div class="mb-4">
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">
              Chapters Background Image (optional)
            </label>
            <div class="space-y-2">
              <div>
                <input
                  @change="(e) => handleFileSelect(e, 'chaptersImage')"
                  type="file"
                  accept="image/*"
                  :ref="el => fileInputs.chapters = el"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
                <p class="text-xs text-gray-500 mt-1">Or enter image URL below</p>
              </div>
              <input
                v-model="form.chaptersImage"
                type="url"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                placeholder="https://example.com/chapters-image.jpg"
              />
            </div>
            <div v-if="form.chaptersImage && !uploadingImages.chapters" class="mt-2 flex items-center space-x-2">
              <img :src="form.chaptersImage" alt="Preview" class="w-32 h-20 rounded-lg object-cover ring-2 ring-gray-100" />
              <button
                type="button"
                @click="removeImage('chaptersImage')"
                class="text-xs text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>
            <div v-if="uploadingImages.chapters" class="mt-2 flex items-center space-x-2 text-xs text-gray-500">
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Processing image...</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-2 pt-3 border-t border-gray-200">
          <button
            type="button"
            @click="loadData"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors text-xs font-medium"
          >
            Reset
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-semibold flex items-center space-x-2"
          >
            <svg v-if="loading" class="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ loading ? 'Saving...' : 'Save Changes' }}</span>
          </button>
        </div>
      </form>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '../../../layouts/AdminLayout.vue'
import { aboutUsService } from '../../../firebase/firestore'
import { useToast } from '../../../composables/useToast'

const { success: showSuccess, error: showError } = useToast()

const loading = ref(false)
const loadingData = ref(true)
const uploadingImage = ref(false)
const fileInput = ref(null)
const uploadingImages = ref({
  officers: false,
  nationalCouncil: false,
  chapters: false
})
const fileInputs = ref({
  officers: null,
  nationalCouncil: null,
  chapters: null
})

const form = ref({
  heroImage: '',
  description: '',
  mission: '',
  vision: '',
  statsDescription: '',
  valuesDescription: '',
  officersImage: '',
  nationalCouncilImage: '',
  chaptersImage: '',
  stats: {
    regions: 0,
    provinces: 0,
    municipalities: 0,
    members: 0
  }
})

async function loadData() {
  loadingData.value = true
  try {
    const data = await aboutUsService.getAboutUs()
    if (data) {
      form.value = {
        heroImage: data.heroImage || '',
        description: data.description || '',
        mission: data.mission || '',
        vision: data.vision || '',
        statsDescription: data.statsDescription || '',
        valuesDescription: data.valuesDescription || '',
        officersImage: data.officersImage || '',
        nationalCouncilImage: data.nationalCouncilImage || '',
        chaptersImage: data.chaptersImage || '',
        stats: {
          regions: data.stats?.regions || 0,
          provinces: data.stats?.provinces || 0,
          municipalities: data.stats?.municipalities || 0,
          members: data.stats?.members || 0
        }
      }
    }
  } catch (error) {
    console.error('Error loading data:', error)
    showError('Failed to load data')
  } finally {
    loadingData.value = false
  }
}

async function handleSubmit() {
  loading.value = true

  try {
    await aboutUsService.updateAboutUs(form.value)
    showSuccess('Changes saved successfully!')
  } catch (error) {
    console.error('Error saving data:', error)
    showError('Failed to save changes')
  } finally {
    loading.value = false
  }
}

function compressImage(file, maxWidth, maxHeight, quality) {
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

async function handleFileSelect(event, fieldName = 'heroImage') {
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

  if (fieldName === 'heroImage') {
    uploadingImage.value = true
  } else {
    uploadingImages.value[fieldName === 'officersImage' ? 'officers' : fieldName === 'nationalCouncilImage' ? 'nationalCouncil' : 'chapters'] = true
  }

  try {
    const compressedDataUrl = await compressImage(file, 1920, 1080, 0.8)
    
    const base64Size = compressedDataUrl.length * 0.75
    if (base64Size > 900000) {
      const moreCompressed = await compressImage(file, 1600, 900, 0.7)
      form.value[fieldName] = moreCompressed
    } else {
      form.value[fieldName] = compressedDataUrl
    }
  } catch (error) {
    console.error('Error processing image:', error)
    showError('Failed to process image file')
    const inputRef = fieldName === 'heroImage' ? fileInput.value : fileInputs.value[fieldName === 'officersImage' ? 'officers' : fieldName === 'nationalCouncilImage' ? 'nationalCouncil' : 'chapters']
    if (inputRef) {
      inputRef.value = ''
    }
  } finally {
    if (fieldName === 'heroImage') {
      uploadingImage.value = false
    } else {
      uploadingImages.value[fieldName === 'officersImage' ? 'officers' : fieldName === 'nationalCouncilImage' ? 'nationalCouncil' : 'chapters'] = false
    }
  }
}

function removeImage(fieldName = 'heroImage') {
  form.value[fieldName] = ''
  const inputRef = fieldName === 'heroImage' ? fileInput.value : fileInputs.value[fieldName === 'officersImage' ? 'officers' : fieldName === 'nationalCouncilImage' ? 'nationalCouncil' : 'chapters']
  if (inputRef) {
    inputRef.value = ''
  }
}

onMounted(() => {
  loadData()
})
</script>

