<template>
  <AdminLayout>
    <div class="space-y-4">
      <!-- Header -->
      <div>
        <h1 class="text-xl font-semibold text-gray-900 tracking-tight">Contact Information</h1>
        <p class="text-xs text-gray-500 mt-1">Manage contact details and social media links</p>
      </div>

      <div v-if="loadingData" class="bg-white rounded-lg border border-gray-200/80 p-4 space-y-4">
        <div class="space-y-3 animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-20"></div>
          <div class="h-10 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded w-24"></div>
          <div class="h-10 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded w-20"></div>
          <div class="h-10 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded w-16"></div>
          <div class="h-24 bg-gray-200 rounded"></div>
          <div class="h-4 bg-gray-200 rounded w-14"></div>
          <div class="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
      <form v-else @submit.prevent="handleSubmit" class="bg-white rounded-lg border border-gray-200/80 p-4 space-y-4">
        <!-- Email -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5">
            Email *
          </label>
          <input
            v-model="form.email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
            placeholder="contact@example.com"
          />
        </div>

        <!-- Phone Number -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5">
            Phone Number
          </label>
          <input
            v-model="form.phone"
            type="tel"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
            placeholder="+63 123 456 7890"
          />
        </div>

        <!-- Address -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5">
            Address
          </label>
          <textarea
            v-model="form.address"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
            placeholder="Enter full address"
          ></textarea>
        </div>

        <!-- Facebook -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5">
            Facebook URL
          </label>
          <input
            v-model="form.facebook"
            type="url"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
            placeholder="https://facebook.com/yourpage"
          />
        </div>

        <!-- YouTube -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5">
            YouTube URL
          </label>
          <input
            v-model="form.youtube"
            type="url"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
            placeholder="https://youtube.com/@yourchannel"
          />
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3 pt-2">
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
import AdminLayout from '../../layouts/AdminLayout.vue'
import { contactService } from '../../firebase/firestore'
import { useToast } from '../../composables/useToast'

const { success: showSuccess, error: showError } = useToast()

const loading = ref(false)
const loadingData = ref(true)

const form = ref({
  email: '',
  phone: '',
  address: '',
  facebook: '',
  youtube: ''
})

async function loadData() {
  loadingData.value = true
  try {
    const data = await contactService.getContact()
    if (data) {
      form.value = {
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        facebook: data.facebook || '',
        youtube: data.youtube || ''
      }
    }
  } catch (error) {
    console.error('Error loading contact data:', error)
    showError('Failed to load contact data')
  } finally {
    loadingData.value = false
  }
}

async function handleSubmit() {
  loading.value = true

  try {
    await contactService.updateContact(form.value)
    showSuccess('Contact information saved successfully!')
  } catch (error) {
    console.error('Error saving contact data:', error)
    showError('Failed to save contact information')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

