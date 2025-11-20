<template>
  <PublicLayout>

    <!-- SECTION 1: FULL PAGE BACKGROUND -->
    <section
      class="w-full h-[60vh] sm:h-[65vh] bg-cover bg-center relative flex items-end"
      style="background-image: url('/AboutBackground.jpeg');"
    >
      <!-- Dark overlay -->
      <div class="absolute inset-0 bg-black/40"></div>

      <!-- Content -->
      <div
        class="relative z-10 px-4 sm:px-6 pb-6 w-full max-w-6xl mx-auto text-center"
      >
        <h1 class="text-3xl sm:text-4xl font-extrabold text-white drop-shadow-lg">
          About Us
        </h1>
        <p class="text-white/90 mt-1 text-sm sm:text-base">
          Learn more about our organization.
        </p>
      </div>
    </section>

    <!-- SECTION 2: MISSION & VISION -->
    <section class="w-full bg-primary-600 py-12 sm:py-16">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 text-white space-y-6">

        <!-- Mission -->
        <div class="border-b border-white/30">
          <button
            class="w-full flex items-center gap-3 py-4 text-left text-lg font-semibold focus:outline-none"
            @click="toggle('mission')"
          >
            <span
              class="text-xl font-bold transform transition-transform duration-300"
              :class="openSections.mission ? 'rotate-45' : ''"
            >+</span>
            <span>Mission</span>
          </button>

          <transition
            enter-active-class="transition-all duration-500 ease-out"
            leave-active-class="transition-all duration-300 ease-in"
            enter-from-class="max-h-0 opacity-0"
            enter-to-class="max-h-96 opacity-100"
            leave-from-class="max-h-96 opacity-100"
            leave-to-class="max-h-0 opacity-0"
          >
            <div v-if="openSections.mission" class="overflow-hidden">
              <p class="text-sm sm:text-base text-white/80 pb-4">
                {{ mission || 'No mission has been set.' }}
              </p>
            </div>
          </transition>
        </div>

        <!-- Vision -->
        <div class="border-b border-white/30">
          <button
            class="w-full flex items-center gap-3 py-4 text-left text-lg font-semibold focus:outline-none"
            @click="toggle('vision')"
          >
            <span
              class="text-xl font-bold transform transition-transform duration-300"
              :class="openSections.vision ? 'rotate-45' : ''"
            >+</span>
            <span>Vision</span>
          </button>

          <transition
            enter-active-class="transition-all duration-500 ease-out"
            leave-active-class="transition-all duration-300 ease-in"
            enter-from-class="max-h-0 opacity-0"
            enter-to-class="max-h-96 opacity-100"
            leave-from-class="max-h-96 opacity-100"
            leave-to-class="max-h-0 opacity-0"
          >
            <div v-if="openSections.vision" class="overflow-hidden">
              <div class="text-sm sm:text-base text-white/80 pb-4 space-y-2">
                <p v-for="(item, index) in visionPoints" :key="index">{{ item }}</p>
              </div>
            </div>
          </transition>
        </div>

      </div>
    </section>

    <!-- SECTION 3: ADDITIONAL INFO LEFT-ALIGNED (VERTICAL STATS) -->
    <section class="w-full bg-primary-600 py-12 sm:py-16">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 text-white space-y-6">

        <!-- Where we are -->
        <p class="text-sm text-white/70 uppercase tracking-wide">
          Where we are
        </p>

        <!-- Vertical Stats -->
        <div class="flex flex-col gap-2 text-left">
          <div class="flex items-baseline gap-2">
            <span class="text-white/50">|</span>
            <span class="text-2xl sm:text-3xl font-bold">{{ stats.regions }}</span>
            <span class="text-sm sm:text-base text-white/80">Regions</span>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-white/50">|</span>
            <span class="text-2xl sm:text-3xl font-bold">{{ stats.provinces }}</span>
            <span class="text-sm sm:text-base text-white/80">Provinces</span>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-white/50">|</span>
            <span class="text-2xl sm:text-3xl font-bold">{{ stats.municipalities }}</span>
            <span class="text-sm sm:text-base text-white/80">Municipalities</span>
          </div>
          <div class="flex items-baseline gap-2">
            <span class="text-white/50">|</span>
            <span class="text-2xl sm:text-3xl font-bold">{{ stats.members }}</span>
            <span class="text-sm sm:text-base text-white/80">Members</span>
          </div>
        </div>

        <!-- Philosophy / Development Vision -->
        <p class="text-sm sm:text-base text-white/80 max-w-3xl">
          {{ description || 'No description provided.' }}
        </p>

      </div>
    </section>

    <!-- SECTION 4: OFFICERS | NATIONAL COUNCIL | CHAPTERS (BOTTOM) -->
    <section class="w-full bg-primary-600 py-12 sm:py-16">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="flex flex-col sm:flex-row text-center text-white">

          <!-- OFFICERS -->
          <router-link to="/about/officers" class="flex-1 py-4 sm:py-6">
            <div class="flex flex-col items-center">
              <UserCog class="w-8 h-8 mb-2" />
              <h2 class="text-lg font-semibold">Officers</h2>
              <p class="text-sm mt-1 text-white/80">
                Meet our organization's leadership team.
              </p>
            </div>
          </router-link>

          <div class="hidden sm:block w-px bg-white/30 mx-4"></div>
          <div class="sm:hidden h-px bg-white/30 my-2"></div>

          <!-- NATIONAL COUNCIL -->
          <router-link to="/about/national-council" class="flex-1 py-4 sm:py-6">
            <div class="flex flex-col items-center">
              <Building class="w-8 h-8 mb-2" />
              <h2 class="text-lg font-semibold">National Council</h2>
              <p class="text-sm mt-1 text-white/80">
                Our national council members and their roles.
              </p>
            </div>
          </router-link>

          <div class="hidden sm:block w-px bg-white/30 mx-4"></div>
          <div class="sm:hidden h-px bg-white/30 my-2"></div>

          <!-- CHAPTERS -->
          <router-link to="/about/chapters" class="flex-1 py-4 sm:py-6">
            <div class="flex flex-col items-center">
              <MapPin class="w-8 h-8 mb-2" />
              <h2 class="text-lg font-semibold">Chapters</h2>
              <p class="text-sm mt-1 text-white/80">
                Explore our local chapters across the region.
              </p>
            </div>
          </router-link>

        </div>
      </div>
    </section>

  </PublicLayout>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import PublicLayout from '../../layouts/PublicLayout.vue'
import { UserCog, Building, MapPin } from 'lucide-vue-next'
import { aboutUsService } from '../../firebase/firestore'

const description = ref('')
const mission = ref('')
const visionPoints = ref([])
const stats = reactive({
  regions: 0,
  provinces: 0,
  municipalities: 0,
  members: 0
})

const openSections = reactive({
  mission: false,
  vision: false
})

function toggle(section) {
  openSections[section] = !openSections[section]
}

async function loadAboutUs() {
  try {
    const data = await aboutUsService.getAboutUs()
    if (data) {
      description.value = data.description || ''
      mission.value = data.mission || ''
      visionPoints.value = data.vision ? data.vision.split(';') : []
      stats.regions = data.stats?.regions || 0
      stats.provinces = data.stats?.provinces || 0
      stats.municipalities = data.stats?.municipalities || 0
      stats.members = data.stats?.members || 0
    }
  } catch (error) {
    console.error('Failed to load About Us:', error)
  }
}

onMounted(() => {
  loadAboutUs()
})
</script>
