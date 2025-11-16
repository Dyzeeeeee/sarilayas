<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex-shrink-0">
            <router-link to="/" class="text-xl font-bold text-gray-900">
              Sarilaya
            </router-link>
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center space-x-1">
            <!-- About Us Dropdown -->
            <div
              class="relative group"
              @mouseenter="aboutDropdownOpen = true"
              @mouseleave="aboutDropdownOpen = false"
            >
              <button
                class="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors flex items-center"
                :class="{ 'text-blue-600 border-b-2 border-blue-600': isAboutActive }"
              >
                About Us
                <svg
                  class="ml-1 h-4 w-4 transition-transform"
                  :class="{ 'rotate-180': aboutDropdownOpen }"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                v-show="aboutDropdownOpen"
                class="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
              >
                <router-link
                  v-for="subItem in aboutSubItems"
                  :key="subItem.path"
                  :to="subItem.path"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  active-class="bg-blue-50 text-blue-600"
                >
                  {{ subItem.label }}
                </router-link>
              </div>
            </div>

            <!-- Regular Navigation Items -->
            <router-link
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
              active-class="text-blue-600 border-b-2 border-blue-600"
            >
              {{ item.label }}
            </router-link>
          </nav>

          <!-- Mobile Menu Button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
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
          class="md:hidden border-t border-gray-200 py-4"
        >
          <div class="flex flex-col space-y-1">
            <!-- About Us Mobile Dropdown -->
            <div>
              <button
                @click="mobileAboutOpen = !mobileAboutOpen"
                class="w-full text-left text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center justify-between"
                :class="{ 'text-blue-600 bg-blue-50': isAboutActive }"
              >
                <span>About Us</span>
                <svg
                  class="h-5 w-5 transition-transform"
                  :class="{ 'rotate-180': mobileAboutOpen }"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                v-show="mobileAboutOpen"
                class="pl-6 mt-1 space-y-1"
              >
                <router-link
                  v-for="subItem in aboutSubItems"
                  :key="subItem.path"
                  :to="subItem.path"
                  @click="mobileMenuOpen = false; mobileAboutOpen = false"
                  class="block text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  active-class="text-blue-600 bg-blue-50"
                >
                  {{ subItem.label }}
                </router-link>
              </div>
            </div>

            <!-- Regular Navigation Items -->
            <router-link
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              @click="mobileMenuOpen = false"
              class="text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium transition-colors"
              active-class="text-blue-600 bg-blue-50"
            >
              {{ item.label }}
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <slot></slot>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Column 1 -->
          <div class="space-y-4">
            <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              About
            </h3>
            <p class="text-sm text-gray-600">
              Your company description goes here.
            </p>
          </div>

          <!-- Column 2 -->
          <div class="space-y-4">
            <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Quick Links
            </h3>
            <ul class="space-y-2">
              <li>
                <router-link
                  to="/"
                  class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Home
                </router-link>
              </li>
              <li>
                <router-link
                  to="/news"
                  class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Latest News
                </router-link>
              </li>
              <li>
                <router-link
                  to="/projects"
                  class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Projects
                </router-link>
              </li>
              <li>
                <router-link
                  to="/contact"
                  class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Contact Us
                </router-link>
              </li>
            </ul>
          </div>

          <!-- Column 3 -->
          <div class="space-y-4">
            <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Legal
            </h3>
            <ul class="space-y-2">
              <li>
                <a
                  href="#"
                  class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  class="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          <!-- Column 4 -->
          <div class="space-y-4">
            <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider">
              Contact
            </h3>
            <ul class="space-y-2">
              <li class="text-sm text-gray-600">Email: info@example.com</li>
              <li class="text-sm text-gray-600">Phone: +1 (555) 123-4567</li>
            </ul>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="mt-8 pt-8 border-t border-gray-200">
          <p class="text-center text-sm text-gray-600">
            &copy; {{ currentYear }} Sarilaya. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const mobileMenuOpen = ref(false)
const aboutDropdownOpen = ref(false)
const mobileAboutOpen = ref(false)

const currentYear = computed(() => new Date().getFullYear())

// About Us sub-items
const aboutSubItems = [
  { path: '/about/officers', label: 'Officers' },
  { path: '/about/national-council', label: 'National Council' },
  { path: '/about/chapters', label: 'Chapters' },
]

// Check if any About Us route is active
const isAboutActive = computed(() => {
  return route.path.startsWith('/about')
})

// Navigation items for public users
const navItems = [
  { path: '/', label: 'Home' },
  { path: '/news', label: 'Latest News' },
  { path: '/projects', label: 'Projects' },
  { path: '/videos', label: 'Video Page' },
  { path: '/photos', label: 'Photos' },
  { path: '/contact', label: 'Contact Us' },
]

// Expose navItems so parent can override if needed
defineExpose({
  navItems,
})
</script>

