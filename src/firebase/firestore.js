import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, addDoc, query, orderBy, limit as firestoreLimit, where, onSnapshot } from 'firebase/firestore'
import { app } from './config'

const db = getFirestore(app)

const defaultSettings = {
  siteEnabled: true,
  pageLoaderEnabled: true,
  siteName: 'Sarilaya',
  siteDescription: 'Kasarian Kalayaan Inc.',
  logoUrl: '/MainSarilayaLogo.png',
  compactLogoUrl: '/SarilayaLogo.png',
  primaryColor: '#9333ea',
}

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

  // Subscribe to real-time media updates
  subscribeToMedia(callback, type = null, limitCount = null) {
    let q = query(collection(db, 'media'))
    
    // Filter by type if specified
    if (type) {
      q = query(q, where('type', '==', type))
      // When using where clause, we can't use orderBy without a composite index
      // So we'll fetch more items and sort client-side
      const fetchLimit = limitCount ? limitCount * 3 : null // Fetch more to ensure we have enough after sorting
      if (fetchLimit) {
        q = query(q, firestoreLimit(fetchLimit))
      }
    } else {
      // If no type filter, we can safely order by createdAt
      q = query(q, orderBy('createdAt', 'desc'))
      if (limitCount) {
        q = query(q, firestoreLimit(limitCount))
      }
    }
    
    return onSnapshot(q, (snapshot) => {
      let media = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      // Always sort client-side for consistency (especially when using where clause)
      media.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : (a.createdAt ? new Date(a.createdAt) : new Date(0))
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : (b.createdAt ? new Date(b.createdAt) : new Date(0))
        return dateB - dateA
      })
      
      // Apply limit client-side (especially important when using where clause)
      if (limitCount && media.length > limitCount) {
        media = media.slice(0, limitCount)
      }
      
      callback(media)
    }, (error) => {
      console.error('Error subscribing to media:', error)
      callback([])
    })
  },

  // Subscribe to real-time photos updates
  subscribeToPhotos(callback, limitCount = null) {
    return this.subscribeToMedia((media) => {
      const photos = media.filter(item => item.type === 'photo')
      callback(photos)
    }, 'photo', limitCount)
  },

  // Subscribe to real-time videos updates
  subscribeToVideos(callback, limitCount = null) {
    return this.subscribeToMedia((media) => {
      const videos = media.filter(item => item.type === 'video')
      callback(videos)
    }, 'video', limitCount)
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

  // Subscribe to real-time news updates
  subscribeToNews(callback, limitCount = null) {
    let q = query(collection(db, 'news'), orderBy('publishDate', 'desc'))
    if (limitCount) {
      q = query(q, firestoreLimit(limitCount))
    }
    return onSnapshot(q, (snapshot) => {
      const news = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      callback(news)
    }, (error) => {
      console.error('Error subscribing to news:', error)
      callback([])
    })
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

  // Subscribe to real-time projects updates
  subscribeToProjects(callback, limitCount = null) {
    let q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'))
    if (limitCount) {
      q = query(q, firestoreLimit(limitCount))
    }
    return onSnapshot(q, (snapshot) => {
      const projects = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      callback(projects)
    }, (error) => {
      console.error('Error subscribing to projects:', error)
      callback([])
    })
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

// Settings service
export const settingsService = {
  // Get site settings
  async getSettings() {
    const settings = await firestoreService.getDocument('settings', 'site')
    if (!settings) {
      return { ...defaultSettings }
    }

    return {
      ...defaultSettings,
      ...settings,
      siteEnabled: settings.siteEnabled !== undefined ? settings.siteEnabled : defaultSettings.siteEnabled,
      pageLoaderEnabled: settings.pageLoaderEnabled !== undefined ? settings.pageLoaderEnabled : defaultSettings.pageLoaderEnabled,
      siteName: settings.siteName || defaultSettings.siteName,
      siteDescription: settings.siteDescription || defaultSettings.siteDescription,
      logoUrl: settings.logoUrl || defaultSettings.logoUrl,
      compactLogoUrl: settings.compactLogoUrl || defaultSettings.compactLogoUrl,
      primaryColor: settings.primaryColor || defaultSettings.primaryColor,
    }
  },

  // Update site settings
  async updateSettings(data) {
    return await firestoreService.setDocument('settings', 'site', data)
  },

  // Subscribe to real-time settings updates
  subscribeToSettings(callback) {
    const docRef = doc(db, 'settings', 'site')
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          callback({
            ...defaultSettings,
            id: docSnap.id,
            ...docSnap.data(),
          })
        } else {
          callback({ ...defaultSettings })
        }
      },
      (error) => {
        console.error('Error subscribing to settings:', error)
        callback({ ...defaultSettings })
      }
    )
  },
}

export const userService = {
  async getUsers() {
    return await firestoreService.getCollection('users', null, 'createdAt', 'desc')
  },
}

export const visitorsService = {
  async recordVisit(data) {
    const payload = {
      route: data.route || '/',
      referrer: data.referrer || (typeof document !== 'undefined' ? document.referrer : ''),
      userAgent: data.userAgent || '',
      siteEnabled: data.siteEnabled !== false,
      createdAt: new Date(),
    }
    return await addDoc(collection(db, 'visits'), payload)
  },

  async getVisitSummary(limitCount = 20) {
    const q = query(collection(db, 'visits'), orderBy('createdAt', 'desc'), firestoreLimit(limitCount))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  },
}

export const eventsService = {
  async getEvents() {
    const q = query(collection(db, 'events'), orderBy('startAt', 'desc'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  },

  subscribeToEvents(callback) {
    const q = query(collection(db, 'events'), orderBy('startAt', 'desc'))
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    })
  },

  async createEvent(data) {
    return await addDoc(collection(db, 'events'), {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  },

  async updateEvent(id, data) {
    return await updateDoc(doc(db, 'events', id), {
      ...data,
      updatedAt: new Date(),
    })
  },

  async deleteEvent(id) {
    return await deleteDoc(doc(db, 'events', id))
  },

  async getActiveEvent() {
    const now = new Date()
    const q = query(
      collection(db, 'events'),
      where('active', '==', true),
      orderBy('startAt', 'desc'),
      firestoreLimit(1)
    )
    const snapshot = await getDocs(q)
    const [eventDoc] = snapshot.docs
    if (!eventDoc) return null
    const data = eventDoc.data()
    if (data.endAt && data.endAt.toDate && data.endAt.toDate() < now) return null
    return { id: eventDoc.id, ...data }
  },
}

