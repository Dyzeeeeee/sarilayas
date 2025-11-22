<template>
  <AdminLayout>
    <div class="space-y-4 md:space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
      <div>
          <h1 class="text-xl md:text-2xl font-semibold text-gray-900 tracking-tight">Projects</h1>
          <p class="text-xs md:text-sm text-gray-500 mt-1">Manage organization projects</p>
        </div>
        <button
          @click="showProjectModal = true; editingProject = null; form = { title: '', tagline: '', description: '', content: '', image: '' }"
          class="px-3 py-1.5 text-xs font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
        >
          <Plus class="h-4 w-4" />
          Add Project
        </button>
      </div>

      <!-- Projects Grid -->
      <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div class="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 class="text-base md:text-lg font-semibold text-gray-900">All Projects</h2>
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

        <!-- Projects Grid View -->
        <div v-else-if="projects.length > 0 && viewMode === 'grid'" class="p-4 md:p-6">
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            <div
              v-for="project in projects"
              :key="project.id"
              class="group relative border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors"
            >
              <!-- Project Thumbnail -->
              <div class="aspect-video bg-gray-100 relative">
                <img
                  v-if="project.image"
                  :src="project.image"
                  :alt="project.title"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                  <Briefcase class="w-8 h-8 text-white" />
                </div>
                <!-- Overlay Actions -->
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div class="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                    <button
                      @click.stop="handleEdit(project)"
                      class="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                      title="Edit project"
                    >
                      <Edit class="h-4 w-4 text-gray-700" />
                    </button>
                    <button
                      @click.stop="handleDelete(project.id)"
                      class="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                      title="Delete project"
                    >
                      <Trash2 class="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Project Info -->
              <div class="p-2 md:p-3">
                <h3 class="text-xs md:text-sm font-semibold text-gray-900 mb-1 line-clamp-2">{{ project.title || 'Untitled' }}</h3>
                <p v-if="project.tagline" class="text-[10px] md:text-xs text-gray-600 line-clamp-1 mb-1 italic">{{ project.tagline }}</p>
                <p v-if="project.description" class="text-[10px] md:text-xs text-gray-600 line-clamp-2 mb-1">{{ project.description }}</p>
                <p class="text-[10px] text-gray-500 flex items-center gap-1">
                  <Clock class="h-3 w-3" />
                  {{ formatDate(project.createdAt) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Projects List View -->
        <div v-else-if="projects.length > 0 && viewMode === 'list'" class="divide-y divide-gray-200">
          <div
            v-for="project in projects"
            :key="project.id"
            class="group p-3 md:p-4 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center gap-3 md:gap-4">
              <!-- Thumbnail -->
              <div class="w-24 md:w-32 h-16 md:h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                <img
                  v-if="project.image"
                  :src="project.image"
                  :alt="project.title"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                  <Briefcase class="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <h3 class="text-sm md:text-base font-semibold text-gray-900 mb-1 line-clamp-1">{{ project.title || 'Untitled' }}</h3>
                <p v-if="project.tagline" class="text-xs md:text-sm text-gray-600 mb-1 line-clamp-1 italic">{{ project.tagline }}</p>
                <p v-if="project.description" class="text-xs md:text-sm text-gray-600 mb-1 line-clamp-2">{{ project.description }}</p>
                <p class="text-[10px] md:text-xs text-gray-500 flex items-center gap-1">
                  <Clock class="h-3 w-3" />
                  {{ formatDate(project.createdAt) }}
                </p>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  @click="handleEdit(project)"
                  class="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="Edit project"
                >
                  <Edit class="h-4 w-4" />
                </button>
                <button
                  @click="handleDelete(project.id)"
                  class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete project"
                >
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="p-8 md:p-12 text-center">
          <Briefcase class="h-12 w-12 md:h-16 md:w-16 text-gray-400 mx-auto mb-4" />
          <p class="text-sm md:text-base text-gray-500">No projects added yet</p>
        </div>
      </div>
    </div>

    <!-- Project Add/Edit Modal -->
    <Teleport to="body">
      <div
        v-if="showProjectModal"
        @click.self="closeProjectModal"
        @keydown.esc="closeProjectModal"
        class="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4"
        tabindex="-1"
      >
        <div class="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
            <h2 class="text-lg font-semibold text-gray-900">
          {{ editingProject ? 'Edit Project' : 'Add New Project' }}
        </h2>
            <button
              @click="closeProjectModal"
              class="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
            >
              <X class="h-5 w-5" />
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-hidden flex">
            <!-- Preview Column -->
            <div class="w-1/2 border-r border-gray-200 overflow-y-auto p-6 bg-gray-50">
              <p class="text-sm font-semibold text-gray-700 mb-4">Preview</p>
              <div class="bg-white rounded-lg border border-gray-200 p-4">
                <div v-if="form.image || form.title || form.description" class="space-y-4">
                  <!-- Image -->
                  <div v-if="form.image" class="aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <img
                      :src="form.image"
                      :alt="form.title || 'Project'"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div v-else class="aspect-video bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                    <Briefcase class="w-12 h-12 text-white" />
                  </div>
                  
                  <!-- Content -->
                  <div class="space-y-2">
                    <h3 class="text-lg font-semibold text-gray-900">{{ form.title || 'Project Title' }}</h3>
                    <p v-if="form.tagline" class="text-sm text-gray-600 italic">{{ form.tagline }}</p>
                    <p v-if="form.description" class="text-sm text-gray-600">{{ form.description }}</p>
                    <div v-if="form.content" class="text-sm text-gray-700 whitespace-pre-wrap border-t border-gray-200 pt-4 mt-4">
                      {{ form.content }}
                    </div>
                  </div>
                </div>
                <div v-else class="text-center py-8">
                  <p class="text-xs text-gray-500">Fill in the form to see preview</p>
                </div>
              </div>
            </div>

            <!-- Editor Column -->
            <div class="w-1/2 overflow-y-auto p-6 space-y-4">
              <form @submit.prevent="saveProjectAndClose" class="space-y-4">
          <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
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
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
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
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
              Description (optional)
            </label>
            <textarea
              v-model="form.description"
              rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm resize-none"
              placeholder="Short project description or summary"
            ></textarea>
          </div>
          <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              v-model="form.content"
              rows="10"
              required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm font-mono resize-none"
              placeholder="Full project content. You can structure it with sections, headings, and paragraphs."
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">Enter the full project content with all sections and details</p>
          </div>
          <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
              Featured Image (optional)
            </label>
            <div class="space-y-2">
                <input
                  @change="handleFileSelect"
                  type="file"
                  accept="image/*"
                  ref="fileInput"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
                    <p class="text-xs text-gray-500">Or enter image URL</p>
              <input
                v-model="form.image"
                      @input="clearFileInput"
                type="url"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                placeholder="https://example.com/image.jpg"
              />
            </div>
                  <div v-if="form.image && !uploadingImage" class="mt-2 flex items-center gap-2">
                    <img :src="form.image" alt="Preview" class="w-20 h-20 rounded-lg object-cover border border-gray-200" />
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
              </form>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 shrink-0">
            <button
              @click="closeProjectModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="saveProjectAndClose"
              :disabled="loading || uploadingImage || !form.title || !form.content"
              class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ loading ? 'Saving...' : editingProject ? 'Update' : 'Add' }} Project
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, Teleport } from 'vue'
import AdminLayout from '../../layouts/AdminLayout.vue'
import { projectsService } from '../../firebase/firestore'
import { useToast } from '../../composables/useToast'
import { useConfirm } from '../../composables/useConfirm'
import { useBodyScrollLock } from '../../composables/useBodyScrollLock'
import { Plus, Edit, Trash2, X, Grid3x3, List, Briefcase, Clock } from 'lucide-vue-next'

const { success: showSuccess, error: showError } = useToast()
const { confirm } = useConfirm()
const { useLock } = useBodyScrollLock()

const loading = ref(false)
const loadingData = ref(true)
const projects = ref([])
const editingProject = ref(null)
const showProjectModal = ref(false)
const uploadingImage = ref(false)
const fileInput = ref(null)
const viewMode = ref('grid') // 'grid' or 'list'

// Lock body scroll when modal is open
useLock(showProjectModal)

const form = ref({
  title: '',
  tagline: '',
  description: '',
  content: '',
  image: ''
})

function formatDate(date) {
  if (!date) return 'Unknown'
  
  const now = new Date()
  const dateObj = date?.toDate ? date.toDate() : (date ? new Date(date) : new Date(0))
  const diffMs = now - dateObj
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffWeeks < 4) return `${diffWeeks}w ago`
  if (diffMonths < 12) return `${diffMonths}mo ago`
  return `${diffYears}y ago`
}

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

function clearFileInput() {
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

async function loadProjects() {
  loadingData.value = true
  try {
    const allProjects = await projectsService.getProjects()
    // Sort by newest first
    projects.value = allProjects.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : (a.createdAt ? new Date(a.createdAt) : new Date(0))
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : (b.createdAt ? new Date(b.createdAt) : new Date(0))
      return dateB - dateA
    })
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
  showProjectModal.value = true
}

function closeProjectModal() {
  showProjectModal.value = false
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

async function saveProjectAndClose() {
  if (!form.value.title || !form.value.content) {
    showError('Title and content are required')
    return
  }

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
    closeProjectModal()
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
