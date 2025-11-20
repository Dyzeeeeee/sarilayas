<template>
  <PublicLayout>
    <div class="space-y-4">

      <!-- HEADER -->
      <div class="text-center px-2 sm:px-0">
        <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900">
          Latest News
        </h1>
        <p class="text-gray-700 mt-1 text-sm sm:text-base">
          Stay updated with our latest news and announcements.
        </p>
      </div>

      <!-- CONTENT -->
      <div class="max-w-6xl mx-auto px-2 sm:px-4">

        <!-- Loading state -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

        <!-- Articles -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="article in articles"
            :key="article.id"
            class="bg-primary-700 rounded-lg border border-white/30 shadow-sm flex flex-col"
          >
            <!-- IMAGE FULL -->
            <div
              class="relative w-full h-40 sm:h-48 lg:h-56 cursor-pointer overflow-hidden rounded-t-lg"
              @click="openModal(article.image)"
            >
              <img
                :src="article.image"
                alt="News Image"
                class="w-full h-full object-cover"
              />
              <!-- Overlay text -->
              <div class="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded sm:hidden">
                Tap to view
              </div>
            </div>

            <div class="p-3 flex-1 flex flex-col justify-between text-white">
              <!-- TITLE -->
              <h2 class="text-sm sm:text-base font-semibold mb-1 truncate">
                {{ article.title }}
              </h2>

              <!-- DESCRIPTION -->
              <p class="text-white/80 text-xs sm:text-sm line-clamp-3 mb-1">
                {{ article.description }}
              </p>

              <!-- DATE -->
              <p class="text-[10px] sm:text-xs text-white/60">
                Published on: <span class="font-medium">{{ article.publishDate }}</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <p v-if="!loading && articles.length === 0" class="text-center text-white/70 py-4 text-sm">
          No news articles available.
        </p>
      </div>

      <!-- IMAGE MODAL FULLSCREEN -->
      <div
        v-if="modalImage"
        class="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-3"
        @click.self="closeModal"
      >
        <div class="relative w-full max-w-3xl flex items-center justify-center">
          <img
            :src="modalImage"
            alt="Full Image"
            class="w-full h-auto object-contain rounded-lg"
          />
          <!-- Close X button -->
          <button
            @click="closeModal"
            class="absolute top-2 right-2 text-black text-2xl font-bold leading-none hover:text-gray-800"
          >
            ×
          </button>
        </div>
      </div>

    </div>
  </PublicLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import PublicLayout from "../layouts/PublicLayout.vue";
import { newsService } from "../firebase/firestore";

const articles = ref([]);
const loading = ref(true);
const modalImage = ref(null);

function openModal(imageUrl) {
  modalImage.value = imageUrl;
}

function closeModal() {
  modalImage.value = null;
}

onMounted(async () => {
  try {
    articles.value = await newsService.getNews();
  } catch (err) {
    console.error("Error fetching articles:", err);
  } finally {
    loading.value = false;
  }
});
</script>
