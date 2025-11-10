<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
      <!-- Title -->
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">Create Account</h1>

      <!-- Form -->
      <form @submit.prevent="handleRegister" class="space-y-5">
        <!-- Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            v-model="name"
            type="text"
            required
            placeholder="Enter your full name"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="Enter your email"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="Create a password"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Register Button -->
        <button
          type="submit"
          class="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
        >
          Register
        </button>
      </form>

      <!-- Divider -->
      <div class="my-6 border-t border-gray-200"></div>

      <!-- Login Link -->
      <p class="text-center text-gray-600 text-sm">
        Already have an account?
        <router-link to="/login" class="text-blue-600 font-medium hover:underline">
          Login here
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const password = ref('')

function handleRegister() {
  console.log('Register with', name.value, email.value, password.value)
  // dito mo ilalagay yung actual register logic
}
</script>
