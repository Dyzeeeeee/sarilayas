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
            <a @click="handleNavClick('/')" class="flex items-center gap-2 text-xl font-bold text-white hover:opacity-90 transition-opacity cursor-pointer">
              <img 
                src="/MainSarilayaLogo.png" 
                alt="Sarilaya Logo" 
                class="hidden lg:block h-10 w-auto object-contain"
              />
              <img 
                src="/SarilayaLogo.png" 
                alt="Sarilaya Logo" 
                class="lg:hidden h-8 w-8 object-contain"
              />
              <span>{{ pageTitle }}</span>
            </a>
          </div>

          <!-- View Toggler (Mobile) -->
          <div v-if="showViewToggler" class="flex items-center md:hidden">
            <ViewToggler
              :key="viewTogglerKey"
              :storage-key="viewTogglerKey"
              :modes="viewTogglerModes"
              :default-mode="viewTogglerDefaultMode"
            />
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center space-x-1">
            <!-- View Toggler (Desktop) -->
            <div v-if="showViewToggler" class="flex items-center mr-2">
              <ViewToggler
                :key="viewTogglerKey"
                :storage-key="viewTogglerKey"
                :modes="viewTogglerModes"
                :default-mode="viewTogglerDefaultMode"
              />
            </div>
            
            <a
              @click="handleNavClick('/')"
              class="text-white/90 hover:text-white px-3 py-2 text-sm font-medium transition-colors cursor-pointer"
              :class="{ 'text-white border-b-2 border-white': route.path === '/' }"
            >
              Home
            </a>
            <a
              @click="handleNavClick('/about')"
              class="text-white/90 hover:text-white px-3 py-2 text-sm font-medium transition-colors cursor-pointer"
              :class="{ 'text-white border-b-2 border-white': isAboutActive }"
            >
              About Us
            </a>
            <a
              v-for="item in navItems"
              :key="item.path"
              @click="handleNavClick(item.path)"
              class="text-white/90 hover:text-white px-3 py-2 text-sm font-medium transition-colors cursor-pointer"
              :class="{ 'text-white border-b-2 border-white': isActiveRoute(item.path) }"
            >
              {{ item.label }}
            </a>
            <a
              @click="handleNavClick('/contact')"
              class="text-white/90 hover:text-white px-3 py-2 text-sm font-medium transition-colors cursor-pointer"
              :class="{ 'text-white border-b-2 border-white': route.path === '/contact' }"
            >
              Contact
            </a>
            
            <!-- Notifications -->
            <div class="relative ml-2">
              <button
                ref="notificationButton"
                @click="showNotificationsDropdown = !showNotificationsDropdown"
                class="relative text-white/90 hover:text-white px-3 py-2 transition-colors cursor-pointer"
              >
                <Bell class="w-5 h-5" />
                <span
                  v-if="unreadCount > 0"
                  class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {{ unreadCount > 9 ? '9+' : unreadCount }}
                </span>
              </button>
              
              <!-- Notifications Dropdown -->
              <div
                v-if="showNotificationsDropdown"
                ref="notificationsDropdown"
                class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden flex flex-col"
              >
                <div class="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 class="font-bold text-gray-900">Notifications</h3>
                  <button
                    v-if="unreadCount > 0"
                    @click="markAllAsRead"
                    class="text-sm text-primary-600 hover:text-primary-700 font-medium cursor-pointer"
                  >
                    Mark all as read
                  </button>
                </div>
                
                <div class="overflow-y-auto flex-1">
                  <div v-if="isLoading" class="p-4 text-center text-gray-500 text-sm">
                    Loading...
                  </div>
                  <div v-else-if="notifications.length === 0" class="p-4 text-center text-gray-500 text-sm">
                    No notifications
                  </div>
                  <div v-else class="divide-y divide-gray-100">
                    <button
                      v-for="notification in notifications"
                      :key="notification.id"
                      @click="handleNotificationClick(notification)"
                      class="w-full text-left hover:bg-gray-50 transition-colors cursor-pointer"
                      :class="{ 'bg-primary-50': !isNotificationRead(notification.id) }"
                    >
                      <div class="flex items-start gap-3 p-4">
                        <!-- Image Preview -->
                        <div v-if="notification.image" class="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            :src="notification.image"
                            :alt="notification.title"
                            class="w-full h-full object-cover"
                          />
                        </div>
                        <!-- Icon fallback if no image -->
                        <div v-else :class="getNotificationIconBgClass(notification.type)" class="w-16 h-16 rounded-lg flex items-center justify-center shrink-0">
                          <component
                            :is="getNotificationIconComponent(notification.type)"
                            :class="getNotificationIconClass(notification.type)"
                            class="w-6 h-6"
                          />
                        </div>
                        <div class="flex-1 min-w-0">
                          <div class="flex items-center gap-2 mb-1">
                            <span class="text-xs font-medium text-primary-600">
                              {{ getNotificationTypeLabel(notification.type) }}
                            </span>
                            <span v-if="!isNotificationRead(notification.id)" class="w-2 h-2 bg-primary-600 rounded-full"></span>
                          </div>
                          <p class="text-sm font-medium text-gray-900 line-clamp-2">
                            {{ notification.title }}
                          </p>
                          <p class="text-xs text-gray-500 mt-1">
                            {{ formatNotificationDate(notification.date) }}
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          
          <!-- Mobile Notifications -->
          <div class="md:hidden relative">
            <button
              ref="mobileNotificationButton"
              @click="showNotificationsDropdown = !showNotificationsDropdown"
              class="relative text-white p-2 cursor-pointer"
            >
              <Bell class="w-5 h-5" />
              <span
                v-if="unreadCount > 0"
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
              >
                {{ unreadCount > 9 ? '9+' : unreadCount }}
              </span>
            </button>
            
            <!-- Mobile Notifications Dropdown -->
            <div
              v-if="showNotificationsDropdown"
              ref="mobileNotificationsDropdown"
              class="fixed top-16 left-0 right-0 bg-white border-b border-gray-200 z-50 max-h-96 overflow-y-auto"
            >
              <div class="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 class="font-bold text-gray-900">Notifications</h3>
                <button
                  v-if="unreadCount > 0"
                  @click="markAllAsRead"
                  class="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Mark all as read
                </button>
              </div>
              
              <div v-if="isLoading" class="p-4 text-center text-gray-500 text-sm">
                Loading...
              </div>
              <div v-else-if="notifications.length === 0" class="p-4 text-center text-gray-500 text-sm">
                No notifications
              </div>
              <div v-else class="divide-y divide-gray-100">
                <button
                  v-for="notification in notifications"
                  :key="notification.id"
                  @click="handleNotificationClick(notification)"
                  class="w-full text-left transition-colors"
                  :class="{
                    'bg-primary-50 hover:bg-gray-50': !isNotificationRead(notification.id),
                    'hover:bg-gray-50': isNotificationRead(notification.id)
                  }"
                >
                  <div class="flex items-start gap-3 p-4">
                    <!-- Image Preview -->
                    <div v-if="notification.image" class="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        :src="notification.image"
                        :alt="notification.title"
                        class="w-full h-full object-cover"
                      />
                    </div>
                    <!-- Icon fallback if no image -->
                    <div v-else :class="[getNotificationIconBgClass(notification.type), 'w-16 h-16 rounded-lg flex items-center justify-center shrink-0']">
                      <component
                        :is="getNotificationIconComponent(notification.type)"
                        :class="getNotificationIconClass(notification.type)"
                        class="w-6 h-6"
                      />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <span class="text-xs font-medium text-primary-600">
                          {{ getNotificationTypeLabel(notification.type) }}
                        </span>
                        <span v-if="notification.updated" class="px-1.5 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-bold rounded">
                          UPDATED
                        </span>
                        <span v-else-if="!isNotificationRead(notification.id)" class="w-2 h-2 bg-primary-600 rounded-full"></span>
                      </div>
                      <p class="text-sm font-medium text-gray-900 line-clamp-2">
                        {{ notification.title }}
                      </p>
                      <p class="text-xs text-gray-500 mt-1">
                        {{ formatNotificationDate(notification.date) }}
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 w-full mx-auto px-0 sm:px-6 lg:px-8 py-0 sm:pt-6 pb-24 md:pb-0 overflow-hidden pt-6 lg:max-w-none">
      <slot></slot>
    </main>

    <!-- Bottom Navigation Bar (Mobile Only) -->
    <nav class="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 md:hidden safe-area-inset-bottom">
      <div class="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 px-3 py-2">
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
            <button
              @click="handleBottomNavClick(item)"
              class="relative z-10 flex items-center justify-center w-14 h-14 rounded-xl transition-all duration-500 ease-out"
              :class="{
                'text-white scale-125 animate-scale-up': isActiveRoute(item.path),
                'text-gray-500 hover:text-primary-500 hover:scale-105': !isActiveRoute(item.path)
              }"
            >
              <!-- Icon with animation -->
              <div
                class="relative transition-all duration-500 ease-out"
                :class="{
                  'scale-125': isActiveRoute(item.path),
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
                <BadgeInfo 
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
                <Mail 
                  v-else-if="item.icon === 'contact'" 
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
            </button>
          </template>
        </div>
      </div>
    </nav>
    
    <!-- Toast Container -->
    <ToastContainer />
  </div>
</template>

<script setup>
import { ref, computed, provide, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Newspaper, Briefcase, Users, Video, Image, Home, FolderOpenDot, BadgeInfo, Mail, Bell } from 'lucide-vue-next'
import ViewToggler from '../components/ViewToggler.vue'
import ToastContainer from '../components/ToastContainer.vue'
import { useNotifications } from '../composables/useNotifications'

const route = useRoute()
const router = useRouter()
const isScrolledToTop = ref(true)

// Notifications
const {
  notifications,
  unreadCount,
  isLoading,
  markAsRead,
  markAllAsRead: markAllNotificationsAsRead,
  getNotificationTypeLabel,
  initialize: initializeNotifications,
  cleanup: cleanupNotifications
} = useNotifications()

const showNotificationsDropdown = ref(false)
const readNotifications = ref(new Set())
const notificationsDropdown = ref(null)
const mobileNotificationsDropdown = ref(null)
const notificationButton = ref(null)
const mobileNotificationButton = ref(null)

// Handle click outside to close dropdown
function handleClickOutside(event) {
  if (showNotificationsDropdown.value) {
    const dropdown = notificationsDropdown.value || mobileNotificationsDropdown.value
    const button = notificationButton.value || mobileNotificationButton.value
    
    if (dropdown && !dropdown.contains(event.target) && 
        button && !button.contains(event.target)) {
      showNotificationsDropdown.value = false
    }
  }
}

// Initialize notifications on mount
onMounted(() => {
  initializeNotifications()
  loadReadNotifications()
  
  // Add click outside listener
  document.addEventListener('click', handleClickOutside)
  
  // Scroll detection
  window.addEventListener('scroll', handleScroll)
  handleScroll() // Check initial scroll position
})

onUnmounted(() => {
  cleanupNotifications()
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', handleScroll)
})

// Load read notifications from localStorage
function loadReadNotifications() {
  try {
    const read = localStorage.getItem('sarilaya_notifications_read')
    if (read) {
      readNotifications.value = new Set(JSON.parse(read))
    }
  } catch (error) {
    console.error('Error loading read notifications:', error)
  }
}

// Check if notification is read
function isNotificationRead(notificationId) {
  return readNotifications.value.has(notificationId)
}

// Handle notification click
function handleNotificationClick(notification) {
  // Don't navigate if deleted
  if (notification.deleted) {
    return
  }
  
  markAsRead(notification.id)
  readNotifications.value.add(notification.id)
  showNotificationsDropdown.value = false
  
  // Navigate to the item
  if (notification.type === 'news') {
    router.push(`/news/${notification.itemId}`)
  } else if (notification.type === 'project') {
    router.push(`/projects/${notification.itemId}`)
  } else if (notification.type === 'photo') {
    router.push('/media')
  } else if (notification.type === 'video') {
    router.push('/media')
  }
}

// Mark all as read
function markAllAsRead() {
  markAllNotificationsAsRead()
  notifications.value.forEach(n => readNotifications.value.add(n.id))
}

// Get notification icon component
function getNotificationIconComponent(type) {
  const icons = {
    'news': Newspaper,
    'photo': Image,
    'video': Video,
    'project': FolderOpenDot
  }
  return icons[type] || Bell
}

// Get notification icon background class
function getNotificationIconBgClass(type) {
  const classes = {
    'news': 'bg-blue-100',
    'photo': 'bg-green-100',
    'video': 'bg-red-100',
    'project': 'bg-purple-100'
  }
  return classes[type] || 'bg-gray-100'
}

// Get notification icon color class
function getNotificationIconClass(type) {
  const classes = {
    'news': 'text-blue-600',
    'photo': 'text-green-600',
    'video': 'text-red-600',
    'project': 'text-purple-600'
  }
  return classes[type] || 'text-gray-600'
}

// Format notification date
function formatNotificationDate(date) {
  if (!date) return 'Recently'
  
  let dateObj
  if (date.toDate) {
    dateObj = date.toDate()
  } else if (date instanceof Date) {
    dateObj = date
  } else if (typeof date === 'string' || typeof date === 'number') {
    dateObj = new Date(date)
  } else {
    return 'Recently'
  }
  
  const now = new Date()
  const diffMs = now - dateObj
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffSeconds < 60) {
    return 'Just now'
  } else if (diffMinutes < 60) {
    return `${diffMinutes}m ago`
  } else if (diffHours < 24) {
    return `${diffHours}h ago`
  } else if (diffDays < 7) {
    return `${diffDays}d ago`
  }
  
  const options = { month: 'short', day: 'numeric' }
  return dateObj.toLocaleDateString('en-US', options)
}

// Scroll detection
const handleScroll = () => {
  isScrolledToTop.value = window.scrollY < 10
}

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
  { path: '/contact', label: 'Contact', icon: 'contact' },
]

// Helper to check if a route is active
const isActiveRoute = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path === path || route.path.startsWith(path + '/')
}

// Handle navigation click (topbar and bottom nav)
const handleNavClick = (path) => {
  if (isActiveRoute(path)) {
    // If already on this page, scroll to top and dispatch event to refetch data
    window.scrollTo({ top: 0, behavior: 'smooth' })
    window.dispatchEvent(new CustomEvent('refetch-page-data', { 
      detail: { path: path } 
    }))
  } else {
    // Navigate to the new page
    router.push(path)
  }
}

// Handle bottom nav item click
const handleBottomNavClick = (item) => {
  handleNavClick(item.path)
}
</script>

<style scoped>
@keyframes scale-up {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1.25);
  }
}

.animate-scale-up {
  animation: scale-up 0.3s ease-out;
}
</style>
