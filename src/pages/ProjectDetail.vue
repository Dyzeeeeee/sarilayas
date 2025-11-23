<template>
  <PublicLayout>
    <div class="max-w-4xl mx-auto px-2 sm:px-4 py-6 sm:py-8">
      <!-- Loading State -->
      <div v-if="loading" class="space-y-4">
        <div class="h-8 bg-gray-200 rounded animate-pulse w-3/4"></div>
        <div class="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
        <div class="aspect-video bg-gray-200 rounded-lg animate-pulse"></div>
        <div class="space-y-2">
          <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div class="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
        </div>
      </div>

      <!-- Project Content -->
      <article v-else-if="project">
        <!-- Header -->
        <header class="mb-6">
          <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
            {{ project.title || 'Untitled Project' }}
          </h1>
          <div v-if="project.tagline" class="text-xl sm:text-2xl text-primary-600 font-semibold mb-3">
            {{ project.tagline }}
          </div>
          <div class="flex items-center gap-4 text-sm text-gray-500">
            <span v-if="project.createdAt" class="flex items-center gap-1">
              <Calendar class="w-4 h-4" />
              <span class="font-medium">{{ formatDate(project.createdAt) }}</span>
            </span>
          </div>
        </header>

        <!-- Featured Image -->
        <div v-if="project.image" class="mb-6 rounded-lg overflow-hidden">
          <img
            :src="project.image"
            :alt="project.title || 'Project image'"
            class="w-full h-auto object-cover"
          />
        </div>

        <!-- Description -->
        <div v-if="project.description" class="prose prose-lg max-w-none mb-6">
          <p class="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
            {{ project.description }}
          </p>
        </div>

        <!-- Content (if available) -->
        <div v-if="project.content" class="prose prose-lg max-w-none">
          <div class="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {{ project.content }}
          </div>
        </div>

        <!-- Back Button -->
        <div class="mt-8">
          <router-link
            to="/projects"
            class="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Back to Projects
          </router-link>
        </div>
      </article>

      <!-- Other Projects -->
      <div v-if="!loading && project && otherProjects.length > 0" class="mt-12">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6">
          Other Projects
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card
            v-for="otherProject in otherProjects"
            :key="otherProject.id"
            variant="light"
            :image="otherProject.image"
            image-alt="Project Image"
            :title="otherProject.title || 'Untitled Project'"
            :title-clamp="2"
            :description="otherProject.description || 'No description'"
            :description-clamp="3"
            card-classes="h-full"
            clickable
            @click="openProject(otherProject)"
          >
            <template v-if="otherProject.tagline" #subtitle>
              <p class="text-primary-600 font-medium text-sm line-clamp-1">
                {{ otherProject.tagline }}
              </p>
            </template>
            <template v-if="otherProject.createdAt" #footer>
              <p class="text-[10px] sm:text-xs text-gray-500 mt-1 flex items-center gap-1">
                <Calendar class="w-3 h-3" />
                <span class="font-medium">{{ formatDate(otherProject.createdAt) }}</span>
              </p>
            </template>
          </Card>
        </div>
      </div>

      <!-- Not Found -->
      <div v-if="!loading && !project" class="text-center py-12">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h2>
        <p class="text-gray-600 mb-6">The project you're looking for doesn't exist.</p>
        <router-link
          to="/projects"
          class="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
        >
          ← Back to Projects
        </router-link>
      </div>
    </div>
  </PublicLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PublicLayout from '../layouts/PublicLayout.vue'
import Card from '../components/Card.vue'
import { Calendar } from 'lucide-vue-next'
import { projectsService } from '../firebase/firestore'

const route = useRoute()
const router = useRouter()
const project = ref(null)
const allProjects = ref([])
const loading = ref(true)

// Get other projects (excluding current one)
const otherProjects = computed(() => {
  if (!project.value) return []
  return allProjects.value
    .filter(p => p.id !== project.value.id)
    .slice(0, 6) // Show up to 6 other projects
})

function openProject(project) {
  router.push(`/projects/${project.id}`)
}

// Format date for display with relative time
function formatDate(date) {
  if (!date) return '';
  
  // Handle Firestore Timestamp
  let dateObj;
  if (date.toDate) {
    dateObj = date.toDate();
  } else if (date instanceof Date) {
    dateObj = date;
  } else if (typeof date === 'string' || typeof date === 'number') {
    dateObj = new Date(date);
  } else {
    return '';
  }
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  const now = new Date();
  const diffMs = now - dateObj;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);
  
  // Show relative time for recent dates
  if (diffSeconds < 60) {
    return diffSeconds <= 1 ? 'just now' : `${diffSeconds} seconds ago`;
  } else if (diffMinutes < 60) {
    return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`;
  } else if (diffHours < 24) {
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  } else if (diffDays < 7) {
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
  } else if (diffWeeks < 4) {
    return diffWeeks === 1 ? '1 week ago' : `${diffWeeks} weeks ago`;
  } else if (diffMonths < 12) {
    return diffMonths === 1 ? '1 month ago' : `${diffMonths} months ago`;
  } else if (diffYears < 2) {
    return '1 year ago';
  }
  
  // For older dates, show full date and time
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };
  return dateObj.toLocaleString('en-US', options);
}

onMounted(async () => {
  const projectId = route.params.id
  if (!projectId) {
    router.push('/projects')
    return
  }

  try {
    loading.value = true
    allProjects.value = await projectsService.getProjects()
    project.value = allProjects.value.find(p => p.id === projectId) || null
  } catch (err) {
    console.error('Error fetching project:', err)
  } finally {
    loading.value = false
  }
})
</script>



