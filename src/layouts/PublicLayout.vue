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
                :class="{ 'text-primary-600 border-b-2 border-primary-600': isAboutActive }"
              >
                About Us
                <ChevronDown
                  class="ml-1 h-4 w-4 transition-transform"
                  :class="{ 'rotate-180': aboutDropdownOpen }"
                />
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
                  active-class="bg-primary-50 text-primary-600"
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
              active-class="text-primary-600 border-b-2 border-primary-600"
            >
              {{ item.label }}
            </router-link>
          </nav>

        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 w-full max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-6 sm:py-8 pb-20 md:pb-8">
      <slot></slot>
    </main>

    <!-- Bottom Navigation Bar (Mobile Only) -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden safe-area-inset-bottom">
      <div class="flex justify-around items-center h-16">
        <template v-for="item in bottomNavItems" :key="item.path">
          <router-link
            :to="item.path"
            class="flex flex-col items-center justify-center flex-1 h-full text-gray-600 hover:text-primary-600 transition-colors"
            :class="{ 'text-primary-600': item.path === '/about' ? isAboutActive : false }"
            active-class="text-primary-600"
          >
            <Users v-if="item.icon === 'about'" class="w-6 h-6 mb-1" />
            <Newspaper v-else-if="item.icon === 'news'" class="w-6 h-6 mb-1" />
            <Briefcase v-else-if="item.icon === 'projects'" class="w-6 h-6 mb-1" />
            <Video v-else-if="item.icon === 'videos'" class="w-6 h-6 mb-1" />
            <Mail v-else-if="item.icon === 'contact'" class="w-6 h-6 mb-1" />
            <span class="text-xs font-medium">{{ item.label }}</span>
          </router-link>
        </template>
      </div>
    </nav>

    <!-- Footer -->
    <footer class="hidden bg-white border-t border-gray-200 mt-auto">
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
import { ChevronDown, Newspaper, Briefcase, Mail, Users, Video } from 'lucide-vue-next'

const route = useRoute()
const aboutDropdownOpen = ref(false)

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

// Bottom navigation items (main items - mobile)
const bottomNavItems = [
  { path: '/about', label: 'About Us', icon: 'about' },
  { path: '/news', label: 'News', icon: 'news' },
  { path: '/projects', label: 'Projects', icon: 'projects' },
  { path: '/videos', label: 'Videos', icon: 'videos' },
  { path: '/contact', label: 'Contact', icon: 'contact' },
]


// All navigation items for desktop
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

