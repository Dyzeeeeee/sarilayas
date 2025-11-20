import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { app } from './config'

const storage = getStorage(app)

export const storageService = {
  // Upload a file to Firebase Storage
  async uploadFile(file, path) {
    try {
      const storageRef = ref(storage, path)
      const snapshot = await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)
      return downloadURL
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  },

  // Upload an image (with automatic path generation)
  async uploadImage(file, folder = 'images') {
    const timestamp = Date.now()
    const fileName = `${folder}/${timestamp}_${file.name}`
    return await this.uploadFile(file, fileName)
  },

  // Delete a file from Firebase Storage
  async deleteFile(url) {
    try {
      // Extract the path from the URL
      const urlObj = new URL(url)
      const path = decodeURIComponent(urlObj.pathname.split('/o/')[1]?.split('?')[0] || '')
      if (path) {
        const storageRef = ref(storage, path)
        await deleteObject(storageRef)
      }
    } catch (error) {
      console.error('Error deleting file:', error)
      // Don't throw - file might not exist or already deleted
    }
  }
}

