<template>
  <SuperAdminLayout>
    <div class="space-y-6 md:space-y-8">
      <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">User Directory</h1>
          <p class="text-sm md:text-base text-gray-600">Review every authenticated account and its assigned role.</p>
        </div>
        <div class="flex gap-2">
          <button
            @click="loadUsers"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw class="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      <div class="bg-white border border-gray-200 rounded-2xl shadow-sm">
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-gray-100 p-4">
          <div class="text-sm text-gray-500">
            Showing <span class="font-semibold text-gray-900">{{ filteredUsers.length }}</span> of {{ users.length }} account(s)
          </div>
          <div class="relative w-full md:w-80">
            <input
              v-model="search"
              type="text"
              placeholder="Search name or email"
              class="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition text-sm"
            />
            <svg class="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div v-if="loading" class="p-6 space-y-4">
          <div v-for="n in 4" :key="n" class="animate-pulse flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-gray-200"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 rounded w-1/3"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>

        <div v-else-if="filteredUsers.length === 0" class="p-10 text-center text-gray-500">
          <Users class="w-10 h-10 mx-auto mb-3 text-gray-400" />
          <p class="font-semibold text-gray-900">No users found</p>
          <p class="text-sm text-gray-500">Adjust your search or refresh to try again.</p>
        </div>

        <div v-else class="divide-y divide-gray-100">
          <div
            v-for="user in filteredUsers"
            :key="user.id"
            class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-4 py-4"
          >
            <div class="flex items-center gap-4">
              <div class="h-12 w-12 rounded-full bg-primary-50 text-primary-700 font-semibold text-lg flex items-center justify-center uppercase">
                {{ (user.name || user.email || '?').charAt(0) }}
              </div>
              <div>
                <p class="text-base font-semibold text-gray-900">{{ user.name || 'Unnamed user' }}</p>
                <p class="text-sm text-gray-500">{{ user.email }}</p>
              </div>
            </div>
            <div class="flex flex-col items-start gap-2 text-sm md:text-right md:items-end">
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                :class="user.role === 'superadmin' ? 'bg-rose-100 text-rose-700' : 'bg-primary-50 text-primary-700'"
              >
                {{ user.role || 'admin' }}
              </span>
              <p class="text-xs text-gray-500">
                Created {{ formatDate(user.createdAt) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </SuperAdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Users, RefreshCw } from 'lucide-vue-next'
import SuperAdminLayout from '../../layouts/SuperAdminLayout.vue'
import { userService } from '../../firebase/firestore'
import { useToast } from '../../composables/useToast'

const users = ref([])
const loading = ref(true)
const search = ref('')

const { error: showError } = useToast()

const filteredUsers = computed(() => {
  if (!search.value.trim()) {
    return users.value
  }
  const term = search.value.toLowerCase()
  return users.value.filter((user) => {
    return (
      user.name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.role?.toLowerCase().includes(term)
    )
  })
})

function formatDate(date) {
  if (!date) return 'Unknown'
  let dateObj
  if (date.toDate) {
    dateObj = date.toDate()
  } else if (date instanceof Date) {
    dateObj = date
  } else {
    dateObj = new Date(date)
  }
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

async function loadUsers() {
  loading.value = true
  try {
    users.value = await userService.getUsers()
  } catch (error) {
    console.error('Error loading users:', error)
    showError('Failed to load users')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadUsers()
})
</script>


