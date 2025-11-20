import { ref } from 'vue'
import { authService } from '../firebase/auth'

const user = ref(null)
const userData = ref(null)
const loading = ref(true)

let unsubscribe = null
let initialized = false

export function useAuth() {
  const init = () => {
    if (initialized) return
    
    initialized = true
    loading.value = true
    
    if (typeof window === 'undefined') {
      loading.value = false
      return
    }
    
    unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        user.value = firebaseUser
        try {
          userData.value = await authService.getUserData(firebaseUser.uid)
        } catch (error) {
          console.error('Error fetching user data:', error)
        }
      } else {
        user.value = null
        userData.value = null
      }
      loading.value = false
    })
  }

  const register = async (email, password, name) => {
    try {
      await authService.register(email, password, name)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: getErrorMessage(error.code) 
      }
    }
  }

  const login = async (email, password) => {
    try {
      await authService.login(email, password)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: getErrorMessage(error.code) 
      }
    }
  }

  const logout = async (router = null) => {
    try {
      await authService.logout()
      user.value = null
      userData.value = null
      if (router) {
        router.push('/login')
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const getErrorMessage = (errorCode) => {
    const errorMessages = {
      'auth/email-already-in-use': 'Email is already registered',
      'auth/invalid-email': 'Invalid email address',
      'auth/operation-not-allowed': 'Operation not allowed',
      'auth/weak-password': 'Password should be at least 6 characters',
      'auth/user-disabled': 'This account has been disabled',
      'auth/user-not-found': 'No account found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later',
      'auth/network-request-failed': 'Network error. Please check your connection'
    }
    return errorMessages[errorCode] || 'An error occurred. Please try again'
  }

  const waitForAuth = () => {
    return new Promise((resolve) => {
      if (!loading.value) {
        resolve()
        return
      }
      
      const checkLoading = () => {
        if (!loading.value) {
          resolve()
        } else {
          setTimeout(checkLoading, 50)
        }
      }
      checkLoading()
    })
  }

  return {
    user,
    userData,
    loading,
    init,
    register,
    login,
    logout,
    waitForAuth
  }
}

