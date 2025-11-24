import { ref } from 'vue'
import { visitorsService } from '../firebase/firestore'

export function useVisitors() {
  const recordVisit = async ({ route, referrer, userAgent, siteEnabled }) => {
    try {
      await visitorsService.recordVisit({
        route,
        referrer,
        userAgent,
        siteEnabled,
      })
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to record visit', error)
      }
    }
  }

  const getVisitSummary = async (limit = 50) => {
    try {
      return await visitorsService.getVisitSummary(limit)
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to load visit summary', error)
      }
      return []
    }
  }

  return {
    recordVisit,
    getVisitSummary,
  }
}


