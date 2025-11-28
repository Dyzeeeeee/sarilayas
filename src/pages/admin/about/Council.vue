<template>
  <AdminLayout>
    <div class="space-y-4 md:space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-xl md:text-2xl font-semibold text-gray-900 tracking-tight">National Council</h1>
        <p class="text-xs md:text-sm text-gray-500 mt-1">Manage national council members</p>
      </div>

      <!-- Two Column Layout: Background Image Preview & Council Members List -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <!-- Column 1: Background Image Preview -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div class="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 class="text-base md:text-lg font-semibold text-gray-900">Background Image</h2>
              <p class="text-xs text-gray-500 mt-0.5">Image for the national council card in explore section</p>
            </div>
            <button
              @click="showImageModal = true"
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Pencil class="h-4 w-4 text-gray-500" />
            </button>
          </div>
          <div class="p-4 md:p-6">
            <p class="text-xs font-semibold text-gray-700 mb-2">Preview</p>
            <div class="relative rounded-xl overflow-hidden h-[400px] bg-gradient-to-br from-primary-600 to-primary-800">
              <img
                v-if="nationalCouncilImage"
                :src="nationalCouncilImage"
                alt="National Council Background"
                class="absolute inset-0 w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-800/60 to-primary-700/40"></div>
              <div class="relative h-full flex flex-col justify-end p-6 text-white">
                <h3 class="text-2xl font-bold mb-3">National Council</h3>
                <p class="text-sm text-white/90 leading-relaxed mb-4">
                  Our national council members and their contributions.
                </p>
                <div class="flex items-center text-white opacity-80">
                  <span class="text-sm font-semibold">Learn more</span>
                  <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Column 2: Council Members List -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div class="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 class="text-base md:text-lg font-semibold text-gray-900">Council Members</h2>
              <p class="text-xs text-gray-500 mt-0.5">Manage national council members</p>
            </div>
            <button
              @click="showMemberModal = true; editingMember = null; form = { name: '', role: '', photo: '' }"
              class="px-3 py-1.5 text-xs font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
            >
              <Plus class="h-4 w-4" />
              Add Member
            </button>
          </div>
          <div class="p-4 md:p-6">
            <div v-if="loadingData" class="space-y-2">
              <div v-for="i in 3" :key="i" class="border border-gray-200 rounded-lg p-3 animate-pulse">
                <div class="flex items-center space-x-3">
                  <div class="w-12 h-12 rounded-full bg-gray-200"></div>
                  <div class="flex-1 space-y-2">
                    <div class="h-4 bg-gray-200 rounded w-24"></div>
                    <div class="h-3 bg-gray-200 rounded w-32"></div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="members.length === 0" class="text-gray-500 text-center py-6 text-xs">
              No council members added yet
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="(member, index) in members"
                :key="member.id"
                class="border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors"
              >
                <div class="flex items-center space-x-3">
                  <div class="flex flex-col gap-1 shrink-0">
                    <button
                      @click="moveMember(index, 'up')"
                      :disabled="index === 0"
                      class="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move up"
                    >
                      <ChevronUp class="h-4 w-4" />
                    </button>
                    <button
                      @click="moveMember(index, 'down')"
                      :disabled="index === members.length - 1"
                      class="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move down"
                    >
                      <ChevronDown class="h-4 w-4" />
                    </button>
                  </div>
                  <div v-if="member.photo" class="shrink-0">
                    <div class="w-12 h-12 rounded-full ring-2 ring-gray-100 overflow-hidden flex items-center justify-center relative">
                      <!-- Dynamic gradient background with blur -->
                      <div class="absolute inset-0 bg-gradient-to-br from-primary-300 via-primary-200 to-primary-100 blur-sm"></div>
                      <div 
                        class="absolute inset-0 opacity-80"
                        style="background: radial-gradient(circle, rgba(233, 213, 255, 0.8) 0%, rgba(243, 232, 255, 0.6) 50%, rgba(250, 245, 255, 0.4) 100%);"
                      ></div>
                      <img
                        :src="member.photo"
                        :alt="member.name"
                        class="w-full h-full object-cover relative z-10"
                      />
                    </div>
                  </div>
                  <div v-else class="shrink-0 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center ring-2 ring-gray-100">
                    <span class="text-primary-600 text-base font-semibold">{{ member.name.charAt(0) }}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-gray-900 text-xs truncate">{{ member.name }}</h3>
                    <p class="text-gray-500 text-xs mt-0.5 truncate">{{ member.role }}</p>
                  </div>
                </div>
                <div class="flex space-x-1.5 mt-3">
                  <button
                    @click="handleEdit(member)"
                    class="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    title="Edit member"
                  >
                    <Edit class="h-4 w-4" />
                  </button>
                  <button
                    @click="handleDelete(member.id)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete member"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Member Add/Edit Modal -->
    <Teleport to="body">
      <div
        v-if="showMemberModal"
        class="fixed inset-0 z-[60] flex items-center justify-center p-4"
        @click.self="showMemberModal = false"
        @keydown.esc="showMemberModal = false"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        
        <!-- Modal Content -->
        <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
            <h2 class="text-lg font-semibold text-gray-900">
              {{ editingMember ? 'Edit Council Member' : 'Add New Council Member' }}
            </h2>
            <button
              @click="showMemberModal = false; cancelEdit()"
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
              <div class="bg-white rounded-lg border border-gray-200 p-6">
                <div class="flex flex-col items-center text-center space-y-4">
                  <div v-if="form.photo" class="relative">
                    <div class="w-24 h-24 rounded-full ring-4 ring-primary-100 overflow-hidden flex items-center justify-center relative">
                      <!-- Dynamic gradient background with blur -->
                      <div class="absolute inset-0 bg-gradient-to-br from-primary-300 via-primary-200 to-primary-100 blur-sm"></div>
                      <div 
                        class="absolute inset-0 opacity-80"
                        style="background: radial-gradient(circle, rgba(233, 213, 255, 0.8) 0%, rgba(243, 232, 255, 0.6) 50%, rgba(250, 245, 255, 0.4) 100%);"
                      ></div>
                      <img
                        :src="form.photo"
                        :alt="form.name || 'Member'"
                        class="w-full h-full object-cover relative z-10"
                      />
                    </div>
                  </div>
                  <div v-else class="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center ring-4 ring-primary-100">
                    <span class="text-white text-2xl font-bold">{{ (form.name || 'M').charAt(0).toUpperCase() }}</span>
                  </div>
                  <div class="space-y-1">
                    <h3 class="text-lg font-bold text-gray-900">
                      {{ form.name || 'Member Name' }}
                    </h3>
                    <p class="text-sm text-primary-600 font-medium">
                      {{ form.role || 'Role / Committee' }}
                    </p>
                  </div>
                </div>
              </div>
              
            </div>

            <!-- Editor Column -->
            <div class="w-1/2 overflow-y-auto p-6 space-y-4">
              <form @submit.prevent="saveMemberAndClose" class="space-y-4">
                <div class="grid grid-cols-1 gap-4">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      v-model="form.name"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                      placeholder="Enter member name"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                      Role / Committee *
                    </label>
                    <input
                      v-model="form.role"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                      placeholder="e.g., Finance Committee"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Photo (optional)
                  </label>
                  <div class="space-y-2">
                    <input
                      @change="handleFileSelect"
                      type="file"
                      accept="image/*"
                      ref="fileInput"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
                    <p class="text-xs text-gray-500">Or enter image URL</p>
                    <input
                      v-model="form.photo"
                      type="url"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>
                  <div v-if="form.photo && !uploadingPhoto && !editingImage" class="mt-2 flex items-center gap-2">
                    <div class="w-16 h-16 rounded-full border border-gray-200 overflow-hidden flex items-center justify-center relative">
                      <!-- Dynamic gradient background with blur -->
                      <div class="absolute inset-0 bg-gradient-to-br from-primary-300 via-primary-200 to-primary-100 blur-sm"></div>
                      <div 
                        class="absolute inset-0 opacity-80"
                        style="background: radial-gradient(circle, rgba(233, 213, 255, 0.8) 0%, rgba(243, 232, 255, 0.6) 50%, rgba(250, 245, 255, 0.4) 100%);"
                      ></div>
                      <img :src="form.photo" alt="Preview" class="w-full h-full object-cover relative z-10" />
                    </div>
                    <div class="flex gap-2">
                      <button
                        type="button"
                        @click="startImageEdit"
                        class="text-xs text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        @click="removePhoto"
                        class="text-xs text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div v-if="uploadingPhoto" class="mt-2 flex items-center gap-2 text-xs text-gray-500">
                    <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing image...</span>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 shrink-0">
            <button
              @click="showMemberModal = false; cancelEdit()"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="saveMemberAndClose"
              :disabled="loading || uploadingPhoto"
              class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ loading ? 'Saving...' : editingMember ? 'Update' : 'Add' }} Member
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Image Editor Modal -->
    <Teleport to="body">
      <div
        v-if="showImageEditorModal"
        class="fixed inset-0 z-[70] flex items-center justify-center p-4"
        @click.self="showImageEditorModal = false"
        @keydown.esc="showImageEditorModal = false"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        
        <!-- Modal Content -->
        <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
            <h2 class="text-lg font-semibold text-gray-900">Edit Image</h2>
            <button
              @click="cancelImageEdit"
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X class="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <!-- Modal Body -->
          <div class="flex-1 overflow-y-auto p-6">
            <div class="space-y-4">
              <!-- Editor Container -->
              <div
                ref="editorContainer"
                class="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden cursor-move border border-gray-200"
                @mousedown="startDrag"
                @wheel.prevent="handleWheel"
              >
                <!-- Circular crop mask overlay -->
                <div class="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                  <div class="w-64 h-64 rounded-full border-2 border-primary-500 shadow-lg ring-2 ring-white/50 relative">
                    <!-- Face position indicator -->
                    <div class="absolute inset-0 flex items-center justify-center">
                      <div class="relative">
                        <!-- Face outline -->
                        <svg class="w-32 h-32 text-primary-400/60" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.5">
                          <!-- Head circle -->
                          <circle cx="50" cy="50" r="35" />
                          <!-- Left eye -->
                          <circle cx="40" cy="45" r="4" />
                          <!-- Right eye -->
                          <circle cx="60" cy="45" r="4" />
                          <!-- Nose -->
                          <path d="M 50 50 Q 50 55 48 58" />
                          <!-- Mouth -->
                          <path d="M 40 65 Q 50 70 60 65" />
                        </svg>
                        <!-- Center dot -->
                        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Editable image layer -->
                <div
                  ref="editableImage"
                  class="absolute inset-0 flex items-center justify-center"
                  :style="imageTransform"
                >
                  <img
                    :src="editingImage"
                    alt="Editable"
                    ref="editorImage"
                    class="max-w-none select-none pointer-events-none"
                    style="max-width: 100%; max-height: 100%; width: auto; height: auto;"
                    draggable="false"
                    @load="onEditorImageLoad"
                  />
                </div>
                <!-- Instructions -->
                <div class="absolute bottom-2 left-0 right-0 text-center pointer-events-none z-10">
                  <p class="text-xs text-gray-600 bg-white/80 px-2 py-1 rounded">Drag to move • Scroll to zoom</p>
                </div>
              </div>
              
              <!-- Controls -->
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Scale: {{ Math.round(imageScale * 100) }}%
                  </label>
                  <input
                    v-model.number="imageScale"
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                  />
                  <div class="flex justify-between text-xs text-gray-500 mt-1">
                    <span>50%</span>
                    <span>300%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 shrink-0">
            <button
              @click="cancelImageEdit"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="resetImageTransform"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Reset
            </button>
            <button
              @click="applyImageEdit"
              class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Background Image Modal -->
    <Teleport to="body">
      <div
        v-if="showImageModal"
        class="fixed inset-0 z-[60] flex items-center justify-center p-4"
        @click.self="showImageModal = false"
        @keydown.esc="showImageModal = false"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        
        <!-- Modal Content -->
        <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <!-- Header -->
          <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
            <h2 class="text-lg font-semibold text-gray-900">Edit Background Image</h2>
            <button
              @click="showImageModal = false"
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
              <div class="relative rounded-xl overflow-hidden h-[400px] bg-gradient-to-br from-primary-600 to-primary-800">
                <img
                  v-if="nationalCouncilImage"
                  :src="nationalCouncilImage"
                  alt="National Council Background"
                  class="absolute inset-0 w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-800/60 to-primary-700/40"></div>
                <div class="relative h-full flex flex-col justify-end p-6 text-white">
                  <h3 class="text-2xl font-bold mb-3">National Council</h3>
                  <p class="text-sm text-white/90 leading-relaxed mb-4">
                    Our national council members and their contributions.
                  </p>
                  <div class="flex items-center text-white opacity-80">
                    <span class="text-sm font-semibold">Learn more</span>
                    <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Editor Column -->
            <div class="w-1/2 overflow-y-auto p-6 space-y-6">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Background Image (optional)</label>
                <div class="space-y-2">
                  <input
                    @change="handleImageFileSelect"
                    type="file"
                    accept="image/*"
                    ref="imageFileInput"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                  <p class="text-xs text-gray-500">Or enter image URL</p>
                  <input
                    v-model="nationalCouncilImage"
                    type="url"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm"
                    placeholder="https://example.com/national-council-image.jpg"
                  />
                </div>
                <div v-if="nationalCouncilImage && !uploadingImage" class="mt-2 flex items-center gap-2">
                  <img :src="nationalCouncilImage" alt="Preview" class="w-24 h-16 rounded-lg object-cover border border-gray-200" />
                  <button
                    type="button"
                    @click="removeImage"
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
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 shrink-0">
            <button
              @click="showImageModal = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="saveImageAndClose"
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
import { ref, onMounted, computed, Teleport } from 'vue'
import AdminLayout from '../../../layouts/AdminLayout.vue'
import { aboutUsService } from '../../../firebase/firestore'
import { useToast } from '../../../composables/useToast'
import { useConfirm } from '../../../composables/useConfirm'
import { useBodyScrollLock } from '../../../composables/useBodyScrollLock'
import { Pencil, X, Plus, Edit, Trash2, ChevronUp, ChevronDown } from 'lucide-vue-next'

const { success: showSuccess, error: showError } = useToast()
const { confirm } = useConfirm()
const { useLock } = useBodyScrollLock()

// Remove.bg API key
const REMOVE_BG_API_KEY = 'brLpKtTAsdKuFHoJe6KgFCjK'

const loading = ref(false)
const loadingData = ref(true)
const members = ref([])
const editingMember = ref(null)
const uploadingPhoto = ref(false)
const fileInput = ref(null)
const showImageModal = ref(false)
const showMemberModal = ref(false)
const showImageEditorModal = ref(false)
const nationalCouncilImage = ref('')
const uploadingImage = ref(false)
const imageFileInput = ref(null)

// Image editor state
const editingImage = ref(null)
const imageScale = ref(1)
const imagePosition = ref({ x: 0, y: 0 })
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const editorContainer = ref(null)
const editableImage = ref(null)
const originalImageData = ref(null)
const imageDimensions = ref({ width: 0, height: 0 })

// Lock body scroll when modals are open
useLock(showImageModal)
useLock(showMemberModal)
useLock(showImageEditorModal)

const form = ref({
  name: '',
  role: '',
  photo: ''
})

// Computed transform for editable image
const imageTransform = computed(() => {
  return {
    transform: `translate(${imagePosition.value.x}px, ${imagePosition.value.y}px) scale(${imageScale.value})`,
    transition: isDragging.value ? 'none' : 'transform 0.1s ease-out'
  }
})

async function loadMembers() {
  loadingData.value = true
  try {
    const membersData = await aboutUsService.getNationalCouncil()
    // Ensure all members have an index, assign if missing, then sort by index (lowest first)
    members.value = membersData
      .map((member, idx) => ({
        ...member,
        index: member.index !== undefined ? member.index : idx
      }))
      .sort((a, b) => (a.index || 0) - (b.index || 0))
    const aboutData = await aboutUsService.getAboutUs()
    nationalCouncilImage.value = aboutData?.nationalCouncilImage || ''
  } catch (error) {
    console.error('Error loading council members:', error)
    showError('Failed to load council members')
  } finally {
    loadingData.value = false
  }
}

function handleEdit(member) {
  editingMember.value = member
  form.value = {
    name: member.name,
    role: member.role,
    photo: member.photo || ''
  }
  showMemberModal.value = true
}

function cancelEdit() {
  editingMember.value = null
  form.value = { name: '', role: '', photo: '' }
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  cancelImageEdit()
  showMemberModal.value = false
}

async function removeBackground(file) {
  try {
    const formData = new FormData()
    formData.append('size', 'auto')
    formData.append('image_file', file)

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': REMOVE_BG_API_KEY
      },
      body: formData
    })

    if (!response.ok) {
      const errMsg = await response.text()
      throw new Error(`Background removal failed: ${response.status} - ${errMsg}`)
    }

    const blob = await response.blob()
    return blob
  } catch (error) {
    console.error('Error removing background:', error)
    throw error
  }
}

function compressImage(fileOrBlob, maxWidth = 400, maxHeight = 400, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        
        // Calculate new dimensions
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
        
        // Convert to base64 with compression
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
        resolve(compressedDataUrl)
      }
      
      img.onerror = reject
      img.src = e.target.result
    }
    
    reader.onerror = reject
    reader.readAsDataURL(fileOrBlob)
  })
}

async function handleFileSelect(event) {
  const file = event.target.files[0]
  if (!file) return

  // Validate file type
  if (!file.type.startsWith('image/')) {
    showError('Please select an image file')
    return
  }

  // Validate file size (max 5MB before compression)
  if (file.size > 5 * 1024 * 1024) {
    showError('Image size must be less than 5MB')
    return
  }

  uploadingPhoto.value = true

  try {
    // Step 1: Remove background using remove.bg API
    let processedFile = file
    try {
      const bgRemovedBlob = await removeBackground(file)
      // Convert blob to File for editing
      processedFile = new File([bgRemovedBlob], file.name, { type: 'image/png' })
    } catch (bgError) {
      console.warn('Background removal failed, using original image:', bgError)
      // Continue with original file if background removal fails
    }

    // Step 2: Load image for editing
    const reader = new FileReader()
    reader.onload = (e) => {
      editingImage.value = e.target.result
      originalImageData.value = e.target.result
      imageScale.value = 1
      imagePosition.value = { x: 0, y: 0 }
      imageDimensions.value = { width: 0, height: 0 }
      uploadingPhoto.value = false
      showImageEditorModal.value = true
    }
    reader.readAsDataURL(processedFile)
  } catch (error) {
    console.error('Error processing image:', error)
    showError('Failed to process image file')
    if (fileInput.value) {
      fileInput.value.value = ''
    }
    uploadingPhoto.value = false
  }
}

function removePhoto() {
  form.value.photo = ''
  editingImage.value = null
  originalImageData.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Image editor functions
function onEditorImageLoad(event) {
  if (event.target) {
    imageDimensions.value = {
      width: event.target.naturalWidth,
      height: event.target.naturalHeight
    }
    // Image dimensions loaded
  }
}

function startImageEdit() {
  if (form.value.photo) {
    editingImage.value = form.value.photo
    originalImageData.value = form.value.photo
    imageScale.value = 1
    imagePosition.value = { x: 0, y: 0 }
    imageDimensions.value = { width: 0, height: 0 }
    showImageEditorModal.value = true
  }
}

function cancelImageEdit() {
  editingImage.value = null
  originalImageData.value = null
  imageScale.value = 1
  imagePosition.value = { x: 0, y: 0 }
  isDragging.value = false
  showImageEditorModal.value = false
}

function resetImageTransform() {
  imageScale.value = 1
  imagePosition.value = { x: 0, y: 0 }
}

function startDrag(event) {
  if (!editingImage.value || !editorContainer.value) return
  event.preventDefault()
  isDragging.value = true
  
  const containerRect = editorContainer.value.getBoundingClientRect()
  const containerCenterX = containerRect.width / 2
  const containerCenterY = containerRect.height / 2
  
  const startX = event.clientX - containerRect.left
  const startY = event.clientY - containerRect.top
  const startOffsetX = imagePosition.value.x
  const startOffsetY = imagePosition.value.y
  
  const handleMouseMove = (e) => {
    if (!isDragging.value) return
    const currentX = e.clientX - containerRect.left
    const currentY = e.clientY - containerRect.top
    
    imagePosition.value = {
      x: startOffsetX + (currentX - startX),
      y: startOffsetY + (currentY - startY)
    }
  }
  
  const handleMouseUp = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

function handleWheel(event) {
  if (!editingImage.value) return
  event.preventDefault()
  const delta = event.deltaY > 0 ? -0.1 : 0.1
  imageScale.value = Math.max(0.5, Math.min(3, imageScale.value + delta))
}

async function applyImageEdit() {
  if (!editingImage.value || imageDimensions.value.width === 0 || !editorContainer.value || !editableImage.value) return
  
  try {
    // Create canvas to render the edited image
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    // Set canvas size (circular crop area - 400x400 for final output)
    const size = 400
    canvas.width = size
    canvas.height = size
    
    // Load the image
    const img = new Image()
    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
      img.src = editingImage.value
    })
    
    // Get actual rendered dimensions
    const containerRect = editorContainer.value.getBoundingClientRect()
    const containerWidth = containerRect.width
    const containerHeight = containerRect.height
    
    // Calculate base display size (how image fits in container with CSS constraints)
    // Image has max-width: 100%, max-height: 100%, maintaining aspect ratio
    const imageAspect = imageDimensions.value.width / imageDimensions.value.height
    const containerAspect = containerWidth / containerHeight
    
    let baseDisplayWidth, baseDisplayHeight
    if (imageAspect > containerAspect) {
      // Image is wider - constrained by container width
      baseDisplayWidth = containerWidth
      baseDisplayHeight = containerWidth / imageAspect
    } else {
      // Image is taller - constrained by container height
      baseDisplayHeight = containerHeight
      baseDisplayWidth = containerHeight * imageAspect
    }
    
    // Crop circle is w-64 = 256px
    const cropSize = 256
    const scaleFactor = size / cropSize // Maps container pixels to canvas pixels
    
    // Calculate the scale ratio: displayed pixels per actual image pixel
    const pixelsPerImagePixel = baseDisplayWidth / imageDimensions.value.width
    
    // Apply user scale factor (from CSS transform)
    const scaledDisplayWidth = baseDisplayWidth * imageScale.value
    const scaledDisplayHeight = baseDisplayHeight * imageScale.value
    
    // Map position from container space to canvas space
    // imagePosition is in container pixels, relative to center
    const canvasX = size / 2 + (imagePosition.value.x * scaleFactor)
    const canvasY = size / 2 + (imagePosition.value.y * scaleFactor)
    
    // Calculate image dimensions on canvas in actual image pixels
    // First convert displayed size to canvas size, then to image pixels
    const canvasDisplayWidth = scaledDisplayWidth * scaleFactor
    const canvasDisplayHeight = scaledDisplayHeight * scaleFactor
    
    // Convert canvas display size to actual image pixels
    const canvasImageWidth = canvasDisplayWidth / pixelsPerImagePixel
    const canvasImageHeight = canvasDisplayHeight / pixelsPerImagePixel
    
    // Draw circular clipping path and fill with dynamic gradient background
    ctx.beginPath()
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
    
    // Create radial gradient for dynamic effect
    const gradient = ctx.createRadialGradient(
      size / 2, size / 2, 0,
      size / 2, size / 2, size / 2
    )
    gradient.addColorStop(0, '#e9d5ff') // primary-200 center
    gradient.addColorStop(0.5, '#f3e8ff') // primary-100 middle
    gradient.addColorStop(1, '#faf5ff') // primary-50 edge
    
    ctx.fillStyle = gradient
    ctx.fill()
    ctx.clip()
    
    // Draw the scaled and positioned image
    ctx.drawImage(
      img,
      canvasX - canvasImageWidth / 2,
      canvasY - canvasImageHeight / 2,
      canvasImageWidth,
      canvasImageHeight
    )
    
    // Convert to blob and then compress
    canvas.toBlob((blob) => {
      if (!blob) {
        showError('Failed to create image')
        return
      }
      // Compress the edited image
      compressImage(blob, 400, 400, 0.75).then((compressed) => {
        form.value.photo = compressed
        showImageEditorModal.value = false
        cancelImageEdit()
        showSuccess('Image edited and saved')
      }).catch((error) => {
        console.error('Error compressing edited image:', error)
        showError('Failed to save edited image')
      })
    }, 'image/png', 0.9)
  } catch (error) {
    console.error('Error applying image edit:', error)
    showError('Failed to apply image edits')
  }
}

async function handleSubmit() {
  loading.value = true

  try {
    if (editingMember.value) {
      await aboutUsService.updateCouncilMember(editingMember.value.id, form.value)
      showSuccess('Council member updated successfully!')
    } else {
      // Set index to the end when adding new member
      const maxIndex = members.value.length > 0 
        ? Math.max(...members.value.map(m => m.index || 0))
        : -1
      await aboutUsService.addCouncilMember({
        ...form.value,
        index: maxIndex + 1
      })
      showSuccess('Council member added successfully!')
    }
    cancelEdit()
    await loadMembers()
  } catch (error) {
    console.error('Error saving council member:', error)
    showError('Failed to save council member')
  } finally {
    loading.value = false
  }
}

async function moveMember(currentIndex, direction) {
  if (direction === 'up' && currentIndex === 0) return
  if (direction === 'down' && currentIndex === members.value.length - 1) return

  const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
  const currentMember = members.value[currentIndex]
  const targetMember = members.value[newIndex]

  // Swap indices
  const tempIndex = currentMember.index
  const targetIndex = targetMember.index

  loading.value = true
  try {
    // Update both members' indices
    await Promise.all([
      aboutUsService.updateCouncilMember(currentMember.id, { ...currentMember, index: targetIndex }),
      aboutUsService.updateCouncilMember(targetMember.id, { ...targetMember, index: tempIndex })
    ])
    await loadMembers()
  } catch (error) {
    console.error('Error reordering council members:', error)
    showError('Failed to reorder council members')
  } finally {
    loading.value = false
  }
}

async function saveMemberAndClose() {
  await handleSubmit()
  if (!loading.value) {
    showMemberModal.value = false
  }
}

async function handleDelete(id) {
  const confirmed = await confirm('Are you sure you want to delete this council member?', {
    title: 'Delete Council Member',
    confirmText: 'Delete'
  })
  
  if (!confirmed) return

  try {
    await aboutUsService.deleteCouncilMember(id)
    showSuccess('Council member deleted successfully!')
    await loadMembers()
  } catch (error) {
    console.error('Error deleting council member:', error)
    showError('Failed to delete council member')
  }
}

async function handleImageFileSelect(event) {
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

  uploadingImage.value = true

  try {
    const compressedDataUrl = await compressImage(file, 1920, 1080, 0.8)
    const base64Size = compressedDataUrl.length * 0.75
    if (base64Size > 900000) {
      const moreCompressed = await compressImage(file, 1600, 900, 0.7)
      nationalCouncilImage.value = moreCompressed
    } else {
      nationalCouncilImage.value = compressedDataUrl
    }
  } catch (error) {
    console.error('Error processing image:', error)
    showError('Failed to process image file')
    if (imageFileInput.value) {
      imageFileInput.value.value = ''
    }
  } finally {
    uploadingImage.value = false
  }
}

function removeImage() {
  nationalCouncilImage.value = ''
  if (imageFileInput.value) {
    imageFileInput.value.value = ''
  }
}

async function saveImageAndClose() {
  loading.value = true
  try {
    const aboutData = await aboutUsService.getAboutUs()
    await aboutUsService.updateAboutUs({
      ...aboutData,
      nationalCouncilImage: nationalCouncilImage.value
    })
    showSuccess('Background image updated successfully!')
    showImageModal.value = false
  } catch (error) {
    console.error('Error saving image:', error)
    showError('Failed to save image')
  } finally {
    loading.value = false
  }
}


onMounted(() => {
  loadMembers()
})
</script>
