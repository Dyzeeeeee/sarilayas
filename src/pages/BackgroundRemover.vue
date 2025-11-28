<template>
  <PublicLayout>
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      <div class="bg-white rounded-xl border border-gray-200 p-6 lg:p-8 shadow-sm">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Background Remover</h1>
        <p class="text-gray-600 mb-8">Upload an image and remove its background instantly</p>

        <!-- Upload Area -->
        <div
          v-if="!originalImage && !processing"
          @drop.prevent="handleDrop"
          @dragover.prevent
          @dragenter.prevent
          class="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-primary-500 transition-colors cursor-pointer"
          :class="{ 'border-primary-500 bg-primary-50': isDragging }"
        >
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            @change="handleFileSelect"
            class="hidden"
          />
          <div class="flex flex-col items-center gap-4">
            <Upload class="w-12 h-12 text-gray-400" />
            <div>
              <p class="text-lg font-medium text-gray-700 mb-1">
                Drop your image here or click to browse
              </p>
              <p class="text-sm text-gray-500">
                Supports JPG, PNG, and other image formats
              </p>
            </div>
            <button
              @click="$refs.fileInput.click()"
              class="mt-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Select Image
            </button>
          </div>
        </div>

        <!-- Processing State -->
        <div v-if="processing" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mb-4"></div>
          <p class="text-lg font-medium text-gray-700">Removing background...</p>
          <p class="text-sm text-gray-500 mt-2">This may take a few seconds</p>
        </div>

        <!-- Results -->
        <div v-if="originalImage && resultImage && !processing" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Original Image -->
            <div class="space-y-2">
              <h3 class="text-lg font-semibold text-gray-900">Original</h3>
              <div class="bg-gray-100 rounded-lg p-4 flex items-center justify-center min-h-[300px]">
                <img
                  :src="originalImage"
                  alt="Original image"
                  class="max-w-full max-h-[400px] object-contain rounded-lg"
                />
              </div>
            </div>

            <!-- Result Image -->
            <div class="space-y-2">
              <h3 class="text-lg font-semibold text-gray-900">Background Removed</h3>
              <div class="bg-gray-100 rounded-lg p-4 flex items-center justify-center min-h-[300px] relative">
                <!-- Blurred primary background under removed image -->
                <div class="absolute inset-0 rounded-lg bg-primary-500 blur-2xl opacity-60 pointer-events-none"></div>
                <!-- Checkerboard pattern for transparency -->
                <div
                  class="absolute inset-0 opacity-30"
                  style="background-image: repeating-conic-gradient(#f0f0f0 0% 25%, #ffffff 0% 50%) 50% / 20px 20px;"
                ></div>
                <img
                  :src="resultImage"
                  alt="Background removed"
                  class="max-w-full max-h-[400px] object-contain rounded-lg relative z-10"
                />
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-4 justify-center pt-4">
            <button
              @click="downloadImage"
              class="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
            >
              <Download class="w-5 h-5" />
              Download Image
            </button>
            <button
              @click="reset"
              class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
            >
              <X class="w-5 h-5" />
              Remove Another Image
            </button>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mt-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          <p class="font-medium">Error: {{ error }}</p>
        </div>
      </div>
    </div>
  </PublicLayout>
</template>

<script setup>
import { ref } from 'vue'
import PublicLayout from '../layouts/PublicLayout.vue'
import { Upload, Download, X } from 'lucide-vue-next'

// Remove.bg API key
const REMOVE_BG_API_KEY = 'brLpKtTAsdKuFHoJe6KgFCjK'

const fileInput = ref(null)
const originalImage = ref(null)
const resultImage = ref(null)
const processing = ref(false)
const error = ref(null)
const isDragging = ref(false)

function handleFileSelect(event) {
  const file = event.target.files?.[0]
  if (file) {
    processImage(file)
  }
}

function handleDrop(event) {
  isDragging.value = false
  const file = event.dataTransfer.files?.[0]
  if (file && file.type.startsWith('image/')) {
    processImage(file)
  } else {
    error.value = 'Please drop a valid image file'
  }
}

async function processImage(file) {
  error.value = null
  processing.value = true
  originalImage.value = null
  resultImage.value = null

  try {
    // Preview original image
    const reader = new FileReader()
    reader.onload = (e) => {
      originalImage.value = e.target.result
    }
    reader.readAsDataURL(file)

    // Prepare to send to remove.bg
    const formData = new FormData()
    formData.append('size', 'auto')
    formData.append('image_file', file)

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': REMOVE_BG_API_KEY
      },
      body: formData
    });

    if (!response.ok) {
      const errMsg = await response.text()
      throw new Error(`${response.status}: ${response.statusText} - ${errMsg}`)
    }

    // remove.bg's result is a PNG image blob
    const blob = await response.blob()
    resultImage.value = URL.createObjectURL(blob)
  } catch (err) {
    console.error('Error removing background:', err)
    error.value = 'Failed to remove background. Please try another image.'
  } finally {
    processing.value = false
  }
}

function downloadImage() {
  if (!resultImage.value) return

  const link = document.createElement('a')
  link.href = resultImage.value
  link.download = 'background-removed.png'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function reset() {
  originalImage.value = null
  resultImage.value = null
  error.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

