import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/auth/login.vue'
import Register from '../pages/auth/register.vue'
import Home from '../pages/Home.vue'
import News from '../pages/News.vue'
import Projects from '../pages/Projects.vue'
import Videos from '../pages/Videos.vue'
import Photos from '../pages/Photos.vue'
import Contact from '../pages/Contact.vue'
import About from '../pages/about/About.vue'
import Officers from '../pages/about/Officers.vue'
import NationalCouncil from '../pages/about/NationalCouncil.vue'
import Chapters from '../pages/about/Chapters.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/news', name: 'News', component: News },
  { path: '/projects', name: 'Projects', component: Projects },
  { path: '/videos', name: 'Videos', component: Videos },
  { path: '/photos', name: 'Photos', component: Photos },
  { path: '/contact', name: 'Contact', component: Contact },
  { path: '/about', name: 'About', component: About },
  { path: '/about/officers', name: 'Officers', component: Officers },
  { path: '/about/national-council', name: 'NationalCouncil', component: NationalCouncil },
  { path: '/about/chapters', name: 'Chapters', component: Chapters },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
