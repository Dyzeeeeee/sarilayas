<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
      <!-- Title -->
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">Login</h1>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-5">
        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="Enter your email"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="Enter your password"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <!-- Button -->
        <button
          type="submit"
          class="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition duration-200 font-semibold"
        >
          Login
        </button>
      </form>

      <!-- Divider -->
      <div class="my-6 border-t border-gray-200"></div>

      <!-- Register Link -->
      <p class="text-center text-gray-600 text-sm">
        Don’t have an account?
        <router-link to="/register" class="text-primary-600 font-medium hover:underline">
          Register here
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')

function handleLogin() {
  console.log('Login with', email.value, password.value)
  // dito mo ilalagay yung actual login logic
}
</script>
