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

      <!-- Chapters List View -->
      <template v-else-if="!loading && chapters.length > 0 && viewMode === 'list'">
        <div class="space-y-3">
        <div
          v-for="chapter in chapters"
          :key="chapter.id"
          @click="handleChapterClick(chapter)"
          class="bg-white rounded-xl border-2 border-gray-100 p-4 flex items-center space-x-4 transition-all duration-300 cursor-pointer hover:border-primary-300"
        >
          <!-- ICON -->
          <div class="shrink-0">
            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center ring-2 ring-primary-100 overflow-hidden">
              <img
                v-if="chapter.image"
                :src="chapter.image"
                :alt="chapter.chapterName"
                class="w-full h-full object-cover"
              />
              <span v-else class="text-white text-lg font-bold">{{ chapter.chapterName.charAt(0) }}</span>
            </div>
          </div>

          <!-- INFO -->
          <div class="flex-1 min-w-0">
            <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-1">
              {{ chapter.chapterName }}
            </h3>
            <p class="text-sm sm:text-base text-gray-600">
              {{ chapter.municipality }}, {{ chapter.province }}, {{ chapter.region }}
            </p>
            <p class="text-xs sm:text-sm text-primary-600 font-medium mt-1">
              {{ chapter.membersCount }} {{ chapter.membersCount === 1 ? 'member' : 'members' }}
            </p>
          </div>
        </div>
        </div>
      </template>

      <!-- Chapters Cards View -->
      <template v-else-if="!loading && chapters.length > 0 && viewMode === 'cards'">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div
          v-for="chapter in chapters"
          :key="chapter.id"
          @click="handleChapterClick(chapter)"
          class="bg-white rounded-xl border-2 border-gray-100 p-6 text-center transition-all duration-300 cursor-pointer hover:border-primary-300"
        >
          <!-- ICON -->
          <div class="flex justify-center mb-4">
            <div class="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center ring-4 ring-primary-100 overflow-hidden">
              <img
                v-if="chapter.image"
                :src="chapter.image"
                :alt="chapter.chapterName"
                class="w-full h-full object-cover"
              />
              <span v-else class="text-white text-2xl font-bold">{{ chapter.chapterName.charAt(0) }}</span>
            </div>
          </div>

          <!-- INFO -->
          <div>
            <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              {{ chapter.chapterName }}
            </h3>
            <p class="text-sm sm:text-base text-gray-600 mb-2">
              {{ chapter.municipality }}, {{ chapter.province }}
            </p>
            <p class="text-xs sm:text-sm text-gray-500 mb-2">
              {{ chapter.region }}
            </p>
            <p class="text-sm sm:text-base text-primary-600 font-semibold">
              {{ chapter.membersCount }} {{ chapter.membersCount === 1 ? 'member' : 'members' }}
            </p>
          </div>
        </div>
        </div>
      </template>

      <!-- Empty state -->
      <template v-else-if="!loading && chapters.length === 0">
        <div class="text-center py-12">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <p class="text-gray-500 text-base sm:text-lg">
          No chapters available.
        </p>
        </div>
      </template>

      <!-- Navigation to Officers and National Council -->
      <div v-if="!loading" class="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-gray-200">
        <div class="text-center mb-6 sm:mb-8">
          <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Explore More</h3>
          <p class="text-sm sm:text-base text-gray-600">Discover our Officers and National Council</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
          <router-link
            to="/about/officers"
            class="group relative rounded-xl p-6 sm:p-8 text-white overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-48 sm:h-56 flex items-end"
            :style="officersImage ? { backgroundImage: `url(${officersImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: 'linear-gradient(to bottom right, rgb(139, 92, 246), rgb(124, 58, 237))' }"
          >
            <div class="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-700/60 to-primary-500/30"></div>
            <div class="relative z-10 w-full">
              <div class="flex items-center justify-between mb-2">
                <h4 class="text-lg sm:text-xl font-bold">Officers</h4>
                <ChevronRight class="w-5 h-5 sm:w-6 sm:h-6 transform group-hover:translate-x-1 transition-transform duration-300" />
              </div>
              <p class="text-sm sm:text-base text-white/90">Meet our organization officers</p>
            </div>
          </router-link>
          <router-link
            to="/about/national-council"
            class="group relative rounded-xl p-6 sm:p-8 text-white overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-48 sm:h-56 flex items-end"
            :style="councilImage ? { backgroundImage: `url(${councilImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: 'linear-gradient(to bottom right, rgb(139, 92, 246), rgb(124, 58, 237))' }"
          >
            <div class="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-700/60 to-primary-500/30"></div>
            <div class="relative z-10 w-full">
              <div class="flex items-center justify-between mb-2">
                <h4 class="text-lg sm:text-xl font-bold">National Council</h4>
                <ChevronRight class="w-5 h-5 sm:w-6 sm:h-6 transform group-hover:translate-x-1 transition-transform duration-300" />
              </div>
              <p class="text-sm sm:text-base text-white/90">Meet our national leadership team</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <!-- CHAPTER MODAL -->
    <div
      v-if="selectedChapter"
      class="fixed inset-0 backdrop-blur-sm bg-black/70 flex items-center justify-center z-[60] p-3"
      @click.self="closeChapterModal"
    >
      <div class="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-lg overflow-hidden">
        <!-- Close Button -->
        <button
          @click="closeChapterModal"
          class="absolute top-2 right-2 z-10 bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-700 transition text-lg leading-none"
          aria-label="Close"
        >
          ×
        </button>
        
        <!-- Previous Button -->
        <button
          v-if="getCurrentChapterIndex() > 0"
          @click.stop="navigateToPreviousChapter"
          class="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-700 transition"
          aria-label="Previous chapter"
        >
          <ChevronLeft class="w-5 h-5" />
        </button>
        
        <!-- Next Button -->
        <button
          v-if="getCurrentChapterIndex() < chapters.length - 1"
          @click.stop="navigateToNextChapter"
          class="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-700 transition"
          aria-label="Next chapter"
        >
          <ChevronRight class="w-5 h-5" />
        </button>
        
        <!-- Icon Section -->
        <div class="flex-1 overflow-auto flex items-center justify-center bg-gradient-to-br from-primary-500 via-primary-700 to-primary-900 p-8 sm:p-12">
          <div class="w-48 h-48 rounded-full bg-white flex items-center justify-center overflow-hidden">
            <img
              v-if="selectedChapter.image"
              :src="selectedChapter.image"
              :alt="selectedChapter.chapterName"
              class="w-full h-full object-cover"
            />
            <span v-else class="text-primary-600 text-6xl font-bold">{{ selectedChapter.chapterName.charAt(0) }}</span>
          </div>
        </div>
        
        <!-- Details -->
        <div class="p-6 bg-white border-t border-gray-200">
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            {{ selectedChapter.chapterName }}
          </h2>
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-gray-600">
              <span class="font-semibold">Location:</span>
              <span>{{ selectedChapter.municipality }}, {{ selectedChapter.province }}, {{ selectedChapter.region }}</span>
            </div>
            <div class="flex items-center gap-2 text-primary-600">
              <span class="font-semibold">Members:</span>
              <span class="text-lg">{{ selectedChapter.membersCount }} {{ selectedChapter.membersCount === 1 ? 'member' : 'members' }}</span>
            </div>
          </div>
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

const { viewMode } = useViewMode('chapters')
const chapters = ref([])
const loading = ref(true)
const selectedChapter = ref(null)
const officersImage = ref('')
const councilImage = ref('')

// Lock body scroll when modal is open
const { useLock } = useBodyScrollLock()
const isModalOpen = computed(() => !!selectedChapter.value)
useLock(isModalOpen)

function handleChapterClick(chapter) {
  selectedChapter.value = chapter
}

function closeChapterModal() {
  selectedChapter.value = null
}

function getCurrentChapterIndex() {
  if (!selectedChapter.value) return -1
  return chapters.value.findIndex(c => c.id === selectedChapter.value.id)
}

function navigateToPreviousChapter() {
  const currentIndex = getCurrentChapterIndex()
  if (currentIndex > 0) {
    selectedChapter.value = chapters.value[currentIndex - 1]
  }
}

function navigateToNextChapter() {
  const currentIndex = getCurrentChapterIndex()
  if (currentIndex < chapters.value.length - 1) {
    selectedChapter.value = chapters.value[currentIndex + 1]
  }
}

async function loadChapters() {
  loading.value = true
  try {
    const [chaptersData, aboutData] = await Promise.all([
      aboutUsService.getChapters(),
      aboutUsService.getAboutUs().catch(() => null)
    ])
    chapters.value = chaptersData
    if (aboutData) {
      officersImage.value = aboutData.officersImage || ''
      councilImage.value = aboutData.nationalCouncilImage || ''
    }
  } catch (error) {
    console.error('Error loading chapters:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadChapters()
})
</script>
