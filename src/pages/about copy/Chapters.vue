<template>
  <PublicLayout>
    <div class="flex flex-col h-full">
      <!-- HEADER -->
      <div class="shrink-0">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Chapters</h1>
        <p class="text-gray-600 text-sm">Explore our local chapters across the region.</p>
      </div>

      <!-- CHAPTERS LIST -->
      <div class="flex-1 overflow-y-auto mt-4">
        <!-- Loading skeleton -->
        <Skeleton
          v-if="loading"
          v-for="n in 6"
          :key="n"
          type="list"
          :lines="1"
          :show-avatar="false"
          list-item-spacing="py-2"
          custom-class="bg-white rounded-lg border border-gray-200 p-2 shadow-sm"
        />

        <!-- Chapters list -->
        <div v-else class="space-y-2 pb-4">
          <div
            v-for="chapter in chapters"
            :key="chapter.id"
            class="bg-white rounded-lg border border-gray-200 p-2 shadow-sm hover:shadow-md transition"
          >
            <h3 class="text-base font-semibold text-gray-900 truncate">{{ chapter.chapterName }}</h3>
            <p class="text-gray-500 text-xs mt-0.5 truncate">
              {{ chapter.municipality }}, {{ chapter.province }}, {{ chapter.region }}
            </p>
            <p class="text-gray-600 text-xs mt-1">
              Members: <span class="font-medium">{{ chapter.membersCount }}</span>
            </p>
          </div>
        </div>

        <!-- Empty state -->
        <p v-if="!loading && chapters.length === 0" class="text-center text-gray-500 py-4 text-sm">
          No chapters available at the moment.
        </p>
      </div>
    </div>
  </PublicLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PublicLayout from '../../layouts/PublicLayout.vue'
import Skeleton from '../../components/Skeleton.vue'
import { aboutUsService } from '../../firebase/firestore'

const chapters = ref([])
const loading = ref(true)

async function loadChapters() {
  loading.value = true
  try {
    chapters.value = await aboutUsService.getChapters()
  } catch (error) {
    console.error('Error loading chapters:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadChapters()
})
</script>
