<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-primary-100 to-primary-200 p-4">
    <div class="w-full max-w-md">
      <!-- Skeleton Loader -->
      <div v-if="initialLoading" class="space-y-8">
        <!-- Logo and Title Skeleton -->
        <div class="text-center mb-8">
          <div class="inline-block p-4 bg-white rounded-2xl shadow-lg mb-4 animate-pulse">
            <div class="h-20 w-20 bg-gray-200 rounded-lg mx-auto"></div>
          </div>
          <div class="h-8 w-48 bg-gray-200 rounded-lg mx-auto mb-2 animate-pulse"></div>
          <div class="h-4 w-64 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
        </div>

        <!-- Form Skeleton -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10 space-y-6">
          <div class="space-y-4">
            <div class="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
            <div class="h-12 w-full bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
          <div class="space-y-4">
            <div class="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div class="h-12 w-full bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
          <div class="h-12 w-full bg-gray-200 rounded-xl animate-pulse mt-8"></div>
        </div>
      </div>

      <!-- Actual Content -->
      <div v-else>
        <!-- Logo and Title Section -->
        <div class="text-center mb-8">
          <div class="inline-block p-4 bg-white rounded-2xl shadow-lg mb-4">
            <img :src="logo" alt="Sarilaya Logo" class="h-20 w-auto mx-auto object-contain" />
          </div>
          <h1 class="text-3xl font-bold text-gray-900 tracking-tight mb-2">Welcome Back</h1>
          <p class="text-sm text-gray-600">Sign in to access the admin panel</p>
        </div>

        <!-- Login Card -->
        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10">
        <!-- Error Message -->
        <div
          v-if="errorMessage"
          class="mb-6 bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded-lg text-sm flex items-start gap-2 animate-shake"
        >
          <svg class="w-5 h-5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                v-model="email"
                type="email"
                required
                placeholder="admin@example.com"
                :disabled="loading"
                class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                v-model="password"
                type="password"
                required
                placeholder="Enter your password"
                :disabled="loading"
                class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          <!-- Button -->
          <Button
            type="submit"
            :loading="loading"
            loading-text="Signing in..."
            full-width
            size="md"
            class="mt-8"
          >
            Sign In
          </Button>
        </form>
      </div>

        <!-- Footer Text -->
        <p class="text-center text-sm text-gray-600 mt-6">
          Secure admin access for authorized personnel only
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from '../../components/Button.vue'
import { useAuth } from '../../composables/useAuth'
import logo from '../../assets/Sarilaya Logo.png'

const router = useRouter()
const { login } = useAuth()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const initialLoading = ref(true)

onMounted(() => {
  // Simulate initial load time for skeleton
  setTimeout(() => {
    initialLoading.value = false
  }, 500)
})

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

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
  20%, 40%, 60%, 80% { transform: translateX(4px); }
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}
</style>
