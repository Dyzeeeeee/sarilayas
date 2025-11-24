<template>
  <div class="min-h-screen flex bg-gray-100">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 w-72 md:w-64 bg-white lg:bg-gray-900 text-gray-900 lg:text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-2xl lg:shadow-none rounded-r-2xl lg:rounded-none',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <!-- Sidebar Header -->
      <div class="flex items-center justify-between h-14 md:h-16 px-4 md:px-6 border-b border-gray-200 lg:border-gray-800/50">
        <router-link to="/admin" class="flex items-center space-x-2 group">
          <span class="text-lg md:text-xl font-semibold tracking-tight">{{ siteName }} Admin</span>
          <span class="text-[10px] md:text-xs bg-primary-600 px-1.5 md:px-2 py-0.5 rounded font-medium">ADMIN</span>
        </router-link>
        <button
          @click="sidebarOpen = false"
          class="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 lg:hover:bg-gray-800/50 transition-colors"
        >
          <svg class="h-5 w-5 text-gray-600 lg:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Sidebar Navigation -->
      <nav class="flex-1 px-3 md:px-4 py-4 md:py-6 overflow-y-auto">
        <div class="space-y-0.5 md:space-y-1">
          <!-- Dashboard -->
          <router-link
            to="/admin"
            @click="sidebarOpen = false"
            class="flex items-center px-3 md:px-4 py-2 md:py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
            :class="route.path === '/admin' ? 'bg-primary-50 lg:bg-primary-600/20 text-primary-600 lg:text-white border-l-2 border-primary-500' : 'text-gray-700 lg:text-gray-300 hover:bg-gray-100 lg:hover:bg-gray-800/50 hover:text-primary-600 lg:hover:text-white'"
          >
            <svg class="mr-3 h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </router-link>

          <!-- About Us Section -->
          <div>
            <button
              @click="aboutUsExpanded = !aboutUsExpanded"
              class="w-full flex items-center justify-between px-3 md:px-4 py-2 md:py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
              :class="isAboutUsActive ? 'bg-primary-50 lg:bg-primary-600/20 text-primary-600 lg:text-white border-l-2 border-primary-500' : 'text-gray-700 lg:text-gray-300 hover:bg-gray-100 lg:hover:bg-gray-800/50 hover:text-primary-600 lg:hover:text-white'"
            >
              <div class="flex items-center">
                <svg class="mr-3 h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About Us
              </div>
              <svg
                class="h-4 w-4 transition-transform duration-200 shrink-0"
                :class="{ 'rotate-180': aboutUsExpanded }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div v-show="aboutUsExpanded" class="mt-1 md:mt-1.5 ml-3 md:ml-4 space-y-0.5 border-l border-gray-200 lg:border-gray-800/50 pl-2">
              <router-link
                v-for="item in aboutUsItems"
                :key="item.path"
                :to="item.path"
                @click="sidebarOpen = false"
                class="flex items-center px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm rounded-md transition-all duration-200"
                :class="route.path === item.path ? 'bg-primary-50 lg:bg-primary-600/20 text-primary-600 lg:text-white border-l-2 border-primary-500' : 'text-gray-600 lg:text-gray-400 hover:bg-gray-100 lg:hover:bg-gray-800/50 hover:text-primary-600 lg:hover:text-white'"
              >
                <span class="ml-6">{{ item.label }}</span>
              </router-link>
            </div>
          </div>

          <!-- Contact -->
          <router-link
            to="/admin/contact"
            @click="sidebarOpen = false"
            class="flex items-center px-3 md:px-4 py-2 md:py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
            :class="route.path === '/admin/contact' ? 'bg-primary-50 lg:bg-primary-600/20 text-primary-600 lg:text-white border-l-2 border-primary-500' : 'text-gray-700 lg:text-gray-300 hover:bg-gray-100 lg:hover:bg-gray-800/50 hover:text-primary-600 lg:hover:text-white'"
          >
            <svg class="mr-3 h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact
          </router-link>

          <!-- Messages -->
          <router-link
            to="/admin/messages"
            @click="sidebarOpen = false"
            class="flex items-center justify-between px-3 md:px-4 py-2 md:py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
            :class="route.path === '/admin/messages' ? 'bg-primary-50 lg:bg-primary-600/20 text-primary-600 lg:text-white border-l-2 border-primary-500' : 'text-gray-700 lg:text-gray-300 hover:bg-gray-100 lg:hover:bg-gray-800/50 hover:text-primary-600 lg:hover:text-white'"
          >
            <div class="flex items-center">
              <svg class="mr-3 h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Messages
            </div>
            <span
              v-if="unreadMessagesCount > 0"
              class="px-2 py-0.5 text-[10px] font-semibold bg-primary-600 text-white rounded-full min-w-[20px] text-center"
            >
              {{ unreadMessagesCount > 99 ? '99+' : unreadMessagesCount }}
            </span>
          </router-link>

          <!-- News -->
          <router-link
            to="/admin/news"
            @click="sidebarOpen = false"
            class="flex items-center px-3 md:px-4 py-2 md:py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
            :class="route.path === '/admin/news' ? 'bg-primary-50 lg:bg-primary-600/20 text-primary-600 lg:text-white border-l-2 border-primary-500' : 'text-gray-700 lg:text-gray-300 hover:bg-gray-100 lg:hover:bg-gray-800/50 hover:text-primary-600 lg:hover:text-white'"
          >
            <svg class="mr-3 h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            News
          </router-link>

          <!-- Projects -->
          <router-link
            to="/admin/projects"
            @click="sidebarOpen = false"
            class="flex items-center px-3 md:px-4 py-2 md:py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
            :class="route.path === '/admin/projects' ? 'bg-primary-50 lg:bg-primary-600/20 text-primary-600 lg:text-white border-l-2 border-primary-500' : 'text-gray-700 lg:text-gray-300 hover:bg-gray-100 lg:hover:bg-gray-800/50 hover:text-primary-600 lg:hover:text-white'"
          >
            <svg class="mr-3 h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Projects
          </router-link>

          <!-- Media Section -->
          <div>
            <button
              @click="mediaExpanded = !mediaExpanded"
              class="w-full flex items-center justify-between px-3 md:px-4 py-2 md:py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
              :class="isMediaActive ? 'bg-primary-50 lg:bg-primary-600/20 text-primary-600 lg:text-white border-l-2 border-primary-500' : 'text-gray-700 lg:text-gray-300 hover:bg-gray-100 lg:hover:bg-gray-800/50 hover:text-primary-600 lg:hover:text-white'"
            >
              <div class="flex items-center">
                <svg class="mr-3 h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Media
              </div>
              <svg
                class="h-4 w-4 transition-transform duration-200 shrink-0"
                :class="{ 'rotate-180': mediaExpanded }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div v-show="mediaExpanded" class="mt-1 md:mt-1.5 ml-3 md:ml-4 space-y-0.5 border-l border-gray-200 lg:border-gray-800/50 pl-2">
              <router-link
                v-for="item in mediaItems"
                :key="item.path"
                :to="item.path"
                @click="sidebarOpen = false"
                class="flex items-center px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm rounded-md transition-all duration-200"
                :class="route.path === item.path ? 'bg-primary-50 lg:bg-primary-600/20 text-primary-600 lg:text-white border-l-2 border-primary-500' : 'text-gray-600 lg:text-gray-400 hover:bg-gray-100 lg:hover:bg-gray-800/50 hover:text-primary-600 lg:hover:text-white'"
              >
                <span class="ml-6">{{ item.label }}</span>
              </router-link>
            </div>
          </div>

        </div>
      </nav>

      <!-- Sidebar Footer -->
      <div class="p-3 md:p-4 border-t border-gray-200 lg:border-gray-800/50"></div>
    </aside>

    <!-- Overlay for mobile -->
    <div
      v-if="sidebarOpen"
      @click="sidebarOpen = false"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
    ></div>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col lg:pl-64">
      <!-- Top Header -->
      <header class="bg-white/95 border-b border-gray-200/80 sticky top-0 z-30 backdrop-blur-sm">
        <div class="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <button
            @click="sidebarOpen = true"
            class="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div class="flex-1"></div>
          
          <!-- Notifications -->
          <div class="relative mr-4">
            <button
              ref="notificationButton"
              @click="showNotificationsDropdown = !showNotificationsDropdown"
              class="relative h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <Bell class="w-5 h-5 text-gray-600" />
              <span
                v-if="unreadCount > 0"
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
              >
                {{ unreadCount > 9 ? '9+' : unreadCount }}
              </span>
            </button>
            
            <!-- Desktop Notifications Dropdown -->
            <div
              v-if="showNotificationsDropdown"
              ref="notificationsDropdown"
              class="hidden lg:flex absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden flex-col"
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
                <div v-if="notificationsLoading" class="p-4 text-center text-gray-500 text-sm">
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
                    :class="{
                      'bg-primary-50': !isNotificationRead(notification.id)
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
            
            <!-- Mobile Notifications Modal -->
            <Teleport to="body">
              <Transition name="modal">
                <div
                  v-if="showNotificationsDropdown"
                  class="lg:hidden fixed inset-0 flex flex-col"
                  style="z-index: 9999;"
                  @click.self="showNotificationsDropdown = false"
                >
                  <!-- Backdrop -->
                  <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
                  
                  <!-- Modal Content -->
                  <div
                    class="relative w-full bg-white rounded-t-3xl shadow-2xl flex-1 flex flex-col mt-auto"
                  >
                    <!-- Header -->
                    <div class="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white rounded-t-3xl z-10">
                      <h3 class="text-lg font-bold text-gray-900">Notifications</h3>
                      <div class="flex items-center gap-3">
                        <button
                          v-if="unreadCount > 0"
                          @click="markAllAsRead"
                          class="text-sm text-primary-600 hover:text-primary-700 font-medium cursor-pointer"
                        >
                          Mark all as read
                        </button>
                        <button
                          @click="showNotificationsDropdown = false"
                          class="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <!-- Content -->
                    <div class="flex-1 overflow-y-auto">
                      <div v-if="notificationsLoading" class="p-8 text-center text-gray-500 text-sm">
                        Loading...
                      </div>
                      <div v-else-if="notifications.length === 0" class="p-8 text-center text-gray-500 text-sm">
                        No notifications
                      </div>
                      <div v-else class="divide-y divide-gray-100">
                        <button
                          v-for="notification in notifications"
                          :key="notification.id"
                          @click="handleNotificationClick(notification)"
                          class="w-full text-left transition-colors cursor-pointer"
                          :class="{
                            'bg-primary-50 active:bg-primary-100': !isNotificationRead(notification.id),
                            'active:bg-gray-50': isNotificationRead(notification.id)
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
              </Transition>
            </Teleport>
          </div>
          
          <div class="relative user-menu-container">
            <!-- Avatar Button -->
            <button
              @click.stop="userMenuOpen = !userMenuOpen"
              class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center hover:bg-primary-200 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 cursor-pointer"
            >
              <span class="text-primary-600 text-sm font-medium">{{ userInitial }}</span>
            </button>

            <!-- User Menu Dropdown -->
            <Transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div
                v-if="userMenuOpen"
                class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                @click.stop
              >
                <div class="px-4 py-3 border-b border-gray-200">
                  <p class="text-sm font-semibold text-gray-900">{{ userName }}</p>
                  <p class="text-xs text-gray-500 mt-0.5">{{ userEmail }}</p>
                </div>
                <button
                  @click="handleLogout"
                  class="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <svg class="mr-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 p-4 lg:p-5">
        <slot></slot>
      </main>

      <!-- Footer -->
      <footer class="bg-white border-t border-gray-200/80 px-4 py-3">
        <p class="text-xs text-gray-500 text-center">
          &copy; {{ currentYear }} {{ siteName }} Admin. All rights reserved.
        </p>
      </footer>
    </div>

    <!-- Toast Container -->
    <ToastContainer />

    <!-- Confirmation Modal -->
    <ConfirmModal
      :is-open="confirmState.isOpen"
      :title="confirmState.title"
      :message="confirmState.message"
      :confirm-text="confirmState.confirmText"
      :cancel-text="confirmState.cancelText"
      @confirm="handleConfirm"
      @cancel="handleCancel"
      @update:is-open="(val) => confirmState.isOpen = val"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, Teleport } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Bell, Newspaper, Image, Video, FolderOpenDot } from 'lucide-vue-next'
import ToastContainer from '../components/ToastContainer.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import { useConfirm } from '../composables/useConfirm'
import { useAuth } from '../composables/useAuth'
import { useBodyScrollLock } from '../composables/useBodyScrollLock'
import { useNotifications } from '../composables/useNotifications'
import { contactService } from '../firebase/firestore'
import { useBranding } from '../composables/useBranding'

const router = useRouter()
const route = useRoute()
const { user, userData, logout, init } = useAuth()
const { branding, initBranding } = useBranding()
const sidebarOpen = ref(false)
const aboutUsExpanded = ref(false)
const mediaExpanded = ref(false)
const userMenuOpen = ref(false)
const unreadMessagesCount = ref(0)

// Notifications
const {
  notifications,
  unreadCount,
  isLoading: notificationsLoading,
  markAsRead,
  markAllAsRead: markAllNotificationsAsRead,
  getNotificationTypeLabel,
  initialize: initializeNotifications,
  cleanup: cleanupNotifications
} = useNotifications()

const showNotificationsDropdown = ref(false)
const readNotifications = ref(new Set())
const notificationsDropdown = ref(null)
const notificationButton = ref(null)

// Lock body scroll when sidebar is open on mobile
const { lock, unlock, useLock } = useBodyScrollLock()
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)

// Lock body scroll when mobile notifications modal is open
const isMobileModalOpen = computed(() => showNotificationsDropdown.value && windowWidth.value < 1024)
useLock(isMobileModalOpen)

function shouldIgnoreSecretKeyEvent(event) {
  const target = event.target
  if (!target) return false
  const tagName = target.tagName
  return ['INPUT', 'TEXTAREA', 'SELECT'].includes(tagName) || target.isContentEditable
}

function handleSecretSequence(event) {
  if (!route.path.startsWith('/admin')) return
  if (!isSuperAdmin.value) return
  if (shouldIgnoreSecretKeyEvent(event)) return
  const key = event.key?.toLowerCase()
  if (!key || key.length !== 1 || !/^[a-z0-9]$/.test(key)) return
  secretBuffer = (secretBuffer + key).slice(-SECRET_SEQUENCE.length)
  if (secretBuffer === SECRET_SEQUENCE) {
    secretBuffer = ''
    router.push('/superadmin')
  }
}

// Update window width on resize
let updateWidth = null
if (typeof window !== 'undefined') {
  updateWidth = () => {
    windowWidth.value = window.innerWidth
  }
  window.addEventListener('resize', updateWidth)
  onMounted(() => {
    updateWidth()
  })
  onUnmounted(() => {
    if (updateWidth) {
      window.removeEventListener('resize', updateWidth)
    }
    // Ensure unlock on unmount
    unlock()
  })
}

// Watch sidebar state and lock/unlock scroll on mobile
watch([sidebarOpen, windowWidth], ([isOpen, width]) => {
  // Only lock on mobile (below lg breakpoint - 1024px)
  if (width < 1024) {
    if (isOpen) {
      lock()
    } else {
      unlock()
    }
  } else {
    // Ensure unlock on desktop
    if (!isOpen) {
      unlock()
    }
  }
}, { immediate: true })

const currentYear = computed(() => new Date().getFullYear())
const siteName = computed(() => branding.value.siteName || 'Sarilaya')

initBranding()

const isSuperAdmin = computed(() => userData.value?.role === 'superadmin')
const SECRET_SEQUENCE = 'dyze09'
let secretBuffer = ''

const userName = computed(() => {
  return userData.value?.name || user.value?.displayName || user.value?.email || 'Admin'
})

const userInitial = computed(() => {
  const name = userName.value
  return name.charAt(0).toUpperCase()
})

const userEmail = computed(() => {
  return user.value?.email || userData.value?.email || 'No email'
})

// About Us submenu items
const aboutUsItems = [
  { path: '/admin/about', label: 'General Info' },
  { path: '/admin/about/officers', label: 'Officers' },
  { path: '/admin/about/council', label: 'Council' },
  { path: '/admin/about/chapters', label: 'Chapters' },
]

// Media submenu items
const mediaItems = [
  { path: '/admin/videos', label: 'Videos' },
  { path: '/admin/photos', label: 'Photos' },
]

// Check if any About Us route is active
const isAboutUsActive = computed(() => {
  return route.path.startsWith('/admin/about')
})

// Check if any Media route is active
const isMediaActive = computed(() => {
  return route.path.startsWith('/admin/videos') || route.path.startsWith('/admin/photos')
})

// Auto-expand About Us menu if on an About Us page
watch(() => route.path, (newPath) => {
  if (newPath.startsWith('/admin/about')) {
    aboutUsExpanded.value = true
  }
  if (newPath.startsWith('/admin/videos') || newPath.startsWith('/admin/photos')) {
    mediaExpanded.value = true
  }
}, { immediate: true })

const { confirmState, handleConfirm, handleCancel, confirm } = useConfirm()

async function handleLogout() {
  userMenuOpen.value = false
  const confirmed = await confirm('Are you sure you want to logout?', {
    title: 'Logout',
    confirmText: 'Logout'
  })
  
  if (confirmed) {
    await logout(router)
  }
}


async function loadUnreadMessagesCount() {
  try {
    const messages = await contactService.getMessages()
    unreadMessagesCount.value = messages ? messages.filter(m => !m.read).length : 0
  } catch (error) {
    console.error('Error loading unread messages count:', error)
  }
}

// Refresh unread count when route changes to messages page
watch(() => route.path, (newPath) => {
  if (newPath === '/admin/messages') {
    loadUnreadMessagesCount()
  }
})

// Listen for messages updated event
const handleMessagesUpdated = () => {
  loadUnreadMessagesCount()
}

// Refresh unread count periodically
let refreshInterval = null

// Handle click outside to close dropdowns (desktop only)
function handleClickOutsideDropdown(event) {
  // Only handle desktop dropdown, not mobile modal
  if (showNotificationsDropdown.value && windowWidth.value >= 1024) {
    const dropdown = notificationsDropdown.value
    const button = notificationButton.value
    
    if (dropdown && !dropdown.contains(event.target) && 
        button && !button.contains(event.target)) {
      showNotificationsDropdown.value = false
    }
  }
  
  if (userMenuOpen.value && !event.target.closest('.user-menu-container')) {
    userMenuOpen.value = false
  }
}

// Handle escape key to close mobile modal
function handleEscapeKey(event) {
  if (event.key === 'Escape' && showNotificationsDropdown.value && windowWidth.value < 1024) {
    showNotificationsDropdown.value = false
  }
}

// Handle notification click
function handleNotificationClick(notification) {
  markAsRead(notification.id)
  readNotifications.value.add(notification.id)
  showNotificationsDropdown.value = false
  
  // Navigate to the item
  if (notification.type === 'news') {
    router.push(`/admin/news`)
  } else if (notification.type === 'project') {
    router.push(`/admin/projects`)
  } else if (notification.type === 'photo') {
    router.push('/admin/photos')
  } else if (notification.type === 'video') {
    router.push('/admin/videos')
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

// Check if notification is read
function isNotificationRead(notificationId) {
  return readNotifications.value.has(notificationId)
}

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

onMounted(() => {
  init()
  document.addEventListener('click', handleClickOutsideDropdown)
  document.addEventListener('keydown', handleEscapeKey)
  document.addEventListener('keydown', handleSecretSequence)
  window.addEventListener('messages-updated', handleMessagesUpdated)
  loadUnreadMessagesCount()
  initializeNotifications()
  loadReadNotifications()
  
  // Refresh every 30 seconds
  refreshInterval = setInterval(() => {
    loadUnreadMessagesCount()
  }, 30000)
})

onUnmounted(() => {
  window.removeEventListener('messages-updated', handleMessagesUpdated)
  document.removeEventListener('click', handleClickOutsideDropdown)
  document.removeEventListener('keydown', handleEscapeKey)
  document.removeEventListener('keydown', handleSecretSequence)
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
  cleanupNotifications()
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: translateY(100%);
}
</style>

