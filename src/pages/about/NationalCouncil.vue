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

      <!-- Members List View -->
      <template v-else-if="!loading && members.length > 0 && viewMode === 'list'">
        <div class="space-y-3">
        <div
          v-for="member in members"
          :key="member.id"
          @click="handleMemberClick(member)"
          class="bg-white rounded-xl border-2 border-gray-100 p-4 flex items-center space-x-4 transition-all duration-300 cursor-pointer hover:border-primary-300"
        >
          <!-- PHOTO -->
          <div class="shrink-0">
            <div v-if="member.photo" class="relative">
              <img
                :src="member.photo"
                :alt="member.name"
                class="w-16 h-16 rounded-full object-cover ring-2 ring-primary-100"
              />
            </div>
            <div v-else class="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center ring-2 ring-primary-100">
              <span class="text-white text-lg font-bold">{{ member.name.charAt(0) }}</span>
            </div>
          </div>

          <!-- INFO -->
          <div class="flex-1 min-w-0">
            <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-1">
              {{ member.name }}
            </h3>
            <p class="text-sm sm:text-base text-primary-600 font-medium">
              {{ member.role }}
            </p>
          </div>
        </div>
        </div>
      </template>

      <!-- Members Cards View -->
      <template v-else-if="!loading && members.length > 0 && viewMode === 'cards'">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div
          v-for="member in members"
          :key="member.id"
          @click="handleMemberClick(member)"
          class="bg-white rounded-xl border-2 border-gray-100 p-6 text-center transition-all duration-300 cursor-pointer hover:border-primary-300"
        >
          <!-- PHOTO -->
          <div class="flex justify-center mb-4">
            <div v-if="member.photo" class="relative">
              <img
                :src="member.photo"
                :alt="member.name"
                class="w-24 h-24 rounded-full object-cover ring-4 ring-primary-100"
              />
            </div>
            <div v-else class="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center ring-4 ring-primary-100">
              <span class="text-white text-2xl font-bold">{{ member.name.charAt(0) }}</span>
            </div>
          </div>

          <!-- INFO -->
          <div>
            <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-2">
              {{ member.name }}
            </h3>
            <p class="text-sm sm:text-base text-primary-600 font-medium">
              {{ member.role }}
            </p>
          </div>
        </div>
        </div>
      </template>

      <!-- Empty state -->
      <template v-else-if="!loading && members.length === 0">
        <div class="text-center py-12">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <p class="text-gray-500 text-base sm:text-lg">
          No council members available.
        </p>
        </div>
      </template>

      <!-- Navigation to Officers and Chapters -->
      <div v-if="!loading" class="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-gray-200">
        <div class="text-center mb-6 sm:mb-8">
          <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Explore More</h3>
          <p class="text-sm sm:text-base text-gray-600">Discover our Officers and Chapters</p>
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
            to="/about/chapters"
            class="group relative rounded-xl p-6 sm:p-8 text-white overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-48 sm:h-56 flex items-end"
            :style="chaptersImage ? { backgroundImage: `url(${chaptersImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: 'linear-gradient(to bottom right, rgb(139, 92, 246), rgb(124, 58, 237))' }"
          >
            <div class="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-700/60 to-primary-500/30"></div>
            <div class="relative z-10 w-full">
              <div class="flex items-center justify-between mb-2">
                <h4 class="text-lg sm:text-xl font-bold">Chapters</h4>
                <ChevronRight class="w-5 h-5 sm:w-6 sm:h-6 transform group-hover:translate-x-1 transition-transform duration-300" />
              </div>
              <p class="text-sm sm:text-base text-white/90">Explore our regional chapters</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <!-- MEMBER MODAL -->
    <div
      v-if="selectedMember"
      class="fixed inset-0 backdrop-blur-sm bg-black/70 flex items-center justify-center z-[60] p-3"
      @click.self="closeMemberModal"
    >
      <div class="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-lg overflow-hidden">
        <!-- Close Button -->
        <button
          @click="closeMemberModal"
          class="absolute top-2 right-2 z-10 bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-700 transition text-lg leading-none"
          aria-label="Close"
        >
          ×
        </button>
        
        <!-- Previous Button -->
        <button
          v-if="getCurrentMemberIndex() > 0"
          @click.stop="navigateToPreviousMember"
          class="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-700 transition"
          aria-label="Previous member"
        >
          <ChevronLeft class="w-5 h-5" />
        </button>
        
        <!-- Next Button -->
        <button
          v-if="getCurrentMemberIndex() < members.length - 1"
          @click.stop="navigateToNextMember"
          class="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-700 transition"
          aria-label="Next member"
        >
          <ChevronRight class="w-5 h-5" />
        </button>
        
        <!-- Photo Section -->
        <div class="flex-1 overflow-auto flex items-center justify-center bg-gradient-to-br from-primary-500 via-primary-700 to-primary-900 p-8 sm:p-12">
          <div v-if="selectedMember.photo" class="relative">
            <img
              :src="selectedMember.photo"
              :alt="selectedMember.name"
              class="max-w-full max-h-[50vh] object-contain rounded-lg"
            />
          </div>
          <div v-else class="w-48 h-48 rounded-full bg-white flex items-center justify-center">
            <span class="text-primary-600 text-6xl font-bold">{{ selectedMember.name.charAt(0) }}</span>
          </div>
        </div>
        
        <!-- Details -->
        <div class="p-6 bg-white border-t border-gray-200">
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {{ selectedMember.name }}
          </h2>
          <p class="text-lg sm:text-xl text-primary-600 font-semibold">
            {{ selectedMember.role }}
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

const { viewMode } = useViewMode('nationalCouncil')
const members = ref([])
const loading = ref(true)
const selectedMember = ref(null)
const officersImage = ref('')
const chaptersImage = ref('')

// Lock body scroll when modal is open
const { useLock } = useBodyScrollLock()
const isModalOpen = computed(() => !!selectedMember.value)
useLock(isModalOpen)

function handleMemberClick(member) {
  selectedMember.value = member
}

function closeMemberModal() {
  selectedMember.value = null
}

function getCurrentMemberIndex() {
  if (!selectedMember.value) return -1
  return members.value.findIndex(m => m.id === selectedMember.value.id)
}

function navigateToPreviousMember() {
  const currentIndex = getCurrentMemberIndex()
  if (currentIndex > 0) {
    selectedMember.value = members.value[currentIndex - 1]
  }
}

function navigateToNextMember() {
  const currentIndex = getCurrentMemberIndex()
  if (currentIndex < members.value.length - 1) {
    selectedMember.value = members.value[currentIndex + 1]
  }
}

async function loadMembers() {
  loading.value = true
  try {
    const [membersData, aboutData] = await Promise.all([
      aboutUsService.getNationalCouncil(),
      aboutUsService.getAboutUs().catch(() => null)
    ])
    members.value = membersData
    if (aboutData) {
      officersImage.value = aboutData.officersImage || ''
      chaptersImage.value = aboutData.chaptersImage || ''
    }
  } catch (error) {
    console.error('Error loading council members:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadMembers()
})
</script>
