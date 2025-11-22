<template>
  <AdminLayout>
    <div class="space-y-3 md:space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
      <div>
          <h1 class="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p class="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">Overview of your content and activity</p>
        </div>
        <button
          @click="loadAllStats"
          :disabled="loading"
          class="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 md:gap-2"
        >
          <RefreshCw :class="['h-4 w-4', loading && 'animate-spin']" />
          Refresh
        </button>
      </div>

      <!-- Key Metrics -->
      <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 md:gap-4">
        <div class="bg-white rounded-lg border border-gray-200 p-2 md:p-4 hover:border-primary-300 transition-colors">
          <div class="flex items-center gap-2 md:gap-3">
            <div class="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
              <Users class="h-4 w-4 md:h-5 md:w-5 text-primary-600" />
            </div>
            <div class="flex-1 min-w-0">
              <div v-if="loading" class="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
              <div v-else>
                <p class="text-lg md:text-2xl font-bold text-gray-900">{{ stats.officers }}</p>
                <p class="text-[10px] md:text-xs text-gray-500 mt-0.5">Officers</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-2 md:p-4 hover:border-primary-300 transition-colors">
          <div class="flex items-center gap-2 md:gap-3">
            <div class="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
              <Building2 class="h-5 w-5 text-primary-600" />
            </div>
            <div class="flex-1 min-w-0">
              <div v-if="loading" class="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
              <div v-else>
                <p class="text-2xl font-bold text-gray-900">{{ stats.council }}</p>
                <p class="text-xs text-gray-500 mt-0.5">Council</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-2 md:p-4 hover:border-primary-300 transition-colors">
          <div class="flex items-center gap-2 md:gap-3">
            <div class="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
              <MapPin class="h-5 w-5 text-primary-600" />
            </div>
            <div class="flex-1 min-w-0">
              <div v-if="loading" class="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
              <div v-else>
                <p class="text-2xl font-bold text-gray-900">{{ stats.chapters }}</p>
                <p class="text-xs text-gray-500 mt-0.5">Chapters</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-2 md:p-4 hover:border-primary-300 transition-colors">
          <div class="flex items-center gap-2 md:gap-3">
            <div class="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
              <Newspaper class="h-5 w-5 text-primary-600" />
            </div>
            <div class="flex-1 min-w-0">
              <div v-if="loading" class="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
              <div v-else>
                <p class="text-2xl font-bold text-gray-900">{{ stats.news }}</p>
                <p class="text-xs text-gray-500 mt-0.5">News</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-2 md:p-4 hover:border-primary-300 transition-colors">
          <div class="flex items-center gap-2 md:gap-3">
            <div class="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
              <FolderOpen class="h-5 w-5 text-primary-600" />
            </div>
            <div class="flex-1 min-w-0">
              <div v-if="loading" class="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
              <div v-else>
                <p class="text-2xl font-bold text-gray-900">{{ stats.projects }}</p>
                <p class="text-xs text-gray-500 mt-0.5">Projects</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-2 md:p-4 hover:border-primary-300 transition-colors">
          <div class="flex items-center gap-2 md:gap-3">
            <div class="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
              <Image class="h-5 w-5 text-primary-600" />
            </div>
            <div class="flex-1 min-w-0">
              <div v-if="loading" class="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
              <div v-else>
                <p class="text-2xl font-bold text-gray-900">{{ stats.photos }}</p>
                <p class="text-xs text-gray-500 mt-0.5">Photos</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg border border-gray-200 p-2 md:p-4 hover:border-primary-300 transition-colors">
          <div class="flex items-center gap-2 md:gap-3">
            <div class="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
              <Video class="h-5 w-5 text-primary-600" />
            </div>
            <div class="flex-1 min-w-0">
              <div v-if="loading" class="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
              <div v-else>
                <p class="text-2xl font-bold text-gray-900">{{ stats.videos }}</p>
                <p class="text-xs text-gray-500 mt-0.5">Videos</p>
              </div>
            </div>
          </div>
      </div>

        <div class="bg-white rounded-lg border border-gray-200 p-4 hover:border-primary-300 transition-colors relative">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0 relative">
              <Mail class="h-5 w-5 text-primary-600" />
              <span v-if="!loading && stats.unreadMessages > 0" class="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                <span class="text-[10px] font-bold text-white">{{ stats.unreadMessages > 9 ? '9+' : stats.unreadMessages }}</span>
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <div v-if="loading" class="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
              <div v-else>
                <p class="text-2xl font-bold text-gray-900">{{ stats.messages }}</p>
                <p class="text-xs text-gray-500 mt-0.5">{{ stats.unreadMessages }} unread</p>
              </div>
            </div>
            </div>
          </div>
        </div>

      <!-- Main Content Area -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-6">
        <!-- Activity Chart -->
        <div class="lg:col-span-8 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div class="px-3 md:px-6 py-2 md:py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 class="text-base md:text-lg font-semibold text-gray-900">Activity Overview</h2>
              <p class="text-[10px] md:text-xs text-gray-500 mt-0.5">{{ chartPeriod === 1 ? 'Content activity today' : `Content activity over the last ${chartPeriod} days` }}</p>
        </div>
            <select
              v-model="chartPeriod"
              @change="updateChartData"
              class="text-xs border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="1">Today</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
            </select>
          </div>
          <div class="p-3 md:p-6">
            <div v-if="loadingChart" class="h-80 flex items-center justify-center">
              <div class="animate-pulse text-gray-400">Loading chart data...</div>
            </div>
            <div v-else>
              <VueApexCharts
                type="bar"
                height="320"
                :options="chartOptions"
                :series="chartSeries"
              ></VueApexCharts>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="lg:col-span-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div class="px-3 md:px-6 py-2 md:py-4 border-b border-gray-200">
            <h2 class="text-base md:text-lg font-semibold text-gray-900">Recent Activity</h2>
            <p class="text-[10px] md:text-xs text-gray-500 mt-0.5">Latest updates</p>
          </div>
          <div class="p-3 md:p-6">
            <div v-if="loading" class="space-y-2 md:space-y-3">
              <div v-for="n in 6" :key="n" class="animate-pulse flex items-center gap-2 md:gap-3">
                <div class="h-8 w-8 md:h-10 md:w-10 bg-gray-200 rounded-lg"></div>
            <div class="flex-1">
                  <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
            <div v-else-if="recentActivity.length > 0" class="space-y-2 md:space-y-3">
              <div
                v-for="item in recentActivity.slice(0, 6)"
                :key="item.id"
                class="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50/30 transition-all cursor-pointer"
                @click="handleActivityClick(item)"
              >
                <div class="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                  <component :is="getActivityIcon(item.type)" class="h-4 w-4 md:h-5 md:w-5 text-primary-600" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-900 truncate">{{ item.title || 'Untitled' }}</p>
                  <p class="text-xs text-gray-500 mt-0.5">{{ getActivityTypeLabel(item.type) }} • {{ formatActivityDate(item.date) }}</p>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-4 md:py-8">
              <p class="text-xs md:text-sm text-gray-500">No recent activity</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Messages, Quick Actions & Summary -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-6">
        <!-- Recent Messages -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div class="px-3 md:px-6 py-2 md:py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 class="text-base md:text-lg font-semibold text-gray-900">Recent Messages</h2>
              <p class="text-[10px] md:text-xs text-gray-500 mt-0.5">Contact form submissions</p>
            </div>
            <router-link
              to="/admin/messages"
              class="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              View all
              <ChevronRight class="h-4 w-4" />
            </router-link>
          </div>
          <div class="p-3 md:p-6">
            <div v-if="loadingMessages" class="space-y-2 md:space-y-4">
              <div v-for="n in 3" :key="n" class="animate-pulse">
                <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div v-else-if="recentMessages.length > 0" class="space-y-2 md:space-y-4">
              <div
                v-for="message in recentMessages"
                :key="message.id"
                class="p-2 md:p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50/30 transition-all"
                :class="{ 'border-primary-300 bg-primary-50/30': !message.read }"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <h3 class="text-sm font-semibold text-gray-900">{{ message.name }}</h3>
                      <span
                        v-if="!message.read"
                        class="px-2 py-0.5 text-xs font-medium bg-primary-600 text-white rounded-full"
                      >
                        New
                      </span>
                    </div>
                    <p class="text-sm font-medium text-gray-700 mb-1">{{ message.subject }}</p>
                    <p class="text-xs text-gray-500 line-clamp-2 mb-2">{{ message.message }}</p>
                    <p class="text-xs text-gray-400">{{ formatDate(message.createdAt) }}</p>
                  </div>
                  <a
                    :href="`mailto:${message.email}`"
                    class="shrink-0 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Reply via email"
                  >
                    <Mail class="h-4 w-4 text-gray-400" />
                  </a>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-4 md:py-8">
              <Mail class="h-8 w-8 md:h-12 md:w-12 text-gray-300 mx-auto mb-2 md:mb-3" />
              <p class="text-xs md:text-sm text-gray-500">No messages yet</p>
          </div>
        </div>
      </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div class="px-3 md:px-6 py-2 md:py-4 border-b border-gray-200">
            <h2 class="text-base md:text-lg font-semibold text-gray-900">Quick Actions</h2>
            <p class="text-[10px] md:text-xs text-gray-500 mt-0.5">Common tasks</p>
        </div>
          <div class="p-3 md:p-6 space-y-1.5 md:space-y-2">
            <router-link
              to="/admin/news"
              class="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50/50 transition-colors group"
            >
              <div class="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                <Plus class="h-4 w-4 md:h-5 md:w-5 text-primary-600" />
              </div>
              <div class="flex-1">
                <p class="text-sm font-semibold text-gray-900">Add News Article</p>
                <p class="text-xs text-gray-500">Create new announcement</p>
              </div>
            </router-link>
            <router-link
              to="/admin/projects"
              class="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50/50 transition-colors group"
            >
              <div class="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                <Plus class="h-4 w-4 md:h-5 md:w-5 text-primary-600" />
              </div>
              <div class="flex-1">
                <p class="text-sm font-semibold text-gray-900">Add Project</p>
                <p class="text-xs text-gray-500">Create new project</p>
              </div>
            </router-link>
            <router-link
              to="/admin/photos"
              class="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50/50 transition-colors group"
            >
              <div class="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                <Plus class="h-4 w-4 md:h-5 md:w-5 text-primary-600" />
              </div>
              <div class="flex-1">
                <p class="text-sm font-semibold text-gray-900">Upload Photo</p>
                <p class="text-xs text-gray-500">Add to gallery</p>
              </div>
            </router-link>
            <router-link
              to="/admin/videos"
              class="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50/50 transition-colors group"
            >
              <div class="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                <Plus class="h-4 w-4 md:h-5 md:w-5 text-primary-600" />
              </div>
              <div class="flex-1">
                <p class="text-sm font-semibold text-gray-900">Add Video</p>
                <p class="text-xs text-gray-500">Add YouTube link</p>
              </div>
            </router-link>
            <router-link
              to="/admin/about/officers"
              class="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg border border-gray-200 hover:border-primary-300 hover:bg-primary-50/50 transition-colors group"
            >
              <div class="h-8 w-8 md:h-10 md:w-10 rounded-lg bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                <Plus class="h-4 w-4 md:h-5 md:w-5 text-primary-600" />
              </div>
              <div class="flex-1">
                <p class="text-sm font-semibold text-gray-900">Add Officer</p>
                <p class="text-xs text-gray-500">Add team member</p>
              </div>
            </router-link>
          </div>
        </div>

        <!-- Summary -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div class="px-3 md:px-6 py-2 md:py-4 border-b border-gray-200">
            <h2 class="text-base md:text-lg font-semibold text-gray-900">Activity Summary</h2>
            <p class="text-[10px] md:text-xs text-gray-500 mt-0.5">Last {{ chartPeriod === 1 ? '24 hours' : `${chartPeriod} days` }}</p>
          </div>
          <div class="p-3 md:p-6 space-y-2 md:space-y-4">
            <div v-if="loadingChart" class="space-y-2 md:space-y-3">
              <div v-for="n in 4" :key="n" class="animate-pulse">
                <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div class="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
            <div v-else class="space-y-2 md:space-y-4">
              <div class="flex items-center justify-between p-2 md:p-3 rounded-lg bg-primary-50/30 border border-primary-100">
                <div class="flex items-center gap-2 md:gap-3">
                  <div class="h-7 w-7 md:h-8 md:w-8 rounded-lg bg-primary-100 flex items-center justify-center">
                    <Mail class="h-3 w-3 md:h-4 md:w-4 text-primary-600" />
                  </div>
                  <div>
                    <p class="text-xs md:text-sm font-semibold text-gray-900">Messages</p>
                    <p class="text-[10px] md:text-xs text-gray-500">Contact submissions</p>
                  </div>
                </div>
                <p class="text-base md:text-lg font-bold text-primary-600">{{ chartSummary.messages }}</p>
              </div>
              <div class="flex items-center justify-between p-3 rounded-lg bg-green-50/30 border border-green-100">
                <div class="flex items-center gap-3">
                  <div class="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <Newspaper class="h-3 w-3 md:h-4 md:w-4 text-green-600" />
                  </div>
                  <div>
                    <p class="text-xs md:text-sm font-semibold text-gray-900">News</p>
                    <p class="text-[10px] md:text-xs text-gray-500">Articles published</p>
                  </div>
                </div>
                <p class="text-base md:text-lg font-bold text-green-600">{{ chartSummary.news }}</p>
              </div>
              <div class="flex items-center justify-between p-3 rounded-lg bg-pink-50/30 border border-pink-100">
                <div class="flex items-center gap-3">
                  <div class="h-8 w-8 rounded-lg bg-pink-100 flex items-center justify-center">
                    <FolderOpen class="h-3 w-3 md:h-4 md:w-4 text-pink-600" />
                  </div>
                  <div>
                    <p class="text-xs md:text-sm font-semibold text-gray-900">Projects</p>
                    <p class="text-[10px] md:text-xs text-gray-500">Projects added</p>
                  </div>
                </div>
                <p class="text-base md:text-lg font-bold text-pink-600">{{ chartSummary.projects }}</p>
              </div>
              <div class="flex items-center justify-between p-3 rounded-lg bg-primary-50/30 border border-primary-100">
                <div class="flex items-center gap-3">
                  <div class="h-8 w-8 rounded-lg bg-primary-100 flex items-center justify-center">
                    <Image class="h-3 w-3 md:h-4 md:w-4 text-primary-600" />
                  </div>
                  <div>
                    <p class="text-xs md:text-sm font-semibold text-gray-900">Media</p>
                    <p class="text-[10px] md:text-xs text-gray-500">Photos & videos</p>
                  </div>
                </div>
                <p class="text-base md:text-lg font-bold text-primary-600">{{ chartSummary.media }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Management Sections -->
      <div>
        <h2 class="text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-4">Content Management</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
          <!-- About Us -->
          <router-link
            to="/admin/about"
            class="bg-white rounded-lg border border-gray-200 p-3 md:p-5 hover:border-primary-300 hover:bg-primary-50/30 transition-all group"
          >
            <div class="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <div class="h-10 w-10 md:h-12 md:w-12 rounded-lg bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                <Users class="h-5 w-5 md:h-6 md:w-6 text-primary-600" />
              </div>
              <div>
                <h3 class="text-sm md:text-base font-semibold text-gray-900 group-hover:text-primary-700">About Us</h3>
                <p class="text-[10px] md:text-xs text-gray-500">Organization information</p>
              </div>
        </div>
            <p class="text-xs md:text-sm text-gray-600">Manage general info, values, officers, council, and chapters</p>
          </router-link>

          <!-- News -->
            <router-link
              to="/admin/news"
            class="bg-white rounded-lg border border-gray-200 p-3 md:p-5 hover:border-primary-300 hover:bg-primary-50/30 transition-all group"
          >
            <div class="flex items-center gap-3 mb-3">
              <div class="h-12 w-12 rounded-lg bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                <Newspaper class="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 class="text-base font-semibold text-gray-900 group-hover:text-primary-700">News</h3>
                <p class="text-xs text-gray-500">Articles & announcements</p>
              </div>
            </div>
            <p class="text-sm text-gray-600">Create and manage news articles and announcements</p>
            </router-link>

          <!-- Projects -->
            <router-link
              to="/admin/projects"
            class="bg-white rounded-lg border border-gray-200 p-3 md:p-5 hover:border-primary-300 hover:bg-primary-50/30 transition-all group"
          >
            <div class="flex items-center gap-3 mb-3">
              <div class="h-12 w-12 rounded-lg bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                <FolderOpen class="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 class="text-base font-semibold text-gray-900 group-hover:text-primary-700">Projects</h3>
                <p class="text-xs text-gray-500">Organization projects</p>
              </div>
            </div>
            <p class="text-sm text-gray-600">Manage organization projects and initiatives</p>
            </router-link>

          <!-- Media -->
            <router-link
            to="/admin/photos"
            class="bg-white rounded-lg border border-gray-200 p-3 md:p-5 hover:border-primary-300 hover:bg-primary-50/30 transition-all group"
          >
            <div class="flex items-center gap-3 mb-3">
              <div class="h-12 w-12 rounded-lg bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                <Image class="h-6 w-6 text-primary-600" />
          </div>
              <div>
                <h3 class="text-base font-semibold text-gray-900 group-hover:text-primary-700">Media</h3>
                <p class="text-xs text-gray-500">Photos & videos</p>
        </div>
      </div>
            <p class="text-sm text-gray-600">Manage photo gallery and video collection</p>
          </router-link>

          <!-- Contact -->
            <router-link
            to="/admin/contact"
            class="bg-white rounded-lg border border-gray-200 p-3 md:p-5 hover:border-primary-300 hover:bg-primary-50/30 transition-all group"
          >
            <div class="flex items-center gap-3 mb-3">
              <div class="h-12 w-12 rounded-lg bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                <Mail class="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h3 class="text-base font-semibold text-gray-900 group-hover:text-primary-700">Contact</h3>
                <p class="text-xs text-gray-500">Contact information</p>
              </div>
            </div>
            <p class="text-sm text-gray-600">Update contact details and manage messages</p>
            </router-link>

          <!-- Messages -->
            <router-link
            to="/admin/messages"
            class="bg-white rounded-lg border border-gray-200 p-5 hover:border-primary-300 hover:bg-primary-50/30 transition-all group relative"
          >
            <div class="flex items-center gap-3 mb-3">
              <div class="h-12 w-12 rounded-lg bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors relative">
                <Mail class="h-6 w-6 text-primary-600" />
                <span v-if="!loading && stats.unreadMessages > 0" class="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                  <span class="text-[10px] font-bold text-white">{{ stats.unreadMessages > 9 ? '9+' : stats.unreadMessages }}</span>
                </span>
              </div>
              <div>
                <h3 class="text-base font-semibold text-gray-900 group-hover:text-primary-700">Messages</h3>
                <p class="text-xs text-gray-500">Contact form submissions</p>
              </div>
            </div>
            <p class="text-sm text-gray-600">View and manage all contact form messages</p>
            </router-link>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import AdminLayout from '../../layouts/AdminLayout.vue'
import { aboutUsService, newsService, projectsService, mediaService, contactService } from '../../firebase/firestore'
import { Users, Building2, MapPin, Newspaper, FolderOpen, Image, Video, Mail, RefreshCw, ChevronRight, Plus } from 'lucide-vue-next'
import VueApexCharts from 'vue3-apexcharts'

const loading = ref(true)
const loadingMessages = ref(true)
const loadingChart = ref(true)
const chartPeriod = ref(7)
const stats = ref({
  officers: 0,
  council: 0,
  chapters: 0,
  news: 0,
  projects: 0,
  photos: 0,
  videos: 0,
  messages: 0,
  unreadMessages: 0
})
const recentMessages = ref([])
const recentActivity = ref([])
const chartData = ref([])
const chartSummary = ref({
  messages: 0,
  news: 0,
  projects: 0,
  media: 0
})

const chartSeries = computed(() => {
  return [
    {
      name: 'Messages',
      data: chartData.value.map(day => day.messages)
    },
    {
      name: 'News',
      data: chartData.value.map(day => day.news)
    },
    {
      name: 'Projects',
      data: chartData.value.map(day => day.projects)
    },
    {
      name: 'Media',
      data: chartData.value.map(day => day.media)
    }
  ]
})

const chartOptions = computed(() => {
  return {
    chart: {
      type: 'bar',
      stacked: true,
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        borderRadius: 4
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 1,
      colors: ['#fff']
    },
    xaxis: {
      categories: chartData.value.map(day => formatChartDate(day)),
      labels: {
        style: {
          fontSize: '11px',
          colors: '#6B7280'
        },
        rotate: chartPeriod.value === 1 ? 0 : -45,
        rotateAlways: false
      }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '11px',
          colors: '#6B7280'
        }
      }
    },
    fill: {
      opacity: 1
    },
    colors: ['#9333ea', '#22c55e', '#ec4899', '#c084fc'],
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      fontSize: '12px',
      markers: {
        width: 12,
        height: 12,
        radius: 4
      }
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + ' items'
        }
      }
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    }
  }
})

function getDateKey(date) {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function parseDate(date) {
  if (!date) return null
  if (date.toDate) return date.toDate()
  if (date instanceof Date) return date
  if (typeof date === 'string' || typeof date === 'number') return new Date(date)
  return null
}

function updateChartData() {
  loadingChart.value = true
  try {
    const days = chartPeriod.value
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Initialize chart data for the period
    const dataMap = {}
    
    if (days === 1) {
      // For "Today", show hourly data
      const now = new Date()
      const currentHour = now.getHours()
      for (let i = 0; i <= currentHour; i++) {
        const date = new Date(today)
        date.setHours(i, 0, 0, 0)
        const key = `${getDateKey(date)}-${String(i).padStart(2, '0')}`
        dataMap[key] = {
          date: new Date(date),
          messages: 0,
          news: 0,
          projects: 0,
          media: 0,
          isHourly: true,
          hour: i
        }
      }
    } else {
      // For multiple days, show daily data
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const key = getDateKey(date)
        dataMap[key] = {
          date: new Date(date),
          messages: 0,
          news: 0,
          projects: 0,
          media: 0,
          isHourly: false
        }
      }
    }

    // Process messages
    allMessages.value.forEach(msg => {
      const date = parseDate(msg.createdAt)
      if (date) {
        let key
        if (days === 1) {
          const hour = date.getHours()
          const dateKey = getDateKey(date)
          key = `${dateKey}-${String(hour).padStart(2, '0')}`
        } else {
          key = getDateKey(date)
        }
        if (dataMap[key]) {
          dataMap[key].messages++
        }
      }
    })

    // Process news
    allNews.value.forEach(article => {
      const date = parseDate(article.publishDate || article.createdAt)
      if (date) {
        let key
        if (days === 1) {
          const hour = date.getHours()
          const dateKey = getDateKey(date)
          key = `${dateKey}-${String(hour).padStart(2, '0')}`
        } else {
          key = getDateKey(date)
        }
        if (dataMap[key]) {
          dataMap[key].news++
        }
      }
    })

    // Process projects
    allProjects.value.forEach(project => {
      const date = parseDate(project.createdAt)
      if (date) {
        let key
        if (days === 1) {
          const hour = date.getHours()
          const dateKey = getDateKey(date)
          key = `${dateKey}-${String(hour).padStart(2, '0')}`
        } else {
          key = getDateKey(date)
        }
        if (dataMap[key]) {
          dataMap[key].projects++
        }
      }
    })

    // Process media
    allMedia.value.forEach(media => {
      const date = parseDate(media.createdAt)
      if (date) {
        let key
        if (days === 1) {
          const hour = date.getHours()
          const dateKey = getDateKey(date)
          key = `${dateKey}-${String(hour).padStart(2, '0')}`
        } else {
          key = getDateKey(date)
        }
        if (dataMap[key]) {
          dataMap[key].media++
        }
      }
    })

    chartData.value = Object.values(dataMap)
    
    // Calculate summary
    chartSummary.value = {
      messages: chartData.value.reduce((sum, day) => sum + day.messages, 0),
      news: chartData.value.reduce((sum, day) => sum + day.news, 0),
      projects: chartData.value.reduce((sum, day) => sum + day.projects, 0),
      media: chartData.value.reduce((sum, day) => sum + day.media, 0)
    }
  } catch (error) {
    console.error('Error updating chart data:', error)
  } finally {
    loadingChart.value = false
  }
}

function formatChartDate(dayData) {
  const d = new Date(dayData.date)
  if (dayData.isHourly) {
    const hour = dayData.hour
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}${period}`
  } else {
    const day = d.getDate()
    const month = d.toLocaleDateString('en-US', { month: 'short' })
    return `${day} ${month}`
  }
}

const allMessages = ref([])
const allNews = ref([])
const allProjects = ref([])
const allMedia = ref([])

function buildRecentActivity() {
  const activities = []
  
  // Add news articles
  allNews.value.forEach(article => {
    activities.push({
      id: `news-${article.id}`,
      type: 'news',
      title: article.title || 'Untitled Article',
      date: parseDate(article.publishDate || article.createdAt),
      item: article
    })
  })
  
  // Add projects
  allProjects.value.forEach(project => {
    activities.push({
      id: `project-${project.id}`,
      type: 'project',
      title: project.title || 'Untitled Project',
      date: parseDate(project.createdAt),
      item: project
    })
  })
  
  // Add photos
  allMedia.value.filter(m => m.type === 'photo').forEach(photo => {
    activities.push({
      id: `photo-${photo.id}`,
      type: 'photo',
      title: photo.title || 'Untitled Photo',
      date: parseDate(photo.createdAt),
      item: photo
    })
  })
  
  // Add videos
  allMedia.value.filter(m => m.type === 'video').forEach(video => {
    activities.push({
      id: `video-${video.id}`,
      type: 'video',
      title: video.title || 'Untitled Video',
      date: parseDate(video.createdAt),
      item: video
    })
  })
  
  // Add messages
  allMessages.value.forEach(message => {
    activities.push({
      id: `message-${message.id}`,
      type: 'message',
      title: message.subject || `Message from ${message.name}`,
      date: parseDate(message.createdAt),
      item: message
    })
  })
  
  // Sort by date (newest first) and take top 10
  recentActivity.value = activities
    .filter(a => a.date)
    .sort((a, b) => b.date - a.date)
    .slice(0, 10)
}

function getActivityIcon(type) {
  const icons = {
    news: Newspaper,
    project: FolderOpen,
    photo: Image,
    video: Video,
    message: Mail
  }
  return icons[type] || Newspaper
}

function getActivityTypeLabel(type) {
  const labels = {
    news: 'News Article',
    project: 'Project',
    photo: 'Photo',
    video: 'Video',
    message: 'Message'
  }
  return labels[type] || 'Item'
}

function formatActivityDate(date) {
  if (!date) return 'Unknown date'
  
  const now = new Date()
  const diffMs = now - date
  const diffMinutes = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffMinutes < 1) {
    return 'Just now'
  } else if (diffMinutes < 60) {
    return `${diffMinutes}m ago`
  } else if (diffHours < 24) {
    return `${diffHours}h ago`
  } else if (diffDays < 7) {
    return `${diffDays}d ago`
  }
  
  const options = { 
    month: 'short', 
    day: 'numeric'
  }
  return date.toLocaleDateString('en-US', options)
}

function handleActivityClick(item) {
  if (item.type === 'news') {
    window.location.href = `/admin/news`
  } else if (item.type === 'project') {
    window.location.href = `/admin/projects`
  } else if (item.type === 'photo') {
    window.location.href = `/admin/photos`
  } else if (item.type === 'video') {
    window.location.href = `/admin/videos`
  } else if (item.type === 'message') {
    window.location.href = `/admin/messages`
  }
}

function formatDate(date) {
  if (!date) return 'Unknown date'
  
  let dateObj
  if (date.toDate) {
    dateObj = date.toDate()
  } else if (date instanceof Date) {
    dateObj = date
  } else if (typeof date === 'string' || typeof date === 'number') {
    dateObj = new Date(date)
  } else {
    return 'Unknown date'
  }
  
  const now = new Date()
  const diffMs = now - dateObj
  const diffMinutes = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffMinutes < 1) {
    return 'Just now'
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  }
  
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  return dateObj.toLocaleDateString('en-US', options)
}

async function loadAllStats() {
  loading.value = true
  loadingMessages.value = true
  loadingChart.value = true
  try {
    const [officers, council, chapters, news, projects, photos, videos, messages] = await Promise.all([
      aboutUsService.getOfficers(),
      aboutUsService.getNationalCouncil(),
      aboutUsService.getChapters(),
      newsService.getNews(),
      projectsService.getProjects(),
      mediaService.getPhotos(),
      mediaService.getVideos(),
      contactService.getMessages()
    ])
    
    stats.value = {
      officers: officers.length,
      council: council.length,
      chapters: chapters.length,
      news: news.length,
      projects: projects.length,
      photos: photos.length,
      videos: videos.length,
      messages: messages.length,
      unreadMessages: messages.filter(m => !m.read).length
    }

    // Get 3 most recent messages
    recentMessages.value = messages.slice(0, 3)

    // Store all data for chart
    allMessages.value = messages
    allNews.value = news
    allProjects.value = projects
    allMedia.value = [...photos, ...videos]

    // Build recent activity
    buildRecentActivity()

    // Update chart data
    updateChartData()
  } catch (error) {
    console.error('Error loading stats:', error)
  } finally {
    loading.value = false
    loadingMessages.value = false
  }
}

onMounted(() => {
  loadAllStats()
})
</script>
