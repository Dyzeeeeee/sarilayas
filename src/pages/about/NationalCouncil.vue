<template>
  <PublicLayout>
    <div class="space-y-4 px-2 sm:px-4">

      <!-- HEADER -->
      <div class="text-center sm:text-left">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">
          National Council
        </h1>
        <p class="text-gray-600 text-sm sm:text-base mt-1">
          Our national council members and their roles.
        </p>
      </div>

      <!-- MEMBERS LIST -->
      <div class="divide-y divide-gray-200">

        <!-- Loading skeleton -->
        <div v-if="loading" class="space-y-2 mt-2">
          <div
            v-for="n in 6"
            :key="n"
            class="flex items-center space-x-3 py-2 animate-pulse"
          >
            <div class="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0"></div>
            <div class="flex-1 space-y-1">
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>

        <!-- Council Members -->
        <div v-else class="mt-2">
          <div
            v-for="member in members"
            :key="member.id"
            class="flex items-center space-x-3 py-3 sm:py-2"
          >
            <!-- PHOTO -->
            <div v-if="member.photo" class="w-12 h-12 flex-shrink-0">
              <img
                :src="member.photo"
                :alt="member.name"
                class="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
              />
            </div>
            <div v-else class="w-12 h-12 flex-shrink-0 rounded-full bg-primary-100 flex items-center justify-center ring-2 ring-gray-100">
              <span class="text-primary-600 text-sm font-semibold">{{ member.name.charAt(0) }}</span>
            </div>

            <!-- INFO -->
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-900 text-sm sm:text-base truncate">
                {{ member.name }}
              </h3>
              <p class="text-gray-500 text-xs sm:text-sm truncate mt-0.5">{{ member.role }}</p>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <p v-if="!loading && members.length === 0" class="text-center text-gray-500 py-4 text-sm sm:text-base">
          No council members available.
        </p>

      </div>
    </div>
  </PublicLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PublicLayout from '../../layouts/PublicLayout.vue'
import { aboutUsService } from '../../firebase/firestore'

const members = ref([])
const loading = ref(true)

async function loadMembers() {
  loading.value = true
  try {
    members.value = await aboutUsService.getNationalCouncil()
  } catch (error) {
    console.error('Error loading council members:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadMembers()
})
</script>
