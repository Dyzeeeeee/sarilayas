import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/auth/login.vue'
import Register from '../pages/auth/register.vue'
import Home from '../pages/Home.vue'
import News from '../pages/News.vue'
import NewsDetail from '../pages/NewsDetail.vue'
import Projects from '../pages/Projects.vue'
import Media from '../pages/Media.vue'
import Contact from '../pages/Contact.vue'
import About from '../pages/about/About.vue'
import Officers from '../pages/about/Officers.vue'
import NationalCouncil from '../pages/about/NationalCouncil.vue'
import Chapters from '../pages/about/Chapters.vue'
import AdminDashboard from '../pages/admin/Dashboard.vue'
import AdminAbout from '../pages/admin/about/About.vue'
import AdminValues from '../pages/admin/about/Values.vue'
import AdminOfficers from '../pages/admin/about/Officers.vue'
import AdminCouncil from '../pages/admin/about/Council.vue'
import AdminChapters from '../pages/admin/about/Chapters.vue'
import AdminContact from '../pages/admin/Contact.vue'
import AdminVideos from '../pages/admin/Videos.vue'
import AdminPhotos from '../pages/admin/Photos.vue'
import AdminNews from '../pages/admin/News.vue'
import AdminProjects from '../pages/admin/Projects.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/news', name: 'News', component: News },
  { path: '/news/:id', name: 'NewsDetail', component: NewsDetail },
  { path: '/projects', name: 'Projects', component: Projects },
  { path: '/media', name: 'Media', component: Media },
  { path: '/contact', name: 'Contact', component: Contact },
  { path: '/about', name: 'About', component: About },
  { path: '/about/officers', name: 'Officers', component: Officers },
  { path: '/about/national-council', name: 'NationalCouncil', component: NationalCouncil },
  { path: '/about/chapters', name: 'Chapters', component: Chapters },
  { path: '/login', name: 'Login', component: Login, meta: { requiresGuest: true } },
  { path: '/register', name: 'Register', component: Register, meta: { requiresGuest: true } },
  { path: '/admin', name: 'AdminDashboard', component: AdminDashboard, meta: { requiresAuth: true } },
  { path: '/admin/about', name: 'AdminAbout', component: AdminAbout, meta: { requiresAuth: true } },
  { path: '/admin/about/values', name: 'AdminValues', component: AdminValues, meta: { requiresAuth: true } },
  { path: '/admin/about/officers', name: 'AdminOfficers', component: AdminOfficers, meta: { requiresAuth: true } },
  { path: '/admin/about/council', name: 'AdminCouncil', component: AdminCouncil, meta: { requiresAuth: true } },
  { path: '/admin/about/chapters', name: 'AdminChapters', component: AdminChapters, meta: { requiresAuth: true } },
  { path: '/admin/contact', name: 'AdminContact', component: AdminContact, meta: { requiresAuth: true } },
  { path: '/admin/videos', name: 'AdminVideos', component: AdminVideos, meta: { requiresAuth: true } },
  { path: '/admin/photos', name: 'AdminPhotos', component: AdminPhotos, meta: { requiresAuth: true } },
  { path: '/admin/news', name: 'AdminNews', component: AdminNews, meta: { requiresAuth: true } },
  { path: '/admin/projects', name: 'AdminProjects', component: AdminProjects, meta: { requiresAuth: true } },
  { path: '/admin/messages', name: 'AdminMessages', component: () => import('../pages/admin/Messages.vue'), meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  try {
    // Import auth composable
    const { useAuth } = await import('../composables/useAuth')
    
    // Initialize auth state
    const auth = useAuth()
    auth.init()
    
    // Wait for auth to initialize
    await auth.waitForAuth()
    
    const isAuthenticated = !!auth.user.value
    
    if (to.meta.requiresAuth && !isAuthenticated) {
      next('/login')
    } else if (to.meta.requiresGuest && isAuthenticated) {
      next('/admin')
    } else {
      next()
    }
  } catch (error) {
    console.error('Router guard error:', error)
    // On error, allow navigation to proceed
    next()
  }
})

export default router
