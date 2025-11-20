<template>
  <PublicLayout>
    <div class="space-y-4 px-2 sm:px-4">

      <!-- HEADER -->
      <div class="text-center sm:text-left">
        <h1 class="text-2xl sm:text-3xl font-extrabold text-black">
          Projects
        </h1>
        <p class="text-black/80 mt-1 text-sm sm:text-base">
          Discover our ongoing and completed projects.
        </p>
      </div>

      <!-- PROJECTS LIST -->
      <div class="max-w-6xl mx-auto">

        <!-- Loading skeleton -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <div
            v-for="n in 6"
            :key="n"
            class="bg-primary-700 rounded-lg border border-white/30 p-2 shadow animate-pulse space-y-2"
          >
            <div class="h-36 bg-white/20 rounded mb-1"></div>
            <div class="h-4 bg-white/20 rounded w-3/4"></div>
            <div class="h-3 bg-white/20 rounded w-full"></div>
            <div class="h-3 bg-white/20 rounded w-5/6"></div>
          </div>
        </div>

        <!-- Projects cards -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <div v-if="projects.length === 0" class="text-center text-white/70 py-6 col-span-full">
            No projects available.
          </div>

          <div
            v-for="project in projects"
            :key="project.id"
            class="bg-primary-700 rounded-lg border border-white/30 shadow-sm flex flex-col overflow-hidden hover:shadow-md transition"
          >
            <!-- IMAGE FULL -->
            <div v-if="project.image" class="relative w-full h-40 sm:h-48 lg:h-56 overflow-hidden cursor-pointer">
              <img
                :src="project.image"
                :alt="project.title"
                class="w-full h-full object-cover"
              />
            </div>

            <div class="p-3 flex-1 flex flex-col justify-between text-white">
              <!-- TITLE -->
              <h3 v-if="project.title" class="text-sm sm:text-base font-semibold mb-1 truncate">
                {{ project.title }}
              </h3>

              <!-- TAGLINE -->
              <p v-if="project.tagline" class="text-white/80 text-xs sm:text-sm italic mb-1 truncate">
                {{ project.tagline }}
              </p>

              <!-- DESCRIPTION -->
              <p v-if="project.description" class="text-white/80 text-xs sm:text-sm line-clamp-3 mb-1">
                {{ project.description }}
              </p>

              <!-- FULL CONTENT -->
              <div v-if="project.content" class="text-white/70 text-xs sm:text-sm whitespace-pre-wrap mt-1 line-clamp-none">
                {{ project.content }}
              </div>
            </div>
          </div>
        </div>

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
