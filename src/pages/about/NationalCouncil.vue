<template>
  <PublicLayout>
    <div class="space-y-4">
      <!-- HEADER -->
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">National Council</h1>
        <p class="text-gray-600 text-sm">Our national council members and their roles.</p>
      </div>

      <!-- MEMBERS LIST -->
      <div>
        <!-- Loading skeleton -->
        <div v-if="loading" class="space-y-2">
          <div
            v-for="n in 6"
            :key="n"
            class="bg-white rounded-lg border border-gray-200 p-2 shadow-sm animate-pulse flex items-center space-x-2"
          >
            <div class="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0"></div>
            <div class="flex-1 space-y-1">
              <div class="h-4 bg-gray-200 rounded w-3/4"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>

        <!-- Members cards -->
        <div v-else class="space-y-2">
          <div
            v-for="member in members"
            :key="member.id"
            class="bg-white rounded-lg border border-gray-200 p-2 shadow-sm flex items-center space-x-2 hover:shadow-md transition"
          >
            <!-- PHOTO -->
            <div v-if="member.photo" class="flex-shrink-0 w-12 h-12">
              <img
                :src="member.photo"
                :alt="member.name"
                class="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
              />
            </div>
            <div v-else class="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center ring-2 ring-gray-100">
              <span class="text-primary-600 text-sm font-semibold">{{ member.name.charAt(0) }}</span>
            </div>

            <!-- INFO -->
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-900 text-sm truncate">{{ member.name }}</h3>
              <p class="text-gray-500 text-xs truncate mt-0.5">{{ member.role }}</p>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <p v-if="!loading && members.length === 0" class="text-center text-gray-500 py-4 text-sm">
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
