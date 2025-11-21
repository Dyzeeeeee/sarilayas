import { computed } from 'vue'

/**
 * Simple Feed Algorithm for mixed content (News, Photos, Videos, Projects)
 * 
 * Scoring factors:
 * 1. Recency (time decay) - 50%
 * 2. Content type priority - 20%
 * 3. Content quality - 30%
 */

export function useFeedAlgorithm() {
  
  /**
   * Calculate recency score (0-1, higher = newer)
   * Uses exponential decay
   */
  function calculateRecencyScore(date, halfLifeHours = 48) {
    if (!date) return 0
    
    const now = new Date()
    let itemDate
    if (date.toDate) {
      itemDate = date.toDate()
    } else if (date instanceof Date) {
      itemDate = date
    } else {
      itemDate = new Date(date)
    }
    
    const hoursAgo = (now - itemDate) / (1000 * 60 * 60)
    
    // Exponential decay: score = 0.5^(hours/halfLife)
    return Math.pow(0.5, hoursAgo / halfLifeHours)
  }

  /**
   * Calculate content type priority score
   */
  function getContentTypeScore(type) {
    const weights = {
      'news': 1.2,      // News gets 20% boost
      'project': 1.1,   // Projects get 10% boost
      'photo': 1.0,     // Photos baseline
      'video': 1.0      // Videos baseline
    }
    return weights[type] || 1.0
  }

  /**
   * Calculate content quality score
   * Rewards complete content
   */
  function calculateQualityScore(item, type) {
    let score = 0.5 // Base score
    
    // Has image/thumbnail
    if (item.image || item.url) score += 0.2
    
    // Has description
    if (item.description && item.description.length > 50) score += 0.15
    if (item.description && item.description.length > 200) score += 0.1
    
    // Has title
    if (item.title && item.title.length > 10) score += 0.05
    
    // Type-specific quality checks
    if (type === 'news' && item.content && item.content.length > 100) {
      score += 0.1
    }
    if (type === 'project' && item.content && item.content.length > 200) {
      score += 0.1
    }
    
    return Math.min(score, 1.0) // Cap at 1.0
  }

  /**
   * Calculate feed score for an item
   */
  function calculateFeedScore(item, type) {
    const date = item.publishDate || item.createdAt
    
    // Factor weights
    const weights = {
      recency: 0.5,        // 50% weight on recency
      type: 0.2,           // 20% weight on content type
      quality: 0.3,        // 30% weight on quality
    }
    
    const recencyScore = calculateRecencyScore(date)
    const typeScore = getContentTypeScore(type)
    const qualityScore = calculateQualityScore(item, type)
    
    // Weighted sum
    const totalScore = 
      (recencyScore * weights.recency) +
      (typeScore * weights.type) +
      (qualityScore * weights.quality)
    
    return totalScore
  }

  /**
   * Sort and merge multiple content types into a unified feed
   */
  function createUnifiedFeed(news, photos, videos, projects) {
    // Normalize all items to common format
    const allItems = [
      ...news.map(item => ({ 
        ...item, 
        type: 'news', 
        date: item.publishDate || item.createdAt,
        feedScore: 0
      })),
      ...photos.map(item => ({ 
        ...item, 
        type: 'photo', 
        date: item.createdAt,
        feedScore: 0
      })),
      ...videos.map(item => ({ 
        ...item, 
        type: 'video', 
        date: item.createdAt,
        feedScore: 0
      })),
      ...projects.map(item => ({ 
        ...item, 
        type: 'project', 
        date: item.createdAt,
        feedScore: 0
      }))
    ]
    
    // Calculate scores for all items
    allItems.forEach(item => {
      item.feedScore = calculateFeedScore(item, item.type)
    })
    
    // Sort by score (highest first)
    allItems.sort((a, b) => b.feedScore - a.feedScore)
    
    return allItems
  }

  return {
    calculateFeedScore,
    createUnifiedFeed
  }
}

