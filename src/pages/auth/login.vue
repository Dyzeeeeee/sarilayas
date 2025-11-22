<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="w-full max-w-md bg-white rounded-lg border border-gray-200/80 shadow-sm p-6">
      <!-- Logo and Title -->
      <div class="text-center mb-6">
        <img :src="logo" alt="Sarilaya Logo" class="h-16 mx-auto mb-4 object-contain" />
        <h1 class="text-xl font-semibold text-gray-900 tracking-tight">Login</h1>
        <p class="text-xs text-gray-500 mt-1">Sign in to access the admin panel</p>
      </div>

      <!-- Error Message -->
      <div
        v-if="errorMessage"
        class="mb-4 bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded-lg text-xs"
      >
        {{ errorMessage }}
      </div>

      <!-- Form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- Email -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5">Email</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="Enter your email"
            :disabled="loading"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <!-- Password -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5">Password</label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="Enter your password"
            :disabled="loading"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <!-- Button -->
        <Button
          type="submit"
          :loading="loading"
          loading-text="Logging in..."
          full-width
          size="sm"
        >
          Login
        </Button>
      </form>

      <!-- Divider -->
      <!-- <div class="my-5 border-t border-gray-200"></div> -->

      <!-- Register Link -->
      <!-- <p class="text-center text-gray-600 text-xs">
        Don't have an account?
        <router-link to="/register" class="text-primary-600 font-medium hover:underline">
          Register here
        </router-link>
      </p> -->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Button from '../../components/Button.vue'
import { useAuth } from '../../composables/useAuth'
import logo from '../../assets/SarilayaLogo.png'

const router = useRouter()
const { login } = useAuth()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

async function handleLogin() {
  loading.value = true
  errorMessage.value = ''

  const result = await login(email.value, password.value)
  
  if (result.success) {
    router.push('/admin')
  } else {
    errorMessage.value = result.error
    setTimeout(() => {
      errorMessage.value = ''
    }, 5000)
  }
  
  loading.value = false
}
</script>
