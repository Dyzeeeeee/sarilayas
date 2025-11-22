<template>
  <PublicLayout>
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 min-h-[calc(100vh-80px)]">
      
      <!-- Loading Skeleton -->
      <template v-if="loading">
        <div :class="[
          'gap-4 sm:gap-6',
          (viewMode || 'cards') === 'list' ? 'flex flex-col' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        ]">
          <Skeleton
            v-for="n in 6"
            :key="n"
            type="card"
            variant="default"
            :image-aspect="(viewMode || 'cards') === 'list' ? undefined : 'square'"
            :image-height="(viewMode || 'cards') === 'list' ? 'h-32 w-32' : undefined"
            :description-lines="(viewMode || 'cards') === 'list' ? 2 : 3"
            :card-classes="(viewMode || 'cards') === 'list' ? 'flex-row' : ''"
          />
        </div>
      </template>

      <!-- Projects List View -->
      <template v-else-if="!loading && projects.length > 0 && viewMode === 'list'">
        <div class="space-y-4">
          <div
            v-for="project in sortedProjects"
            :key="project.id"
            @click="handleProjectClick(project)"
            class="bg-white rounded-xl border-2 border-gray-100 overflow-hidden transition-all duration-300 cursor-pointer hover:border-primary-300 shadow-lg"
          >
            <div class="flex flex-col sm:flex-row">
              <!-- IMAGE WITH GRADIENT OVERLAY -->
              <div class="relative shrink-0 w-full sm:w-48 h-48 sm:h-auto sm:min-h-[200px] overflow-hidden bg-gray-100">
                <img
                  v-if="project.image"
                  :src="project.image"
                  :alt="project.title"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                  <Briefcase class="w-16 h-16 text-white" />
                </div>
                <!-- Primary Gradient Overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-700/60 to-primary-500/30"></div>
                <!-- Content Overlay -->
                <div class="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                  <div v-if="project.createdAt" class="mb-2 flex items-center gap-2">
                    <Calendar class="w-3 h-3 sm:w-4 sm:h-4" />
                    <span class="text-xs sm:text-sm text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)] font-semibold">
                      {{ formatDate(project.createdAt) }}
                    </span>
                  </div>
                  <h3 class="text-xl sm:text-2xl font-extrabold mb-1 line-clamp-2 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                    {{ project.title }}
                  </h3>
                  <p v-if="project.tagline" class="text-sm sm:text-base text-primary-200 font-medium line-clamp-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">
                    {{ project.tagline }}
                  </p>
                </div>
              </div>

              <!-- CONTENT -->
              <div class="flex-1 p-4 sm:p-6 flex flex-col justify-center">
                <p v-if="project.description" class="text-sm sm:text-base text-gray-600 line-clamp-3">
                  {{ project.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Projects Cards View -->
      <template v-else-if="!loading && projects.length > 0 && viewMode === 'cards'">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div
            v-for="project in sortedProjects"
            :key="project.id"
            @click="handleProjectClick(project)"
            class="bg-white rounded-xl border-2 border-gray-100 overflow-hidden transition-all duration-300 cursor-pointer hover:border-primary-300 flex flex-col shadow-lg"
          >
            <!-- IMAGE WITH GRADIENT OVERLAY -->
            <div class="relative w-full aspect-video overflow-hidden bg-gray-100">
              <img
                v-if="project.image"
                :src="project.image"
                :alt="project.title"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                <Briefcase class="w-16 h-16 text-white" />
              </div>
              <!-- Primary Gradient Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-700/60 to-primary-500/30"></div>
              <!-- Content Overlay -->
              <div class="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                <div v-if="project.createdAt" class="mb-2 flex items-center gap-2">
                  <Calendar class="w-3 h-3 sm:w-4 sm:h-4" />
                  <span class="text-xs sm:text-sm text-white/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)] font-semibold">
                    {{ formatDate(project.createdAt) }}
                  </span>
                </div>
                <h3 class="text-xl sm:text-2xl font-extrabold mb-1 line-clamp-2 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  {{ project.title }}
                </h3>
                <p v-if="project.tagline" class="text-sm sm:text-base text-primary-200 font-medium line-clamp-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">
                  {{ project.tagline }}
                </p>
              </div>
            </div>

            <!-- CONTENT -->
            <div class="p-4 sm:p-6 flex-1 flex flex-col">
              <p v-if="project.description" class="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">
                {{ project.description }}
              </p>
            </div>
          </div>
        </div>
      </template>

      <!-- Empty state -->
      <template v-else-if="!loading && projects.length === 0">
        <div class="text-center py-12">
          <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase class="w-8 h-8 text-gray-400" />
          </div>
          <p class="text-gray-500 text-base sm:text-lg">
            No projects available.
          </p>
        </div>
      </template>
    </div>
  </PublicLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PublicLayout from '../layouts/PublicLayout.vue'
import Skeleton from '../components/Skeleton.vue'
import { projectsService } from '../firebase/firestore'
import { useViewMode } from '../composables/useViewMode'
import { Briefcase, Calendar } from 'lucide-vue-next'

const { viewMode } = useViewMode('projects')
const route = useRoute()
const router = useRouter()
const projects = ref([])
const loading = ref(true)

// Sort projects by newest first
const sortedProjects = computed(() => {
  return [...projects.value].sort((a, b) => {
    const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : (a.createdAt ? new Date(a.createdAt) : new Date(0))
    const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : (b.createdAt ? new Date(b.createdAt) : new Date(0))
    return dateB - dateA // Newest first
  })
})

function handleProjectClick(project) {
  router.push(`/projects/${project.id}`)
}

// Format date for display
function formatDate(date) {
  if (!date) return ''
  
  // Handle Firestore Timestamp
  let dateObj
  if (date.toDate) {
    dateObj = date.toDate()
  } else if (date instanceof Date) {
    dateObj = date
  } else if (typeof date === 'string' || typeof date === 'number') {
    dateObj = new Date(date)
  } else {
    return ''
  }
  
  const now = new Date()
  const diffTime = Math.abs(now - dateObj)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  // Format options
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  
  if (diffDays === 0) {
    return 'Today'
  } else if (diffDays === 1) {
    return 'Yesterday'
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
  } else {
    return dateObj.toLocaleDateString('en-US', options)
  }
}

async function loadProjects() {
  loading.value = true
  try {
    projects.value = await projectsService.getProjects()
  } catch (error) {
    console.error('Error loading projects:', error)
  } finally {
    loading.value = false
  }
}

const handleRefetch = () => {
  if (route.path === '/projects') {
    loadProjects()
  }
}

onMounted(() => {
  loadProjects()
  window.addEventListener('refetch-page-data', handleRefetch)
})

onUnmounted(() => {
  window.removeEventListener('refetch-page-data', handleRefetch)
})
</script>
