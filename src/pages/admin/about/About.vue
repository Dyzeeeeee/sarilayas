<template>
  <AdminLayout>
    <div class="space-y-4 md:space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-xl md:text-2xl font-semibold text-gray-900 tracking-tight">General Info</h1>
        <p class="text-xs md:text-sm text-gray-500 mt-1">Manage your organization's information</p>
      </div>

      <!-- Loading State -->
      <div v-if="loadingData" class="space-y-4">
        <div v-for="n in 6" :key="n" class="bg-white rounded-lg border border-gray-200 p-4 md:p-6 animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
          <div class="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>

      <!-- Content Sections -->
      <div v-else class="space-y-4 md:space-y-6">
        <!-- Who We Are & Where We Are Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <!-- Who We Are Section (Hero) -->
          <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div class="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
              <h2 class="text-base md:text-lg font-semibold text-gray-900">Who We Are</h2>
              <p class="text-xs text-gray-500 mt-0.5">Hero section with title and description</p>
            </div>
            <button
              @click="showHeroModal = true"
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Pencil class="h-4 w-4 text-gray-500" />
            </button>
          </div>
          
          <!-- Preview -->
          <div class="p-4 md:p-6">
            <div>
              <p class="text-xs font-semibold text-gray-700 mb-2">Preview</p>
                <div class="relative w-full aspect-video max-h-[300px] bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-lg overflow-hidden border border-gray-200">
                  <!-- Background Image -->
                  <img
                    v-if="form.heroImage"
                    :src="form.heroImage"
                    alt="Hero Background"
                    class="absolute inset-0 w-full h-full object-cover"
                  />
                  <!-- Primary Overlay -->
                  <div class="absolute inset-0 bg-primary-600/85"></div>
                  <!-- Decorative Elements -->
                  <div class="absolute inset-0 opacity-10">
                    <div class="absolute top-4 left-2 w-16 h-16 bg-white rounded-full blur-xl"></div>
                    <div class="absolute bottom-4 right-2 w-20 h-20 bg-white rounded-full blur-xl"></div>
                  </div>
                  <!-- Content -->
                  <div class="relative z-10 text-center px-3 py-3 md:py-4 h-full flex flex-col items-center justify-center">
                    <div class="inline-block mb-1.5 px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                      <span class="text-[9px] md:text-[10px] font-semibold text-white uppercase tracking-wider">Who We Are</span>
                    </div>
                    <h1 class="text-lg md:text-xl lg:text-2xl font-extrabold text-white mb-1.5 drop-shadow-2xl leading-tight">
                      {{ form.title || 'SARILAYA' }}
                    </h1>
                    <p class="text-[10px] md:text-xs text-white/95 max-w-xs mx-auto drop-shadow-lg leading-relaxed line-clamp-2">
                      {{ form.description || 'Learn more about our organization and our commitment to excellence.' }}
                    </p>
                  </div>
                </div>
            </div>
          </div>
        </div>

          <!-- Where We Are Section -->
          <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div class="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
                <h2 class="text-base md:text-lg font-semibold text-gray-900">Where We Are</h2>
                <p class="text-xs text-gray-500 mt-0.5">Organization statistics and reach</p>
              </div>
              <button
                @click="showStatsModal = true"
                class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Pencil class="h-4 w-4 text-gray-500" />
              </button>
            </div>
            <div class="p-4 md:p-6">
              <!-- Preview -->
              <div>
                <p class="text-xs font-semibold text-gray-700 mb-2">Preview</p>
                  <div class="bg-gradient-to-b from-white to-gray-50 rounded-lg border border-gray-200 p-4">
                    <div class="text-center mb-4">
                      <h3 class="text-lg font-extrabold text-gray-900 mb-2">Where We Are</h3>
                      <div class="w-16 h-0.5 bg-primary-600 mx-auto rounded-full"></div>
                    </div>
                    <div class="grid grid-cols-2 gap-3 mb-3">
                      <div class="text-center group">
                        <div class="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl mb-2 group-hover:bg-primary-600 transition-colors">
                          <span class="text-lg font-extrabold text-primary-600 group-hover:text-white transition-colors">
                            {{ formatNumber(form.stats.regions) }}
                          </span>
                        </div>
                        <div class="text-xs text-gray-700 font-semibold">Regions</div>
                      </div>
                      <div class="text-center group">
                        <div class="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl mb-2 group-hover:bg-primary-600 transition-colors">
                          <span class="text-lg font-extrabold text-primary-600 group-hover:text-white transition-colors">
                            {{ formatNumber(form.stats.provinces) }}
                          </span>
                        </div>
                        <div class="text-xs text-gray-700 font-semibold">Provinces</div>
                      </div>
                      <div class="text-center group">
                        <div class="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl mb-2 group-hover:bg-primary-600 transition-colors">
                          <span class="text-lg font-extrabold text-primary-600 group-hover:text-white transition-colors">
                            {{ formatNumber(form.stats.municipalities) }}
                          </span>
                        </div>
                        <div class="text-xs text-gray-700 font-semibold">Municipalities</div>
                      </div>
                      <div class="text-center group">
                        <div class="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl mb-2 group-hover:bg-primary-600 transition-colors">
                          <span class="text-lg font-extrabold text-primary-600 group-hover:text-white transition-colors">
                            {{ formatNumber(form.stats.members) }}
                          </span>
                        </div>
                        <div class="text-xs text-gray-700 font-semibold">Members</div>
                      </div>
                    </div>
                    <div v-if="form.statsDescription" class="text-center pt-3 border-t border-gray-200">
                      <p class="text-xs text-gray-700 leading-relaxed text-justify line-clamp-2">
                        {{ form.statsDescription }}
                      </p>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Our Purpose & Our Values Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <!-- Our Purpose Section (Mission & Vision) -->
          <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div class="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 class="text-base md:text-lg font-semibold text-gray-900">Our Purpose</h2>
                <p class="text-xs text-gray-500 mt-0.5">Mission and Vision</p>
              </div>
              <button
                @click="showPurposeModal = true"
                class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Pencil class="h-4 w-4 text-gray-500" />
              </button>
            </div>
            <div class="p-4 md:p-6">
              <!-- Preview -->
              <div>
                <p class="text-xs font-semibold text-gray-700 mb-3">Preview</p>
                <div class="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-lg border border-gray-200 p-4">
                  <div class="text-center mb-4">
                    <h3 class="text-lg font-extrabold text-white mb-2">Our Purpose</h3>
                    <div class="w-12 h-0.5 bg-white mx-auto rounded-full"></div>
                  </div>
                  <div class="grid grid-cols-1 gap-3">
                    <!-- Mission Preview -->
                    <div class="bg-white/10 backdrop-blur-sm rounded-lg border border-white/30 p-3">
                      <div class="flex items-center gap-2 mb-2">
                        <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center shrink-0">
                          <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h4 class="text-sm font-bold text-white">Our Mission</h4>
                      </div>
                      <p class="text-xs text-white/90 leading-relaxed text-justify line-clamp-3">
                        {{ form.mission || 'No mission has been set.' }}
                      </p>
                    </div>
                    <!-- Vision Preview -->
                    <div class="bg-white/10 backdrop-blur-sm rounded-lg border border-white/30 p-3">
                      <div class="flex items-center gap-2 mb-2">
                        <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center shrink-0">
                          <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                        <h4 class="text-sm font-bold text-white">Our Vision</h4>
                      </div>
                      <div class="space-y-1.5">
                        <p 
                          v-for="(item, index) in visionPoints"
                          :key="index"
                          class="text-xs text-white/90 leading-relaxed flex items-start gap-1.5"
                        >
                          <span class="text-white font-bold text-xs mt-0.5 shrink-0">▸</span>
                          <span class="line-clamp-1">{{ item }}</span>
                        </p>
                        <p v-if="visionPoints.length === 0" class="text-xs text-white/90">
                          No vision has been set.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Values Section -->
          <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div class="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 class="text-base md:text-lg font-semibold text-gray-900">Our Values</h2>
                <p class="text-xs text-gray-500 mt-0.5">Core values and principles</p>
              </div>
              <button
                @click="showValuesModal = true"
                class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Pencil class="h-4 w-4 text-gray-500" />
              </button>
            </div>
            <div class="p-4 md:p-6">
              <!-- Preview -->
              <div>
                <p class="text-xs font-semibold text-gray-700 mb-3">Preview</p>
                <div class="bg-gradient-to-b from-white via-primary-50/30 to-white rounded-lg border border-gray-200 p-4">
                  <div class="text-center mb-4">
                    <h3 class="text-lg font-extrabold text-gray-900 mb-2">Our Core Values</h3>
                    <div v-if="form.valuesDescription" class="mb-3">
                    <p class="text-xs text-gray-700 leading-relaxed text-justify line-clamp-2">
                      {{ form.valuesDescription }}
                    </p>
                  </div>
                  <div class="w-12 h-0.5 bg-primary-600 mx-auto rounded-full"></div>
                </div>
                  <div v-if="form.values && form.values.length > 0" class="space-y-2">
                    <div
                      v-for="(value, index) in form.values.slice(0, 4)"
                      :key="index"
                      class="bg-white rounded-lg border-2 border-primary-500 p-3 shadow-sm"
                    >
                      <div class="flex items-center gap-2">
                        <div class="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center shrink-0">
                          <span class="text-white font-bold text-xs">{{ index + 1 }}</span>
                        </div>
                        <div class="text-sm font-bold text-primary-600">
                          {{ value.name || value }}
                        </div>
                      </div>
                    </div>
                    <p v-if="form.values.length > 4" class="text-xs text-gray-500 text-center pt-2">
                      +{{ form.values.length - 4 }} more value{{ form.values.length - 4 > 1 ? 's' : '' }}
                    </p>
                  </div>
                  <p v-else class="text-xs text-gray-400 italic text-center py-4">No values added yet</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Hero Edit Modal -->
    <Teleport to="body">
      <div
        v-if="showHeroModal"
        class="fixed inset-0 z-[60] flex items-center justify-center p-4"
        @click.self="showHeroModal = false"
        @keydown.esc="showHeroModal = false"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        
        <!-- Modal Content -->
        <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
            <h2 class="text-lg font-semibold text-gray-900">Edit Who We Are</h2>
            <button
              @click="showHeroModal = false"
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X class="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <!-- Modal Body (Two Columns) -->
          <div class="flex-1 overflow-hidden flex">
            <!-- Preview Column -->
            <div class="w-1/2 border-r border-gray-200 overflow-y-auto p-6 bg-gray-50">
              <p class="text-sm font-semibold text-gray-700 mb-4">Preview</p>
              <div class="flex justify-center">
                <div class="w-full max-w-md">
                  <div class="relative w-full aspect-video max-h-[400px] bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-lg overflow-hidden border border-gray-200">
                    <!-- Background Image -->
                    <img
                      v-if="form.heroImage"
                      :src="form.heroImage"
                      alt="Hero Background"
                      class="absolute inset-0 w-full h-full object-cover"
                    />
                    <!-- Primary Overlay -->
                    <div class="absolute inset-0 bg-primary-600/85"></div>
                    <!-- Decorative Elements -->
                    <div class="absolute inset-0 opacity-10">
                      <div class="absolute top-4 left-3 w-16 h-16 bg-white rounded-full blur-xl"></div>
                      <div class="absolute bottom-4 right-3 w-20 h-20 bg-white rounded-full blur-xl"></div>
                    </div>
                    <!-- Content -->
                    <div class="relative z-10 text-center px-3 py-4 h-full flex flex-col items-center justify-center">
                      <div class="inline-block mb-2 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                        <span class="text-[10px] font-semibold text-white uppercase tracking-wider">Who We Are</span>
                      </div>
                      <h1 class="text-lg md:text-xl font-extrabold text-white mb-2 drop-shadow-2xl leading-tight">
                        {{ form.title || 'SARILAYA' }}
                      </h1>
                      <p class="text-xs md:text-sm text-white/95 max-w-md mx-auto drop-shadow-lg leading-relaxed line-clamp-2">
                        {{ form.description || 'Learn more about our organization and our commitment to excellence.' }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Editor Column -->
            <div class="w-1/2 overflow-y-auto p-6 space-y-6">
              <!-- Hero Image -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Hero Image (optional)</label>
                <div class="space-y-2">
              <input
                @change="(e) => handleFileSelect(e, 'heroImage')"
                type="file"
                accept="image/*"
                ref="fileInput"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
              />
                  <p class="text-xs text-gray-500">Or enter image URL</p>
            <input
              v-model="form.heroImage"
              type="url"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
              placeholder="https://example.com/hero-image.jpg"
            />
          </div>
                <div v-if="form.heroImage && !uploadingImage" class="mt-2 flex items-center gap-2">
                  <img :src="form.heroImage" alt="Preview" class="w-24 h-16 rounded-lg object-cover border border-gray-200" />
            <button
              type="button"
                    @click="removeImage('heroImage')"
              class="text-xs text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>
                <div v-if="uploadingImage" class="mt-2 flex items-center gap-2 text-xs text-gray-500">
            <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Processing image...</span>
          </div>
        </div>

              <!-- Title -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                <input
                  v-model="form.title"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                  placeholder="SARILAYA"
                />
        </div>

        <!-- Description -->
        <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Description</label>
          <textarea
            v-model="form.description"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
            placeholder="Short explanation of who you are and what you do"
          ></textarea>
        </div>
          </div>
        </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 shrink-0">
          <button
              @click="showHeroModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
              Cancel
          </button>
          <button
              @click="saveHeroAndClose"
            :disabled="loading"
              class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ loading ? 'Saving...' : 'Save Changes' }}
          </button>
          </div>
        </div>
    </div>
    </Teleport>

    <!-- Purpose Edit Modal -->
    <Teleport to="body">
      <div
        v-if="showPurposeModal"
        class="fixed inset-0 z-[60] flex items-center justify-center p-4"
        @click.self="showPurposeModal = false"
        @keydown.esc="showPurposeModal = false"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        
        <!-- Modal Content -->
        <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
            <h2 class="text-lg font-semibold text-gray-900">Edit Our Purpose</h2>
            <button
              @click="showPurposeModal = false"
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X class="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <!-- Modal Body (Two Columns) -->
          <div class="flex-1 overflow-hidden flex">
            <!-- Preview Column -->
            <div class="w-1/2 border-r border-gray-200 overflow-y-auto p-6 bg-gray-50">
              <p class="text-sm font-semibold text-gray-700 mb-4">Preview</p>
              <div class="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-lg border border-gray-200 p-4">
                <div class="text-center mb-4">
                  <h3 class="text-lg font-extrabold text-white mb-2">Our Purpose</h3>
                  <div class="w-12 h-0.5 bg-white mx-auto rounded-full"></div>
                </div>
                <div class="grid grid-cols-1 gap-3">
                  <!-- Mission Preview -->
                  <div class="bg-white/10 backdrop-blur-sm rounded-lg border border-white/30 p-3">
                    <div class="flex items-center gap-2 mb-2">
                      <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center shrink-0">
                        <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h4 class="text-sm font-bold text-white">Our Mission</h4>
                    </div>
                    <p class="text-xs text-white/90 leading-relaxed text-justify">
                      {{ form.mission || 'No mission has been set.' }}
                    </p>
                  </div>
                  <!-- Vision Preview -->
                  <div class="bg-white/10 backdrop-blur-sm rounded-lg border border-white/30 p-3">
                    <div class="flex items-center gap-2 mb-2">
                      <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center shrink-0">
                        <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                      <h4 class="text-sm font-bold text-white">Our Vision</h4>
                    </div>
                    <div class="space-y-1.5">
                      <p 
                        v-for="(item, index) in visionPoints"
                        :key="index"
                        class="text-xs text-white/90 leading-relaxed flex items-start gap-1.5"
                      >
                        <span class="text-white font-bold text-xs mt-0.5 shrink-0">▸</span>
                        <span>{{ item }}</span>
                      </p>
                      <p v-if="visionPoints.length === 0" class="text-xs text-white/90">
                        No vision has been set.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Editor Column -->
            <div class="w-1/2 overflow-y-auto p-6 space-y-6">
        <!-- Mission -->
        <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Mission</label>
          <textarea
            v-model="form.mission"
                  rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
            placeholder="One clear statement of your purpose"
          ></textarea>
        </div>

        <!-- Vision -->
        <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Vision</label>
          <textarea
            v-model="form.vision"
                  rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                  placeholder="Enter vision points separated by semicolons (;)"
          ></textarea>
                <p class="text-xs text-gray-500 mt-1">Separate multiple vision points with semicolons (;)</p>
              </div>
            </div>
        </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 shrink-0">
            <button
              @click="showPurposeModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="savePurposeAndClose"
              :disabled="loading"
              class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ loading ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Stats Edit Modal -->
    <Teleport to="body">
      <div
        v-if="showStatsModal"
        class="fixed inset-0 z-[60] flex items-center justify-center p-4"
        @click.self="showStatsModal = false"
        @keydown.esc="showStatsModal = false"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        
        <!-- Modal Content -->
        <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
            <h2 class="text-lg font-semibold text-gray-900">Edit Where We Are</h2>
            <button
              @click="showStatsModal = false"
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X class="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <!-- Modal Body (Two Columns) -->
          <div class="flex-1 overflow-hidden flex">
            <!-- Preview Column -->
            <div class="w-1/2 border-r border-gray-200 overflow-y-auto p-6 bg-gray-50">
              <p class="text-sm font-semibold text-gray-700 mb-4">Preview</p>
              <div class="bg-gradient-to-b from-white to-gray-50 rounded-lg border border-gray-200 p-4">
                <div class="text-center mb-4">
                  <h3 class="text-lg font-extrabold text-gray-900 mb-2">Where We Are</h3>
                  <div class="w-16 h-0.5 bg-primary-600 mx-auto rounded-full"></div>
                </div>
                <div class="grid grid-cols-2 gap-3 mb-3">
                  <div class="text-center group">
                    <div class="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl mb-2 group-hover:bg-primary-600 transition-colors">
                      <span class="text-lg font-extrabold text-primary-600 group-hover:text-white transition-colors">
                        {{ formatNumber(form.stats.regions) }}
                      </span>
                    </div>
                    <div class="text-xs text-gray-700 font-semibold">Regions</div>
                  </div>
                  <div class="text-center group">
                    <div class="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl mb-2 group-hover:bg-primary-600 transition-colors">
                      <span class="text-lg font-extrabold text-primary-600 group-hover:text-white transition-colors">
                        {{ formatNumber(form.stats.provinces) }}
                      </span>
                    </div>
                    <div class="text-xs text-gray-700 font-semibold">Provinces</div>
                  </div>
                  <div class="text-center group">
                    <div class="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl mb-2 group-hover:bg-primary-600 transition-colors">
                      <span class="text-lg font-extrabold text-primary-600 group-hover:text-white transition-colors">
                        {{ formatNumber(form.stats.municipalities) }}
                      </span>
                    </div>
                    <div class="text-xs text-gray-700 font-semibold">Municipalities</div>
                  </div>
                  <div class="text-center group">
                    <div class="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-xl mb-2 group-hover:bg-primary-600 transition-colors">
                      <span class="text-lg font-extrabold text-primary-600 group-hover:text-white transition-colors">
                        {{ formatNumber(form.stats.members) }}
                      </span>
                    </div>
                    <div class="text-xs text-gray-700 font-semibold">Members</div>
                  </div>
                </div>
                <div v-if="form.statsDescription" class="text-center pt-3 border-t border-gray-200">
                  <p class="text-xs text-gray-700 leading-relaxed text-justify">
                    {{ form.statsDescription }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Editor Column -->
            <div class="w-1/2 overflow-y-auto p-6 space-y-6">
              <!-- Description -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Description (optional)</label>
            <textarea
              v-model="form.statsDescription"
                  rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
              placeholder="Brief description about your organization's reach"
            ></textarea>
          </div>

              <!-- Statistics -->
            <div>
                <label class="block text-sm font-semibold text-gray-700 mb-3">Statistics</label>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-semibold text-gray-700 mb-1.5">Regions</label>
              <input
                v-model.number="form.stats.regions"
                type="number"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
              />
            </div>
            <div>
                    <label class="block text-xs font-semibold text-gray-700 mb-1.5">Provinces</label>
              <input
                v-model.number="form.stats.provinces"
                type="number"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
              />
            </div>
            <div>
                    <label class="block text-xs font-semibold text-gray-700 mb-1.5">Municipalities</label>
              <input
                v-model.number="form.stats.municipalities"
                type="number"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
              />
            </div>
            <div>
                    <label class="block text-xs font-semibold text-gray-700 mb-1.5">Members</label>
              <input
                v-model.number="form.stats.members"
                type="number"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
              />
            </div>
          </div>
        </div>
          </div>
        </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 shrink-0">
            <button
              @click="showStatsModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="saveStatsAndClose"
              :disabled="loading"
              class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ loading ? 'Saving...' : 'Save Changes' }}
            </button>
              </div>
            </div>
      </div>
    </Teleport>

    <!-- Values Edit Modal -->
    <Teleport to="body">
      <div
        v-if="showValuesModal"
        class="fixed inset-0 z-[60] flex items-center justify-center p-4"
        @click.self="showValuesModal = false"
        @keydown.esc="showValuesModal = false"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        
        <!-- Modal Content -->
        <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
            <h2 class="text-lg font-semibold text-gray-900">Edit Our Values</h2>
              <button
              @click="showValuesModal = false"
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
              <X class="h-5 w-5 text-gray-500" />
              </button>
            </div>

          <!-- Modal Body (Two Columns) -->
          <div class="flex-1 overflow-hidden flex">
            <!-- Preview Column -->
            <div class="w-1/2 border-r border-gray-200 overflow-y-auto p-6 bg-gray-50">
              <p class="text-sm font-semibold text-gray-700 mb-4">Preview</p>
              <div class="bg-gradient-to-b from-white via-primary-50/30 to-white rounded-lg border border-gray-200 p-4">
                <div class="text-center mb-4">
                  <h3 class="text-lg font-extrabold text-gray-900 mb-2">Our Core Values</h3>
                  <div v-if="form.valuesDescription" class="mb-3">
                    <p class="text-xs text-gray-700 leading-relaxed text-justify">
                      {{ form.valuesDescription }}
                    </p>
                  </div>
                  <div class="w-12 h-0.5 bg-primary-600 mx-auto rounded-full"></div>
                </div>
                <div v-if="form.values && form.values.length > 0" class="space-y-2">
                  <div
                    v-for="(value, index) in form.values"
                    :key="index"
                    class="bg-white rounded-lg border-2 border-primary-500 p-3 shadow-sm"
                  >
                    <div class="flex items-center gap-2">
                      <div class="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center shrink-0">
                        <span class="text-white font-bold text-xs">{{ index + 1 }}</span>
                      </div>
                      <div class="text-sm font-bold text-primary-600">
                        {{ value.name || value }}
                      </div>
                    </div>
                  </div>
                </div>
                <p v-else class="text-xs text-gray-400 italic text-center py-4">No values added yet</p>
            </div>
          </div>

            <!-- Editor Column -->
            <div class="w-1/2 overflow-y-auto p-6 space-y-6">
              <!-- Values Description -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Description (optional)</label>
                <textarea
                  v-model="form.valuesDescription"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                  placeholder="Brief description about your organization's values"
                ></textarea>
              </div>
              
              <!-- Add New Value -->
              <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <label class="block text-sm font-semibold text-gray-700 mb-2">Add New Value</label>
                <div class="flex gap-2">
              <input
                    v-model="newValue.name"
                    type="text"
                    @keyup.enter="handleAddValue"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                    placeholder="e.g., Integrity"
                  />
              <button
                    @click="handleAddValue"
                    :disabled="!newValue.name.trim() || savingValue"
                    class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs font-semibold"
                  >
                    Add
              </button>
            </div>
          </div>

              <!-- Values List -->
              <div v-if="form.values && form.values.length > 0" class="space-y-2">
                <p class="text-sm font-semibold text-gray-700">Current Values</p>
            <div class="space-y-2">
                  <div
                    v-for="(value, index) in form.values"
                    :key="index"
                    class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <span class="text-sm text-gray-900 font-medium">{{ value.name || value }}</span>
              <button
                      @click="handleDeleteValue(index)"
                      class="px-2.5 py-1 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
              >
                      Delete
              </button>
            </div>
            </div>
              </div>
              <p v-else class="text-sm text-gray-400 italic text-center py-4">No values added yet</p>
          </div>
        </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 shrink-0">
          <button
              @click="showValuesModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
              Cancel
          </button>
          <button
              @click="saveValuesAndClose"
            :disabled="loading"
              class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ loading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
    </div>
      </div>
    </Teleport>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted, Teleport } from 'vue'
import AdminLayout from '../../../layouts/AdminLayout.vue'
import { aboutUsService } from '../../../firebase/firestore'
import { useToast } from '../../../composables/useToast'
import { useBodyScrollLock } from '../../../composables/useBodyScrollLock'
import { Pencil, X, Plus } from 'lucide-vue-next'

const { success: showSuccess, error: showError } = useToast()
const { useLock } = useBodyScrollLock()

const loading = ref(false)
const loadingData = ref(true)
const uploadingImage = ref(false)
const fileInput = ref(null)
const editingField = ref(null)
const showHeroModal = ref(false)
const showPurposeModal = ref(false)
const showStatsModal = ref(false)
const showValuesModal = ref(false)

// Lock body scroll when modals are open
useLock(showHeroModal)
useLock(showPurposeModal)
useLock(showStatsModal)
useLock(showValuesModal)
const savingValue = ref(false)
const newValue = ref({ name: '' })
const uploadingImages = ref({
  officers: false,
  nationalCouncil: false,
  chapters: false
})
const fileInputs = ref({
  officers: null,
  nationalCouncil: null,
  chapters: null
})

const form = ref({
  title: '',
  heroImage: '',
  description: '',
  mission: '',
  vision: '',
  statsDescription: '',
  valuesDescription: '',
  officersImage: '',
  nationalCouncilImage: '',
  chaptersImage: '',
  stats: {
    regions: 0,
    provinces: 0,
    municipalities: 0,
    members: 0
  },
  values: []
})

const visionPoints = computed(() => {
  if (!form.value.vision) return []
  return form.value.vision.split(';').filter(v => v.trim())
})

async function loadData() {
  loadingData.value = true
  try {
    const data = await aboutUsService.getAboutUs()
    if (data) {
      form.value = {
        title: data.title || 'SARILAYA',
        heroImage: data.heroImage || '',
        description: data.description || '',
        mission: data.mission || '',
        vision: data.vision || '',
        statsDescription: data.statsDescription || '',
        valuesDescription: data.valuesDescription || '',
        officersImage: data.officersImage || '',
        nationalCouncilImage: data.nationalCouncilImage || '',
        chaptersImage: data.chaptersImage || '',
        stats: {
          regions: data.stats?.regions || 0,
          provinces: data.stats?.provinces || 0,
          municipalities: data.stats?.municipalities || 0,
          members: data.stats?.members || 0
        },
        values: data.values || []
      }
    }
  } catch (error) {
    console.error('Error loading data:', error)
    showError('Failed to load data')
  } finally {
    loadingData.value = false
  }
}

async function saveField(fieldName) {
  loading.value = true
  try {
    await aboutUsService.updateAboutUs(form.value)
    const fieldLabels = {
      hero: 'Who We Are',
      stats: 'Statistics',
      values: 'Values',
      heroImage: 'Hero Image',
      description: 'Description',
      mission: 'Mission',
      vision: 'Vision',
      valuesDescription: 'Values Description',
      officersImage: 'Officers Image',
      nationalCouncilImage: 'National Council Image',
      chaptersImage: 'Chapters Image'
    }
    showSuccess(`${fieldLabels[fieldName] || fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} updated successfully!`)
    editingField.value = null
  } catch (error) {
    console.error('Error saving data:', error)
    showError('Failed to save changes')
  } finally {
    loading.value = false
  }
}

async function saveHeroAndClose() {
  await saveField('hero')
  if (!loading.value) {
    showHeroModal.value = false
  }
}

async function savePurposeAndClose() {
  loading.value = true
  try {
    await aboutUsService.updateAboutUs(form.value)
    showSuccess('Our Purpose updated successfully!')
    showPurposeModal.value = false
  } catch (error) {
    console.error('Error saving data:', error)
    showError('Failed to save changes')
  } finally {
    loading.value = false
  }
}

async function saveStatsAndClose() {
  loading.value = true
  try {
    await aboutUsService.updateAboutUs(form.value)
    showSuccess('Where We Are updated successfully!')
    showStatsModal.value = false
  } catch (error) {
    console.error('Error saving data:', error)
    showError('Failed to save changes')
  } finally {
    loading.value = false
  }
}

async function saveValuesAndClose() {
  loading.value = true
  try {
    await aboutUsService.updateAboutUs(form.value)
    showSuccess('Our Values updated successfully!')
    showValuesModal.value = false
  } catch (error) {
    console.error('Error saving data:', error)
    showError('Failed to save changes')
  } finally {
    loading.value = false
  }
}

async function handleAddValue() {
  if (!newValue.value.name.trim()) return

  savingValue.value = true
  const valueToAdd = { name: newValue.value.name.trim() }
  
  try {
    if (!form.value.values) {
      form.value.values = []
    }
    form.value.values.push(valueToAdd)
    newValue.value = { name: '' }
    showSuccess('Value added! Click Save to apply changes.')
  } catch (error) {
    form.value.values.pop()
    showError('Failed to add value')
  } finally {
    savingValue.value = false
  }
}

function handleDeleteValue(index) {
  if (!form.value.values) return
  form.value.values.splice(index, 1)
  showSuccess('Value removed! Click Save to apply changes.')
}

function compressImage(file, maxWidth, maxHeight, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }
        
        canvas.width = width
        canvas.height = height
        
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
        resolve(compressedDataUrl)
      }
      
      img.onerror = reject
      img.src = e.target.result
    }
    
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

async function handleFileSelect(event, fieldName = 'heroImage') {
  const file = event.target.files[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    showError('Please select an image file')
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    showError('Image size must be less than 5MB')
    return
  }

  if (fieldName === 'heroImage') {
    uploadingImage.value = true
  } else {
    uploadingImages.value[fieldName === 'officersImage' ? 'officers' : fieldName === 'nationalCouncilImage' ? 'nationalCouncil' : 'chapters'] = true
  }

  try {
    const compressedDataUrl = await compressImage(file, 1920, 1080, 0.8)
    
    const base64Size = compressedDataUrl.length * 0.75
    if (base64Size > 900000) {
      const moreCompressed = await compressImage(file, 1600, 900, 0.7)
      form.value[fieldName] = moreCompressed
    } else {
      form.value[fieldName] = compressedDataUrl
    }
  } catch (error) {
    console.error('Error processing image:', error)
    showError('Failed to process image file')
    const inputRef = fieldName === 'heroImage' ? fileInput.value : fileInputs.value[fieldName === 'officersImage' ? 'officers' : fieldName === 'nationalCouncilImage' ? 'nationalCouncil' : 'chapters']
    if (inputRef) {
      inputRef.value = ''
    }
  } finally {
    if (fieldName === 'heroImage') {
      uploadingImage.value = false
    } else {
      uploadingImages.value[fieldName === 'officersImage' ? 'officers' : fieldName === 'nationalCouncilImage' ? 'nationalCouncil' : 'chapters'] = false
    }
  }
}

function removeImage(fieldName = 'heroImage') {
  form.value[fieldName] = ''
  const inputRef = fieldName === 'heroImage' ? fileInput.value : fileInputs.value[fieldName === 'officersImage' ? 'officers' : fieldName === 'nationalCouncilImage' ? 'nationalCouncil' : 'chapters']
  if (inputRef) {
    inputRef.value = ''
  }
}

function formatNumber(num) {
  if (num >= 1000) {
    return `${Math.floor(num / 1000)}K+`
  }
  return num.toString()
}

onMounted(() => {
  loadData()
})
</script>
