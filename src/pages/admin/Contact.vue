<template>
  <AdminLayout>
    <div class="space-y-4 md:space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-xl md:text-2xl font-semibold text-gray-900 tracking-tight">Contact Information</h1>
        <p class="text-xs md:text-sm text-gray-500 mt-1">Manage contact details and social media links</p>
      </div>

      <!-- Contact Information Card -->
      <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div class="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 class="text-base md:text-lg font-semibold text-gray-900">Contact Information</h2>
            <p class="text-xs text-gray-500 mt-0.5">Preview of how contact information appears on the public page</p>
          </div>
          <button
            @click="showModal = true"
            class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Pencil class="h-4 w-4 text-gray-500" />
          </button>
        </div>
        <div class="p-4 md:p-6">
          <div v-if="loadingData" class="space-y-4">
            <div class="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
            <div class="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
            <div class="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div v-else class="space-y-6">
            <!-- Email -->
            <div class="flex items-start gap-4">
              <div class="bg-primary-100 rounded-lg p-3 shrink-0">
                <Mail class="w-6 h-6 text-primary-600" />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-gray-900 mb-1">Email</h3>
                <p v-if="form.email" class="text-primary-600 break-words">{{ form.email }}</p>
                <p v-else class="text-gray-400 italic text-sm">No email set</p>
              </div>
            </div>

            <!-- Phone -->
            <div class="flex items-start gap-4">
              <div class="bg-primary-100 rounded-lg p-3 shrink-0">
                <Phone class="w-6 h-6 text-primary-600" />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-gray-900 mb-1">Phone</h3>
                <p v-if="form.phone" class="text-primary-600 break-words">{{ form.phone }}</p>
                <p v-else class="text-gray-400 italic text-sm">No phone set</p>
              </div>
            </div>

            <!-- Address -->
            <div class="flex items-start gap-4">
              <div class="bg-primary-100 rounded-lg p-3 shrink-0">
                <MapPin class="w-6 h-6 text-primary-600" />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-gray-900 mb-1">Address</h3>
                <p v-if="form.address" class="text-gray-600 leading-relaxed break-words">{{ form.address }}</p>
                <p v-else class="text-gray-400 italic text-sm">No address set</p>
              </div>
            </div>

            <!-- Social Media -->
            <div class="pt-4 border-t border-gray-200">
              <h3 class="font-semibold text-gray-900 mb-4">Follow Us</h3>
              <div class="flex gap-4">
                <a
                  v-if="form.facebook"
                  :href="form.facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="bg-primary-100 hover:bg-primary-200 rounded-lg p-3 transition-colors"
                >
                  <Facebook class="w-6 h-6 text-primary-600" />
                </a>
                <a
                  v-if="form.youtube"
                  :href="form.youtube"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="bg-primary-100 hover:bg-primary-200 rounded-lg p-3 transition-colors"
                >
                  <Youtube class="w-6 h-6 text-primary-600" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <Teleport to="body">
      <div
        v-if="showModal"
        class="fixed inset-0 z-60 flex items-center justify-center p-4"
        @click.self="showModal = false"
        @keydown.esc="showModal = false"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        
        <!-- Modal Content -->
        <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
            <h2 class="text-lg font-semibold text-gray-900">Edit Contact Information</h2>
            <button
              @click="showModal = false"
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X class="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <!-- Modal Body (Two Columns) -->
          <div class="flex-1 overflow-hidden flex flex-col md:flex-row">
            <!-- Preview Column - Hidden on mobile -->
            <div class="hidden md:block w-1/2 border-r border-gray-200 overflow-y-auto p-6 bg-gray-50">
              <p class="text-sm font-semibold text-gray-700 mb-4">Preview</p>
              <div class="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
                <!-- Email -->
                <div class="flex items-start gap-4">
                  <div class="bg-primary-100 rounded-lg p-3 shrink-0">
                    <Mail class="w-6 h-6 text-primary-600" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-gray-900 mb-1">Email</h3>
                    <p v-if="tempForm.email" class="text-primary-600 break-words">{{ tempForm.email }}</p>
                    <p v-else class="text-gray-400 italic text-sm">No email set</p>
                  </div>
                </div>

                <!-- Phone -->
                <div class="flex items-start gap-4">
                  <div class="bg-primary-100 rounded-lg p-3 shrink-0">
                    <Phone class="w-6 h-6 text-primary-600" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-gray-900 mb-1">Phone</h3>
                    <p v-if="tempForm.phone" class="text-primary-600 break-words">{{ tempForm.phone }}</p>
                    <p v-else class="text-gray-400 italic text-sm">No phone set</p>
                  </div>
                </div>

                <!-- Address -->
                <div class="flex items-start gap-4">
                  <div class="bg-primary-100 rounded-lg p-3 shrink-0">
                    <MapPin class="w-6 h-6 text-primary-600" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-gray-900 mb-1">Address</h3>
                    <p v-if="tempForm.address" class="text-gray-600 leading-relaxed break-words">{{ tempForm.address }}</p>
                    <p v-else class="text-gray-400 italic text-sm">No address set</p>
                  </div>
                </div>

                <!-- Social Media -->
                <div class="pt-4 border-t border-gray-200">
                  <h3 class="font-semibold text-gray-900 mb-4">Follow Us</h3>
                  <div class="flex gap-4">
                    <a
                      v-if="tempForm.facebook"
                      :href="tempForm.facebook"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="bg-primary-100 hover:bg-primary-200 rounded-lg p-3 transition-colors"
                    >
                      <Facebook class="w-6 h-6 text-primary-600" />
                    </a>
                    <a
                      v-if="tempForm.youtube"
                      :href="tempForm.youtube"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="bg-primary-100 hover:bg-primary-200 rounded-lg p-3 transition-colors"
                    >
                      <Youtube class="w-6 h-6 text-primary-600" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Editor Column -->
            <div class="w-full md:w-1/2 overflow-y-auto p-6 space-y-4">
              <!-- Preview Button - Mobile Only -->
              <button
                @click="showPreviewModal = true"
                type="button"
                class="md:hidden w-full px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 transition-colors flex items-center justify-center gap-2 mb-4"
              >
                <Eye class="h-4 w-4" />
                Preview
              </button>
              <form @submit.prevent="saveContact" class="space-y-4">
                <!-- Email -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    v-model="tempForm.email"
                    type="email"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                    placeholder="contact@example.com"
                  />
                </div>

                <!-- Phone -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    v-model="tempForm.phone"
                    type="tel"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                    placeholder="+63 123 456 7890"
                  />
                </div>

                <!-- Address -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    v-model="tempForm.address"
                    rows="4"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm resize-none"
                    placeholder="Enter full address"
                  ></textarea>
                </div>

                <!-- Facebook -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Facebook URL
                  </label>
                  <input
                    v-model="tempForm.facebook"
                    type="url"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>

                <!-- YouTube -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    YouTube URL
                  </label>
                  <input
                    v-model="tempForm.youtube"
                    type="url"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                    placeholder="https://youtube.com/@yourchannel"
                  />
                </div>
              </form>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 shrink-0">
            <button
              @click="showModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="saveContact"
              :disabled="loading"
              class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ loading ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Preview Modal - Mobile Only -->
    <Teleport to="body">
      <div
        v-if="showPreviewModal"
        @click.self="showPreviewModal = false"
        @keydown.esc="showPreviewModal = false"
        class="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4"
        tabindex="-1"
      >
        <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
            <h2 class="text-lg font-semibold text-gray-900">Preview</h2>
            <button
              @click="showPreviewModal = false"
              class="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
            >
              <X class="h-5 w-5" />
            </button>
          </div>

          <!-- Preview Content -->
          <div class="flex-1 overflow-y-auto p-6 bg-gray-50">
            <div class="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
              <!-- Email -->
              <div class="flex items-start gap-4">
                <div class="bg-primary-100 rounded-lg p-3 shrink-0">
                  <Mail class="w-6 h-6 text-primary-600" />
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-gray-900 mb-1">Email</h3>
                  <p v-if="tempForm.email" class="text-primary-600 break-words">{{ tempForm.email }}</p>
                  <p v-else class="text-gray-400 italic text-sm">No email set</p>
                </div>
              </div>

              <!-- Phone -->
              <div class="flex items-start gap-4">
                <div class="bg-primary-100 rounded-lg p-3 shrink-0">
                  <Phone class="w-6 h-6 text-primary-600" />
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-gray-900 mb-1">Phone</h3>
                  <p v-if="tempForm.phone" class="text-primary-600 break-words">{{ tempForm.phone }}</p>
                  <p v-else class="text-gray-400 italic text-sm">No phone set</p>
                </div>
              </div>

              <!-- Address -->
              <div class="flex items-start gap-4">
                <div class="bg-primary-100 rounded-lg p-3 shrink-0">
                  <MapPin class="w-6 h-6 text-primary-600" />
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-gray-900 mb-1">Address</h3>
                  <p v-if="tempForm.address" class="text-gray-600 leading-relaxed break-words">{{ tempForm.address }}</p>
                  <p v-else class="text-gray-400 italic text-sm">No address set</p>
                </div>
              </div>

              <!-- Social Media -->
              <div class="pt-4 border-t border-gray-200">
                <h3 class="font-semibold text-gray-900 mb-4">Follow Us</h3>
                <div class="flex gap-4">
                  <a
                    v-if="tempForm.facebook"
                    :href="tempForm.facebook"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="bg-primary-100 hover:bg-primary-200 rounded-lg p-3 transition-colors"
                  >
                    <Facebook class="w-6 h-6 text-primary-600" />
                  </a>
                  <a
                    v-if="tempForm.youtube"
                    :href="tempForm.youtube"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="bg-primary-100 hover:bg-primary-200 rounded-lg p-3 transition-colors"
                  >
                    <Youtube class="w-6 h-6 text-primary-600" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-200 flex justify-end shrink-0">
            <button
              @click="showPreviewModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, Teleport, watch } from 'vue'
import AdminLayout from '../../layouts/AdminLayout.vue'
import { contactService } from '../../firebase/firestore'
import { useToast } from '../../composables/useToast'
import { useBodyScrollLock } from '../../composables/useBodyScrollLock'
import { Pencil, X, Mail, Phone, MapPin, Facebook, Youtube, Eye } from 'lucide-vue-next'

const { success: showSuccess, error: showError } = useToast()
const { useLock } = useBodyScrollLock()

const loading = ref(false)
const loadingData = ref(true)
const showModal = ref(false)
const showPreviewModal = ref(false)

// Lock body scroll when modal is open
useLock(showModal)
useLock(showPreviewModal)

const form = ref({
  email: '',
  phone: '',
  address: '',
  facebook: '',
  youtube: ''
})

const tempForm = ref({
  email: '',
  phone: '',
  address: '',
  facebook: '',
  youtube: ''
})

// Watch for modal opening to set tempForm
watch(showModal, (isOpen) => {
  if (isOpen) {
    tempForm.value = {
      email: form.value.email || '',
      phone: form.value.phone || '',
      address: form.value.address || '',
      facebook: form.value.facebook || '',
      youtube: form.value.youtube || ''
    }
  }
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

async function saveContact() {
  loading.value = true

  try {
    form.value = { ...tempForm.value }
    await contactService.updateContact(form.value)
    showSuccess('Contact information updated successfully!')
    showModal.value = false
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
