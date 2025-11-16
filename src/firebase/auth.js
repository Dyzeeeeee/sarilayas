import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { app } from './config'
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'

const auth = getAuth(app)
const db = getFirestore(app)

export const authService = {
  // Register new user
  async register(email, password, name) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      // Update user profile with display name
      await updateProfile(user, { displayName: name })
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        name: name,
        role: 'admin', // Default role
        createdAt: new Date(),
        updatedAt: new Date()
      })
      
      return user
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  },

  // Login user
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return userCredential.user
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },

  // Logout user
  async logout() {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  },

  // Get current user
  getCurrentUser() {
    return auth.currentUser
  },

  // Listen to auth state changes
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback)
  },

  // Get user data from Firestore
  async getUserData(uid) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid))
      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() }
      }
      return null
    } catch (error) {
      console.error('Error getting user data:', error)
      throw error
    }
  }
}

