<template>
  <div class="min-h-screen flex flex-col bg-primary-100">
    <!-- Header -->
    <header 
      class="bg-gradient-to-r from-primary-400 via-primary-500 to-primary-700 shadow-sm sticky z-50 transition-all duration-300 ease-in-out py-1 md:py-0 top-0 lg:top-0 lg:rounded-none lg:mx-0"
      :class="{
        'top-3 mx-4 rounded-full': isScrolledToTop,
        'top-0 mx-0 rounded-none': !isScrolledToTop
      }"
    >
      <div class="lg:max-w-none mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-10 md:h-16">
          <!-- Logo -->
          <div class="flex-shrink-0">
            <router-link to="/" class="flex items-center gap-2 text-xl font-bold text-white hover:opacity-90 transition-opacity">
              <img 
                src="/MainSarilayaLogo.png" 
                alt="Sarilaya Logo" 
                class="h-8 w-8 lg:h-10 lg:w-auto object-contain"
              />
              <span>{{ pageTitle }}</span>
            </router-link>
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center space-x-1">
            <!-- View Toggler (only on Media and News pages) -->
            <div v-if="showViewToggler" class="flex items-center mr-2">
              <ViewToggler
                :key="viewTogglerKey"
                :storage-key="viewTogglerKey"
                :modes="viewTogglerModes"
                :default-mode="viewTogglerDefaultMode"
              />
            </div>
            
            <router-link
              to="/"
              class="text-white/90 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              :class="{ 'text-white border-b-2 border-white': route.path === '/' }"
            >
              Home
            </router-link>
            <router-link
              to="/about"
              class="text-white/90 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              :class="{ 'text-white border-b-2 border-white': isAboutActive }"
            >
              About Us
            </router-link>
            <router-link
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="text-white/90 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              active-class="text-white border-b-2 border-white"
            >
              {{ item.label }}
            </router-link>
            <router-link
              to="/contact"
              class="text-white/90 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
              active-class="text-white border-b-2 border-white"
            >
              Contact
            </router-link>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 w-full lg:max-w-none mx-auto px-0 sm:px-6 lg:px-8 py-0 sm:pt-6 pb-24 md:pb-0 overflow-hidden pt-6 ">
      <slot></slot>
    </main>

    <!-- Bottom Navigation Bar (Mobile Only) -->
    <nav class="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 md:hidden safe-area-inset-bottom">
      <div class="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 px-6 py-3">
        <div class="flex items-center relative">
          <!-- Sliding Background Indicator -->
          <div
            class="absolute top-0 bottom-0 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500 ease-out shadow-lg"
            :style="{
              width: `${100 / bottomNavItems.length}%`,
              left: `${(bottomNavItems.findIndex(item => isActiveRoute(item.path)) * 100) / bottomNavItems.length}%`,
              transform: 'translateX(0)',
            }"
          ></div>
          
          <template v-for="(item, index) in bottomNavItems" :key="item.path">
            <router-link
              :to="item.path"
              class="relative z-10 flex items-center justify-center w-14 h-14 rounded-xl transition-all duration-500 ease-out"
              :class="{
                'text-white scale-110': isActiveRoute(item.path),
                'text-gray-500 hover:text-primary-500': !isActiveRoute(item.path)
              }"
            >
              <!-- Icon with animation -->
              <div
                class="relative transition-all duration-500"
                :class="{
                  'scale-110': isActiveRoute(item.path),
                  'scale-100': !isActiveRoute(item.path)
                }"
              >
                <Home 
                  v-if="item.icon === 'home'" 
                  class="w-6 h-6 transition-all duration-500"
                  :class="{
                    'drop-shadow-lg filter brightness-110': isActiveRoute(item.path)
                  }"
                />
                <Users 
                  v-else-if="item.icon === 'about'" 
                  class="w-6 h-6 transition-all duration-500"
                  :class="{
                    'drop-shadow-lg filter brightness-110': isActiveRoute(item.path)
                  }"
                />
                <Newspaper 
                  v-else-if="item.icon === 'news'" 
                  class="w-6 h-6 transition-all duration-500"
                  :class="{
                    'drop-shadow-lg filter brightness-110': isActiveRoute(item.path)
                  }"
                />
                <FolderOpenDot 
                  v-else-if="item.icon === 'projects'" 
                  class="w-6 h-6 transition-all duration-500"
                  :class="{
                    'drop-shadow-lg filter brightness-110': isActiveRoute(item.path)
                  }"
                />
                <Video 
                  v-else-if="item.icon === 'videos'" 
                  class="w-6 h-6 transition-all duration-500"
                  :class="{
                    'drop-shadow-lg filter brightness-110': isActiveRoute(item.path)
                  }"
                />
                <Image 
                  v-else-if="item.icon === 'photos'" 
                  class="w-6 h-6 transition-all duration-500"
                  :class="{
                    'drop-shadow-lg filter brightness-110': isActiveRoute(item.path)
                  }"
                />
              </div>
              
              <!-- Glow effect for active item -->
              <div
                v-if="isActiveRoute(item.path)"
                class="absolute inset-0 rounded-xl bg-white/20 blur-md -z-10 animate-pulse"
              ></div>
            </router-link>
          </template>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, provide, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { Newspaper, Briefcase, Users, Video, Image, Home, FolderOpenDot } from 'lucide-vue-next'
import ViewToggler from '../components/ViewToggler.vue'

const route = useRoute()
const isScrolledToTop = ref(true)

// Scroll detection
const handleScroll = () => {
  isScrolledToTop.value = window.scrollY < 10
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll() // Check initial scroll position
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// View toggler state
const showViewToggler = computed(() => {
  return route.path === '/media' || route.path === '/news' || route.path === '/projects' || route.path === '/about/officers' || route.path === '/about/national-council' || route.path === '/about/chapters'
})

const viewTogglerKey = computed(() => {
  if (route.path === '/media') return 'mediaViewMode'
  if (route.path === '/news') return 'newsViewMode'
  if (route.path === '/projects') return 'projectsViewMode'
  if (route.path === '/about/officers') return 'officersViewMode'
  if (route.path === '/about/national-council') return 'nationalCouncilViewMode'
  if (route.path === '/about/chapters') return 'chaptersViewMode'
  return ''
})

const viewTogglerModes = computed(() => {
  if (route.path === '/news') return ['list', 'cards'] // No grid for news
  if (route.path === '/projects') return ['list', 'cards'] // List and cards for projects
  if (route.path === '/about/officers') return ['list', 'cards'] // List and cards for officers
  if (route.path === '/about/national-council') return ['list', 'cards'] // List and cards for national council
  if (route.path === '/about/chapters') return ['list', 'cards'] // List and cards for chapters
  return ['list', 'grid', 'cards'] // All modes for media
})

const viewTogglerDefaultMode = computed(() => {
  if (route.path === '/media') return 'grid'
  if (route.path === '/news') return 'cards'
  if (route.path === '/projects') return 'cards'
  if (route.path === '/about/officers') return 'cards'
  if (route.path === '/about/national-council') return 'cards'
  if (route.path === '/about/chapters') return 'cards'
  return 'grid'
})

// Initialize view mode based on current route
const getInitialViewMode = () => {
  if (route.path === '/media') {
    return localStorage.getItem('mediaViewMode') || 'grid'
  }
  if (route.path === '/news') {
    return localStorage.getItem('newsViewMode') || 'cards'
  }
  if (route.path === '/projects') {
    return localStorage.getItem('projectsViewMode') || 'cards'
  }
  if (route.path === '/about/officers') {
    return localStorage.getItem('officersViewMode') || 'cards'
  }
  if (route.path === '/about/national-council') {
    return localStorage.getItem('nationalCouncilViewMode') || 'cards'
  }
  if (route.path === '/about/chapters') {
    return localStorage.getItem('chaptersViewMode') || 'cards'
  }
  return null
}

const currentViewMode = ref(getInitialViewMode())

// Watch route changes to update view mode
watch(() => route.path, () => {
  const newMode = getInitialViewMode()
  if (newMode) {
    currentViewMode.value = newMode
  }
}, { immediate: true })

// Provide view mode to child components - use a computed to ensure reactivity
provide('viewMode', currentViewMode)

// Page title mapping
const pageTitleMap = {
  '/': 'Sarilaya',
  '/news': 'Latest News',
  '/projects': 'Projects',
  '/media': 'Media',
  '/contact': 'Contact Us',
  '/about': 'About Us',
  '/about/officers': 'Officers',
  '/about/national-council': 'National Council',
  '/about/chapters': 'Chapters',
}

const pageTitle = computed(() => {
  return pageTitleMap[route.path] || 'Sarilaya'
})

// Navigation
const navItems = [
  { path: '/news', label: 'Latest News' },
  { path: '/projects', label: 'Projects' },
  { path: '/media', label: 'Media' },
]

const aboutSubItems = [
  { path: '/about/officers', label: 'Officers' },
  { path: '/about/national-council', label: 'National Council' },
  { path: '/about/chapters', label: 'Chapters' },
]

const isAboutActive = computed(() => route.path.startsWith('/about'))

const bottomNavItems = [
  { path: '/', label: 'Home', icon: 'home' },
  { path: '/about', label: 'About Us', icon: 'about' },
  { path: '/news', label: 'News', icon: 'news' },
  { path: '/projects', label: 'Projects', icon: 'projects' },
  { path: '/media', label: 'Media', icon: 'photos' },
]

// Helper to check if a route is active
const isActiveRoute = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path === path || route.path.startsWith(path + '/')
}
</script>
