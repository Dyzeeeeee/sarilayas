import { ref, computed, onMounted } from 'vue'
import { newsService, mediaService, projectsService } from '../firebase/firestore'
import { useToast } from './useToast'

const LAST_VISIT_KEY = 'sarilaya_last_visit'
const NOTIFICATIONS_KEY = 'sarilaya_notifications'
const NOTIFICATIONS_READ_KEY = 'sarilaya_notifications_read'

const notifications = ref([])
const unreadCount = ref(0)
const isLoading = ref(false)
let unsubscribeNews = null
let unsubscribePhotos = null
let unsubscribeVideos = null
let unsubscribeProjects = null
let notificationSound = null

// Initialize notification sound
function initNotificationSound() {
  try {
    // Try public folder first (Vite serves files from public/)
    notificationSound = new Audio('/notif.mp3')
    notificationSound.volume = 0.5
    // Preload the sound
    notificationSound.load().catch(err => {
      console.warn('Could not preload notification sound:', err)
    })
  } catch (error) {
    console.warn('Could not load notification sound:', error)
  }
}

// Play notification sound
function playNotificationSound() {
  if (notificationSound) {
    try {
      notificationSound.currentTime = 0
      notificationSound.play().catch(err => {
        console.warn('Could not play notification sound:', err)
      })
    } catch (error) {
      console.warn('Error playing notification sound:', error)
    }
  }
}

// Get last visit timestamp from localStorage
function getLastVisit() {
  try {
    const lastVisit = localStorage.getItem(LAST_VISIT_KEY)
    return lastVisit ? parseInt(lastVisit, 10) : null
  } catch (error) {
    console.error('Error reading last visit:', error)
    return null
  }
}

// Update last visit timestamp
function updateLastVisit() {
  try {
    localStorage.setItem(LAST_VISIT_KEY, Date.now().toString())
  } catch (error) {
    console.error('Error updating last visit:', error)
  }
}

// Get read notification IDs
function getReadNotifications() {
  try {
    const read = localStorage.getItem(NOTIFICATIONS_READ_KEY)
    return read ? JSON.parse(read) : []
  } catch (error) {
    console.error('Error reading read notifications:', error)
    return []
  }
}

// Mark notification as read
function markAsRead(notificationId) {
  try {
    const read = getReadNotifications()
    if (!read.includes(notificationId)) {
      read.push(notificationId)
      localStorage.setItem(NOTIFICATIONS_READ_KEY, JSON.stringify(read))
      updateUnreadCount()
    }
  } catch (error) {
    console.error('Error marking notification as read:', error)
  }
}

// Mark all notifications as read
function markAllAsRead() {
  try {
    const allIds = notifications.value.map(n => n.id)
    localStorage.setItem(NOTIFICATIONS_READ_KEY, JSON.stringify(allIds))
    updateUnreadCount()
  } catch (error) {
    console.error('Error marking all as read:', error)
  }
}

// Update unread count
function updateUnreadCount() {
  const read = getReadNotifications()
  unreadCount.value = notifications.value.filter(n => !read.includes(n.id)).length
}

// Convert date to timestamp
function getItemTimestamp(item) {
  let date
  if (item.type === 'news') {
    date = item.publishDate || item.createdAt
  } else {
    date = item.createdAt
  }
  
  if (!date) return 0
  
  if (date.toDate) {
    return date.toDate().getTime()
  } else if (date instanceof Date) {
    return date.getTime()
  } else if (typeof date === 'string' || typeof date === 'number') {
    return new Date(date).getTime()
  }
  
  return 0
}

// Get YouTube video ID from URL
function getYouTubeVideoId(url) {
  if (!url) return null
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) return match[1]
  }
  return null
}

// Get YouTube thumbnail URL
function getYouTubeThumbnailUrl(url) {
  const videoId = getYouTubeVideoId(url)
  if (!videoId) return null
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
}

// Get image URL for notification
function getNotificationImage(item) {
  if (item.type === 'news' || item.type === 'project') {
    return item.image || null
  }
  if (item.type === 'photo') {
    return item.url || null
  }
  if (item.type === 'video') {
    if (item.url) {
      return getYouTubeThumbnailUrl(item.url) || null
    }
    return null
  }
  return null
}

// Process new items and create notifications
function processNewItems(allItems, isInitialLoad = false) {
  const lastVisit = getLastVisit()
  const now = Date.now()
  
  // If no last visit and not initial load, set it to now and return (first time user)
  if (!lastVisit && !isInitialLoad) {
    updateLastVisit()
    return []
  }
  
  // For initial load, use current time as last visit if none exists
  const checkTime = lastVisit || now
  
  // Filter items created after last visit
  const newItems = allItems.filter(item => {
    const itemTimestamp = getItemTimestamp(item)
    return itemTimestamp > checkTime && itemTimestamp <= now
  })
  
  // Create notifications from new items
  const newNotifications = newItems.map(item => ({
    id: `${item.type}-${item.id}`,
    type: item.type,
    title: item.title || 'Untitled',
    itemId: item.id,
    timestamp: getItemTimestamp(item),
    date: item.publishDate || item.createdAt,
    image: getNotificationImage(item),
    deleted: false
  }))
  
  return newNotifications
}

// Add new notifications and show toast/sound
function addNewNotifications(newNotifications) {
  if (newNotifications.length === 0) return
  
  const { info } = useToast()
  const existingNotifications = getStoredNotifications()
  const existingIds = new Set(existingNotifications.map(n => n.id))
  
  // Filter out already existing notifications
  const trulyNew = newNotifications.filter(n => !existingIds.has(n.id))
  
  if (trulyNew.length === 0) return
  
  // Merge with existing and sort by timestamp (newest first)
  notifications.value = [...trulyNew, ...existingNotifications]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 50) // Keep only last 50 notifications
  
  // Store notifications
  storeNotifications(notifications.value)
  
  // Update unread count
  updateUnreadCount()
  
  // Show toast and play sound for each new notification
  trulyNew.forEach(notification => {
    const typeLabel = getNotificationTypeLabel(notification.type)
    info(`New ${typeLabel}: ${notification.title}`, 5000, {
      image: notification.image,
      type: notification.type
    })
  })
  
  // Play sound once for all new notifications
  if (trulyNew.length > 0) {
    playNotificationSound()
  }
}

// Check for new posts (one-time check)
async function checkForNewPosts() {
  isLoading.value = true
  try {
    const lastVisit = getLastVisit()
    const now = Date.now()
    
    // If no last visit, set it to now and return (first time user)
    if (!lastVisit) {
      updateLastVisit()
      notifications.value = []
      updateUnreadCount()
      return
    }
    
    // Fetch all posts
    const [news, photos, videos, projects] = await Promise.all([
      newsService.getNews(),
      mediaService.getPhotos(),
      mediaService.getVideos(),
      projectsService.getProjects()
    ])
    
    // Combine all items
    const allItems = [
      ...news.map(item => ({ ...item, type: 'news' })),
      ...photos.map(item => ({ ...item, type: 'photo' })),
      ...videos.map(item => ({ ...item, type: 'video' })),
      ...projects.map(item => ({ ...item, type: 'project' }))
    ]
    
    // Process new items
    const newNotifications = processNewItems(allItems, true)
    addNewNotifications(newNotifications)
    
  } catch (error) {
    console.error('Error checking for new posts:', error)
  } finally {
    isLoading.value = false
  }
}

// Get stored notifications from localStorage
function getStoredNotifications() {
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error reading stored notifications:', error)
    return []
  }
}

// Store notifications to localStorage
function storeNotifications(notifs) {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs))
  } catch (error) {
    console.error('Error storing notifications:', error)
  }
}

// Remove notification when item is deleted
function removeNotification(notificationId) {
  const index = notifications.value.findIndex(n => n.id === notificationId)
  if (index !== -1) {
    notifications.value.splice(index, 1)
    storeNotifications(notifications.value)
    updateUnreadCount()
    
    // Also remove from read notifications
    const read = getReadNotifications()
    const readIndex = read.indexOf(notificationId)
    if (readIndex !== -1) {
      read.splice(readIndex, 1)
      localStorage.setItem(NOTIFICATIONS_READ_KEY, JSON.stringify(read))
    }
    
    return true
  }
  return false
}

// Check and mark deleted notifications against current items
async function checkDeletedNotifications() {
  try {
    // Fetch all current items
    const [news, photos, videos, projects] = await Promise.all([
      newsService.getNews(),
      mediaService.getPhotos(),
      mediaService.getVideos(),
      projectsService.getProjects()
    ])
    
    // Create a set of all current item IDs
    const currentItems = new Set()
    news.forEach(item => currentItems.add(`news-${item.id}`))
    photos.forEach(item => currentItems.add(`photo-${item.id}`))
    videos.forEach(item => currentItems.add(`video-${item.id}`))
    projects.forEach(item => currentItems.add(`project-${item.id}`))
    
    // Check all stored notifications
    const storedNotifications = getStoredNotifications()
    let hasChanges = false
    
    storedNotifications.forEach(notification => {
      if (!currentItems.has(notification.id)) {
        // Item no longer exists, remove notification
        const index = notifications.value.findIndex(n => n.id === notification.id)
        if (index !== -1) {
          notifications.value.splice(index, 1)
          hasChanges = true
        }
      }
    })
    
    if (hasChanges) {
      storeNotifications(notifications.value)
      updateUnreadCount()
    }
  } catch (error) {
    console.error('Error checking deleted notifications:', error)
  }
}

// Setup real-time listeners
function setupRealtimeListeners() {
  const lastVisit = getLastVisit()
  
  // Track seen item IDs to detect truly new items
  const seenItemIds = new Set()
  // Track current item IDs to detect deletions
  const currentItemIds = {
    news: new Set(),
    photo: new Set(),
    video: new Set(),
    project: new Set()
  }
  let initialLoadComplete = false
  let loadedCount = 0
  const totalListeners = 4
  
  const checkAndProcess = () => {
    loadedCount++
    if (loadedCount >= totalListeners && !initialLoadComplete) {
      initialLoadComplete = true
      // Mark all current items as seen
      // Update last visit after initial load
      updateLastVisit()
      isLoading.value = false
    }
  }
  
  // Track previous item data to detect updates
  const previousItems = {
    news: new Map(),
    photo: new Map(),
    video: new Map(),
    project: new Map()
  }
  
  // Helper to get item hash for comparison
  const getItemHash = (item) => {
    return JSON.stringify({
      title: item.title,
      description: item.description,
      image: item.image || item.url,
      updatedAt: item.updatedAt?.toDate ? item.updatedAt.toDate().getTime() : (item.updatedAt ? new Date(item.updatedAt).getTime() : null)
    })
  }
  
  // Helper to process items and detect new ones, updates, and deletions
  const processItems = (items, type) => {
    const typedItems = items.map(item => ({ ...item, type }))
    const currentItemIdsSet = new Set(typedItems.map(item => item.id))
    const previousItemsMap = previousItems[type]
    
    if (!initialLoadComplete) {
      // On initial load, mark all items as seen and store their data
      typedItems.forEach(item => {
        const itemId = `${item.type}-${item.id}`
        seenItemIds.add(itemId)
        currentItemIds[type].add(item.id)
        previousItemsMap.set(item.id, getItemHash(item))
      })
      checkAndProcess()
      return
    }
    
    // After initial load, check all stored notifications of this type for deletions
    const storedNotifications = getStoredNotifications()
    const typeNotifications = storedNotifications.filter(n => n.type === type)
    
    typeNotifications.forEach(notification => {
      // Check if the item still exists
      const itemStillExists = currentItemIdsSet.has(notification.itemId)
      if (!itemStillExists) {
        // Item was deleted, remove notification
        removeNotification(notification.id)
        previousItemsMap.delete(notification.itemId)
      }
    })
    
    // Detect updates and new items
    const updatedItems = []
    const newItems = []
    
    typedItems.forEach(item => {
      const itemId = `${item.type}-${item.id}`
      const currentHash = getItemHash(item)
      const previousHash = previousItemsMap.get(item.id)
      
      if (!seenItemIds.has(itemId)) {
        // New item
        seenItemIds.add(itemId)
        newItems.push(item)
        previousItemsMap.set(item.id, currentHash)
      } else if (previousHash && previousHash !== currentHash) {
        // Item was updated
        updatedItems.push(item)
        previousItemsMap.set(item.id, currentHash)
      } else if (!previousHash) {
        // Item exists but wasn't tracked (shouldn't happen, but handle it)
        previousItemsMap.set(item.id, currentHash)
      }
    })
    
    // Process updates
    if (updatedItems.length > 0) {
      const { info } = useToast()
      let hasUpdates = false
      
      updatedItems.forEach(item => {
        const notificationId = `${type}-${item.id}`
        const existingIndex = notifications.value.findIndex(n => n.id === notificationId)
        
        if (existingIndex !== -1) {
          // Update existing notification
          const existing = notifications.value[existingIndex]
          notifications.value[existingIndex] = {
            ...existing,
            title: item.title || 'Untitled',
            image: getNotificationImage(item),
            updated: true,
            updateTimestamp: Date.now()
          }
          
          // Mark as unread if it was read before
          const read = getReadNotifications()
          const readIndex = read.indexOf(notificationId)
          if (readIndex !== -1) {
            read.splice(readIndex, 1)
            localStorage.setItem('sarilaya_notifications_read', JSON.stringify(read))
          }
          
          hasUpdates = true
          
          const typeLabel = getNotificationTypeLabel(type)
          info(`Updated ${typeLabel}: ${item.title || 'Untitled'}`, 5000, {
            image: getNotificationImage(item),
            type: type
          })
        } else {
          // Create new notification for updated item (shouldn't happen often)
          const notification = {
            id: notificationId,
            type: type,
            title: item.title || 'Untitled',
            itemId: item.id,
            timestamp: getItemTimestamp(item),
            date: item.publishDate || item.createdAt,
            image: getNotificationImage(item),
            deleted: false,
            updated: true,
            updateTimestamp: Date.now()
          }
          notifications.value.push(notification)
          hasUpdates = true
        }
      })
      
      if (hasUpdates) {
        // Sort by timestamp (newest first), prioritizing update timestamp
        notifications.value.sort((a, b) => {
          const aTime = a.updateTimestamp || a.timestamp
          const bTime = b.updateTimestamp || b.timestamp
          return bTime - aTime
        })
        notifications.value = notifications.value.slice(0, 50)
        storeNotifications(notifications.value)
        updateUnreadCount()
        
        // Play sound for updates
        playNotificationSound()
      }
    }
    
    // Process new items
    if (newItems.length > 0) {
      // Check if these items are actually new (created after last visit)
      const lastVisitTime = getLastVisit() || 0
      const trulyNew = newItems.filter(item => {
        const itemTimestamp = getItemTimestamp(item)
        return itemTimestamp > lastVisitTime
      })
      
      if (trulyNew.length > 0) {
        const newNotifications = trulyNew.map(item => ({
          id: `${item.type}-${item.id}`,
          type: item.type,
          title: item.title || 'Untitled',
          itemId: item.id,
          timestamp: getItemTimestamp(item),
            date: item.publishDate || item.createdAt,
            image: getNotificationImage(item),
            updated: false
          }))
        addNewNotifications(newNotifications)
      }
    }
    
    // Update current item IDs for this type
    currentItemIds[type] = new Set(typedItems.map(item => item.id))
  }
  
  // Subscribe to real-time updates
  unsubscribeNews = newsService.subscribeToNews((news) => {
    processItems(news, 'news')
  })
  
  unsubscribePhotos = mediaService.subscribeToPhotos((photos) => {
    processItems(photos, 'photo')
  })
  
  unsubscribeVideos = mediaService.subscribeToVideos((videos) => {
    processItems(videos, 'video')
  })
  
  unsubscribeProjects = projectsService.subscribeToProjects((projects) => {
    processItems(projects, 'project')
  })
}

// Cleanup real-time listeners
function cleanupRealtimeListeners() {
  if (unsubscribeNews) unsubscribeNews()
  if (unsubscribePhotos) unsubscribePhotos()
  if (unsubscribeVideos) unsubscribeVideos()
  if (unsubscribeProjects) unsubscribeProjects()
}

// Initialize: load stored notifications and setup real-time listeners
async function initialize() {
  // Initialize sound
  initNotificationSound()
  
  // Load stored notifications first
  notifications.value = getStoredNotifications()
  updateUnreadCount()
  isLoading.value = true
  
  // Check for deleted items in stored notifications
  await checkDeletedNotifications()
  
  // Setup real-time listeners
  setupRealtimeListeners()
}

// Get notification icon based on type
function getNotificationIcon(type) {
  const icons = {
    'news': 'Newspaper',
    'photo': 'Image',
    'video': 'Video',
    'project': 'FolderOpenDot'
  }
  return icons[type] || 'Bell'
}

// Get notification type label
function getNotificationTypeLabel(type) {
  const labels = {
    'news': 'News',
    'photo': 'Photo',
    'video': 'Video',
    'project': 'Project'
  }
  return labels[type] || 'Update'
}

export function useNotifications() {
  return {
    notifications: computed(() => notifications.value),
    unreadCount: computed(() => unreadCount.value),
    isLoading: computed(() => isLoading.value),
    checkForNewPosts,
    markAsRead,
    markAllAsRead,
    updateLastVisit,
    getNotificationIcon,
    getNotificationTypeLabel,
    initialize,
    cleanup: cleanupRealtimeListeners
  }
}

