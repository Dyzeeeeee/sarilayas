<template>
  <PublicLayout>
    <!-- Sticky Navigator -->
    <div class="fixed right-0 top-2/3 -translate-y-1/2 z-50 transition-all duration-300 opacity-30 hover:opacity-100">
      <nav class="bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-200/50 p-0 flex flex-col gap-2">
        <!-- Toggle Button -->
        <button
          @click="showNavigator = !showNavigator"
          class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 text-gray-600 hover:bg-primary-100 hover:text-primary-600"
          :title="showNavigator ? 'Hide Navigator' : 'Show Navigator'"
        >
          <Compass v-if="!showNavigator" class="w-5 h-5" />
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <!-- Navigation Items -->
        <a
          v-for="nav in navigatorItems"
          :key="nav.id"
          v-show="showNavigator"
          :href="`#${nav.id}`"
          @click.prevent="scrollToSection(nav.id)"
          :class="[
            'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200',
            activeSection === nav.id
              ? 'bg-primary-600 text-white'
              : 'text-gray-600 hover:bg-primary-100 hover:text-primary-600'
          ]"
          :title="nav.label"
        >
          <component :is="nav.icon" class="w-5 h-5" />
        </a>
      </nav>
    </div>

    <!-- HERO SECTION -->
    <section
      id="hero"
      class="section-animate relative w-full min-h-[calc(100vh-80px)] bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 flex items-center justify-center overflow-hidden"
    >
      <!-- Background Image -->
      <img
        v-if="heroImage && !loading"
        :src="heroImage"
        alt="Hero Background"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <!-- Primary Overlay -->
      <div class="absolute inset-0 bg-primary-600/85"></div>
      <!-- Decorative Elements -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div class="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        <div v-if="loading" class="space-y-6">
          <div class="inline-block mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
            <div class="h-4 w-24 bg-white/30 rounded animate-pulse mx-auto"></div>
          </div>
          <div class="space-y-4">
            <div class="h-12 sm:h-16 lg:h-20 w-3/4 bg-white/20 rounded-lg animate-pulse mx-auto"></div>
            <div class="h-6 sm:h-8 w-full max-w-2xl bg-white/20 rounded-lg animate-pulse mx-auto"></div>
            <div class="h-6 sm:h-8 w-5/6 max-w-2xl bg-white/20 rounded-lg animate-pulse mx-auto"></div>
          </div>
        </div>
        <div v-else>
          <div class="inline-block mb-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
            <span class="text-sm sm:text-base font-semibold text-white uppercase tracking-wider">Who We Are</span>
          </div>
          <h1 class="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl leading-tight">
            {{ title || 'SARILAYA' }}
        </h1>
          <p class="text-xl sm:text-2xl text-white/95 max-w-3xl mx-auto drop-shadow-lg leading-relaxed">
            {{ heroDescription || description || 'Learn more about our organization and our commitment to excellence.' }}
        </p>
        </div>
      </div>
    </section>

    <!-- STATS SECTION -->
    <section id="where-we-are" class="section-animate w-full min-h-[calc(100vh-80px)] bg-gradient-to-b from-white to-gray-50 flex items-center">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 w-full py-3">
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-12">
          <div class="text-center mb-8">
            <h2 v-if="!loading" class="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">Where We Are</h2>
            <div v-if="loading" class="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mx-auto mb-3"></div>
            <div class="w-24 h-1 bg-primary-600 mx-auto rounded-full"></div>
          </div>
          <div v-if="loading" class="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div v-for="n in 4" :key="n" class="text-center">
              <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-200 rounded-2xl mb-4 animate-pulse"></div>
              <div class="h-5 w-20 bg-gray-200 rounded animate-pulse mx-auto"></div>
            </div>
          </div>
          <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div class="text-center group">
              <div class="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-2xl mb-4 group-hover:bg-primary-600 transition-colors">
                <span class="text-3xl sm:text-4xl font-extrabold text-primary-600 group-hover:text-white transition-colors">
                  {{ formatNumber(stats.regions) }}
                </span>
              </div>
              <div class="text-base sm:text-lg text-gray-700 font-semibold">
                Regions
              </div>
            </div>
            <div class="text-center group">
              <div class="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-2xl mb-4 group-hover:bg-primary-600 transition-colors">
                <span class="text-3xl sm:text-4xl font-extrabold text-primary-600 group-hover:text-white transition-colors">
                  {{ formatNumber(stats.provinces) }}
                </span>
              </div>
              <div class="text-base sm:text-lg text-gray-700 font-semibold">
                Provinces
              </div>
            </div>
            <div class="text-center group">
              <div class="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-2xl mb-4 group-hover:bg-primary-600 transition-colors">
                <span class="text-3xl sm:text-4xl font-extrabold text-primary-600 group-hover:text-white transition-colors">
                  {{ formatNumber(stats.municipalities) }}
                </span>
              </div>
              <div class="text-base sm:text-lg text-gray-700 font-semibold">
                Municipalities
              </div>
            </div>
            <div class="text-center group">
              <div class="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-2xl mb-4 group-hover:bg-primary-600 transition-colors">
                <span class="text-3xl sm:text-4xl font-extrabold text-primary-600 group-hover:text-white transition-colors">
                  {{ formatNumber(stats.members) }}
                </span>
              </div>
              <div class="text-base sm:text-lg text-gray-700 font-semibold">
                Members
              </div>
            </div>
          </div>
          <div v-if="statsDescription && !loading" class="text-center mt-8 pt-8 border-t border-gray-200">
            <p class="text-base sm:text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto text-justify">
              {{ statsDescription }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- MISSION & VISION SECTION -->
    <section id="purpose" class="section-animate w-full min-h-[calc(100vh-80px)] bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 flex items-center">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 w-full py-3">
        <div class="text-center mb-12">
          <h2 v-if="!loading" class="text-3xl sm:text-4xl font-extrabold text-white mb-3">Our Purpose</h2>
          <div v-if="loading" class="h-8 w-48 bg-white/20 rounded-lg animate-pulse mx-auto mb-3"></div>
          <div class="w-24 h-1 bg-white mx-auto rounded-full"></div>
        </div>
        <div v-if="loading" class="grid md:grid-cols-2 gap-8">
          <div v-for="n in 2" :key="n" class="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-white/20 p-8 sm:p-10">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-16 h-16 bg-white/20 rounded-xl animate-pulse"></div>
              <div class="h-8 w-32 bg-white/20 rounded animate-pulse"></div>
            </div>
            <div class="space-y-3">
              <div class="h-4 w-full bg-white/20 rounded animate-pulse"></div>
              <div class="h-4 w-5/6 bg-white/20 rounded animate-pulse"></div>
              <div class="h-4 w-4/6 bg-white/20 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
        <div v-else class="grid md:grid-cols-2 gap-8">
          <!-- Mission Card -->
          <div class="group bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-white/30 p-8 sm:p-10 hover:border-white/50 transition-all duration-300">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <Target class="w-8 h-8 text-primary-600" />
              </div>
              <h2 class="text-2xl sm:text-3xl font-bold text-white">Our Mission</h2>
            </div>
            <p class="text-white/90 leading-relaxed text-lg text-justify">
                {{ mission || 'No mission has been set.' }}
              </p>
            </div>

          <!-- Vision Card -->
          <div class="group bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-white/30 p-8 sm:p-10 hover:border-white/50 transition-all duration-300">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <Eye class="w-8 h-8 text-primary-600" />
              </div>
              <h2 class="text-2xl sm:text-3xl font-bold text-white">Our Vision</h2>
        </div>
            <div class="space-y-4">
              <p 
                v-for="(item, index) in visionPoints" 
                :key="index"
                class="text-white/90 leading-relaxed text-lg flex items-start gap-3"
              >
                <span class="text-white font-bold text-xl mt-0.5">▸</span>
                <span>{{ item }}</span>
              </p>
              <p v-if="visionPoints.length === 0" class="text-white/90 text-lg">
                No vision has been set.
              </p>
              </div>
            </div>
        </div>
      </div>
    </section>

    <!-- VALUES SECTION -->
    <section id="values" v-if="loading || (values && values.length > 0)" class="section-animate w-full min-h-[calc(100vh-80px)] bg-gradient-to-b from-white via-primary-50/30 to-white flex items-center">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 w-full py-3">
        <div class="text-center mb-0 md:mb-12">
          <h2 v-if="!loading" class="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">Our Core Values</h2>
          <div v-if="loading" class="h-8 w-56 bg-gray-200 rounded-lg animate-pulse mx-auto mb-3"></div>
          <p v-if="valuesDescription && !loading" class="text-base sm:text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto mb-4 text-justify">
            {{ valuesDescription }}
          </p>
          <p v-else-if="!loading" class="text-lg text-gray-600 max-w-2xl mx-auto">The principles that guide everything we do</p>
          <div v-if="loading" class="h-5 w-64 bg-gray-200 rounded animate-pulse mx-auto mb-4"></div>
          <div class="w-24 h-1 bg-primary-600 mx-auto rounded-full mt-4"></div>
        </div>
        <!-- Timeline Layout -->
        <div v-if="loading || (values && values.length > 0)" class="relative max-w-6xl mx-auto py-8">
          <!-- Timeline Container -->
          <ul class="timeline-list">
            <!-- Timeline Line (Vertical) -->
            <div class="timeline-line"></div>
            
            <!-- Timeline Items -->
            <li
              v-for="(value, index) in (loading ? Array(6).fill(null) : values)"
              :key="index"
              :class="['timeline-item', index % 2 === 1 ? 'timeline-inverted' : '']"
            >
              <!-- Timeline Badge (Dot) -->
              <div class="timeline-badge">
                <span v-if="!loading" class="text-white font-bold text-sm">{{ index + 1 }}</span>
                <div v-else class="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
              
              <!-- Timeline Panel (Content) -->
              <div class="timeline-panel">
                <div v-if="loading" class="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
                  <div class="h-6 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
          </div>
                <div v-else class="bg-white rounded-lg border-2 border-primary-500 p-5 md:p-6 shadow-md">
                  <div class="text-lg sm:text-xl font-bold text-primary-600">
                    {{ value.name }}
          </div>
          </div>
        </div>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- NAVIGATION CARDS SECTION -->
    <section id="explore" class="section-animate w-full min-h-[calc(100vh-80px)] bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 flex items-center">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 w-full py-3">
        <div class="text-center mb-10">
          <h2 class="text-3xl sm:text-4xl font-extrabold text-white mb-3">Explore Our Organization</h2>
          <p class="text-base sm:text-lg text-white/90 max-w-2xl mx-auto">Discover the people and structure that make us who we are</p>
        </div>
        <div class="grid sm:grid-cols-3 gap-4 sm:gap-6">
          <!-- Officers Card -->
          <router-link 
            to="/about/officers" 
            class="group relative rounded-xl overflow-hidden aspect-[4/5] min-h-[300px]"
          >
            <!-- Background Image -->
            <div class="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700">
              <img
                v-if="officersImage"
                :src="officersImage"
                alt="Officers Background"
                class="absolute inset-0 w-full h-full object-cover"
              />
              <div v-else class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIj48cGF0aCBkPSJNMCAwaDQwdjQwSDB6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDMiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-50"></div>
            </div>
            
            <!-- Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-800/60 to-primary-700/40 group-hover:from-primary-900/95 group-hover:via-primary-800/70 transition-all duration-300"></div>
            
            <!-- Content -->
            <div class="relative h-full flex flex-col justify-end p-6 sm:p-8 text-white">
              <h3 class="text-2xl sm:text-3xl font-bold mb-3">Officers</h3>
              <p class="text-sm sm:text-base text-white/90 leading-relaxed mb-4">
                Meet our organization's leadership team and their roles.
              </p>
              
              <!-- Arrow Indicator -->
              <div class="flex items-center text-white opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                <span class="text-sm font-semibold">Learn more</span>
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </router-link>

          <!-- National Council Card -->
          <router-link 
            to="/about/national-council" 
            class="group relative rounded-xl overflow-hidden aspect-[4/5] min-h-[300px]"
          >
            <!-- Background Image -->
            <div class="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800">
              <img
                v-if="nationalCouncilImage"
                :src="nationalCouncilImage"
                alt="National Council Background"
                class="absolute inset-0 w-full h-full object-cover"
              />
              <div v-else class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIj48cGF0aCBkPSJNMCAwaDQwdjQwSDB6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDMiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-50"></div>
            </div>
            
            <!-- Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-800/60 to-primary-700/40 group-hover:from-primary-900/95 group-hover:via-primary-800/70 transition-all duration-300"></div>
            
            <!-- Content -->
            <div class="relative h-full flex flex-col justify-end p-6 sm:p-8 text-white">
              <h3 class="text-2xl sm:text-3xl font-bold mb-3">National Council</h3>
              <p class="text-sm sm:text-base text-white/90 leading-relaxed mb-4">
                Our national council members and their contributions.
              </p>
              
              <!-- Arrow Indicator -->
              <div class="flex items-center text-white opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                <span class="text-sm font-semibold">Learn more</span>
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </router-link>

          <!-- Chapters Card -->
          <router-link 
            to="/about/chapters" 
            class="group relative rounded-xl overflow-hidden aspect-[4/5] min-h-[300px]"
          >
            <!-- Background Image -->
            <div class="absolute inset-0 bg-gradient-to-br from-primary-700 to-primary-900">
              <img
                v-if="chaptersImage"
                :src="chaptersImage"
                alt="Chapters Background"
                class="absolute inset-0 w-full h-full object-cover"
              />
              <div v-else class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIj48cGF0aCBkPSJNMCAwaDQwdjQwSDB6IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDMiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-50"></div>
            </div>
            
            <!-- Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-800/60 to-primary-700/40 group-hover:from-primary-900/95 group-hover:via-primary-800/70 transition-all duration-300"></div>
            
            <!-- Content -->
            <div class="relative h-full flex flex-col justify-end p-6 sm:p-8 text-white">
              <h3 class="text-2xl sm:text-3xl font-bold mb-3">Chapters</h3>
              <p class="text-sm sm:text-base text-white/90 leading-relaxed mb-4">
                Explore our local chapters across different regions.
              </p>
              
              <!-- Arrow Indicator -->
              <div class="flex items-center text-white opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                <span class="text-sm font-semibold">Learn more</span>
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="w-full bg-gradient-to-r from-primary-500 via-primary-700 to-primary-900 text-white py-8 lg:py-12">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          <!-- About Section -->
          <div>
            <h3 class="text-lg font-bold mb-4">About Sarilaya</h3>
            <p class="text-primary-100 text-sm leading-relaxed">
              {{ description || 'Connecting communities and fostering growth through meaningful initiatives and shared values.' }}
            </p>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="text-lg font-bold mb-4">Quick Links</h3>
            <nav class="space-y-2">
              <router-link to="/" class="block text-primary-100 hover:text-white transition-colors text-sm">
                Home
              </router-link>
              <router-link to="/news" class="block text-primary-100 hover:text-white transition-colors text-sm">
                Latest News
              </router-link>
              <router-link to="/projects" class="block text-primary-100 hover:text-white transition-colors text-sm">
                Projects
              </router-link>
              <router-link to="/media" class="block text-primary-100 hover:text-white transition-colors text-sm">
                Media
              </router-link>
              <router-link to="/contact" class="block text-primary-100 hover:text-white transition-colors text-sm">
                Contact Us
              </router-link>
            </nav>
          </div>

          <!-- Contact Info -->
          <div>
            <h3 class="text-lg font-bold mb-4">Contact</h3>
            <div v-if="footerLoading" class="space-y-3">
              <div class="h-4 bg-white/20 rounded animate-pulse"></div>
              <div class="h-4 bg-white/20 rounded animate-pulse"></div>
              <div class="h-4 bg-white/20 rounded animate-pulse"></div>
            </div>
            <div v-else class="space-y-3 text-sm text-primary-100">
              <div v-if="footerContactInfo.email" class="flex items-center gap-2">
                <Mail class="w-4 h-4" />
                <a :href="`mailto:${footerContactInfo.email}`" class="hover:text-white transition-colors">
                  {{ footerContactInfo.email }}
                </a>
              </div>
              <div v-if="footerContactInfo.phone" class="flex items-center gap-2">
                <Phone class="w-4 h-4" />
                <a :href="`tel:${footerContactInfo.phone}`" class="hover:text-white transition-colors">
                  {{ footerContactInfo.phone }}
                </a>
              </div>
              <div v-if="footerContactInfo.address" class="flex items-start gap-2">
                <MapPin class="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{{ footerContactInfo.address }}</span>
              </div>
              <!-- Social Media -->
              <div class="flex gap-3 pt-2">
                <a
                  v-if="footerContactInfo.facebook"
                  :href="footerContactInfo.facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="bg-white/10 hover:bg-white/20 rounded-lg p-2 transition-colors"
                >
                  <Facebook class="w-5 h-5" />
                </a>
                <a
                  v-if="footerContactInfo.youtube"
                  :href="footerContactInfo.youtube"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="bg-white/10 hover:bg-white/20 rounded-lg p-2 transition-colors"
                >
                  <Youtube class="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Copyright -->
        <div class="mt-8 pt-8 border-t border-white/20 text-center text-sm text-primary-100">
          <p>&copy; {{ new Date().getFullYear() }} Sarilaya. All rights reserved.</p>
        </div>
      </div>
    </footer>

  </PublicLayout>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted } from 'vue'
import PublicLayout from '../../layouts/PublicLayout.vue'
import Skeleton from '../../components/Skeleton.vue'
import { UserCog, Building, MapPin, Target, Eye, Home, MapPin as MapPinIcon, Compass, Sparkles, Navigation, BookUser, Goal, Mail, Phone, Facebook, Youtube } from 'lucide-vue-next'
import { aboutUsService, contactService } from '../../firebase/firestore'

const loading = ref(true)
const title = ref('')
const heroImage = ref('')
const heroDescription = ref('')
const description = ref('')
const mission = ref('')
const visionPoints = ref([])
const values = ref([])
const statsDescription = ref('')
const valuesDescription = ref('')
const officersImage = ref('')
const nationalCouncilImage = ref('')
const chaptersImage = ref('')
const stats = reactive({
  regions: 0,
  provinces: 0,
  municipalities: 0,
  members: 0
})

const footerLoading = ref(true)
const footerContactInfo = ref({
  email: '',
  phone: '',
  address: '',
  facebook: '',
  youtube: ''
})

const navigatorItems = [
  { id: 'hero', label: 'Who We Are', icon: Home },
  { id: 'where-we-are', label: 'Where We Are', icon: MapPinIcon },
  { id: 'purpose', label: 'Our Purpose', icon: Goal },
  { id: 'values', label: 'Our Values', icon: Sparkles },
  { id: 'explore', label: 'Explore', icon: BookUser }
]

const activeSection = ref('hero')
const showNavigator = ref(false)
const animatedSections = ref(new Set())
const sectionRefs = ref({})

function scrollToSection(id) {
  const element = document.getElementById(id)
  if (element) {
    const offset = 80
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

function updateActiveSection() {
  const sections = navigatorItems.map(item => item.id)
  const scrollPosition = window.scrollY + 150

  for (let i = sections.length - 1; i >= 0; i--) {
    const section = document.getElementById(sections[i])
    if (section) {
      const sectionTop = section.offsetTop
      if (scrollPosition >= sectionTop) {
        activeSection.value = sections[i]
        break
      }
    }
  }
}

async function loadAboutUs() {
  try {
    loading.value = true
    const data = await aboutUsService.getAboutUs()
    if (data) {
      title.value = data.title || 'SARILAYA'
      heroImage.value = data.heroImage || ''
      heroDescription.value = data.heroDescription || data.description || ''
      description.value = data.description || ''
      mission.value = data.mission || ''
      visionPoints.value = data.vision ? data.vision.split(';').filter(v => v.trim()) : []
      values.value = data.values || []
      statsDescription.value = data.statsDescription || ''
      valuesDescription.value = data.valuesDescription || ''
      officersImage.value = data.officersImage || ''
      nationalCouncilImage.value = data.nationalCouncilImage || ''
      chaptersImage.value = data.chaptersImage || ''
      stats.regions = data.stats?.regions || 0
      stats.provinces = data.stats?.provinces || 0
      stats.municipalities = data.stats?.municipalities || 0
      stats.members = data.stats?.members || 0
    }
  } catch (error) {
    console.error('Failed to load About Us:', error)
  } finally {
    loading.value = false
  }
}

async function loadFooterContactInfo() {
  footerLoading.value = true
  try {
    const data = await contactService.getContact()
    if (data) {
      footerContactInfo.value = {
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        facebook: data.facebook || '',
        youtube: data.youtube || ''
      }
    }
  } catch (error) {
    console.error('Error loading footer contact info:', error)
  } finally {
    footerLoading.value = false
  }
}

function formatNumber(num) {
  if (num >= 1000) {
    return `${Math.floor(num / 1000)}K+`
  }
  return num.toString()
}

function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animatedSections.value.has(entry.target.id)) {
        animatedSections.value.add(entry.target.id)
        entry.target.classList.add('animate-in')
      }
    })
  }, observerOptions)

  // Observe all sections
  navigatorItems.forEach(item => {
    const element = document.getElementById(item.id)
    if (element) {
      observer.observe(element)
    }
  })

  return observer
}

onMounted(() => {
  loadAboutUs()
  loadFooterContactInfo()
  window.addEventListener('scroll', updateActiveSection)
  updateActiveSection()
  
  // Setup scroll animations after content loads
  setTimeout(() => {
    setupScrollAnimations()
  }, 100)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateActiveSection)
})
</script>

<style scoped>
/* Scroll Animation Styles */
.section-animate {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

.section-animate.animate-in {
  opacity: 1;
  transform: translateY(0);
}

/* Hero Section - Fade in with scale */
#hero.section-animate {
  opacity: 0;
  transform: scale(0.95);
  transition: opacity 1s ease-out, transform 1s ease-out;
}

#hero.section-animate.animate-in {
  opacity: 1;
  transform: scale(1);
}

/* Stats Section - Slide up from bottom */
#where-we-are.section-animate {
  opacity: 0;
  transform: translateY(50px);
  transition: opacity 0.8s ease-out 0.2s, transform 0.8s ease-out 0.2s;
}

#where-we-are.section-animate.animate-in {
  opacity: 1;
  transform: translateY(0);
}

/* Purpose Section - Fade in with slight zoom */
#purpose.section-animate {
  opacity: 0;
  transform: scale(0.98);
  transition: opacity 1s ease-out, transform 1s ease-out;
}

#purpose.section-animate.animate-in {
  opacity: 1;
  transform: scale(1);
}

/* Values Section - Slide in from left */
#values.section-animate {
  opacity: 0;
  transform: translateX(-30px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

#values.section-animate.animate-in {
  opacity: 1;
  transform: translateX(0);
}

/* Explore Section - Slide in from right */
#explore.section-animate {
  opacity: 0;
  transform: translateX(30px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

#explore.section-animate.animate-in {
  opacity: 1;
  transform: translateX(0);
}

/* Animate timeline items with stagger */
.timeline-item {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

#values.animate-in .timeline-item {
  animation: fadeInUp 0.6s ease-out forwards;
}

#values.animate-in .timeline-item:nth-child(1) { animation-delay: 0.1s; }
#values.animate-in .timeline-item:nth-child(2) { animation-delay: 0.2s; }
#values.animate-in .timeline-item:nth-child(3) { animation-delay: 0.3s; }
#values.animate-in .timeline-item:nth-child(4) { animation-delay: 0.4s; }
#values.animate-in .timeline-item:nth-child(5) { animation-delay: 0.5s; }
#values.animate-in .timeline-item:nth-child(6) { animation-delay: 0.6s; }

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Animate stats cards */
#where-we-are.animate-in .grid > div {
  animation: fadeInScale 0.6s ease-out forwards;
  opacity: 0;
  transform: scale(0.9);
}

#where-we-are.animate-in .grid > div:nth-child(1) { animation-delay: 0.1s; }
#where-we-are.animate-in .grid > div:nth-child(2) { animation-delay: 0.2s; }
#where-we-are.animate-in .grid > div:nth-child(3) { animation-delay: 0.3s; }
#where-we-are.animate-in .grid > div:nth-child(4) { animation-delay: 0.4s; }

@keyframes fadeInScale {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Animate mission/vision cards */
#purpose.animate-in .grid > div {
  animation: slideInFade 0.8s ease-out forwards;
  opacity: 0;
  transform: translateY(30px);
}

#purpose.animate-in .grid > div:nth-child(1) { animation-delay: 0.2s; }
#purpose.animate-in .grid > div:nth-child(2) { animation-delay: 0.4s; }

@keyframes slideInFade {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Animate explore cards */
#explore.animate-in .grid > div {
  animation: rotateIn 0.6s ease-out forwards;
  opacity: 0;
  transform: rotate(-5deg) scale(0.9);
}

#explore.animate-in .grid > div:nth-child(1) { animation-delay: 0.1s; }
#explore.animate-in .grid > div:nth-child(2) { animation-delay: 0.2s; }
#explore.animate-in .grid > div:nth-child(3) { animation-delay: 0.3s; }

@keyframes rotateIn {
  to {
    opacity: 1;
    transform: rotate(0deg) scale(1);
  }
}

.timeline-list {
  list-style: none;
  padding: 20px 0;
  position: relative;
  margin: 0;
}

.timeline-line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 3px;
  background-color: #a855f7; /* primary-500 */
  z-index: 0;
}

@media (max-width: 767px) {
  .timeline-line {
    left: 40px;
    transform: none;
  }
}

.timeline-item {
  margin-bottom: 40px;
  position: relative;
  clear: both;
}

.timeline-item::before,
.timeline-item::after {
  content: " ";
  display: table;
}

.timeline-item::after {
  clear: both;
}

.timeline-badge {
  color: white;
  width: 50px;
  height: 50px;
  line-height: 50px;
  font-size: 1.4em;
  text-align: center;
  position: absolute;
  top: 16px;
  left: 50%;
  margin-left: -25px;
  background-color: #9333ea; /* primary-600 */
  z-index: 100;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4px solid white;
  box-shadow: 0 2px 8px rgba(147, 51, 234, 0.3);
}

@media (max-width: 767px) {
  .timeline-badge {
    left: 15px;
    margin-left: 0;
    top: 16px;
  }
}

.timeline-panel {
  width: 46%;
  float: left;
  position: relative;
  border-radius: 8px;
}

.timeline-panel::before {
  display: none;
}

.timeline-panel::after {
  display: none;
}

.timeline-item.timeline-inverted .timeline-panel {
  float: right;
}


@media (max-width: 767px) {
  .timeline-panel {
    width: calc(100% - 90px);
    float: right;
  }

}
</style>
