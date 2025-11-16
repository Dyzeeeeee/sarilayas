<template>
  <AdminLayout>
    <div class="space-y-5">
      <!-- Header -->
      <div>
        <h1 class="text-xl font-semibold text-gray-900 tracking-tight">Dashboard</h1>
        <p class="text-xs text-gray-500 mt-1">Manage your Sarilaya content</p>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white rounded-lg border border-gray-200/80 p-4 hover:border-gray-300 transition-colors">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Officers</p>
              <div v-if="loading" class="mt-2 h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
              <p v-else class="text-2xl font-semibold text-gray-900 mt-2">{{ stats.officers }}</p>
            </div>
            <div class="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center">
              <svg class="h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg border border-gray-200/80 p-4 hover:border-gray-300 transition-colors">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Council Members</p>
              <div v-if="loading" class="mt-2 h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
              <p v-else class="text-2xl font-semibold text-gray-900 mt-2">{{ stats.council }}</p>
            </div>
            <div class="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center">
              <svg class="h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-lg border border-gray-200/80 p-4 hover:border-gray-300 transition-colors">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Chapters</p>
              <div v-if="loading" class="mt-2 h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
              <p v-else class="text-2xl font-semibold text-gray-900 mt-2">{{ stats.chapters }}</p>
            </div>
            <div class="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center">
              <svg class="h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="bg-white rounded-lg border border-gray-200/80">
        <div class="px-4 py-3 border-b border-gray-200/80">
          <h2 class="text-base font-semibold text-gray-900">About Us Management</h2>
          <p class="text-xs text-gray-500 mt-0.5">Manage all About Us content sections</p>
        </div>
        <div class="p-4">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <router-link
              to="/admin/about"
              class="group p-3 border border-gray-200/80 rounded-lg hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200"
            >
              <h3 class="text-sm font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">General Info</h3>
              <p class="text-xs text-gray-500 mt-1">Description, Mission, Vision, Stats</p>
            </router-link>
            <router-link
              to="/admin/about/values"
              class="group p-3 border border-gray-200/80 rounded-lg hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200"
            >
              <h3 class="text-sm font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">Values</h3>
              <p class="text-xs text-gray-500 mt-1">Manage organization values</p>
            </router-link>
            <router-link
              to="/admin/about/officers"
              class="group p-3 border border-gray-200/80 rounded-lg hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200"
            >
              <h3 class="text-sm font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">Officers</h3>
              <p class="text-xs text-gray-500 mt-1">Manage leadership team</p>
            </router-link>
            <router-link
              to="/admin/about/council"
              class="group p-3 border border-gray-200/80 rounded-lg hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200"
            >
              <h3 class="text-sm font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">National Council</h3>
              <p class="text-xs text-gray-500 mt-1">Manage council members</p>
            </router-link>
            <router-link
              to="/admin/about/chapters"
              class="group p-3 border border-gray-200/80 rounded-lg hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200"
            >
              <h3 class="text-sm font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">Chapters</h3>
              <p class="text-xs text-gray-500 mt-1">Manage local chapters</p>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Content Management -->
      <div class="bg-white rounded-lg border border-gray-200/80">
        <div class="px-4 py-3 border-b border-gray-200/80">
          <h2 class="text-base font-semibold text-gray-900">Content Management</h2>
          <p class="text-xs text-gray-500 mt-0.5">Manage news, projects, and contact information</p>
        </div>
        <div class="p-4">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <router-link
              to="/admin/news"
              class="group p-3 border border-gray-200/80 rounded-lg hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200"
            >
              <h3 class="text-sm font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">News</h3>
              <p class="text-xs text-gray-500 mt-1">Manage news articles and announcements</p>
            </router-link>
            <router-link
              to="/admin/projects"
              class="group p-3 border border-gray-200/80 rounded-lg hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200"
            >
              <h3 class="text-sm font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">Projects</h3>
              <p class="text-xs text-gray-500 mt-1">Manage organization projects</p>
            </router-link>
            <router-link
              to="/admin/contact"
              class="group p-3 border border-gray-200/80 rounded-lg hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200"
            >
              <h3 class="text-sm font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">Contact</h3>
              <p class="text-xs text-gray-500 mt-1">Email, Phone, Address, Facebook, YouTube</p>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Media Management -->
      <div class="bg-white rounded-lg border border-gray-200/80">
        <div class="px-4 py-3 border-b border-gray-200/80">
          <h2 class="text-base font-semibold text-gray-900">Media Management</h2>
          <p class="text-xs text-gray-500 mt-0.5">Manage videos and photos</p>
        </div>
        <div class="p-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <router-link
              to="/admin/videos"
              class="group p-3 border border-gray-200/80 rounded-lg hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200"
            >
              <h3 class="text-sm font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">Videos</h3>
              <p class="text-xs text-gray-500 mt-1">Manage YouTube video links</p>
            </router-link>
            <router-link
              to="/admin/photos"
              class="group p-3 border border-gray-200/80 rounded-lg hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200"
            >
              <h3 class="text-sm font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">Photos</h3>
              <p class="text-xs text-gray-500 mt-1">Manage photo gallery</p>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '../../layouts/AdminLayout.vue'
import { aboutUsService } from '../../firebase/firestore'

const loading = ref(true)
const stats = ref({
  officers: 0,
  council: 0,
  chapters: 0
})

async function loadStats() {
  loading.value = true
  try {
    const [officers, council, chapters] = await Promise.all([
      aboutUsService.getOfficers(),
      aboutUsService.getNationalCouncil(),
      aboutUsService.getChapters()
    ])
    stats.value = {
      officers: officers.length,
      council: council.length,
      chapters: chapters.length
    }
  } catch (error) {
    console.error('Error loading stats:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadStats()
})
</script>

