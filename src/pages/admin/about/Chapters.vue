<template>
  <AdminLayout>
    <div class="space-y-4">
      <!-- Header -->
      <div>
        <h1 class="text-xl font-semibold text-gray-900 tracking-tight">Chapters</h1>
        <p class="text-xs text-gray-500 mt-1">Manage local chapters</p>
      </div>

      <!-- Two Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Left Column: Add/Edit Form -->
        <div class="bg-white rounded-lg border border-gray-200/80 p-4">
        <h2 class="text-sm font-semibold text-gray-900 mb-3">
          {{ editingChapter ? 'Edit Chapter' : 'Add New Chapter' }}
        </h2>
        <form @submit.prevent="handleSubmit" class="space-y-3">
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">
              Chapter Name *
            </label>
            <input
              v-model="form.chapterName"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
            />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">
                Region *
              </label>
              <input
                v-model="form.region"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">
                Province *
              </label>
              <input
                v-model="form.province"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
              />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">
                Municipality *
              </label>
              <input
                v-model="form.municipality"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
              />
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1.5">
              Members Count *
            </label>
            <input
              v-model.number="form.membersCount"
              type="number"
              min="0"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
            />
          </div>
          <div class="flex space-x-2">
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 transition-colors text-xs font-semibold flex items-center space-x-2"
            >
              <svg v-if="loading" class="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ loading ? 'Saving...' : editingChapter ? 'Update' : 'Add' }} Chapter</span>
            </button>
            <button
              v-if="editingChapter"
              type="button"
              @click="cancelEdit"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
        </div>

        <!-- Right Column: Chapters List -->
        <div class="bg-white rounded-lg border border-gray-200/80 flex flex-col">
        <div class="px-4 py-3 border-b border-gray-200/80">
          <h2 class="text-sm font-semibold text-gray-900">Current Chapters</h2>
        </div>
        <div class="p-4 flex-1 overflow-y-auto max-h-[600px]">
          <div v-if="loadingData" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Chapter Name</th>
                  <th class="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Region</th>
                  <th class="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Province</th>
                  <th class="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Municipality</th>
                  <th class="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Members</th>
                  <th class="px-3 py-2 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="i in 3" :key="i" class="animate-pulse">
                  <td class="px-3 py-2"><div class="h-4 bg-gray-200 rounded w-24"></div></td>
                  <td class="px-3 py-2"><div class="h-4 bg-gray-200 rounded w-20"></div></td>
                  <td class="px-3 py-2"><div class="h-4 bg-gray-200 rounded w-20"></div></td>
                  <td class="px-3 py-2"><div class="h-4 bg-gray-200 rounded w-24"></div></td>
                  <td class="px-3 py-2"><div class="h-4 bg-gray-200 rounded w-12"></div></td>
                  <td class="px-3 py-2 text-right"><div class="h-4 bg-gray-200 rounded w-16 ml-auto"></div></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else-if="chapters.length === 0" class="text-gray-500 text-center py-6 text-xs">
            No chapters added yet
          </div>
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Chapter Name
                  </th>
                  <th class="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Region
                  </th>
                  <th class="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Province
                  </th>
                  <th class="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Municipality
                  </th>
                  <th class="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Members
                  </th>
                  <th class="px-3 py-2 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="chapter in chapters" :key="chapter.id" class="hover:bg-gray-50 transition-colors">
                  <td class="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">
                    {{ chapter.chapterName }}
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap text-xs text-gray-600">
                    {{ chapter.region }}
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap text-xs text-gray-600">
                    {{ chapter.province }}
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap text-xs text-gray-600">
                    {{ chapter.municipality }}
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap text-xs text-gray-600">
                    {{ chapter.membersCount }}
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap text-right text-xs font-medium">
                    <button
                      @click="handleEdit(chapter)"
                      class="text-primary-600 hover:text-primary-700 mr-3 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      @click="handleDelete(chapter.id)"
                      class="text-red-600 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
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
import { useConfirm } from '../../../composables/useConfirm'

const { success: showSuccess, error: showError } = useToast()
const { confirm } = useConfirm()

const loading = ref(false)
const loadingData = ref(true)
const chapters = ref([])
const editingChapter = ref(null)

const form = ref({
  chapterName: '',
  region: '',
  province: '',
  municipality: '',
  membersCount: 0
})

async function loadChapters() {
  loadingData.value = true
  try {
    chapters.value = await aboutUsService.getChapters()
  } catch (error) {
    console.error('Error loading chapters:', error)
    showError('Failed to load chapters')
  } finally {
    loadingData.value = false
  }
}

function handleEdit(chapter) {
  editingChapter.value = chapter
  form.value = {
    chapterName: chapter.chapterName,
    region: chapter.region,
    province: chapter.province,
    municipality: chapter.municipality,
    membersCount: chapter.membersCount
  }
}

function cancelEdit() {
  editingChapter.value = null
  form.value = {
    chapterName: '',
    region: '',
    province: '',
    municipality: '',
    membersCount: 0
  }
}

async function handleSubmit() {
  loading.value = true

  try {
    if (editingChapter.value) {
      await aboutUsService.updateChapter(editingChapter.value.id, form.value)
      showSuccess('Chapter updated successfully!')
    } else {
      await aboutUsService.addChapter(form.value)
      showSuccess('Chapter added successfully!')
    }
    cancelEdit()
    await loadChapters()
  } catch (error) {
    console.error('Error saving chapter:', error)
    showError('Failed to save chapter')
  } finally {
    loading.value = false
  }
}

async function handleDelete(id) {
  const confirmed = await confirm('Are you sure you want to delete this chapter?', {
    title: 'Delete Chapter',
    confirmText: 'Delete'
  })
  
  if (!confirmed) return

  try {
    await aboutUsService.deleteChapter(id)
    showSuccess('Chapter deleted successfully!')
    await loadChapters()
  } catch (error) {
    console.error('Error deleting chapter:', error)
    showError('Failed to delete chapter')
  }
}

onMounted(() => {
  loadChapters()
})
</script>


