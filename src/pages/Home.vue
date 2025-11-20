<template>
  <PublicLayout>
    <div class="space-y-8">
      <!-- Hero Section -->
      <section class="text-center py-8 sm:py-12">
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
          Welcome to Sarilaya
        </h1>
        <p class="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
          Your mobile-first website built with Vue.js and Tailwind CSS
        </p>
      </section>

      <!-- Content Grid -->
      <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="i in 3"
          :key="i"
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h2 class="text-xl font-semibold text-gray-900 mb-2">
            Card {{ i }}
          </h2>
          <p class="text-gray-600">
            This is a sample card component. Content goes here.
          </p>
        </div>
      </section>
    </div>
  </PublicLayout>
</template>

<script setup>
import PublicLayout from '../layouts/PublicLayout.vue'
</script>

