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
        <Skeleton
          v-if="loading"
          v-for="n in 6"
          :key="n"
          type="card"
          variant="default"
          image-aspect="square"
          :description-lines="2"
        />

        <!-- Empty State -->
        <p v-if="!loading && photos.length === 0" class="text-center text-gray-400 col-span-full">
          No photos available.
        </p>

        <!-- Photo Cards -->
        <Card
          v-else
          v-for="photo in photos"
          :key="photo.id"
          variant="light"
          :image="photo.url"
          :image-alt="photo.title || 'Photo'"
          image-aspect="square"
          :image-hover="true"
          :title="photo.title"
          :description="photo.description"
          description-clamp="2"
          clickable
          @click="openModal(photo.url)"
        />

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
import Card from "../components/Card.vue";
import Skeleton from "../components/Skeleton.vue";
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