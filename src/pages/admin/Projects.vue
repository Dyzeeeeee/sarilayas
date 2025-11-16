<template>
  <AdminLayout>
    <div class="space-y-4">
      <!-- Header -->
      <div>
        <h1 class="text-xl font-semibold text-gray-900 tracking-tight">Projects</h1>
        <p class="text-xs text-gray-500 mt-1">Manage organization projects</p>
      </div>

      <!-- Two Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Left Column: Add/Edit Form -->
        <div class="bg-white rounded-lg border border-gray-200/80 p-4">
        <h2 class="text-sm font-semibold text-gray-900 mb-3">
          {{ editingProject ? 'Edit Project' : 'Add New Project' }}
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
              placeholder="Project title"
            />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">
              Tagline/Subtitle (optional)
            </label>
            <input
              v-model="form.tagline"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
              placeholder="Project tagline or subtitle"
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
              placeholder="Short project description or summary"
            ></textarea>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">
              Content *
            </label>
            <textarea
              v-model="form.content"
              rows="10"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm font-mono text-xs"
              placeholder="Full project content. You can structure it with sections, headings, and paragraphs."
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">Enter the full project content with all sections and details</p>
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
          <div class="flex space-x-2">
            <button
              type="submit"
              :disabled="loading || uploadingImage"
              class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 transition-colors text-xs font-semibold flex items-center space-x-2"
            >
              <svg v-if="loading" class="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ loading ? 'Saving...' : editingProject ? 'Update' : 'Add' }} Project</span>
            </button>
            <button
              v-if="editingProject"
              type="button"
              @click="cancelEdit"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
        </div>

        <!-- Right Column: Projects List -->
        <div class="bg-white rounded-lg border border-gray-200/80 flex flex-col">
        <div class="px-4 py-3 border-b border-gray-200/80">
          <h2 class="text-sm font-semibold text-gray-900">Current Projects</h2>
        </div>
        <div class="p-4 flex-1 overflow-y-auto max-h-[600px]">
          <div v-if="loadingData" class="space-y-2">
            <div v-for="i in 3" :key="i" class="border border-gray-200 rounded-lg p-3 animate-pulse">
              <div class="space-y-2">
                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                <div class="h-3 bg-gray-200 rounded w-full"></div>
                <div class="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
          <div v-else-if="projects.length === 0" class="text-gray-500 text-center py-6 text-xs">
            No projects added yet
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="project in projects"
              :key="project.id"
              class="border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors"
            >
              <div class="flex items-start space-x-3">
                <div v-if="project.image" class="flex-shrink-0">
                  <img
                    :src="project.image"
                    :alt="project.title"
                    class="w-16 h-16 rounded-lg object-cover ring-2 ring-gray-100"
                  />
                </div>
                <div v-else class="flex-shrink-0 w-16 h-16 rounded-lg bg-primary-100 flex items-center justify-center ring-2 ring-gray-100">
                  <svg class="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-gray-900 text-xs truncate">{{ project.title }}</h3>
                  <p v-if="project.tagline" class="text-gray-600 text-xs mt-0.5 italic truncate">{{ project.tagline }}</p>
                  <p v-if="project.description" class="text-gray-600 text-xs mt-1 line-clamp-2">{{ project.description }}</p>
                </div>
                <div class="flex space-x-1.5">
                  <button
                    @click="handleEdit(project)"
                    class="px-2.5 py-1 text-xs text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium"
                  >
                    Edit
                  </button>
                  <button
                    @click="handleDelete(project.id)"
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
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '../../layouts/AdminLayout.vue'
import { projectsService } from '../../firebase/firestore'
import { useToast } from '../../composables/useToast'
import { useConfirm } from '../../composables/useConfirm'

const { success: showSuccess, error: showError } = useToast()
const { confirm } = useConfirm()

const loading = ref(false)
const loadingData = ref(true)
const projects = ref([])
const editingProject = ref(null)
const uploadingImage = ref(false)
const fileInput = ref(null)

const form = ref({
  title: '',
  tagline: '',
  description: '',
  content: '',
  image: ''
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

async function loadProjects() {
  loadingData.value = true
  try {
    projects.value = await projectsService.getProjects()
  } catch (error) {
    console.error('Error loading projects:', error)
    showError('Failed to load projects')
  } finally {
    loadingData.value = false
  }
}

function handleEdit(project) {
  editingProject.value = project
  form.value = {
    title: project.title || '',
    tagline: project.tagline || '',
    description: project.description || '',
    content: project.content || '',
    image: project.image || ''
  }
}

function cancelEdit() {
  editingProject.value = null
  form.value = {
    title: '',
    tagline: '',
    description: '',
    content: '',
    image: ''
  }
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

async function handleSubmit() {
  loading.value = true

  try {
    const projectData = {
      title: form.value.title,
      tagline: form.value.tagline || '',
      description: form.value.description || '',
      content: form.value.content,
      image: form.value.image || ''
    }
    if (editingProject.value) {
      await projectsService.updateProject(editingProject.value.id, projectData)
      showSuccess('Project updated successfully!')
    } else {
      await projectsService.addProject(projectData)
      showSuccess('Project added successfully!')
    }
    cancelEdit()
    await loadProjects()
  } catch (error) {
    console.error('Error saving project:', error)
    showError('Failed to save project')
  } finally {
    loading.value = false
  }
}

async function handleDelete(id) {
  const confirmed = await confirm('Are you sure you want to delete this project?', {
    title: 'Delete Project',
    confirmText: 'Delete'
  })
  
  if (!confirmed) return

  try {
    await projectsService.deleteProject(id)
    showSuccess('Project deleted successfully!')
    await loadProjects()
  } catch (error) {
    console.error('Error deleting project:', error)
    showError('Failed to delete project')
  }
}

onMounted(() => {
  loadProjects()
})
</script>

