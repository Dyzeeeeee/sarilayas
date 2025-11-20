<template>
  <PublicLayout>
    <div class="space-y-4 max-w-6xl mx-auto px-2 sm:px-4">

      <!-- HEADER -->
      <div class="text-center sm:text-left mb-2">
        <h1 class="text-2xl sm:text-3xl font-extrabold text-Black">Photo Gallery</h1>
        <p class="text-gray-600 mt-1 text-sm sm:text-base">
          Browse through our photo collection.
        </p>
      </div>

      <!-- PHOTO GRID -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">

        <!-- Loading Skeleton -->
        <div
          v-if="loading"
          v-for="n in 6"
          :key="n"
          class="bg-gray-100 rounded-lg p-3 animate-pulse shadow-md"
        >
          <div class="w-full aspect-square bg-gray-200 rounded mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
          <div class="h-2 bg-gray-200 rounded w-1/2"></div>
        </div>

        <!-- Empty State -->
        <p v-if="!loading && photos.length === 0" class="text-center text-gray-400 col-span-full">
          No photos available.
        </p>

        <!-- Photo Cards -->
        <div
          v-else
          v-for="photo in photos"
          :key="photo.id"
          class="bg-gray-100 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 cursor-pointer flex flex-col"
          @click="openModal(photo.url)"
        >
          <!-- IMAGE -->
          <div class="w-full aspect-square overflow-hidden">
            <img
              :src="photo.url"
              :alt="photo.title || 'Photo'"
              class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          <!-- CONTENT -->
          <div class="p-3 sm:p-4 flex-1 flex flex-col text-primary-700">
            <p v-if="photo.title" class="text-base sm:text-lg font-semibold mb-1 truncate">
              {{ photo.title }}
            </p>
            <p v-if="photo.description" class="text-primary-700/80 text-sm line-clamp-2">
              {{ photo.description }}
            </p>
          </div>
        </div>

      </div>

      <!-- IMAGE MODAL FULLSCREEN -->
      <div
        v-if="modalImage"
        class="fixed inset-0 backdrop-blur-sm bg-black/70 flex items-center justify-center z-50 p-3"
        @click.self="closeModal"
      >
        <div class="relative w-full max-w-3xl max-h-[90%]">
          <img
            :src="modalImage"
            alt="Full Image"
            class="w-full h-full object-contain rounded-lg"
          />
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

const photos = ref([]);
const loading = ref(true);
const modalImage = ref(null);

function openModal(url) {
  modalImage.value = url;
}

function closeModal() {
  modalImage.value = null;
}

onMounted(async () => {
  try {
    photos.value = await mediaService.getPhotos();
  } catch (err) {
    console.error("Error fetching photos:", err);
  } finally {
    loading.value = false;
  }
});
</script>