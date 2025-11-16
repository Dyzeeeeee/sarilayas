<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <!-- Header -->
    <header class="bg-gray-800 text-white shadow-lg sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center space-x-4">
            <router-link to="/admin" class="text-xl font-bold">
              Admin Panel
            </router-link>
            <span class="text-xs bg-red-500 px-2 py-1 rounded">ADMIN</span>
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex space-x-4">
            <router-link
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              active-class="text-white bg-gray-700"
            >
              {{ item.label }}
            </router-link>
          </nav>

          <!-- User Actions -->
          <div class="hidden md:flex items-center space-x-4">
            <button
              @click="handleLogout"
              class="text-gray-300 hover:text-white text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>

          <!-- Mobile Menu Button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            aria-label="Toggle menu"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                v-if="!mobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Mobile Navigation -->
        <div
          v-show="mobileMenuOpen"
          class="md:hidden border-t border-gray-700 py-4"
        >
          <div class="flex flex-col space-y-2">
            <router-link
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              @click="mobileMenuOpen = false"
              class="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium transition-colors"
              active-class="text-white bg-gray-700"
            >
              {{ item.label }}
            </router-link>
            <button
              @click="handleLogout"
              class="text-left text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <slot></slot>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 text-gray-300 border-t border-gray-700 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col sm:flex-row justify-between items-center">
          <p class="text-sm">
            &copy; {{ currentYear }} Sarilaya Admin. All rights reserved.
          </p>
          <p class="text-xs mt-2 sm:mt-0 text-gray-500">
            Admin Dashboard
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const mobileMenuOpen = ref(false)

const currentYear = computed(() => new Date().getFullYear())

// Navigation items for admin users
const navItems = [
  { path: '/admin', label: 'Dashboard' },
  { path: '/admin/users', label: 'Users' },
  { path: '/admin/settings', label: 'Settings' },
]

function handleLogout() {
  // Add your logout logic here
  console.log('Logging out...')
  // router.push('/login')
}

// Expose navItems so parent can override if needed
defineExpose({
  navItems,
})
</script>

