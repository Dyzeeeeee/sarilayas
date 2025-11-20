<template>
  <PublicLayout>
    <div class="space-y-6">
      
      <!-- HERO -->
      <section class="text-center py-6 sm:py-10">
        <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
          Welcome to Sarilaya
        </h1>
      </section>

      <!-- CONTENT LIST WITH DIVIDERS -->
      <section class="max-w-3xl mx-auto px-4 space-y-4">

        <!-- Item 1 -->
        <div class="py-3">
          <h2 class="text-lg font-semibold text-gray-900">Introduction</h2>
          <p class="text-sm text-gray-600">
            This is a simple description of the first section of your content.
          </p>
        </div>
        <div class="w-full h-px bg-gray-200"></div>

        <!-- Item 2 -->
        <div class="py-3">
          <h2 class="text-lg font-semibold text-gray-900">Our Goal</h2>
          <p class="text-sm text-gray-600">
            We aim to create a responsive, accessible, and clean UI for Sarilaya.
          </p>
        </div>
        <div class="w-full h-px bg-gray-200"></div>

        <!-- Item 3 -->
        <div class="py-3">
          <h2 class="text-lg font-semibold text-gray-900">Technology</h2>
          <p class="text-sm text-gray-600">
            Built with Vue 3, Tailwind CSS, Firebase, and well-structured components.
          </p>
        </div>

      </section>

    </div>
  </PublicLayout>
</template>

<script setup>
import PublicLayout from '../layouts/PublicLayout.vue'
</script>
