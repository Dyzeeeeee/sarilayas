<template>
  <PublicLayout>
    <div class="max-w-4xl lg:max-w-none mx-auto px-4 sm:px-6 py-6 sm:py-0 lg:pt-0">
      <!-- Three Column Layout for Desktop -->
      <div class="flex flex-col lg:flex-row lg:justify-between gap-6 lg:gap-8 lg:py-0">
        <!-- Left Sidebar -->
        <aside ref="leftSidebar" class="hidden lg:block lg:flex-shrink-0" style="width: 320px;">
          <div class="space-y-6 lg:fixed lg:top-24 lg:left-8 w-full lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto scrollbar-minimal lg:pb-6" style="width: 320px;">
            <!-- Quick Links -->
            <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 class="text-lg font-bold text-gray-900 mb-4">Quick Links</h3>
              <nav class="flex flex-wrap gap-2">
                <router-link
                  to="/news"
                  class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-primary-100 hover:text-primary-600"
                >
                  Latest News
                </router-link>
                <router-link
                  to="/projects"
                  class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-primary-100 hover:text-primary-600"
                >
                  Projects
                </router-link>
                <router-link
                  to="/media"
                  class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-primary-100 hover:text-primary-600"
                >
                  Media
                </router-link>
                <router-link
                  to="/about"
                  class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-primary-100 hover:text-primary-600"
                >
                  About Us
                </router-link>
                <router-link
                  to="/contact"
                  class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-primary-100 hover:text-primary-600"
                >
                  Contact
                </router-link>
              </nav>
            </div>

            <!-- About Section -->
            <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 class="text-lg font-bold text-gray-900 mb-3">About Sarilaya</h3>
              <p class="text-sm text-gray-600 leading-relaxed mb-4">
                {{ aboutData?.description || 'Connecting communities and fostering growth through meaningful initiatives and shared values.' }}
              </p>
              <router-link
                to="/about"
                class="text-primary-600 hover:text-primary-700 font-medium text-sm inline-flex items-center gap-1"
              >
                Learn more
                <ChevronRight class="w-4 h-4" />
              </router-link>
            </div>

            <!-- Stats Card -->
            <div class="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-6 text-white shadow-lg">
              <h3 class="text-lg font-bold mb-4">Community Stats</h3>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-primary-100">Total Projects</span>
                  <span class="font-bold text-2xl">{{ stats.projects }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-primary-100">News Articles</span>
                  <span class="font-bold text-2xl">{{ stats.news }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-primary-100">Media Items</span>
                  <span class="font-bold text-2xl">{{ stats.media }}</span>
                </div>
              </div>
            </div>

            <!-- Where We Are Stats -->
            <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 class="text-lg font-bold text-gray-900 mb-4">Where We Are</h3>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Regions</span>
                  <span class="font-bold text-2xl text-primary-600">{{ whereWeAreStats.regions }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Provinces</span>
                  <span class="font-bold text-2xl text-primary-600">{{ whereWeAreStats.provinces }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Municipalities</span>
                  <span class="font-bold text-2xl text-primary-600">{{ whereWeAreStats.municipalities }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Members</span>
                  <span class="font-bold text-2xl text-primary-600">{{ whereWeAreStats.members }}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <!-- Main Feed (Center Column) -->
        <main ref="centerColumn" class="w-full lg:pr-2 lg:flex-[0_0_45%] lg:max-w-[45%]">
      <!-- UNIFIED FEED -->
           <section class="space-y-4 md:space-y-6 lg:space-y-8 lg:pb-8">
        <!-- Loading Skeleton -->
        <div v-if="loading" class="space-y-4">
          <Skeleton
            v-for="n in 6"
            :key="n"
            type="card"
            variant="default"
            :description-lines="2"
          />
        </div>

        <!-- Feed Items -->
        <div v-else-if="filteredFeedItems.length > 0" class="space-y-4 md:space-y-6 lg:space-y-8">
          <div
            v-for="item in filteredFeedItems"
            :key="`${item.type}-${item.id}`"
            :data-item-id="`${item.type}-${item.id}`"
            :ref="el => { if (el) setItemRef(el, `${item.type}-${item.id}`) }"
            @click="handleItemClick(item)"
            class="bg-white rounded-xl border-2 border-gray-100 overflow-hidden transition-all duration-300 cursor-pointer hover:border-primary-300 shadow-sm md:shadow-md lg:shadow-lg hover:shadow-xl flex flex-col group"
          >
            <!-- Title Section at Top -->
            <div class="p-4 sm:p-6 lg:p-8 pb-3 lg:pb-4">
              <div class="flex items-start justify-between gap-3 mb-2 lg:mb-3">
                <div class="flex-1 min-w-0">
                  <h3 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 lg:mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {{ item.title || 'Untitled' }}
                  </h3>
                  <p v-if="item.tagline" class="text-sm lg:text-base text-primary-600 font-medium line-clamp-1">
                    {{ item.tagline }}
                  </p>
                </div>
                <!-- Content Type Icon -->
                <div class="shrink-0">
                  <div :class="getTypeIconBgClass(item.type)" class="w-9 h-9 lg:w-10 lg:h-10 rounded-full flex items-center justify-center shadow-sm opacity-80 group-hover:opacity-100 transition-all duration-300">
                    <component :is="getTypeIcon(item.type)" :class="getTypeIconClass(item.type)" class="w-4 h-4 lg:w-5 lg:h-5" />
                  </div>
                </div>
              </div>
              <div v-if="getItemDate(item)" class="flex items-center gap-2">
                <Calendar class="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-gray-400" />
                <span class="text-xs sm:text-sm lg:text-base text-gray-500 font-medium">
                  {{ formatDate(getItemDate(item)) }}
                </span>
              </div>
            </div>

            <!-- Image Section Below Title -->
            <div v-if="getItemImage(item)" class="relative w-full aspect-video overflow-hidden bg-gray-100 group-hover:bg-gray-200 transition-colors">
              <img
                :src="getItemImage(item)"
                :alt="item.title || 'Content'"
                class="w-full h-full object-cover"
              />
              <!-- Play icon overlay for videos -->
              <div v-if="item.type === 'video'" class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                <div class="w-20 h-20 lg:w-24 lg:h-24 bg-white/90 rounded-full flex items-center justify-center shadow-lg transition-all duration-300">
                  <Play class="w-10 h-10 lg:w-12 lg:h-12 text-primary-600 ml-1" fill="currentColor" />
                </div>
              </div>
            </div>

            <!-- No Image Section -->
            <div v-else class="relative w-full aspect-video bg-gray-100 group-hover:bg-gray-200 transition-colors flex items-center justify-center">
              <div class="w-20 h-20 lg:w-24 lg:h-24 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Play class="w-10 h-10 lg:w-12 lg:h-12 text-primary-600 ml-1" fill="currentColor" />
              </div>
            </div>

            <!-- Description Section -->
            <div v-if="item.description" class="p-4 sm:p-6 lg:p-8 pt-3 lg:pt-4">
              <p class="text-sm sm:text-base lg:text-lg text-gray-600 line-clamp-3 lg:line-clamp-4 leading-relaxed">
                {{ item.description }}
              </p>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12 lg:py-20">
          <p class="text-gray-500 text-base sm:text-lg lg:text-xl">
            No content available at the moment.
          </p>
        </div>
      </section>
        </main>

        <!-- Right Sidebar -->
        <aside ref="rightSidebar" class="hidden lg:block lg:flex-shrink-0" style="width: 320px;">
          <div class="space-y-6 lg:fixed lg:top-24 lg:right-8 w-full lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto scrollbar-minimal lg:pb-6" style="width: 320px;">
            <!-- Content Types Filter -->
            <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 class="text-lg font-bold text-gray-900 mb-4">Content Types</h3>
              <div class="flex flex-wrap gap-2">
                <button
                  @click="setContentTypeFilter('all')"
                  class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                  :class="selectedContentType === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                >
                  All
                </button>
                <button
                  @click="setContentTypeFilter('news')"
                  class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                  :class="selectedContentType === 'news' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                >
                  News
                </button>
                <button
                  @click="setContentTypeFilter('photos')"
                  class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                  :class="selectedContentType === 'photos' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                >
                  Photos
                </button>
                <button
                  @click="setContentTypeFilter('videos')"
                  class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                  :class="selectedContentType === 'videos' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                >
                  Videos
                </button>
                <button
                  @click="setContentTypeFilter('projects')"
                  class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                  :class="selectedContentType === 'projects' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                >
                  Projects
                </button>
              </div>
            </div>

            <!-- Recent Activity -->
            <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 class="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
              <div class="space-y-3">
                <div v-for="(item, index) in filteredFeedItems.slice(0, 5)" :key="`recent-${item.id}`" 
                     class="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                     @click="handleItemClick(item)">
                  <div :class="getTypeIconBgClass(item.type)" class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    <component :is="getTypeIcon(item.type)" :class="getTypeIconClass(item.type)" class="w-4 h-4" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 line-clamp-1">{{ item.title || 'Untitled' }}</p>
                    <p class="text-xs text-gray-500 mt-1">{{ formatDate(getItemDate(item)) }}</p>
                  </div>
                </div>
                <div v-if="filteredFeedItems.length === 0" class="text-sm text-gray-500 text-center py-4">
                  No recent activity
                </div>
              </div>
            </div>

            <!-- Stay Connected Card -->
            <div class="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-6 text-white shadow-lg">
              <h3 class="text-lg font-bold mb-2">Stay Connected</h3>
              <p class="text-primary-100 text-sm mb-4 leading-relaxed">
                Get the latest updates and news from Sarilaya. Join our community and be part of something meaningful.
              </p>
              <div class="space-y-2">
                <router-link
                  to="/contact"
                  class="block w-full bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors text-center"
                >
                  Contact Us
                </router-link>
                <router-link
                  to="/about"
                  class="block w-full bg-white/10 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors text-center border border-white/20"
                >
                  Learn More
                </router-link>
              </div>
            </div>

          </div>
        </aside>
      </div>
    </div>

    <!-- PHOTO MODAL -->
    <div
      v-if="selectedPhoto"
      class="fixed inset-0 backdrop-blur-sm bg-black/70 flex items-center justify-center z-[60] p-3 md:p-6 lg:p-8"
      @click.self="closePhotoModal"
    >
      <div class="relative w-full max-w-4xl lg:max-w-6xl max-h-[90vh] flex flex-col bg-white rounded-lg lg:rounded-xl overflow-hidden shadow-2xl">
        <button
          @click="closePhotoModal"
          class="absolute top-2 right-2 z-10 bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-700 transition text-lg leading-none"
          aria-label="Close"
        >
          ×
        </button>
        <div class="flex-1 overflow-auto flex items-center justify-center bg-gradient-to-br from-primary-500 via-primary-700 to-primary-900 p-4 md:p-6 lg:p-8">
          <img
            :src="selectedPhoto.url"
            :alt="selectedPhoto.title || 'Full Image'"
            class="max-w-full max-h-[70vh] object-contain rounded-lg lg:rounded-xl shadow-2xl"
          />
        </div>
        <div v-if="selectedPhoto" class="p-4 md:p-6 lg:p-8 bg-white border-t border-gray-200">
          <h2 class="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 mb-2 lg:mb-3">
            {{ selectedPhoto.title || 'Untitled Photo' }}
          </h2>
          <p v-if="selectedPhoto.description" class="text-gray-600 mb-3 lg:mb-4 text-base lg:text-lg leading-relaxed">
            {{ selectedPhoto.description }}
          </p>
          <div class="flex items-center gap-4 text-sm lg:text-base text-gray-500">
            <span v-if="selectedPhoto.createdAt" class="flex items-center gap-1">
              <Calendar class="w-4 h-4 lg:w-5 lg:h-5" />
              {{ formatDate(selectedPhoto.createdAt) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- VIDEO MODAL -->
    <div
      v-if="selectedVideo"
      class="fixed inset-0 backdrop-blur-sm bg-black/70 flex items-center justify-center z-[60] p-3 md:p-6 lg:p-8"
      @click.self="closeVideoModal"
    >
      <div class="relative w-full max-w-4xl lg:max-w-6xl flex flex-col bg-white rounded-lg lg:rounded-xl overflow-hidden shadow-2xl">
        <button
          @click="closeVideoModal"
          class="absolute top-2 right-2 z-10 bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-700 transition text-lg leading-none"
          aria-label="Close"
        >
          ×
        </button>
        <div class="relative w-full aspect-video bg-primary-700">
          <iframe
            v-if="getYouTubeEmbedUrl(selectedVideo.url)"
            :src="getYouTubeEmbedUrl(selectedVideo.url)"
            class="w-full h-full"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
          <div v-else class="w-full h-full flex items-center justify-center text-white">
            No Video Available
          </div>
        </div>
        <div v-if="selectedVideo" class="p-4 md:p-6 lg:p-8 bg-white border-t border-gray-200">
          <h2 class="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 mb-2 lg:mb-3">
            {{ selectedVideo.title || 'Untitled Video' }}
          </h2>
          <p v-if="selectedVideo.description" class="text-gray-600 mb-3 lg:mb-4 text-base lg:text-lg leading-relaxed">
            {{ selectedVideo.description }}
          </p>
          <div class="flex items-center gap-4 text-sm lg:text-base text-gray-500">
            <span v-if="selectedVideo.createdAt" class="flex items-center gap-1">
              <Calendar class="w-4 h-4 lg:w-5 lg:h-5" />
              {{ formatDate(selectedVideo.createdAt) }}
            </span>
          </div>
        </div>
      </div>
    </div>

  </PublicLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import PublicLayout from '../layouts/PublicLayout.vue'
import Skeleton from '../components/Skeleton.vue'
import { newsService, mediaService, projectsService, aboutUsService } from '../firebase/firestore'
import { useFeedAlgorithm } from '../composables/useFeedAlgorithm'
import { Calendar, Newspaper, Image, Video, ChevronLeft, ChevronRight, Play, FolderOpenDot, Users } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const { createUnifiedFeed } = useFeedAlgorithm()
const feedItems = ref([])
const loading = ref(true)
const selectedPhoto = ref(null)
const selectedVideo = ref(null)
const centerColumn = ref(null)
const leftSidebar = ref(null)
const rightSidebar = ref(null)
const selectedContentType = ref('all')
const seenItemsKey = 'sarilaya_seen_items'
const itemRefs = ref(new Map())
const aboutData = ref(null)

// Computed stats for display
const stats = computed(() => {
  return {
    projects: feedItems.value.filter(item => item.type === 'project').length,
    news: feedItems.value.filter(item => item.type === 'news').length,
    media: feedItems.value.filter(item => item.type === 'photo' || item.type === 'video').length
  }
})

// Get seen items from localStorage
function getSeenItems() {
  try {
    const seen = localStorage.getItem(seenItemsKey)
    const parsed = seen ? JSON.parse(seen) : []
    console.log('Current seen items from localStorage:', parsed.length, parsed)
    return parsed
  } catch (error) {
    console.error('Error reading seen items:', error)
    return []
  }
}

// Mark item as seen
function markItemAsSeen(itemId) {
  try {
    const seen = getSeenItems()
    if (!seen.includes(itemId)) {
      seen.push(itemId)
      localStorage.setItem(seenItemsKey, JSON.stringify(seen))
      console.log('Marked as seen:', itemId, 'Total seen:', seen.length)
    }
  } catch (error) {
    console.error('Error marking item as seen:', error)
  }
}

// Sort items: unseen first, seen last. When all are seen, shuffle to keep feed dynamic
function sortItemsBySeenStatus(items) {
  const seen = getSeenItems()
  const unseen = items.filter(item => {
    const itemId = `${item.type}-${item.id}`
    return !seen.includes(itemId)
  })
  const seenItems = items.filter(item => {
    const itemId = `${item.type}-${item.id}`
    return seen.includes(itemId)
  })
  
  // If all items are seen, shuffle them to keep the feed dynamic
  if (unseen.length === 0 && seenItems.length > 0) {
    // Create a shuffled copy of seen items
    const shuffled = [...seenItems]
    
    // Use a deterministic shuffle based on current time (changes every hour)
    // This ensures the order changes periodically but stays consistent during the same hour
    const hourSeed = Math.floor(Date.now() / (1000 * 60 * 60)) // Changes every hour
    const seed = hourSeed % 10000 // Keep it manageable
    
    // Simple seeded shuffle algorithm
    for (let i = shuffled.length - 1; i > 0; i--) {
      // Use seed to generate pseudo-random index
      const j = (seed + i * 7919) % (i + 1) // 7919 is a prime number for better distribution
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    
    return shuffled
  }
  
  return [...unseen, ...seenItems]
}

// Filtered feed items based on selected content type
const filteredFeedItems = computed(() => {
  let items = feedItems.value
  
  // Filter by content type
  if (selectedContentType.value === 'news') {
    items = items.filter(item => item.type === 'news')
  } else if (selectedContentType.value === 'photos') {
    items = items.filter(item => item.type === 'photo')
  } else if (selectedContentType.value === 'videos') {
    items = items.filter(item => item.type === 'video')
  } else if (selectedContentType.value === 'projects') {
    items = items.filter(item => item.type === 'project')
  }
  
  // Sort: unseen first, seen last
  return sortItemsBySeenStatus(items)
})

// Function to set content type filter
function setContentTypeFilter(type) {
  selectedContentType.value = type
}

// Where We Are stats
const whereWeAreStats = ref({
  regions: 9,
  provinces: 14,
  municipalities: 32,
  members: '2K+'
})

// Get image for item
function getItemImage(item) {
  if (item.type === 'news' || item.type === 'project') {
    return item.image || null
  }
  if (item.type === 'photo') {
    return item.url || null
  }
  if (item.type === 'video') {
    // Get YouTube thumbnail if it's a YouTube video
    if (item.url) {
      return getYouTubeThumbnailUrl(item.url) || null
    }
    return null
  }
  return null
}

// Get date for item
function getItemDate(item) {
  if (item.type === 'news') {
    return item.publishDate || item.createdAt
  }
  return item.createdAt
}

// Get type icon background class
function getTypeIconBgClass(type) {
  const classes = {
    'news': 'bg-blue-100',
    'photo': 'bg-green-100',
    'video': 'bg-red-100',
    'project': 'bg-purple-100'
  }
  return classes[type] || 'bg-gray-100'
}

// Get type icon color class
function getTypeIconClass(type) {
  const classes = {
    'news': 'text-blue-600',
    'photo': 'text-green-600',
    'video': 'text-red-600',
    'project': 'text-purple-600'
  }
  return classes[type] || 'text-gray-600'
}

// Get type icon
function getTypeIcon(type) {
  if (type === 'news') return Newspaper
  if (type === 'photo') return Image
  if (type === 'video') return Video
  if (type === 'project') return FolderOpenDot
  return FolderOpenDot
}

// Handle item click
function handleItemClick(item) {
  if (item.type === 'news') {
    router.push(`/news/${item.id}`)
  } else if (item.type === 'photo') {
    openPhotoModal(item)
  } else if (item.type === 'video') {
    openVideoModal(item)
  } else if (item.type === 'project') {
    router.push(`/projects/${item.id}`)
  }
}

// Photo modal functions
function openPhotoModal(photo) {
  selectedPhoto.value = photo
}

function closePhotoModal() {
  selectedPhoto.value = null
}

function getPhotosFromFeed() {
  return feedItems.value.filter(item => item.type === 'photo')
}

function getCurrentPhotoIndex() {
  if (!selectedPhoto.value) return -1
  return getPhotosFromFeed().findIndex(p => p.id === selectedPhoto.value.id)
}

function navigateToPreviousPhoto() {
  const photos = getPhotosFromFeed()
  const currentIndex = getCurrentPhotoIndex()
  if (currentIndex > 0) {
    selectedPhoto.value = photos[currentIndex - 1]
  }
}

function navigateToNextPhoto() {
  const photos = getPhotosFromFeed()
  const currentIndex = getCurrentPhotoIndex()
  if (currentIndex < photos.length - 1) {
    selectedPhoto.value = photos[currentIndex + 1]
  }
}

// Video modal functions
function openVideoModal(video) {
  selectedVideo.value = video
}

function closeVideoModal() {
  selectedVideo.value = null
}

function getVideosFromFeed() {
  return feedItems.value.filter(item => item.type === 'video')
}

function getCurrentVideoIndex() {
  if (!selectedVideo.value) return -1
  return getVideosFromFeed().findIndex(v => v.id === selectedVideo.value.id)
}

function navigateToPreviousVideo() {
  const videos = getVideosFromFeed()
  const currentIndex = getCurrentVideoIndex()
  if (currentIndex > 0) {
    selectedVideo.value = videos[currentIndex - 1]
  }
}

function navigateToNextVideo() {
  const videos = getVideosFromFeed()
  const currentIndex = getCurrentVideoIndex()
  if (currentIndex < videos.length - 1) {
    selectedVideo.value = videos[currentIndex + 1]
  }
}

// YouTube helper functions
function getYouTubeVideoId(url) {
  if (!url) return null
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) return match[1]
  }
  return null
}

function getYouTubeThumbnailUrl(url) {
  const videoId = getYouTubeVideoId(url)
  if (!videoId) return null
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
}

function getYouTubeEmbedUrl(url, hideControls = false) {
  const videoId = getYouTubeVideoId(url)
  if (!videoId) return null
  const baseUrl = `https://www.youtube.com/embed/${videoId}`
  if (hideControls) {
    return `${baseUrl}?controls=0&modestbranding=1`
  }
  return baseUrl
}


// Format date for display
function formatDate(date) {
  if (!date) return ''
  
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
  const diffMs = now - dateObj
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)
  
  if (diffSeconds < 60) {
    return diffSeconds <= 1 ? 'just now' : `${diffSeconds} seconds ago`
  } else if (diffMinutes < 60) {
    return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`
  } else if (diffHours < 24) {
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`
  } else if (diffDays < 7) {
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`
  } else if (diffWeeks < 4) {
    return diffWeeks === 1 ? '1 week ago' : `${diffWeeks} weeks ago`
  } else if (diffMonths < 12) {
    return diffMonths === 1 ? '1 month ago' : `${diffMonths} months ago`
  }
  
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  }
  return dateObj.toLocaleDateString('en-US', options)
}

async function loadFeed() {
  loading.value = true
  try {
    const [news, photos, videos, projects, aboutDataResult] = await Promise.all([
      newsService.getNews(),
      mediaService.getPhotos(),
      mediaService.getVideos(),
      projectsService.getProjects(),
      aboutUsService.getAboutUs().catch(() => null)
    ])
    
    feedItems.value = createUnifiedFeed(news, photos, videos, projects)
    
    // Store about data
    aboutData.value = aboutDataResult
    
    // Load Where We Are stats if available
    if (aboutDataResult && aboutDataResult.stats) {
      whereWeAreStats.value = {
        regions: aboutDataResult.stats.regions || 9,
        provinces: aboutDataResult.stats.provinces || 14,
        municipalities: aboutDataResult.stats.municipalities || 32,
        members: formatWhereWeAreNumber(aboutDataResult.stats.members || 2000)
      }
    }
    
    // Setup Intersection Observer after items are loaded
    await nextTick()
    // Wait a bit for DOM to render
    setTimeout(() => {
      setupIntersectionObserver()
    }, 200)
  } catch (error) {
    console.error('Error loading feed:', error)
  } finally {
    loading.value = false
  }
}

function formatWhereWeAreNumber(num) {
  if (typeof num === 'string') return num
  if (num >= 1000) {
    return `${Math.floor(num / 1000)}K+`
  }
  return num.toString()
}

// Set item ref for Intersection Observer
function setItemRef(el, itemId) {
  if (el) {
    itemRefs.value.set(itemId, el)
  } else {
    itemRefs.value.delete(itemId)
  }
}

// Setup Intersection Observer to track seen items
let intersectionObserver = null

function setupIntersectionObserver() {
  if (typeof window === 'undefined' || !window.IntersectionObserver) {
    console.warn('IntersectionObserver not available')
    return
  }

  // Clean up existing observer
  if (intersectionObserver) {
    intersectionObserver.disconnect()
  }

  intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const itemId = entry.target.dataset.itemId
          if (itemId) {
            markItemAsSeen(itemId)
          }
        }
      })
    },
    {
      root: null,
      rootMargin: '0px',
      threshold: 0.3 // Item is considered seen when 30% is visible
    }
  )

  // Also observe items by querying DOM directly as fallback
  const itemElements = document.querySelectorAll('[data-item-id]')
  let observedCount = 0
  
  itemElements.forEach((el) => {
    if (el && el.nodeType === 1) {
      intersectionObserver.observe(el)
      observedCount++
    }
  })
  
  // Also observe refs if available
  itemRefs.value.forEach((el, itemId) => {
    if (el && el.nodeType === 1 && !el.dataset.observed) {
      el.dataset.itemId = itemId
      el.dataset.observed = 'true'
      intersectionObserver.observe(el)
      observedCount++
    }
  })
  
  console.log(`Intersection Observer setup: ${observedCount} items observed`)
  console.log('Current localStorage:', localStorage.getItem(seenItemsKey))
}

const handleRefetch = () => {
  if (route.path === '/') {
    loadFeed()
  }
}

// Watch for changes in filteredFeedItems to update observer
watch(
  () => filteredFeedItems.value.length,
  () => {
    nextTick(() => {
      // Wait a bit more for DOM to fully render
      setTimeout(() => {
        setupIntersectionObserver()
      }, 100)
    })
  }
)

onMounted(() => {
  loadFeed()
  window.addEventListener('refetch-page-data', handleRefetch)
})

onUnmounted(() => {
  window.removeEventListener('refetch-page-data', handleRefetch)
  if (intersectionObserver) {
    intersectionObserver.disconnect()
  }
})
</script>
