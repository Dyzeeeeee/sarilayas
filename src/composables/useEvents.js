import { ref, computed, onMounted, onUnmounted } from 'vue'
import { eventsService } from '../firebase/firestore'
import { EVENT_PRESETS } from '../constants/eventPresets'

export function useEvents() {
  const events = ref([])
  const loading = ref(false)
  let unsubscribe = null

  const sortedEvents = computed(() =>
    [...events.value].sort((a, b) => {
      const aStart = a.startAt?.toDate ? a.startAt.toDate() : new Date(a.startAt || 0)
      const bStart = b.startAt?.toDate ? b.startAt.toDate() : new Date(b.startAt || 0)
      return bStart - aStart
    })
  )

  const activeEvent = computed(() =>
    sortedEvents.value.find(event => event.active)
  )

  const presetMap = EVENT_PRESETS.reduce((map, preset) => {
    map[preset.id] = preset
    return map
  }, {})

  const attachPresetDefaults = (event) => {
    if (!event?.presetKey || event.presetKey === 'custom') {
      return event
    }
    const preset = presetMap[event.presetKey]
    if (!preset) return event
    return {
      ...preset,
      ...event,
      headline: event.headline || preset.headline,
      message: event.message || preset.message,
      colors: {
        ...preset.colors,
        ...(event.colors || {}),
      },
      effects: {
        ...preset.effects,
        ...(event.effects || {}),
      },
    }
  }

  const loadEvents = async () => {
    loading.value = true
    try {
      events.value = await eventsService.getEvents()
    } finally {
      loading.value = false
    }
  }

  const createEvent = async (payload) => {
    await eventsService.createEvent(payload)
  }

  const updateEvent = async (id, payload) => {
    await eventsService.updateEvent(id, payload)
  }

  const deleteEvent = async (id) => {
    await eventsService.deleteEvent(id)
  }

  const subscribe = () => {
    unsubscribe = eventsService.subscribeToEvents((snapshotEvents) => {
      events.value = snapshotEvents
    })
  }

  onMounted(() => {
    subscribe()
  })

  onUnmounted(() => {
    if (unsubscribe) unsubscribe()
  })

  return {
    events,
    sortedEvents,
    activeEvent,
    loading,
    loadEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    attachPresetDefaults,
    EVENT_PRESETS,
  }
}


