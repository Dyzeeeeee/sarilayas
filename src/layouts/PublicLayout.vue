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
            :class="{ 'text-primary-600': route.path.startsWith(item.path) }"
            active-class="text-primary-600"
          >
            <Users v-if="item.icon === 'about'" class="w-6 h-6 mb-1" />
            <Newspaper v-else-if="item.icon === 'news'" class="w-6 h-6 mb-1" />
            <Briefcase v-else-if="item.icon === 'projects'" class="w-6 h-6 mb-1" />
            <Video v-else-if="item.icon === 'videos'" class="w-6 h-6 mb-1" />
            <Image v-else-if="item.icon === 'photos'" class="w-6 h-6 mb-1" />
            <span class="text-xs font-medium">{{ item.label }}</span>
          </router-link>
        </template>
      </div>
    </nav>

    <!-- Footer -->
    <footer class="bg-white text-gray-700 mt-auto border-t border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <!-- Column 1: Legal -->
        <div>
          <h3 class="text-sm font-semibold uppercase tracking-wider mb-3">Legal</h3>
          <ul class="space-y-2">
            <li v-if="footerData?.privacyPolicy">
              <a :href="footerData.privacyPolicy" class="text-gray-600 hover:text-gray-900 text-sm" target="_blank">Privacy Policy</a>
            </li>
            <li v-if="footerData?.termsOfService">
              <a :href="footerData.termsOfService" class="text-gray-600 hover:text-gray-900 text-sm" target="_blank">Terms of Service</a>
            </li>
          </ul>
        </div>

        <!-- Column 2: Contact -->
        <div>
          <h3 class="text-sm font-semibold uppercase tracking-wider mb-3">Contact</h3>
          <ul class="space-y-2 text-sm">
            <li v-if="footerData?.email">Email: {{ footerData.email }}</li>
            <li v-if="footerData?.phone">Phone: {{ footerData.phone }}</li>
            <li v-if="footerData?.address">Address: {{ footerData.address }}</li>
          </ul>
        </div>

        <!-- Column 3: Social -->
        <div>
          <h3 class="text-sm font-semibold uppercase tracking-wider mb-3">Social</h3>
          <div class="flex space-x-4">
            <a v-if="footerData?.facebook" :href="footerData.facebook" target="_blank" class="hover:text-gray-900">
              <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.987h-2.54v-2.892h2.54V9.845c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.196 2.238.196v2.465h-1.26c-1.242 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.892h-2.33v6.987C18.343 21.128 22 16.991 22 12z"/>
              </svg>
            </a>
            <a v-if="footerData?.youtube" :href="footerData.youtube" target="_blank" class="hover:text-gray-900">
              <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M19.615 3.184a2.994 2.994 0 00-2.114-.896C15.3 2.25 12 2.25 12 2.25s-3.3 0-5.5.038a2.994 2.994 0 00-2.115.896A2.977 2.977 0 003 5.385c-.004 2.097-.004 5.123-.004 5.123s0 3.026.004 5.123c.014 1.188.876 2.223 2.115 2.827 2.2.038 5.5.038 5.5.038s3.3 0 5.5-.038c1.238-.604 2.1-1.639 2.115-2.827.004-2.097.004-5.123.004-5.123s0-3.026-.004-5.123a2.977 2.977 0 00-.115-.201zM9.75 15.5V8.5l6.5 3.5-6.5 3.5z"/>
              </svg>
            </a>
          </div>
        </div>

      </div>

      <div class="mt-8 pt-8 border-t border-gray-200">
        <p class="text-center text-gray-500 text-sm">
          &copy; {{ currentYear }} Sarilaya. All rights reserved.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ChevronDown, Newspaper, Briefcase, Users, Video, Image } from 'lucide-vue-next'
import { contactService } from '../firebase/firestore' // fixed path

const route = useRoute()
const aboutDropdownOpen = ref(false)
const currentYear = computed(() => new Date().getFullYear())

// Navigation
const navItems = [
  { path: '/', label: 'Home' },
  { path: '/news', label: 'Latest News' },
  { path: '/projects', label: 'Projects' },
  { path: '/videos', label: 'Video Page' },
  { path: '/photos', label: 'Photos' },
  { path: '/contact', label: 'Contact Us' },
]

const aboutSubItems = [
  { path: '/about/officers', label: 'Officers' },
  { path: '/about/national-council', label: 'National Council' },
  { path: '/about/chapters', label: 'Chapters' },
]

const isAboutActive = computed(() => route.path.startsWith('/about'))

const bottomNavItems = [
  { path: '/about', label: 'About Us', icon: 'about' },
  { path: '/news', label: 'News', icon: 'news' },
  { path: '/projects', label: 'Projects', icon: 'projects' },
  { path: '/videos', label: 'Videos', icon: 'videos' },
  { path: '/photos', label: 'Photos', icon: 'photos' },
]

// Dynamic Footer Data
const footerData = ref(null)
const loadFooterData = async () => {
  try {
    const data = await contactService.getContact()
    footerData.value = data
  } catch (err) {
    console.error('Error fetching footer data:', err)
  }
}

onMounted(() => {
  loadFooterData()
})
</script>
