<template>
  <SuperAdminLayout>
    <div class="space-y-5 md:space-y-8">
      <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Events & Greetings</h1>
          <p class="text-sm text-gray-500">Schedule celebratory greetings and seasonal UI presets.</p>
        </div>
        <button
          @click="openEditor()"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 text-white font-semibold text-sm shadow hover:bg-primary-700 transition"
        >
          <Sparkles class="h-4 w-4" />
          New Event
        </button>
      </div>

      <section class="bg-white border border-gray-200 rounded-2xl shadow-sm divide-y divide-gray-100">
        <div class="p-4 md:p-6 flex items-center justify-between">
          <div>
            <p class="text-lg font-semibold text-gray-900">Scheduled events</p>
            <p class="text-sm text-gray-500">Only one event can be active at a time.</p>
          </div>
          <button
            @click="refreshEvents"
            :disabled="loading"
            class="inline-flex items-center gap-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition disabled:opacity-50"
          >
            <RefreshCw :class="['h-4 w-4', loading && 'animate-spin']" />
            Refresh
          </button>
        </div>
        <div v-if="loading" class="p-4 space-y-3">
          <div v-for="n in 4" :key="n" class="h-16 rounded-xl bg-gray-100 animate-pulse"></div>
        </div>
        <div v-else-if="decoratedEvents.length === 0" class="p-6 text-center text-sm text-gray-500">
          No events yet. Create one with the button above.
        </div>
        <div v-else class="divide-y divide-gray-100">
          <div
            v-for="event in decoratedEvents"
            :key="event.id"
            class="p-4 md:p-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div
                class="h-12 w-12 rounded-xl flex items-center justify-center text-xl"
                :style="{ background: event.colors?.background || '#0f172a', color: event.colors?.text || '#fff' }"
              >
                {{ presetBadge(event.presetKey) }}
              </div>
              <div class="min-w-0">
                <p class="text-base font-semibold text-gray-900 truncate">{{ event.title || presetLabel(event.presetKey) }}</p>
                <p class="text-xs text-gray-500 truncate">
                  {{ formatDateRange(event.startAt, event.endAt) }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span
                class="px-2 py-0.5 text-xs font-semibold rounded-full"
                :class="event.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'"
              >
                {{ event.active ? 'Live' : 'Inactive' }}
              </span>
              <button
                @click="toggleActive(event)"
                class="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                {{ event.active ? 'Disable' : 'Activate' }}
              </button>
              <button
                @click="openEditor(event)"
                class="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Edit
              </button>
              <button
                @click="removeEvent(event)"
                class="px-3 py-1.5 rounded-lg border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </section>

      <Transition name="fade">
        <div
          v-if="showEditor"
          class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          @click.self="closeEditor"
        >
          <div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <p class="text-lg font-semibold text-gray-900">
                  {{ form.id ? 'Edit Event' : 'New Event' }}
                </p>
                <p class="text-sm text-gray-500">Preset-driven greetings modal</p>
              </div>
              <button @click="closeEditor" class="p-2 rounded-lg hover:bg-gray-100 transition">
                <X class="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <form class="px-6 py-6 space-y-6" @submit.prevent="saveEvent">
              <div class="space-y-3">
                <label class="text-sm font-semibold text-gray-700">Event Title</label>
                <input
                  v-model="form.title"
                  type="text"
                  required
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div class="grid gap-4 md:grid-cols-2">
                <div>
                  <label class="text-sm font-semibold text-gray-700">Preset</label>
                  <select
                    v-model="form.presetKey"
                    class="mt-1 w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    @change="applyPresetToForm"
                  >
                    <option
                      v-for="preset in EVENT_PRESETS"
                      :key="preset.id"
                      :value="preset.id"
                    >
                      {{ preset.label }}
                    </option>
                  </select>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="text-sm font-semibold text-gray-700">Start</label>
                    <input
                      v-model="form.startAt"
                      type="datetime-local"
                      class="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label class="text-sm font-semibold text-gray-700">End</label>
                    <input
                      v-model="form.endAt"
                      type="datetime-local"
                      class="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
              <div class="grid gap-4 md:grid-cols-2">
                <div>
                  <label class="text-sm font-semibold text-gray-700">Headline</label>
                  <input
                    v-model="form.headline"
                    type="text"
                    class="mt-1 w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label class="text-sm font-semibold text-gray-700">Accent Color</label>
                  <input
                    v-model="form.colors.accent"
                    type="color"
                    class="mt-1 w-16 h-12 rounded-lg border border-gray-200 cursor-pointer"
                  />
                </div>
              </div>
              <div class="space-y-3">
                <label class="text-sm font-semibold text-gray-700">Message</label>
                <textarea
                  v-model="form.message"
                  rows="3"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                ></textarea>
              </div>
              <div class="flex items-center justify-between">
                <label class="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <input type="checkbox" v-model="form.active" class="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  Set live immediately
                </label>
                <div class="flex items-center gap-3">
                  <button
                    type="button"
                    @click="closeEditor"
                    class="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-semibold shadow hover:bg-primary-700"
                    :disabled="saving"
                  >
                    {{ saving ? 'Saving...' : 'Save Event' }}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </div>
  </SuperAdminLayout>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import SuperAdminLayout from '../../layouts/SuperAdminLayout.vue'
import { useToast } from '../../composables/useToast'
import { useEvents } from '../../composables/useEvents'
import { EVENT_PRESETS } from '../../constants/eventPresets'
import { useConfirm } from '../../composables/useConfirm'
import { Sparkles, RefreshCw, X } from 'lucide-vue-next'

const { success: showSuccess, error: showError } = useToast()
const { confirm } = useConfirm()
const {
  events,
  sortedEvents,
  loading,
  createEvent,
  updateEvent,
  deleteEvent,
  attachPresetDefaults,
  loadEvents,
} = useEvents()

const decoratedEvents = computed(() =>
  sortedEvents.value.map(event => attachPresetDefaults(event))
)

const showEditor = ref(false)
const saving = ref(false)
const form = reactive(getEmptyForm())

function getEmptyForm() {
  return {
    id: null,
    title: '',
    presetKey: 'new_year',
    startAt: '',
    endAt: '',
    headline: '',
    message: '',
    colors: {
      background: '#0f172a',
      accent: '#f97316',
      text: '#ffffff',
    },
    effects: {
      confetti: true,
      glow: true,
    },
    active: false,
  }
}

function openEditor(event = null) {
  Object.assign(form, getEmptyForm())
  if (event) {
    Object.assign(form, {
      ...event,
      startAt: toLocalInputValue(event.startAt),
      endAt: toLocalInputValue(event.endAt),
    })
  } else {
    applyPresetToForm()
  }
  showEditor.value = true
}

function closeEditor() {
  showEditor.value = false
}

function applyPresetToForm() {
  const preset = EVENT_PRESETS.find(p => p.id === form.presetKey)
  if (!preset || preset.id === 'custom') return
  form.headline = preset.headline
  form.message = preset.message
  form.colors = { ...preset.colors }
  form.effects = { ...preset.effects }
}

function presetBadge(key) {
  return EVENT_PRESETS.find(p => p.id === key)?.badge || '🎉'
}

function presetLabel(key) {
  return EVENT_PRESETS.find(p => p.id === key)?.label || 'Custom Event'
}

function toTimestamp(value) {
  if (!value) return null
  return new Date(value)
}

function toLocalInputValue(value) {
  if (!value) return ''
  const date = value.toDate ? value.toDate() : new Date(value)
  return date.toISOString().slice(0, 16)
}

function formatDateRange(start, end) {
  const startDate = start?.toDate ? start.toDate() : new Date(start || 0)
  const endDate = end
    ? (end.toDate ? end.toDate() : new Date(end))
    : null
  const options = { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }
  if (endDate) {
    return `${startDate.toLocaleString('en-US', options)} → ${endDate.toLocaleString('en-US', options)}`
  }
  return startDate.toLocaleString('en-US', options)
}

async function saveEvent() {
  try {
    saving.value = true
    const payload = {
      title: form.title,
      presetKey: form.presetKey,
      headline: form.headline,
      message: form.message,
      colors: form.colors,
      effects: form.effects,
      startAt: toTimestamp(form.startAt),
      endAt: toTimestamp(form.endAt),
      active: form.active,
    }

    if (form.id) {
      await updateEvent(form.id, payload)
      showSuccess('Event updated')
    } else {
      await createEvent(payload)
      showSuccess('Event created')
    }

    closeEditor()
  } catch (err) {
    console.error(err)
    showError('Failed to save event')
  } finally {
    saving.value = false
  }
}

async function toggleActive(event) {
  try {
    await updateEvent(event.id, { active: !event.active })
    showSuccess(event.active ? 'Event disabled' : 'Event activated')
  } catch (err) {
    console.error(err)
    showError('Failed to update event status')
  }
}

async function removeEvent(event) {
  const confirmed = await confirm(`Delete "${event.title}"?`, {
    title: 'Delete Event',
    confirmText: 'Delete',
    cancelText: 'Cancel',
  })
  if (!confirmed) return
  try {
    await deleteEvent(event.id)
    showSuccess('Event deleted')
  } catch (err) {
    console.error(err)
    showError('Failed to delete event')
  }
}

async function refreshEvents() {
  await loadEvents()
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>


