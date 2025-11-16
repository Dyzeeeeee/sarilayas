<template>
  <PublicLayout>
    <div class="space-y-6">
      <h1 class="text-3xl sm:text-4xl font-bold text-gray-900">About Us</h1>
      <p class="text-gray-600">Learn more about our organization.</p>
      
      <!-- Navigation Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
        <router-link
          to="/about/officers"
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h2 class="text-xl font-semibold text-gray-900 mb-2">Officers</h2>
          <p class="text-gray-600">Meet our organization's leadership team.</p>
        </router-link>
        
        <router-link
          to="/about/national-council"
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h2 class="text-xl font-semibold text-gray-900 mb-2">National Council</h2>
          <p class="text-gray-600">Our national council members and their roles.</p>
        </router-link>
        
        <router-link
          to="/about/chapters"
          class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h2 class="text-xl font-semibold text-gray-900 mb-2">Chapters</h2>
          <p class="text-gray-600">Explore our local chapters across the region.</p>
        </router-link>
      </div>
    </div>
  </PublicLayout>
</template>

<script setup>
import PublicLayout from '../../layouts/PublicLayout.vue'
</script>

