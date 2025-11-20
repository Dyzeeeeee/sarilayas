<template>
  <AdminLayout>
    <div class="space-y-4">
      <!-- Header -->
      <div>
        <h1 class="text-xl font-semibold text-gray-900 tracking-tight">National Council</h1>
        <p class="text-xs text-gray-500 mt-1">Manage national council members</p>
      </div>

      <!-- Two Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Left Column: Add/Edit Form -->
        <div class="bg-white rounded-lg border border-gray-200/80 p-4">
        <h2 class="text-sm font-semibold text-gray-900 mb-3">
          {{ editingMember ? 'Edit Council Member' : 'Add New Council Member' }}
        </h2>
        <form @submit.prevent="handleSubmit" class="space-y-3">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">
                Name *
              </label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">
                Role / Committee *
              </label>
              <input
                v-model="form.role"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                placeholder="e.g., Finance Committee"
              />
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">
              Photo (optional)
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
                v-model="form.photo"
                type="url"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                placeholder="https://example.com/photo.jpg"
              />
            </div>
            <div v-if="form.photo && !uploadingPhoto" class="mt-2 flex items-center space-x-2">
              <img :src="form.photo" alt="Preview" class="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100" />
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
            <button
              type="submit"
              :disabled="loading || uploadingPhoto"
              class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 transition-colors text-xs font-semibold flex items-center space-x-2"
            >
              <svg v-if="loading" class="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ loading ? 'Saving...' : editingMember ? 'Update' : 'Add' }} Member</span>
            </button>
            <button
              v-if="editingMember"
              type="button"
              @click="cancelEdit"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
        </div>

        <!-- Right Column: Council Members List -->
        <div class="bg-white rounded-lg border border-gray-200/80 flex flex-col">
        <div class="px-4 py-3 border-b border-gray-200/80">
          <h2 class="text-sm font-semibold text-gray-900">Current Council Members</h2>
        </div>
        <div class="p-4 flex-1 overflow-y-auto max-h-[600px]">
          <div v-if="loadingData" class="space-y-2">
            <div v-for="i in 3" :key="i" class="border border-gray-200 rounded-lg p-3 animate-pulse">
              <div class="flex items-center space-x-3">
                <div class="w-12 h-12 rounded-full bg-gray-200"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-4 bg-gray-200 rounded w-24"></div>
                  <div class="h-3 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="members.length === 0" class="text-gray-500 text-center py-6 text-xs">
            No council members added yet
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="member in members"
              :key="member.id"
              class="border border-gray-200 rounded-lg p-3 flex items-center space-x-3 hover:border-gray-300 transition-colors"
            >
              <div v-if="member.photo" class="flex-shrink-0">
                <img
                  :src="member.photo"
                  :alt="member.name"
                  class="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
                />
              </div>
              <div v-else class="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center ring-2 ring-gray-100">
                <span class="text-primary-600 text-base font-semibold">{{ member.name.charAt(0) }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-gray-900 text-xs truncate">{{ member.name }}</h3>
                <p class="text-gray-500 text-xs mt-0.5 truncate">{{ member.role }}</p>
              </div>
              <div class="flex space-x-1.5">
                <button
                  @click="handleEdit(member)"
                  class="px-2.5 py-1 text-xs text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium"
                >
                  Edit
                </button>
                <button
                  @click="handleDelete(member.id)"
                  class="px-2.5 py-1 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                >
                  Delete
                </button>
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
import AdminLayout from '../../../layouts/AdminLayout.vue'
import { aboutUsService } from '../../../firebase/firestore'
import { useToast } from '../../../composables/useToast'
import { useConfirm } from '../../../composables/useConfirm'

const { success: showSuccess, error: showError } = useToast()
const { confirm } = useConfirm()

const loading = ref(false)
const loadingData = ref(true)
const members = ref([])
const editingMember = ref(null)
const uploadingPhoto = ref(false)
const fileInput = ref(null)

const form = ref({
  name: '',
  role: '',
  photo: ''
})

async function loadMembers() {
  loadingData.value = true
  try {
    members.value = await aboutUsService.getNationalCouncil()
  } catch (error) {
    console.error('Error loading council members:', error)
    showError('Failed to load council members')
  } finally {
    loadingData.value = false
  }
}

function handleEdit(member) {
  editingMember.value = member
  form.value = {
    name: member.name,
    role: member.role,
    photo: member.photo || ''
  }
}

function cancelEdit() {
  editingMember.value = null
  form.value = { name: '', role: '', photo: '' }
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function compressImage(file, maxWidth = 400, maxHeight = 400, quality = 0.8) {
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

async function handleFileSelect(event) {
  const file = event.target.files[0]
  if (!file) return

  // Validate file type
  if (!file.type.startsWith('image/')) {
    showError('Please select an image file')
    return
  }

  // Validate file size (max 5MB before compression)
  if (file.size > 5 * 1024 * 1024) {
    showError('Image size must be less than 5MB')
    return
  }

  uploadingPhoto.value = true

  try {
    // Compress image to fit Firestore limit (1MB)
    const compressedDataUrl = await compressImage(file, 400, 400, 0.75)
    
    // Check if compressed size is still too large
    const base64Size = compressedDataUrl.length * 0.75 // Approximate byte size
    if (base64Size > 900000) { // Leave some margin under 1MB
      // Try more aggressive compression
      const moreCompressed = await compressImage(file, 300, 300, 0.6)
      form.value.photo = moreCompressed
    } else {
      form.value.photo = compressedDataUrl
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
  form.value.photo = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

async function handleSubmit() {
  loading.value = true

  try {
    if (editingMember.value) {
      await aboutUsService.updateCouncilMember(editingMember.value.id, form.value)
      showSuccess('Council member updated successfully!')
    } else {
      await aboutUsService.addCouncilMember(form.value)
      showSuccess('Council member added successfully!')
    }
    cancelEdit()
    await loadMembers()
  } catch (error) {
    console.error('Error saving council member:', error)
    showError('Failed to save council member')
  } finally {
    loading.value = false
  }
}

async function handleDelete(id) {
  const confirmed = await confirm('Are you sure you want to delete this council member?', {
    title: 'Delete Council Member',
    confirmText: 'Delete'
  })
  
  if (!confirmed) return

  try {
    await aboutUsService.deleteCouncilMember(id)
    showSuccess('Council member deleted successfully!')
    await loadMembers()
  } catch (error) {
    console.error('Error deleting council member:', error)
    showError('Failed to delete council member')
  }
}

onMounted(() => {
  loadMembers()
})
</script>


