<template>
  <PublicLayout>
    <div class="space-y-3">
      <!-- HEADER -->
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Projects</h1>
        <p class="text-gray-600 text-sm">Discover our ongoing and completed projects.</p>
      </div>

      <!-- PROJECTS GRID -->
      <div>
        <!-- Loading skeleton -->
        <div v-if="loading" class="space-y-1">
          <div
            v-for="n in 6"
            :key="n"
            class="bg-white rounded-lg border border-gray-200 p-1.5 shadow-sm animate-pulse space-y-1"
          >
            <div class="w-full h-28 bg-gray-200 rounded mb-1.5"></div>
            <div class="h-2.5 bg-gray-200 rounded w-3/4 mb-1"></div>
            <div class="h-2 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>

        <!-- Projects cards -->
        <div v-else class="space-y-1">
          <div
            v-for="project in projects"
            :key="project.id"
            class="bg-white rounded-lg border border-gray-200 p-1.5 shadow-sm hover:shadow-md transition flex flex-col"
          >
            <!-- FEATURED IMAGE -->
            <div v-if="project.image" class="w-full h-28 mb-1.5 rounded-lg overflow-hidden">
              <img
                :src="project.image"
                :alt="project.title"
                class="w-full h-full object-cover"
              />
            </div>
            <div v-else class="w-full h-28 mb-1.5 rounded-lg bg-primary-100 flex items-center justify-center">
              <svg
                class="h-8 w-8 text-primary-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>

            <!-- TITLE -->
            <h3 class="font-semibold text-gray-900 text-sm truncate">{{ project.title }}</h3>

            <!-- TAGLINE -->
            <p
              v-if="project.tagline"
              class="text-gray-600 text-xs mt-0.5 italic truncate"
            >
              {{ project.tagline }}
            </p>

            <!-- DESCRIPTION -->
            <p
              v-if="project.description"
              class="text-gray-600 text-xs mt-0.5 line-clamp-3"
            >
              {{ project.description }}
            </p>
          </div>
        </div>

        <!-- Empty state -->
        <p v-if="!loading && projects.length === 0" class="text-center text-gray-500 py-2 text-sm">
          No projects available.
        </p>
      </div>
    </div>
  </PublicLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PublicLayout from '../layouts/PublicLayout.vue'
import { projectsService } from '../firebase/firestore'

const projects = ref([])
const loading = ref(true)

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

onMounted(() => {
  loadProjects()
})
</script>
