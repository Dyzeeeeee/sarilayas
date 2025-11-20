<template>
  <PublicLayout>
    <div class="space-y-3">
      <!-- HEADER -->
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Latest News</h1>
        <p class="text-gray-600 text-sm">Stay updated with our latest news and announcements.</p>
      </div>

      <!-- CONTENT -->
      <div>
        <!-- Loading state -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="n in 6"
            :key="n"
            class="bg-white rounded-lg border border-gray-200 p-1 shadow-sm animate-pulse space-y-1"
          >
            <div class="h-40 bg-gray-200 rounded mb-1"></div>
            <div class="h-5 bg-gray-200 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 rounded w-full"></div>
            <div class="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>

        <!-- Articles -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="article in articles"
            :key="article.id"
            class="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition hover:border-primary-600 flex flex-col"
          >
            <!-- IMAGE FULL -->
            <div
              class="w-full h-48 sm:h-56 lg:h-64 cursor-pointer overflow-hidden rounded-t-lg"
              @click="openModal(article.image)"
            >
              <img
                :src="article.image"
                alt="News Image"
                class="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>

            <div class="p-3 flex-1 flex flex-col justify-between">
              <!-- TITLE -->
              <h2 class="text-base font-semibold text-gray-900 mb-1 truncate">
                {{ article.title }}
              </h2>

              <!-- DESCRIPTION -->
              <p class="text-gray-600 text-sm line-clamp-3 mb-2">
                {{ article.description }}
              </p>

              <!-- DATE -->
              <p class="text-xs text-gray-500">
                Published on: <span class="font-medium">{{ article.publishDate }}</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <p v-if="!loading && articles.length === 0" class="text-center text-gray-500 py-4 text-sm">
          No news articles available.
        </p>
      </div>

      <!-- IMAGE MODAL FULLSCREEN -->
      <div
        v-if="modalImage"
        class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-3"
        @click.self="closeModal"
      >
        <div class="relative w-full h-full flex items-center justify-center">
          <img
            :src="modalImage"
            alt="Full Image"
            class="max-w-full max-h-full object-contain rounded-lg"
          />
          <button
            @click="closeModal"
            class="absolute top-4 right-4 bg-primary-600 text-white rounded-full p-2 hover:bg-primary-700 transition text-lg"
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
