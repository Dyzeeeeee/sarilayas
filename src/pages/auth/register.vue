<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="w-full max-w-md bg-white rounded-lg border border-gray-200/80 shadow-sm p-6">
      <!-- Logo and Title -->
      <div class="text-center mb-6">
        <img :src="logo" alt="Sarilaya Logo" class="h-16 mx-auto mb-4 object-contain" />
        <h1 class="text-xl font-semibold text-gray-900 tracking-tight">Create Account</h1>
        <p class="text-xs text-gray-500 mt-1">Register for admin access</p>
      </div>

      <!-- Error Message -->
      <div
        v-if="errorMessage"
        class="mb-4 bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded-lg text-xs"
      >
        {{ errorMessage }}
      </div>

      <!-- Success Message -->
      <div
        v-if="successMessage"
        class="mb-4 bg-primary-50 border border-primary-200 text-primary-800 px-3 py-2 rounded-lg text-xs"
      >
        {{ successMessage }}
      </div>

      <!-- Form -->
      <form @submit.prevent="handleRegister" class="space-y-4">
        <!-- Name -->
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1.5">Full Name</label>
          <input
            v-model="name"
            type="text"
            required
            placeholder="Enter your full name"
            :disabled="loading"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

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
            placeholder="Create a password (min. 6 characters)"
            :disabled="loading"
            minlength="6"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <p class="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
        </div>

        <!-- Register Button -->
        <Button
          type="submit"
          :loading="loading"
          loading-text="Creating account..."
          full-width
          size="sm"
        >
          Register
        </Button>
      </form>

      <!-- Divider -->
      <div class="my-5 border-t border-gray-200"></div>

      <!-- Login Link -->
      <p class="text-center text-gray-600 text-xs">
        Already have an account?
        <router-link to="/login" class="text-primary-600 font-medium hover:underline">
          Login here
        </router-link>
      </p>
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
const { register } = useAuth()

const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

async function handleRegister() {
  if (password.value.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters'
    setTimeout(() => {
      errorMessage.value = ''
    }, 5000)
    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  const result = await register(email.value, password.value, name.value)
  
  if (result.success) {
    successMessage.value = 'Account created successfully! Redirecting...'
    setTimeout(() => {
      router.push('/admin')
    }, 1500)
  } else {
    errorMessage.value = result.error
    setTimeout(() => {
      errorMessage.value = ''
    }, 5000)
  }
  
  loading.value = false
}
</script>
