import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/auth/login.vue'
// import Register from '../pages/auth/register.vue'
import Home from '../pages/Home.vue'
import News from '../pages/News.vue'
import NewsDetail from '../pages/NewsDetail.vue'
import Projects from '../pages/Projects.vue'
import ProjectDetail from '../pages/ProjectDetail.vue'
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
import SuperAdminSettings from '../pages/superadmin/Settings.vue'
import SuperAdminUsers from '../pages/superadmin/Users.vue'
import SiteDown from '../components/SiteDown.vue'
import NotFound from '../pages/NotFound.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/news', name: 'News', component: News },
  { path: '/news/:id', name: 'NewsDetail', component: NewsDetail },
  { path: '/projects', name: 'Projects', component: Projects },
  { path: '/media', name: 'Media', component: Media },
  { path: '/projects/:id', name: 'ProjectDetail', component: ProjectDetail },
  { path: '/contact', name: 'Contact', component: Contact },
  { path: '/about', name: 'About', component: About },
  { path: '/about/officers', name: 'Officers', component: Officers },
  { path: '/about/national-council', name: 'NationalCouncil', component: NationalCouncil },
  { path: '/about/chapters', name: 'Chapters', component: Chapters },
  { path: '/login', name: 'Login', component: Login, meta: { requiresGuest: true } },
  // { path: '/register', name: 'Register', component: Register, meta: { requiresGuest: true } },
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
  { path: '/superadmin', redirect: '/superadmin/settings' },
  { path: '/superadmin/settings', name: 'SuperAdminSettings', component: SuperAdminSettings, meta: { requiresAuth: true, requiresSuperAdmin: true } },
  { path: '/superadmin/users', name: 'SuperAdminUsers', component: SuperAdminUsers, meta: { requiresAuth: true, requiresSuperAdmin: true } },
  { path: '/site-down', name: 'SiteDown', component: SiteDown },
  // Catch-all route for 404 - must be last
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Always scroll to top on route change
    return { top: 0 }
  },
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
    const userRole = auth.userData.value?.role
    const isSuperAdmin = userRole === 'superadmin'
    
    // Check if route requires auth
    if (to.meta.requiresAuth && !isAuthenticated) {
      next('/login')
      return
    }

    // Check if route requires super admin privileges
    if (to.meta.requiresSuperAdmin && !isSuperAdmin) {
      next('/admin')
      return
    }
    
    // Check if route requires guest (login page)
    if (to.meta.requiresGuest && isAuthenticated) {
      next('/admin')
      return
    }
    
    // If trying to access site-down page but site is enabled, redirect to home
    if (to.path === '/site-down') {
      try {
        const { settingsService } = await import('../firebase/firestore')
        const settings = await settingsService.getSettings()
        
        // If site is enabled, redirect to home
        if (settings && settings.siteEnabled !== false) {
          next('/')
          return
        }
      } catch (error) {
        console.error('Error checking site status:', error)
        // On error, allow access to site-down page
      }
    }
    
    // Check site status for public routes (not admin routes and not site-down page)
    if (!to.meta.requiresAuth && to.path !== '/site-down' && to.path !== '/login') {
      try {
        const { settingsService } = await import('../firebase/firestore')
        const settings = await settingsService.getSettings()
        
        // Check if site is explicitly disabled
        // siteEnabled can be: true (enabled), false (disabled), or undefined (defaults to enabled)
        // Only allow authenticated admins to access public routes when site is disabled
        const isSiteDisabled = settings && settings.siteEnabled === false
        
        if (isSiteDisabled && !isAuthenticated) {
          next('/site-down')
          return
        }
      } catch (error) {
        console.error('Error checking site status:', error)
        // On error, default to enabled (allow navigation)
      }
    }
    
    next()
  } catch (error) {
    console.error('Router guard error:', error)
    // On error, allow navigation to proceed
    next()
  }
})

export default router
