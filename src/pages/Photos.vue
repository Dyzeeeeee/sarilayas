<template>
  <PublicLayout>
    <div class="space-y-6">
      <!-- HEADER -->
      <div>
        <h1 class="text-3xl sm:text-4xl font-bold text-gray-900">Photo Gallery</h1>
        <p class="text-gray-600">Browse through our photo collection.</p>
      </div>

      <!-- GALLERY -->
      <div>
        <!-- Loading state -->
        <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="n in 6"
            :key="n"
            class="bg-white rounded-xl border border-gray-200 p-5 shadow-sm animate-pulse"
          >
            <div class="aspect-square bg-gray-200 rounded-lg mb-4"></div>
            <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div class="h-3 bg-gray-200 rounded w-full mb-1"></div>
          </div>
        </div>

        <!-- Photos -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="photo in photos"
            :key="photo.id"
            class="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition"
          >
            <!-- IMAGE -->
            <div
              class="w-full aspect-square mb-3 cursor-pointer overflow-hidden rounded-lg"
              @click="openModal(photo.url)"
            >
              <img
                :src="photo.url"
                :alt="photo.title || 'Photo'"
                class="w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-300"
              />
            </div>

            <!-- TITLE -->
            <p v-if="photo.title" class="text-sm font-semibold text-gray-900 mb-1 truncate">
              {{ photo.title }}
            </p>

            <!-- DESCRIPTION -->
            <p v-if="photo.description" class="text-xs text-gray-600 line-clamp-2">
              {{ photo.description }}
            </p>
          </div>
        </div>

        <!-- Empty state -->
        <p v-if="!loading && photos.length === 0" class="text-center text-gray-500 py-10 text-sm">
          No photos available.
        </p>
      </div>

      <!-- IMAGE MODAL -->
      <div
        v-if="modalImage"
        class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
        @click.self="closeModal"
      >
        <div class="relative max-w-[90%] max-h-[90%]">
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
