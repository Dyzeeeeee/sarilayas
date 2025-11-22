import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, addDoc, query, orderBy, limit as firestoreLimit } from 'firebase/firestore'
import { app } from './config'

const db = getFirestore(app)

// Generic CRUD operations
export const firestoreService = {
  // Get a single document
  async getDocument(collectionName, docId) {
    const docRef = doc(db, collectionName, docId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    }
    return null
  },

  // Get all documents in a collection
  async getCollection(collectionName, whereClause = null, orderByField = null, orderDirection = 'asc', limitCount = null) {
    let q = collection(db, collectionName)
    
    if (whereClause) {
      q = query(q, whereClause)
    }
    
    if (orderByField) {
      q = query(q, orderBy(orderByField, orderDirection))
    }
    
    if (limitCount) {
      q = query(q, firestoreLimit(limitCount))
    }
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  },

  // Create or update a document
  async setDocument(collectionName, docId, data) {
    const docRef = doc(db, collectionName, docId)
    await setDoc(docRef, { ...data, updatedAt: new Date() }, { merge: true })
    return docId
  },

  // Add a new document (auto-generated ID)
  async addDocument(collectionName, data) {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    return docRef.id
  },

  // Update a document
  async updateDocument(collectionName, docId, data) {
    const docRef = doc(db, collectionName, docId)
    await updateDoc(docRef, { ...data, updatedAt: new Date() })
  },

  // Delete a document
  async deleteDocument(collectionName, docId) {
    const docRef = doc(db, collectionName, docId)
    await deleteDoc(docRef)
  }
}

// About Us specific services
export const aboutUsService = {
  // Get About Us main content
  async getAboutUs() {
    return await firestoreService.getDocument('aboutUs', 'main')
  },

  // Update About Us main content
  async updateAboutUs(data) {
    return await firestoreService.setDocument('aboutUs', 'main', data)
  },

  // Officers
  async getOfficers() {
    return await firestoreService.getCollection('officers')
  },

  async addOfficer(data) {
    return await firestoreService.addDocument('officers', data)
  },

  async updateOfficer(id, data) {
    return await firestoreService.updateDocument('officers', id, data)
  },

  async deleteOfficer(id) {
    return await firestoreService.deleteDocument('officers', id)
  },

  // National Council
  async getNationalCouncil() {
    return await firestoreService.getCollection('nationalCouncil')
  },

  async addCouncilMember(data) {
    return await firestoreService.addDocument('nationalCouncil', data)
  },

  async updateCouncilMember(id, data) {
    return await firestoreService.updateDocument('nationalCouncil', id, data)
  },

  async deleteCouncilMember(id) {
    return await firestoreService.deleteDocument('nationalCouncil', id)
  },

  // Chapters
  async getChapters() {
    return await firestoreService.getCollection('chapters')
  },

  async addChapter(data) {
    return await firestoreService.addDocument('chapters', data)
  },

  async updateChapter(id, data) {
    return await firestoreService.updateDocument('chapters', id, data)
  },

  async deleteChapter(id) {
    return await firestoreService.deleteDocument('chapters', id)
  }
}

// Contact service
export const contactService = {
  // Get contact information
  async getContact() {
    return await firestoreService.getDocument('contact', 'main')
  },

  // Update contact information
  async updateContact(data) {
    return await firestoreService.setDocument('contact', 'main', data)
  },

  // Submit contact message
  async submitMessage(messageData) {
    const message = {
      ...messageData,
      createdAt: new Date(),
      read: false
    }
    return await firestoreService.addDocument('messages', message)
  },

  // Get all messages (for admin)
  async getMessages() {
    return await firestoreService.getCollection('messages', null, 'createdAt', 'desc')
  },

  // Update message (e.g., mark as read)
  async updateMessage(messageId, data) {
    return await firestoreService.updateDocument('messages', messageId, data)
  },

  // Delete message
  async deleteMessage(messageId) {
    return await firestoreService.deleteDocument('messages', messageId)
  }
}

// Media service (Videos & Photos - unified collection)
export const mediaService = {
  // Get all media items
  async getMedia(type = null) {
    const allMedia = await firestoreService.getCollection('media')
    if (type) {
      return allMedia.filter(item => item.type === type)
    }
    return allMedia
  },

  // Get photos only
  async getPhotos() {
    return await this.getMedia('photo')
  },

  // Get videos only
  async getVideos() {
    return await this.getMedia('video')
  },

  // Add media item
  async addMedia(data) {
    // Ensure type is set
    if (!data.type || !['photo', 'video'].includes(data.type)) {
      throw new Error('Media type must be "photo" or "video"')
    }
    return await firestoreService.addDocument('media', data)
  },

  // Add photo (convenience method)
  async addPhoto(data) {
    return await this.addMedia({ ...data, type: 'photo' })
  },

  // Add video (convenience method)
  async addVideo(data) {
    return await this.addMedia({ ...data, type: 'video', url: data.url })
  },

  // Update media item
  async updateMedia(id, data) {
    return await firestoreService.updateDocument('media', id, data)
  },

  // Update photo (convenience method)
  async updatePhoto(id, data) {
    return await this.updateMedia(id, { ...data, type: 'photo' })
  },

  // Update video (convenience method)
  async updateVideo(id, data) {
    return await this.updateMedia(id, { 
      ...data, 
      type: 'video',
      url: data.url 
    })
  },

  // Delete media item
  async deleteMedia(id) {
    return await firestoreService.deleteDocument('media', id)
  },

  // Delete photo (convenience method)
  async deletePhoto(id) {
    return await this.deleteMedia(id)
  },

  // Delete video (convenience method)
  async deleteVideo(id) {
    return await this.deleteMedia(id)
  }
}

// News service
export const newsService = {
  // Get all news articles
  async getNews() {
    return await firestoreService.getCollection('news')
  },

  // Add news article
  async addArticle(data) {
    return await firestoreService.addDocument('news', data)
  },

  // Update news article
  async updateArticle(id, data) {
    return await firestoreService.updateDocument('news', id, data)
  },

  // Delete news article
  async deleteArticle(id) {
    return await firestoreService.deleteDocument('news', id)
  }
}

// Projects service
export const projectsService = {
  // Get all projects
  async getProjects() {
    return await firestoreService.getCollection('projects')
  },

  // Add project
  async addProject(data) {
    return await firestoreService.addDocument('projects', data)
  },

  // Update project
  async updateProject(id, data) {
    return await firestoreService.updateDocument('projects', id, data)
  },

  // Delete project
  async deleteProject(id) {
    return await firestoreService.deleteDocument('projects', id)
  }
}

