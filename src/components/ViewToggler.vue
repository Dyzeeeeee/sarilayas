<template>
  <button
    @click="cycleViewMode"
    class="p-2 border border-white/30 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2"
    :title="`${viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} view - Click to change`"
  >
    <Rows3 v-if="viewMode === 'list'" class="w-4 h-4" />
    <LayoutGrid v-else-if="viewMode === 'grid'" class="w-4 h-4" />
    <Image v-else class="w-4 h-4" />
    <span class="hidden lg:inline text-sm font-medium">{{ viewMode.charAt(0).toUpperCase() + viewMode.slice(1) }}</span>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { Rows3, LayoutGrid, Image } from 'lucide-vue-next'
import { useViewMode } from '../composables/useViewMode'

const props = defineProps({
  storageKey: {
    type: String,
    required: true
  },
  modes: {
    type: Array,
    default: () => ['list', 'grid', 'cards']
  },
  defaultMode: {
    type: String,
    default: 'grid'
  }
})

// Determine page type from storage key
const pageType = props.storageKey.replace('ViewMode', '') // 'media' or 'news'

// Use the composable
const { viewMode } = useViewMode(pageType)

// Cycle through view modes
function cycleViewMode() {
  const currentIndex = props.modes.indexOf(viewMode.value)
  const nextIndex = (currentIndex + 1) % props.modes.length
  const newMode = props.modes[nextIndex]
  viewMode.value = newMode
}
</script>

