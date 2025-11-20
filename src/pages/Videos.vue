<template>
  <PublicLayout>
    <div class="space-y-4">
      <!-- HEADER -->
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Video Gallery</h1>
        <p class="text-gray-600 text-sm">Watch our collection of videos.</p>
      </div>

      <!-- VIDEO GRID -->
      <div>
        <!-- Loading skeleton -->
        <div v-if="loading" class="space-y-2">
          <div
            v-for="n in 6"
            :key="n"
            class="bg-white rounded-lg border border-gray-200 p-2 shadow-sm animate-pulse"
          >
            <div class="w-full aspect-video bg-gray-200 rounded mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
            <div class="h-2 bg-gray-200 rounded w-full"></div>
          </div>
        </div>

        <!-- Video cards -->
        <div v-else class="space-y-2">
          <div
            v-for="video in videos"
            :key="video.id"
            class="bg-white rounded-lg border border-gray-200 p-2 shadow-sm hover:shadow-md transition"
          >
            <!-- VIDEO -->
            <div
              v-if="getYouTubeEmbedUrl(video.url)"
              class="w-full aspect-video rounded-lg overflow-hidden mb-2 cursor-pointer"
              @click="openModal(video.url)"
            >
              <iframe
                :src="getYouTubeEmbedUrl(video.url)"
                class="w-full h-full"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
            <p v-else class="text-gray-500 text-xs mb-2 truncate">{{ video.url }}</p>

            <!-- TITLE -->
            <p class="text-sm font-semibold text-gray-900 mb-1 truncate">{{ video.title }}</p>

            <!-- DESCRIPTION -->
            <p
              v-if="video.description"
              class="text-xs text-gray-600 line-clamp-2"
            >
              {{ video.description }}
            </p>
          </div>
        </div>

        <!-- Empty state -->
        <p v-if="!loading && videos.length === 0" class="text-center text-gray-500 py-4 text-sm">
          No videos available.
        </p>
      </div>

      <!-- VIDEO MODAL -->
      <div
        v-if="modalVideo"
        class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
        @click.self="closeModal"
      >
        <div class="relative w-[90%] max-w-3xl aspect-video">
          <iframe
            :src="getYouTubeEmbedUrl(modalVideo)"
            class="w-full h-full rounded-lg"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
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
