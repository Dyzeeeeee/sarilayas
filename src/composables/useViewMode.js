import { ref, computed, watch } from 'vue'

// Global state for view modes
const viewModes = {
  media: ref(localStorage.getItem('mediaViewMode') || 'grid'),
  news: ref(localStorage.getItem('newsViewMode') || 'cards'),
  officers: ref(localStorage.getItem('officersViewMode') || 'cards'),
  nationalCouncil: ref(localStorage.getItem('nationalCouncilViewMode') || 'cards'),
  chapters: ref(localStorage.getItem('chaptersViewMode') || 'cards'),
  projects: ref(localStorage.getItem('projectsViewMode') || 'cards')
}

// Watch and sync with localStorage
Object.keys(viewModes).forEach(key => {
  const storageKey = `${key}ViewMode`
  const modeRef = viewModes[key]
  
  // Watch for changes and save to localStorage
  watch(modeRef, (newValue) => {
    if (newValue) {
      localStorage.setItem(storageKey, newValue)
    }
  })
})

export function useViewMode(page) {
  const modeRef = viewModes[page] || ref('grid')
  
  const viewMode = computed({
    get: () => modeRef.value,
    set: (value) => {
      modeRef.value = value
    }
  })
  
  return {
    viewMode
  }
}

