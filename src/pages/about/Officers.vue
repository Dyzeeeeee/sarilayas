<template>
  <PublicLayout>
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <!-- Back Button -->
      <router-link
        to="/about"
        class="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors mb-4 sm:mb-6"
      >
        <ChevronLeft class="w-5 h-5" />
        <span class="text-sm font-medium">Back to About Us</span>
      </router-link>

      <!-- Loading Skeleton -->
      <template v-if="loading">
        <div :class="[
          'gap-4 sm:gap-6',
          (viewMode || 'cards') === 'list' ? 'flex flex-col' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        ]">
          <div
            v-for="n in 6"
            :key="n"
            :class="[
              'bg-white rounded-xl border border-gray-200 animate-pulse',
              (viewMode || 'cards') === 'list' ? 'flex items-center space-x-4 p-4' : 'p-6'
            ]"
          >
            <div v-if="(viewMode || 'cards') === 'list'" class="flex items-center space-x-4 w-full">
              <div class="w-16 h-16 rounded-full bg-gray-200 shrink-0"></div>
              <div class="flex-1 space-y-2">
                <div class="h-5 bg-gray-200 rounded w-3/4"></div>
                <div class="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div v-else class="flex flex-col items-center text-center space-y-4">
              <div class="w-24 h-24 rounded-full bg-gray-200"></div>
              <div class="space-y-2 w-full">
                <div class="h-5 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div class="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Officers List View -->
      <template v-else-if="!loading && officers.length > 0 && viewMode === 'list'">
        <div class="space-y-3">
        <div
          v-for="officer in officers"
          :key="officer.id"
          @click="handleOfficerClick(officer)"
          class="bg-white rounded-xl border-2 border-gray-100 p-4 flex items-center space-x-4 transition-all duration-300 cursor-pointer hover:border-primary-300"
        >
          <!-- PHOTO -->
          <div class="shrink-0">
            <div v-if="officer.photo" class="relative">
              <img
                :src="officer.photo"
                :alt="officer.name"
                class="w-16 h-16 rounded-full object-cover ring-2 ring-primary-100"
              />
            </div>
            <div v-else class="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center ring-2 ring-primary-100">
              <span class="text-white text-lg font-bold">{{ officer.name.charAt(0) }}</span>
            </div>
          </div>

          <!-- INFO -->
          <div class="flex-1 min-w-0">
            <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-1">
              {{ officer.name }}
            </h3>
            <p class="text-sm sm:text-base text-primary-600 font-medium">
              {{ officer.position }}
            </p>
          </div>
        </div>
        </div>
      </template>

      <!-- Officers Cards View -->
      <template v-else-if="!loading && officers.length > 0 && viewMode === 'cards'">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div
          v-for="officer in officers"
          :key="officer.id"
          @click="handleOfficerClick(officer)"
          class="bg-white rounded-xl border-2 border-gray-100 p-6 text-center transition-all duration-300 cursor-pointer hover:border-primary-300"
        >
          <!-- PHOTO -->
          <div class="flex justify-center mb-4">
            <div v-if="officer.photo" class="relative">
              <img
                :src="officer.photo"
                :alt="officer.name"
                class="w-24 h-24 rounded-full object-cover ring-4 ring-primary-100"
              />
            </div>
            <div v-else class="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center ring-4 ring-primary-100">
              <span class="text-white text-2xl font-bold">{{ officer.name.charAt(0) }}</span>
            </div>
          </div>

          <!-- INFO -->
          <div>
            <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              {{ officer.name }}
            </h3>
            <p class="text-sm sm:text-base text-primary-600 font-medium">
              {{ officer.position }}
            </p>
          </div>
        </div>
        </div>
      </template>

      <!-- Empty state -->
      <template v-else-if="!loading && officers.length === 0">
        <div class="text-center py-12">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <p class="text-gray-500 text-base sm:text-lg">
          No officers available.
        </p>
        </div>
      </template>
    </div>

    <!-- OFFICER MODAL -->
    <div
      v-if="selectedOfficer"
      class="fixed inset-0 backdrop-blur-sm bg-black/70 flex items-center justify-center z-[60] p-3"
      @click.self="closeOfficerModal"
    >
      <div class="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-lg overflow-hidden">
        <!-- Close Button -->
        <button
          @click="closeOfficerModal"
          class="absolute top-2 right-2 z-10 bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-700 transition text-lg leading-none"
          aria-label="Close"
        >
          ×
        </button>
        
        <!-- Previous Button -->
        <button
          v-if="getCurrentOfficerIndex() > 0"
          @click.stop="navigateToPreviousOfficer"
          class="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-700 transition"
          aria-label="Previous officer"
        >
          <ChevronLeft class="w-5 h-5" />
        </button>
        
        <!-- Next Button -->
        <button
          v-if="getCurrentOfficerIndex() < officers.length - 1"
          @click.stop="navigateToNextOfficer"
          class="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-700 transition"
          aria-label="Next officer"
        >
          <ChevronRight class="w-5 h-5" />
        </button>
        
        <!-- Photo Section -->
        <div class="flex-1 overflow-auto flex items-center justify-center bg-gradient-to-br from-primary-500 via-primary-700 to-primary-900 p-8 sm:p-12">
          <div v-if="selectedOfficer.photo" class="relative">
            <img
              :src="selectedOfficer.photo"
              :alt="selectedOfficer.name"
              class="max-w-full max-h-[50vh] object-contain rounded-lg"
            />
          </div>
          <div v-else class="w-48 h-48 rounded-full bg-white flex items-center justify-center">
            <span class="text-primary-600 text-6xl font-bold">{{ selectedOfficer.name.charAt(0) }}</span>
          </div>
        </div>
        
        <!-- Details -->
        <div class="p-6 bg-white border-t border-gray-200">
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {{ selectedOfficer.name }}
          </h2>
          <p class="text-lg sm:text-xl text-primary-600 font-semibold">
            {{ selectedOfficer.position }}
          </p>
        </div>
      </div>
    </div>
  </PublicLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import PublicLayout from '../../layouts/PublicLayout.vue'
import { aboutUsService } from '../../firebase/firestore'
import { useViewMode } from '../../composables/useViewMode'
import { useBodyScrollLock } from '../../composables/useBodyScrollLock'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const { viewMode } = useViewMode('officers')
const officers = ref([])
const loading = ref(true)
const selectedOfficer = ref(null)

// Lock body scroll when modal is open
const { useLock } = useBodyScrollLock()
const isModalOpen = computed(() => !!selectedOfficer.value)
useLock(isModalOpen)

function handleOfficerClick(officer) {
  selectedOfficer.value = officer
}

function closeOfficerModal() {
  selectedOfficer.value = null
}

function getCurrentOfficerIndex() {
  if (!selectedOfficer.value) return -1
  return officers.value.findIndex(o => o.id === selectedOfficer.value.id)
}

function navigateToPreviousOfficer() {
  const currentIndex = getCurrentOfficerIndex()
  if (currentIndex > 0) {
    selectedOfficer.value = officers.value[currentIndex - 1]
  }
}

function navigateToNextOfficer() {
  const currentIndex = getCurrentOfficerIndex()
  if (currentIndex < officers.value.length - 1) {
    selectedOfficer.value = officers.value[currentIndex + 1]
  }
}

async function loadOfficers() {
  loading.value = true
  try {
    officers.value = await aboutUsService.getOfficers()
  } catch (error) {
    console.error('Error loading officers:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadOfficers()
})
</script>
