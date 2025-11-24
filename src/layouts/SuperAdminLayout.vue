<template>
  <div class="min-h-screen flex bg-gray-50 text-gray-900">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0',
        sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0 lg:shadow-none'
      ]"
    >
      <div class="h-16 px-5 border-b border-gray-200 flex items-center justify-between">
        <div>
          <p class="text-sm uppercase tracking-wide text-gray-400 font-semibold">Superadmin</p>
          <p class="text-lg font-bold text-gray-900 truncate">{{ siteName }}</p>
        </div>
        <button
          @click="sidebarOpen = false"
          class="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav class="p-4 space-y-1">
        <router-link
          v-for="item in navigation"
          :key="item.to"
          :to="item.to"
          @click="sidebarOpen = false"
          class="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors"
          :class="route.path === item.to ? 'bg-primary-50 text-primary-700 border border-primary-100 shadow-sm' : 'text-gray-600 hover:bg-gray-100'"
        >
          <component :is="item.icon" class="h-5 w-5" />
          {{ item.label }}
        </router-link>
      </nav>

      <div class="mt-auto p-4 border-t border-gray-100">
        <div class="mb-4">
          <p class="text-xs uppercase text-gray-400 tracking-wide">Signed in as</p>
          <p class="text-sm font-semibold text-gray-900 truncate">{{ userName }}</p>
          <p class="text-xs text-gray-500 truncate">{{ userEmail }}</p>
        </div>
        <button
          @click="handleLogout"
          class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <LogOut class="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>

    <!-- Overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
      @click="sidebarOpen = false"
    ></div>

    <!-- Main -->
    <div class="flex-1 flex flex-col lg:ml-72">
      <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-20">
        <div class="flex items-center gap-3">
          <button
            @click="sidebarOpen = true"
            class="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div>
            <p class="text-xs uppercase text-gray-400 tracking-wide">Superadmin Console</p>
            <p class="text-lg font-semibold text-gray-900">{{ currentPageLabel }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="hidden sm:flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-100">
            {{ siteName }}
          </span>
          <div class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold uppercase">
            {{ userInitial }}
          </div>
        </div>
      </header>

      <main class="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50">
        <slot></slot>
      </main>

      <footer class="bg-white border-t border-gray-200 px-4 py-3 text-center text-xs text-gray-500">
        &copy; {{ currentYear }} {{ siteName }} Superadmin Console
      </footer>
    </div>

    <ToastContainer />
    <ConfirmModal
      :is-open="confirmState.isOpen"
      :title="confirmState.title"
      :message="confirmState.message"
      :confirm-text="confirmState.confirmText"
      :cancel-text="confirmState.cancelText"
      @confirm="handleConfirm"
      @cancel="handleCancel"
      @update:is-open="(val) => confirmState.isOpen = val"
    />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Settings, Users, LogOut, Sparkles } from 'lucide-vue-next'
import ToastContainer from '../components/ToastContainer.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import { useAuth } from '../composables/useAuth'
import { useConfirm } from '../composables/useConfirm'
import { useBranding } from '../composables/useBranding'

const route = useRoute()
const sidebarOpen = ref(false)

const { branding, initBranding } = useBranding()
initBranding()

const { user, userData, logout, init } = useAuth()
init()

const { confirmState, handleConfirm, handleCancel, confirm } = useConfirm()

const navigation = [
  { to: '/superadmin/settings', label: 'Brand & Settings', icon: Settings },
  { to: '/superadmin/events', label: 'Events & Greetings', icon: Sparkles },
  { to: '/superadmin/users', label: 'User Directory', icon: Users },
]

const siteName = computed(() => branding.value.siteName || 'Sarilaya')

const currentPageLabel = computed(() => {
  const active = navigation.find(item => item.to === route.path)
  return active ? active.label : 'Overview'
})

const userName = computed(() => userData.value?.name || user.value?.displayName || user.value?.email || 'Superadmin')
const userEmail = computed(() => user.value?.email || 'No email')
const userInitial = computed(() => userName.value?.charAt(0)?.toUpperCase() || 'S')
const currentYear = new Date().getFullYear()

async function handleLogout() {
  const confirmed = await confirm('Are you sure you want to logout?', {
    title: 'Logout',
    confirmText: 'Logout',
    cancelText: 'Cancel',
  })

  if (confirmed) {
    await logout()
  }
}

watch(() => route.path, () => {
  sidebarOpen.value = false
})
</script>


