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
              <nav class="space-y-2">
                <router-link
                  to="/news"
                  class="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                >
                  <Newspaper class="w-5 h-5" />
                  <span class="font-medium">Latest News</span>
                </router-link>
                <router-link
                  to="/projects"
                  class="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                >
                  <FolderOpenDot class="w-5 h-5" />
                  <span class="font-medium">Projects</span>
                </router-link>
                <router-link
                  to="/media"
                  class="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                >
                  <Image class="w-5 h-5" />
                  <span class="font-medium">Media</span>
                </router-link>
                <router-link
                  to="/about"
                  class="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                >
                  <Users class="w-5 h-5" />
                  <span class="font-medium">About Us</span>
                </router-link>
                <router-link
                  to="/contact"
                  class="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                >
                  <Calendar class="w-5 h-5" />
                  <span class="font-medium">Contact</span>
                </router-link>
              </nav>
            </div>

            <!-- About Section -->
            <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 class="text-lg font-bold text-gray-900 mb-3">About Sarilaya</h3>
              <p class="text-sm text-gray-600 leading-relaxed mb-4">
                Connecting communities and fostering growth through meaningful initiatives and shared values.
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
        <main ref="centerColumn" class="lg:pr-2 lg:flex-1" style="flex: 0 0 45%; max-width: 45%;">
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
              <div class="space-y-2">
                <div 
                  @click="setContentTypeFilter('all')"
                  class="flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer"
                  :class="selectedContentType === 'all' ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'"
                >
                  <Newspaper class="w-5 h-5" />
                  <span class="font-medium">All Content</span>
                </div>
                <div 
                  @click="setContentTypeFilter('news')"
                  class="flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer"
                  :class="selectedContentType === 'news' ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'"
                >
                  <Newspaper class="w-5 h-5 text-blue-600" />
                  <span>News</span>
                </div>
                <div 
                  @click="setContentTypeFilter('photos')"
                  class="flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer"
                  :class="selectedContentType === 'photos' ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'"
                >
                  <Image class="w-5 h-5 text-green-600" />
                  <span>Photos</span>
                </div>
                <div 
                  @click="setContentTypeFilter('videos')"
                  class="flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer"
                  :class="selectedContentType === 'videos' ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'"
                >
                  <Video class="w-5 h-5 text-red-600" />
                  <span>Videos</span>
                </div>
                <div 
                  @click="setContentTypeFilter('projects')"
                  class="flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer"
                  :class="selectedContentType === 'projects' ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'"
                >
                  <FolderOpenDot class="w-5 h-5 text-purple-600" />
                  <span>Projects</span>
                </div>
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
        <button
          v-if="getCurrentPhotoIndex() > 0"
          @click.stop="navigateToPreviousPhoto"
          class="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-700 transition"
          aria-label="Previous photo"
        >
          <ChevronLeft class="w-5 h-5" />
        </button>
        <button
          v-if="getCurrentPhotoIndex() < getPhotosFromFeed().length - 1"
          @click.stop="navigateToNextPhoto"
          class="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-700 transition"
          aria-label="Next photo"
        >
          <ChevronRight class="w-5 h-5" />
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
        <button
          v-if="getCurrentVideoIndex() > 0"
          @click.stop="navigateToPreviousVideo"
          class="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-700 transition"
          aria-label="Previous video"
        >
          <ChevronLeft class="w-5 h-5" />
        </button>
        <button
          v-if="getCurrentVideoIndex() < getVideosFromFeed().length - 1"
          @click.stop="navigateToNextVideo"
          class="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-700 transition"
          aria-label="Next video"
        >
          <ChevronRight class="w-5 h-5" />
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

    <!-- PROJECT MODAL -->
    <div
      v-if="selectedProject"
      class="fixed inset-0 backdrop-blur-sm bg-black/70 flex items-center justify-center z-[60] p-3 md:p-6 lg:p-8 overflow-y-auto"
      @click.self="closeProjectModal"
    >
      <div class="relative w-full max-w-4xl lg:max-w-6xl max-h-[90vh] flex flex-col bg-white rounded-lg lg:rounded-xl overflow-hidden my-8 shadow-2xl">
        <button
          @click="closeProjectModal"
          class="absolute top-2 right-2 z-10 bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-700 transition text-lg leading-none"
          aria-label="Close"
        >
          ×
        </button>
        <button
          v-if="getCurrentProjectIndex() > 0"
          @click.stop="navigateToPreviousProject"
          class="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-700 transition"
          aria-label="Previous project"
        >
          <ChevronLeft class="w-5 h-5" />
        </button>
        <button
          v-if="getCurrentProjectIndex() < getProjectsFromFeed().length - 1"
          @click.stop="navigateToNextProject"
          class="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-700 transition"
          aria-label="Next project"
        >
          <ChevronRight class="w-5 h-5" />
        </button>
        <div v-if="selectedProject.image" class="relative w-full h-64 sm:h-80 overflow-hidden bg-gradient-to-br from-primary-500 via-primary-700 to-primary-900">
          <img
            :src="selectedProject.image"
            :alt="selectedProject.title"
            class="w-full h-full object-cover"
          />
        </div>
        <div v-else class="relative w-full h-64 sm:h-80 bg-gradient-to-br from-primary-500 via-primary-700 to-primary-900 flex items-center justify-center">
          <Briefcase class="w-24 h-24 text-white/50" />
        </div>
        <div class="flex-1 overflow-y-auto p-6 sm:p-8">
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {{ selectedProject.title }}
          </h2>
          <p v-if="selectedProject.tagline" class="text-lg sm:text-xl text-primary-600 font-semibold mb-4">
            {{ selectedProject.tagline }}
          </p>
          <div v-if="selectedProject.createdAt" class="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Calendar class="w-4 h-4" />
            <span>{{ formatDate(selectedProject.createdAt) }}</span>
          </div>
          <div v-if="selectedProject.description" class="prose prose-sm sm:prose-base max-w-none mb-6">
            <p class="text-gray-600 leading-relaxed">
              {{ selectedProject.description }}
            </p>
          </div>
          <div v-if="selectedProject.content" class="prose prose-sm sm:prose-base max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
            {{ selectedProject.content }}
          </div>
        </div>
      </div>
    </div>
  </PublicLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import PublicLayout from '../layouts/PublicLayout.vue'
import Skeleton from '../components/Skeleton.vue'
import { newsService, mediaService, projectsService, aboutUsService } from '../firebase/firestore'
import { useFeedAlgorithm } from '../composables/useFeedAlgorithm'
import { Calendar, Newspaper, Image, Video, Briefcase, ChevronLeft, ChevronRight, Play, FolderOpenDot, Users } from 'lucide-vue-next'

const router = useRouter()
const { createUnifiedFeed } = useFeedAlgorithm()
const feedItems = ref([])
const loading = ref(true)
const selectedPhoto = ref(null)
const selectedVideo = ref(null)
const selectedProject = ref(null)
const centerColumn = ref(null)
const leftSidebar = ref(null)
const rightSidebar = ref(null)
const selectedContentType = ref('all')

// Computed stats for display
const stats = computed(() => {
  return {
    projects: feedItems.value.filter(item => item.type === 'project').length,
    news: feedItems.value.filter(item => item.type === 'news').length,
    media: feedItems.value.filter(item => item.type === 'photo' || item.type === 'video').length
  }
})

// Filtered feed items based on selected content type
const filteredFeedItems = computed(() => {
  if (selectedContentType.value === 'all') {
    return feedItems.value
  }
  if (selectedContentType.value === 'news') {
    return feedItems.value.filter(item => item.type === 'news')
  }
  if (selectedContentType.value === 'photos') {
    return feedItems.value.filter(item => item.type === 'photo')
  }
  if (selectedContentType.value === 'videos') {
    return feedItems.value.filter(item => item.type === 'video')
  }
  if (selectedContentType.value === 'projects') {
    return feedItems.value.filter(item => item.type === 'project')
  }
  return feedItems.value
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
    openProjectModal(item)
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

// Project modal functions
function openProjectModal(project) {
  selectedProject.value = project
}

function closeProjectModal() {
  selectedProject.value = null
}

function getProjectsFromFeed() {
  return feedItems.value.filter(item => item.type === 'project')
}

function getCurrentProjectIndex() {
  if (!selectedProject.value) return -1
  return getProjectsFromFeed().findIndex(p => p.id === selectedProject.value.id)
}

function navigateToPreviousProject() {
  const projects = getProjectsFromFeed()
  const currentIndex = getCurrentProjectIndex()
  if (currentIndex > 0) {
    selectedProject.value = projects[currentIndex - 1]
  }
}

function navigateToNextProject() {
  const projects = getProjectsFromFeed()
  const currentIndex = getCurrentProjectIndex()
  if (currentIndex < projects.length - 1) {
    selectedProject.value = projects[currentIndex + 1]
  }
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
    const [news, photos, videos, projects, aboutData] = await Promise.all([
      newsService.getNews(),
      mediaService.getPhotos(),
      mediaService.getVideos(),
      projectsService.getProjects(),
      aboutUsService.getAboutUs().catch(() => null)
    ])
    
    feedItems.value = createUnifiedFeed(news, photos, videos, projects)
    
    // Load Where We Are stats if available
    if (aboutData && aboutData.stats) {
      whereWeAreStats.value = {
        regions: aboutData.stats.regions || 9,
        provinces: aboutData.stats.provinces || 14,
        municipalities: aboutData.stats.municipalities || 32,
        members: formatWhereWeAreNumber(aboutData.stats.members || 2000)
      }
    }
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

onMounted(() => {
  loadFeed()
})
</script>
