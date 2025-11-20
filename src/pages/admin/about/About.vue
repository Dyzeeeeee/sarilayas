<template>
  <AdminLayout>
    <div class="space-y-4">
      <!-- Header -->
      <div>
        <h1 class="text-xl font-semibold text-gray-900 tracking-tight">General Info</h1>
        <p class="text-xs text-gray-500 mt-1">Manage description, mission, vision, and statistics</p>
      </div>

      <div v-if="loadingData" class="bg-white rounded-lg border border-gray-200/80 p-4 space-y-4">
        <div class="space-y-3 animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-20"></div>
          <div class="h-24 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded w-16"></div>
          <div class="h-20 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded w-14"></div>
          <div class="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
      <form v-else @submit.prevent="handleSubmit" class="bg-white rounded-lg border border-gray-200/80 p-4 space-y-4">
        <!-- Description -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5">
            Description
          </label>
          <textarea
            v-model="form.description"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
            placeholder="Short explanation of who you are and what you do"
          ></textarea>
        </div>

        <!-- Mission -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5">
            Mission
          </label>
          <textarea
            v-model="form.mission"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
            placeholder="One clear statement of your purpose"
          ></textarea>
        </div>

        <!-- Vision -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5">
            Vision
          </label>
          <textarea
            v-model="form.vision"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
            placeholder="One clear statement of your future goal"
          ></textarea>
        </div>

        <!-- Statistics -->
        <div class="pt-3 border-t border-gray-200">
          <h3 class="text-sm font-semibold text-gray-900 mb-3">Where We Are</h3>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">
                Regions
              </label>
              <input
                v-model.number="form.stats.regions"
                type="number"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">
                Provinces
              </label>
              <input
                v-model.number="form.stats.provinces"
                type="number"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">
                Municipalities
              </label>
              <input
                v-model.number="form.stats.municipalities"
                type="number"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">
                Members
              </label>
              <input
                v-model.number="form.stats.members"
                type="number"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
              />
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-2 pt-3 border-t border-gray-200">
          <button
            type="button"
            @click="loadData"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors text-xs font-medium"
          >
            Reset
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-semibold flex items-center space-x-2"
          >
            <svg v-if="loading" class="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ loading ? 'Saving...' : 'Save Changes' }}</span>
          </button>
        </div>
      </form>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '../../../layouts/AdminLayout.vue'
import { aboutUsService } from '../../../firebase/firestore'
import { useToast } from '../../../composables/useToast'

const { success: showSuccess, error: showError } = useToast()

const loading = ref(false)
const loadingData = ref(true)

const form = ref({
  description: '',
  mission: '',
  vision: '',
  stats: {
    regions: 0,
    provinces: 0,
    municipalities: 0,
    members: 0
  }
})

async function loadData() {
  loadingData.value = true
  try {
    const data = await aboutUsService.getAboutUs()
    if (data) {
      form.value = {
        description: data.description || '',
        mission: data.mission || '',
        vision: data.vision || '',
        stats: {
          regions: data.stats?.regions || 0,
          provinces: data.stats?.provinces || 0,
          municipalities: data.stats?.municipalities || 0,
          members: data.stats?.members || 0
        }
      }
    }
  } catch (error) {
    console.error('Error loading data:', error)
    showError('Failed to load data')
  } finally {
    loadingData.value = false
  }
}

async function handleSubmit() {
  loading.value = true

  try {
    await aboutUsService.updateAboutUs(form.value)
    showSuccess('Changes saved successfully!')
  } catch (error) {
    console.error('Error saving data:', error)
    showError('Failed to save changes')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

