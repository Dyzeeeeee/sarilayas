<template>
  <Teleport to="body">
    <Transition name="event-fade">
      <div
        v-if="open && event"
        class="fixed inset-0 z-[9998] flex items-center justify-center px-4 py-6"
        @click.self="handleClose"
      >
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div
          class="relative w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-white/10"
          :style="{
            background: event.colors?.background || '#0f172a',
            color: event.colors?.text || '#f8fafc',
          }"
        >
          <div class="absolute inset-0 opacity-20 pointer-events-none">
            <div
              v-if="event.effects?.confetti"
              class="w-full h-full opacity-60"
              style="background-image: radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px); background-size: 20px 20px;"
            ></div>
          </div>
          <div class="relative px-6 py-6 md:px-10 md:py-8 space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-2xl md:text-3xl">{{ event.badge || '🎉' }}</span>
              <button
                class="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
                @click="handleClose"
              >
                <X class="h-5 w-5" />
              </button>
            </div>
            <div>
              <p class="text-sm uppercase tracking-[0.3em] opacity-80">{{ event.label }}</p>
              <h2 class="text-2xl md:text-3xl font-black mt-2" :style="{ color: event.colors?.text }">
                {{ event.headline || 'Special Event' }}
              </h2>
              <p class="text-base md:text-lg mt-3 opacity-90 leading-relaxed">
                {{ event.message }}
              </p>
            </div>
            <div class="flex items-center gap-3 flex-wrap">
              <button
                class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow"
                :style="{
                  background: event.colors?.accent || '#f97316',
                  color: event.colors?.text || '#fff',
                }"
                @click="handleClose"
              >
                Got it
              </button>
              <span class="text-xs uppercase tracking-wide opacity-75">
                {{ formatDateRange(event.startAt, event.endAt) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps({
  event: {
    type: Object,
    default: null,
  },
  open: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

const formattedEvent = computed(() => props.event)

const handleClose = () => {
  emit('close')
}

const formatDateRange = (start, end) => {
  if (!start) return ''
  const startDate = start?.toDate ? start.toDate() : new Date(start)
  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  })
  if (!end) {
    return formatter.format(startDate)
  }
  const endDate = end?.toDate ? end.toDate() : new Date(end)
  return `${formatter.format(startDate)} · ${formatter.format(endDate)}`
}
</script>

<style scoped>
.event-fade-enter-active,
.event-fade-leave-active {
  transition: opacity 0.3s ease;
}
.event-fade-enter-from,
.event-fade-leave-to {
  opacity: 0;
}
</style>


