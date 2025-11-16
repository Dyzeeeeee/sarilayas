<template>
  <AdminLayout>
    <div class="space-y-4">
      <!-- Header -->
      <div>
        <h1 class="text-xl font-semibold text-gray-900 tracking-tight">Values</h1>
        <p class="text-xs text-gray-500 mt-1">Manage organization values</p>
      </div>

      <!-- Two Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Left Column: Add New Value -->
        <div class="bg-white rounded-lg border border-gray-200/80 p-4">
        <h2 class="text-sm font-semibold text-gray-900 mb-3">Add New Value</h2>
        <form @submit.prevent="handleAddValue" class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">
              Value Name
            </label>
            <input
              v-model="newValue.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
              placeholder="e.g., Integrity"
            />
          </div>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 transition-colors text-xs font-semibold flex items-center space-x-2"
          >
            <svg v-if="loading" class="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Add Value</span>
          </button>
        </form>
        </div>

        <!-- Right Column: Values List -->
        <div class="bg-white rounded-lg border border-gray-200/80 flex flex-col">
        <div class="px-4 py-3 border-b border-gray-200/80">
          <h2 class="text-sm font-semibold text-gray-900">Current Values</h2>
        </div>
        <div class="p-4 flex-1 overflow-y-auto max-h-[600px]">
          <div v-if="loadingData" class="space-y-2">
            <div v-for="i in 3" :key="i" class="border border-gray-200 rounded-lg p-3 animate-pulse">
              <div class="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          <div v-else-if="values.length === 0" class="text-gray-500 text-center py-6 text-xs">
            No values added yet
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="(value, index) in values"
              :key="index"
              class="border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors"
            >
              <div class="flex justify-between items-center">
                <div class="flex-1">
                  <h3 class="font-semibold text-gray-900 text-xs">{{ value.name || value }}</h3>
                </div>
                <button
                  @click="handleDeleteValue(index)"
                  class="ml-3 px-2.5 py-1 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
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
const values = ref([])

const newValue = ref({
  name: ''
})

async function loadData() {
  loadingData.value = true
  try {
    const data = await aboutUsService.getAboutUs()
    if (data && data.values) {
      values.value = [...data.values]
    }
  } catch (error) {
    console.error('Error loading values:', error)
  } finally {
    loadingData.value = false
  }
}

async function saveValues() {
  try {
    const data = await aboutUsService.getAboutUs() || {}
    await aboutUsService.updateAboutUs({
      ...data,
      values: values.value
    })
  } catch (error) {
    console.error('Error saving values:', error)
    throw error
  }
}

async function handleAddValue() {
  if (!newValue.value.name.trim()) return

  loading.value = true
  const valueToAdd = { name: newValue.value.name.trim() }
  
  try {
    values.value.push(valueToAdd)
    await saveValues()
    newValue.value = { name: '' }
    showSuccess('Value added successfully!')
  } catch (error) {
    // Rollback on error
    values.value.pop()
    showError('Failed to add value')
  } finally {
    loading.value = false
  }
}

async function handleDeleteValue(index) {
  loading.value = true
  const deletedValue = values.value[index]
  
  try {
    values.value.splice(index, 1)
    await saveValues()
    showSuccess('Value deleted successfully!')
  } catch (error) {
    // Rollback on error
    values.value.splice(index, 0, deletedValue)
    showError('Failed to delete value')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>


