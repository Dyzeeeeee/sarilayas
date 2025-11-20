<template>
  <PublicLayout>
    <div class="space-y-4 max-w-6xl mx-auto px-2 sm:px-4">

      <!-- HEADER -->
      <div class="text-center sm:text-left mb-2">
        <h1 class="text-2xl sm:text-3xl font-extrabold text-black">Video Gallery</h1>
        <p class="text-gray-600 mt-1 text-sm sm:text-base">
          Watch our collection of videos.
        </p>
      </div>

      <!-- VIDEO GRID -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">

        <!-- Loading Skeleton -->
        <div
          v-if="loading"
          v-for="n in 6"
          :key="n"
          class="bg-primary-700/10 rounded-lg p-3 animate-pulse space-y-1 shadow-md"
        >
          <div class="w-full h-32 sm:h-40 bg-white/20 rounded mb-1"></div>
          <div class="h-3 bg-white/20 rounded w-3/4"></div>
          <div class="h-2 bg-white/20 rounded w-1/2"></div>
        </div>

        <!-- Empty State -->
        <p v-if="!loading && videos.length === 0" class="text-center text-gray-400 col-span-full">
          No videos available.
        </p>

        <!-- Video Cards -->
        <div
          v-else
          v-for="video in videos"
          :key="video.id"
          class="bg-primary-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 flex flex-col cursor-pointer"
          @click="openModal(video.url)"
        >
          <!-- Thumbnail / Embed -->
          <div class="w-full aspect-video overflow-hidden">
            <iframe
              v-if="getYouTubeEmbedUrl(video.url)"
              :src="getYouTubeEmbedUrl(video.url)"
              class="w-full h-full object-cover"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
            <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
              No Video
            </div>
          </div>

          <!-- Content -->
          <div class="p-3 sm:p-4 flex-1 flex flex-col text-white">
            <h2 class="text-base sm:text-lg font-semibold mb-1 truncate">{{ video.title }}</h2>
            <p v-if="video.description" class="text-white/80 text-sm line-clamp-3">{{ video.description }}</p>
          </div>
        </div>

      </div>

      <!-- VIDEO MODAL FULLSCREEN -->
      <div
        v-if="modalVideo"
        class="fixed inset-0 backdrop-blur-sm bg-black/70 flex items-center justify-center z-50 p-3"
        @click.self="closeModal"
      >
        <div class="relative w-full max-w-3xl aspect-video">
          <iframe
            :src="getYouTubeEmbedUrl(modalVideo)"
            class="w-full h-full rounded-lg"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
          <!-- Close Button -->
          <button
            @click="closeModal"
            class="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700 transition"
          >
            ✕
          </button>
        </div>
      </div>

    </div>
  </PublicLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import PublicLayout from "../layouts/PublicLayout.vue";
import { mediaService } from "../firebase/firestore";

const videos = ref([]);
const loading = ref(true);
const modalVideo = ref(null);

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
function getYouTubeEmbedUrl(url) {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}`;
}

function openModal(url) {
  modalVideo.value = url;
}

function closeModal() {
  modalVideo.value = null;
}

onMounted(async () => {
  try {
    videos.value = await mediaService.getVideos();
  } catch (err) {
    console.error("Error fetching videos:", err);
  } finally {
    loading.value = false;
  }
});
</script>


