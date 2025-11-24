<template>
  <PublicLayout>
    <div class="flex flex-col max-w-6xl mx-auto px-2 sm:px-4 min-h-[calc(100vh-80px)]">

      <!-- TABS (Fixed) -->
      <div
        class="fixed left-0 right-0 bg-gray-50 z-40 px-2 sm:px-4 py-2"
        :class="[
          tabsFixedScrolled && isMobile
            ? 'top-12'
            : 'top-16',
          'md:top-16'
        ]"
        ref="tabsRef"
      >
        <div class="max-w-6xl mx-auto">
          <div class="flex items-center gap-1 bg-gray-200 rounded-lg p-1 w-full">
            <button
              @click="activeTab = 'photos'"
              :class="[
                'flex-1 px-4 py-1.5 text-sm font-medium transition-colors rounded-md cursor-pointer',
                activeTab === 'photos'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              ]"
            >
              Photos
            </button>
            <button
              @click="activeTab = 'videos'"
              :class="[
                'flex-1 px-4 py-1.5 text-sm font-medium transition-colors rounded-md cursor-pointer',
                activeTab === 'videos'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              ]"
            >
              Videos
            </button>
          </div>
        </div>
      </div>

      <!-- CONTENT AREA (Scrollable) -->
      <div class="flex-1 pt-10 md:pt-10">
        <!-- PHOTOS TAB -->
        <div v-show="activeTab === 'photos'">
          <div :class="[
            viewMode === 'list' ? 'flex flex-col gap-2 p-2' : 'gap-2 sm:gap-3 p-4',
            viewMode === 'grid' ? 'grid grid-cols-3' : viewMode === 'cards' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-fr' : ''
          ]">
          <!-- Loading Skeleton -->
          <template v-if="viewMode === 'grid'">
            <div
              v-if="loadingPhotos"
              v-for="n in 6"
              :key="n"
              class="w-full aspect-square bg-gray-200 rounded-lg animate-pulse"
            ></div>
          </template>
          <Skeleton
            v-else-if="loadingPhotos"
            v-for="n in 6"
            :key="n"
            type="card"
            variant="default"
            :image-aspect="viewMode === 'list' ? undefined : 'square'"
            :image-height="viewMode === 'list' ? 'h-20 w-20' : undefined"
            :description-lines="viewMode === 'list' ? 1 : 2"
            :card-classes="viewMode === 'list' ? 'flex-row' : ''"
          />

          <!-- Empty State -->
          <p v-if="!loadingPhotos && sortedPhotos.length === 0" :class="viewMode === 'list' ? 'text-center text-gray-400 py-4' : 'text-center text-gray-400 col-span-full'">
            No photos available.
          </p>

          <!-- Photo Cards -->
          <template v-if="viewMode === 'grid'">
            <div
              v-for="photo in sortedPhotos"
              :key="photo.id"
              class="relative w-full aspect-square overflow-hidden rounded-lg cursor-pointer bg-gray-100"
              @click="openImageModal(photo)"
            >
              <img
                :src="photo.url"
                :alt="photo.title || 'Photo'"
                class="w-full h-full object-cover"
              />
            </div>
          </template>
          <Card
            v-else
            v-for="photo in sortedPhotos"
            :key="photo.id"
            variant="light"
            :image="photo.url"
            :image-alt="photo.title || 'Photo'"
            :image-aspect="viewMode === 'list' ? undefined : 'square'"
            :image-height="viewMode === 'list' ? 'h-20 w-20' : undefined"
            :image-hover="true"
            :title="photo.title || 'Untitled Photo'"
            :description="photo.description || 'No description'"
            :description-clamp="viewMode === 'list' ? undefined : '2'"
            :card-classes="viewMode === 'list' ? 'flex-row' : (viewMode === 'cards' ? 'h-full' : '')"
            clickable
            @click="openImageModal(photo)"
          >
            <template v-if="viewMode === 'list'" #image>
              <div class="relative w-20 h-20 shrink-0 overflow-hidden rounded-l-lg bg-gray-100">
                <img
                  :src="photo.url"
                  :alt="photo.title || 'Photo'"
                  class="w-full h-full object-cover"
                />
              </div>
            </template>
            <template v-if="photo.createdAt" #footer>
              <p class="text-[10px] sm:text-xs text-gray-500 mt-1 flex items-center gap-1">
                <Calendar class="w-3 h-3" />
                <span class="font-medium">{{ formatDate(photo.createdAt) }}</span>
              </p>
            </template>
          </Card>
        </div>
      </div>

        <!-- VIDEOS TAB -->
        <div v-show="activeTab === 'videos'">
          <div :class="[
            viewMode === 'list' ? 'flex flex-col gap-2 p-2' : 'gap-2 sm:gap-3 p-4',
            viewMode === 'grid' ? 'grid grid-cols-3' : viewMode === 'cards' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-fr' : ''
          ]">
          <!-- Loading Skeleton -->
          <template v-if="viewMode === 'grid'">
            <div
              v-if="loadingVideos"
              v-for="n in 6"
              :key="n"
              class="w-full aspect-square bg-gray-200 rounded-lg animate-pulse"
            ></div>
          </template>
          <Skeleton
            v-else-if="loadingVideos"
            v-for="n in 6"
            :key="n"
            type="card"
            variant="default"
            :image-aspect="viewMode === 'list' ? undefined : 'video'"
            :image-height="viewMode === 'list' ? 'h-20 w-20' : undefined"
            :description-lines="viewMode === 'list' ? 1 : 3"
            :card-classes="viewMode === 'list' ? 'flex-row' : ''"
          />

          <!-- Empty State -->
          <p v-if="!loadingVideos && sortedVideos.length === 0" :class="viewMode === 'list' ? 'text-center text-gray-400 py-4' : 'text-center text-gray-400 col-span-full'">
            No videos available.
          </p>

          <!-- Video Cards -->
          <template v-if="viewMode === 'grid'">
            <div
              v-for="video in sortedVideos"
              :key="video.id"
              class="relative w-full aspect-square overflow-hidden rounded-lg cursor-pointer bg-gray-100"
              @click="openVideoModal(video)"
            >
              <template v-if="getYouTubeEmbedUrl(video.url)">
                <img
                  v-if="isMobile"
                  :src="getYouTubeThumbnailUrl(video.url)"
                  :alt="video.title || 'Video thumbnail'"
                  class="w-full h-full object-cover"
                />
                <iframe
                  v-else
                  :src="getYouTubeEmbedUrl(video.url)"
                  class="w-full h-full object-cover"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </template>
              <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                No Video
              </div>
            </div>
          </template>
          <Card
            v-else
            v-for="video in sortedVideos"
            :key="video.id"
            variant="light"
            :title="video.title || 'Untitled Video'"
            :description="video.description || 'No description'"
            :description-clamp="viewMode === 'list' ? undefined : '3'"
            :card-classes="viewMode === 'list' ? 'flex-row' : (viewMode === 'cards' ? 'h-full' : '')"
            clickable
            @click="openVideoModal(video)"
          >
            <template #image>
              <div :class="viewMode === 'list' ? 'w-20 h-20 shrink-0 overflow-hidden rounded-l-lg bg-gray-100' : 'w-full aspect-video' + ' overflow-hidden'">
                <template v-if="getYouTubeEmbedUrl(video.url)">
                  <img
                    v-if="isMobile || viewMode === 'list'"
                    :src="getYouTubeThumbnailUrl(video.url)"
                    :alt="video.title || 'Video thumbnail'"
                    class="w-full h-full object-cover"
                  />
                  <iframe
                    v-else
                    :src="getYouTubeEmbedUrl(video.url)"
                    class="w-full h-full object-cover"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                </template>
                <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs rounded-l-lg">
                  No Video
                </div>
              </div>
            </template>
            <template v-if="video.createdAt" #footer>
              <p class="text-[10px] sm:text-xs text-gray-500 mt-1 flex items-center gap-1">
                <Calendar class="w-3 h-3" />
                <span class="font-medium">{{ formatDate(video.createdAt) }}</span>
              </p>
            </template>
           </Card>
          </div>
        </div>
      </div>

      <!-- IMAGE MODAL FULLSCREEN -->
      <div
        v-if="modalImage"
        class="fixed inset-0 backdrop-blur-sm bg-black/70 flex items-center justify-center z-[60] p-3"
        @click.self="closeImageModal"
      >
        <div class="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white rounded-lg overflow-hidden">
          <!-- Close Button -->
          <button
            @click="closeImageModal"
            class="absolute top-2 right-2 z-10 bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-700 transition text-lg leading-none"
            aria-label="Close"
          >
            ×
          </button>
          
          <!-- Previous Button -->
          <button
            v-if="getCurrentPhotoIndex() > 0"
            @click.stop="navigateToPreviousPhoto"
            class="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-700 transition"
            aria-label="Previous photo"
          >
            <ChevronLeft class="w-5 h-5" />
          </button>
          
          <!-- Next Button -->
          <button
            v-if="getCurrentPhotoIndex() < photos.length - 1"
            @click.stop="navigateToNextPhoto"
            class="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-700 transition"
            aria-label="Next photo"
          >
            <ChevronRight class="w-5 h-5" />
          </button>
          
          <!-- Image -->
          <div class="flex-1 overflow-auto flex items-center justify-center bg-gradient-to-br from-primary-500 via-primary-700 to-primary-900 p-4">
            <img
              :src="modalImage"
              :alt="selectedPhoto?.title || 'Full Image'"
              class="max-w-full max-h-[70vh] object-contain rounded-lg"
            />
          </div>
          
          <!-- Details -->
          <div v-if="selectedPhoto" class="p-4 bg-white border-t border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900 mb-2">
              {{ selectedPhoto.title || 'Untitled Photo' }}
            </h2>
            <p v-if="selectedPhoto.description" class="text-gray-600 mb-3">
              {{ selectedPhoto.description }}
            </p>
            <div class="flex items-center gap-4 text-sm text-gray-500">
              <span v-if="selectedPhoto.createdAt" class="flex items-center gap-1">
                <Calendar class="w-4 h-4" />
                {{ formatDate(selectedPhoto.createdAt) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- VIDEO MODAL FULLSCREEN -->
      <div
        v-if="modalVideo"
        class="fixed inset-0 backdrop-blur-sm bg-black/70 flex items-center justify-center z-[60] p-3"
        @click.self="closeVideoModal"
      >
        <div class="relative w-full max-w-4xl flex flex-col bg-white rounded-lg overflow-hidden">
          <!-- Close Button -->
          <button
            @click="closeVideoModal"
            class="absolute top-2 right-2 z-10 bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-700 transition text-lg leading-none"
            aria-label="Close"
          >
            ×
          </button>
          
          <!-- Previous Button -->
          <button
            v-if="getCurrentVideoIndex() > 0"
            @click.stop="navigateToPreviousVideo"
            class="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-700 transition"
            aria-label="Previous video"
          >
            <ChevronLeft class="w-5 h-5" />
          </button>
          
          <!-- Next Button -->
          <button
            v-if="getCurrentVideoIndex() < videos.length - 1"
            @click.stop="navigateToNextVideo"
            class="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-gray-800/80 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-700 transition"
            aria-label="Next video"
          >
            <ChevronRight class="w-5 h-5" />
          </button>
          
          <!-- Video -->
          <div class="relative w-full aspect-video bg-primary-700">
            <iframe
              v-if="getYouTubeEmbedUrl(modalVideo)"
              :src="getYouTubeEmbedUrl(modalVideo)"
              class="w-full h-full"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
            <div v-else class="w-full h-full flex items-center justify-center text-white">
              No Video Available
            </div>
          </div>
          
          <!-- Details -->
          <div v-if="selectedVideo" class="p-4 bg-white border-t border-gray-200">
            <h2 class="text-xl font-semibold text-gray-900 mb-2">
              {{ selectedVideo.title || 'Untitled Video' }}
            </h2>
            <p v-if="selectedVideo.description" class="text-gray-600 mb-3">
              {{ selectedVideo.description }}
            </p>
            <div class="flex items-center gap-4 text-sm text-gray-500">
              <span v-if="selectedVideo.createdAt" class="flex items-center gap-1">
                <Calendar class="w-4 h-4" />
                {{ formatDate(selectedVideo.createdAt) }}
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </PublicLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import { useRoute } from "vue-router";
import PublicLayout from "../layouts/PublicLayout.vue";
import Card from "../components/Card.vue";
import Skeleton from "../components/Skeleton.vue";
import { mediaService } from "../firebase/firestore";
import { Play, ChevronLeft, ChevronRight, Calendar } from "lucide-vue-next";
import { useViewMode } from "../composables/useViewMode";
import { useBodyScrollLock } from "../composables/useBodyScrollLock";

// Check if mobile view
const isMobile = ref(false);
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768; // md breakpoint
};

// Track if the scroll position should trigger top-12 (on scroll, mobile only)
const tabsFixedScrolled = ref(false);
let lastScrollTop = 0;
const tabsScrollThreshold = 12; // px, adjust as needed

const handleScroll = () => {
  // Only adjust on mobile
  if (!isMobile.value) {
    tabsFixedScrolled.value = false;
    return;
  }
  const st = window.scrollY || window.pageYOffset;
  // If user has scrolled more than ~0px, apply top-12, else use top-16
  tabsFixedScrolled.value = st > 4;
  lastScrollTop = st;
};

// Load active tab from localStorage or default to 'photos'
const activeTab = ref(localStorage.getItem('mediaActiveTab') || 'photos');

// Save active tab to localStorage whenever it changes
watch(activeTab, (newTab) => {
  localStorage.setItem('mediaActiveTab', newTab);
});

// Use the composable for view mode
const route = useRoute()
const { viewMode } = useViewMode('media');
const photos = ref([]);
const videos = ref([]);
const loadingPhotos = ref(true);
const loadingVideos = ref(true);
const modalImage = ref(null);
const modalVideo = ref(null);
const selectedPhoto = ref(null);
const selectedVideo = ref(null);

// Lock body scroll when modals are open
const { useLock } = useBodyScrollLock();
const isModalOpen = computed(() => !!modalImage.value || !!modalVideo.value);
useLock(isModalOpen);

// Sort photos and videos by newest first
const sortedPhotos = computed(() => {
  return [...photos.value].sort((a, b) => {
    const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : (a.createdAt ? new Date(a.createdAt) : new Date(0));
    const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : (b.createdAt ? new Date(b.createdAt) : new Date(0));
    return dateB - dateA; // Newest first
  });
});

const sortedVideos = computed(() => {
  return [...videos.value].sort((a, b) => {
    const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : (a.createdAt ? new Date(a.createdAt) : new Date(0));
    const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : (b.createdAt ? new Date(b.createdAt) : new Date(0));
    return dateB - dateA; // Newest first
  });
});

// Extract YouTube video ID
function getYouTubeVideoId(url) {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
}

// Return embed URL
function getYouTubeEmbedUrl(url, hideControls = false) {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;
  const baseUrl = `https://www.youtube.com/embed/${videoId}`;
  if (hideControls) {
    return `${baseUrl}?controls=0&modestbranding=1`;
  }
  return baseUrl;
}

// Get YouTube thumbnail URL
function getYouTubeThumbnailUrl(url) {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

function openImageModal(photo) {
  selectedPhoto.value = photo;
  modalImage.value = photo.url;
}

function closeImageModal() {
  modalImage.value = null;
  selectedPhoto.value = null;
}

function openVideoModal(video) {
  selectedVideo.value = video;
  modalVideo.value = video.url;
}

function closeVideoModal() {
  modalVideo.value = null;
  selectedVideo.value = null;
}

// Navigation functions for photos
function getCurrentPhotoIndex() {
  if (!selectedPhoto.value) return -1;
  return sortedPhotos.value.findIndex(p => p.id === selectedPhoto.value.id);
}

function navigateToPreviousPhoto() {
  const currentIndex = getCurrentPhotoIndex();
  if (currentIndex > 0) {
    const previousPhoto = photos.value[currentIndex - 1];
    openImageModal(previousPhoto);
  }
}

function navigateToNextPhoto() {
  const currentIndex = getCurrentPhotoIndex();
  if (currentIndex < sortedPhotos.value.length - 1) {
    const nextPhoto = sortedPhotos.value[currentIndex + 1];
    openImageModal(nextPhoto);
  }
}

// Navigation functions for videos
function getCurrentVideoIndex() {
  if (!selectedVideo.value) return -1;
  return sortedVideos.value.findIndex(v => v.id === selectedVideo.value.id);
}

function navigateToPreviousVideo() {
  const currentIndex = getCurrentVideoIndex();
  if (currentIndex > 0) {
    const previousVideo = videos.value[currentIndex - 1];
    openVideoModal(previousVideo);
  }
}

function navigateToNextVideo() {
  const currentIndex = getCurrentVideoIndex();
  if (currentIndex < sortedVideos.value.length - 1) {
    const nextVideo = sortedVideos.value[currentIndex + 1];
    openVideoModal(nextVideo);
  }
}

// Format date for display
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
  
  const now = new Date();
  const diffTime = Math.abs(now - dateObj);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Format options
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else {
    return dateObj.toLocaleDateString('en-US', options);
  }
}

let unsubscribePhotos = null
let unsubscribeVideos = null

async function loadPhotos() {
  loadingPhotos.value = true;
  let initialLoadComplete = false;
  
  try {
    // Set up real-time listener with pagination (20 items)
    unsubscribePhotos = mediaService.subscribeToPhotos((photosList) => {
      photos.value = photosList;
      if (!initialLoadComplete) {
        initialLoadComplete = true;
        loadingPhotos.value = false;
      }
    }, 20);
  } catch (err) {
    console.error("Error setting up photos subscription:", err);
    loadingPhotos.value = false;
  }
}

async function loadVideos() {
  loadingVideos.value = true;
  let initialLoadComplete = false;
  
  try {
    // Set up real-time listener with pagination (20 items)
    unsubscribeVideos = mediaService.subscribeToVideos((videosList) => {
      videos.value = videosList;
      if (!initialLoadComplete) {
        initialLoadComplete = true;
        loadingVideos.value = false;
      }
    }, 20);
  } catch (err) {
    console.error("Error setting up videos subscription:", err);
    loadingVideos.value = false;
  }
}

onMounted(async () => {
  // Check mobile on mount
  checkMobile();
  window.addEventListener('resize', checkMobile);

  // Listen for scroll to adjust tabs pop
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Load both photos and videos on mount with real-time listeners
  await Promise.all([loadPhotos(), loadVideos()]);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  window.removeEventListener('scroll', handleScroll)
  
  // Cleanup real-time listeners
  if (unsubscribePhotos) unsubscribePhotos()
  if (unsubscribeVideos) unsubscribeVideos()
})
</script>

