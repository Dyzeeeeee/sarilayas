<template>
  <div
    :class="[
      'rounded-lg shadow-sm flex overflow-hidden transition',
      cardClasses && cardClasses.includes('flex-row') ? 'flex-row' : 'flex-col',
      !cardClasses || !cardClasses.includes('flex-row') ? cardClasses : '',
      clickable && 'cursor-pointer',
      variant === 'primary' && 'bg-primary-700 border border-white/30 text-white',
      variant === 'light' && 'bg-gray-100 text-gray-900',
      variant === 'white' && 'bg-white border border-gray-200 text-gray-900',
    ]"
    @click="handleClick"
  >
    <!-- Image Section -->
    <div
      v-if="image || $slots.image"
      :class="[
        'relative overflow-hidden',
        cardClasses && cardClasses.includes('flex-row') ? 'w-auto shrink-0' : 'w-full',
        imageHeight || (cardClasses && cardClasses.includes('flex-row') ? '' : 'h-40 sm:h-48 lg:h-56'),
        imageAspect && !(cardClasses && cardClasses.includes('flex-row')) && `aspect-${imageAspect}`,
        imageRounded && (cardClasses && cardClasses.includes('flex-row') ? 'rounded-l-lg' : 'rounded-t-lg')
      ]"
    >
      <slot name="image">
        <img
          v-if="image"
          :src="image"
          :alt="imageAlt || title"
          class="w-full h-full object-cover"
        />
      </slot>
      <slot name="imageOverlay"></slot>
    </div>

      <!-- Content Section -->
    <div
      v-if="title || description || $slots.default || $slots.footer"
      :class="[
        cardClasses && cardClasses.includes('flex-row') ? 'p-2 flex-1 flex flex-col min-w-0' : 'p-3 sm:p-4 flex-1 flex flex-col min-w-0',
        variant === 'primary' && 'text-white',
        variant === 'light' && 'text-primary-700',
        variant === 'white' && 'text-gray-900'
      ]"
    >
      <!-- Title -->
      <h3
        v-if="title"
        :class="[
          'font-semibold mb-1',
          titleSize || 'text-sm sm:text-base',
          titleClamp ? `line-clamp-${titleClamp}` : (titleTruncate !== false && 'truncate'),
          variant === 'primary' && 'text-white',
          variant === 'light' && 'text-primary-700',
          variant === 'white' && 'text-gray-900'
        ]"
      >
        {{ title }}
      </h3>
      <slot name="title"></slot>

      <!-- Tagline/Subtitle -->
      <p
        v-if="tagline"
        :class="[
          'italic mb-1',
          taglineSize || 'text-xs sm:text-sm',
          taglineTruncate && 'truncate',
          variant === 'primary' && 'text-white/80',
          variant === 'light' && 'text-primary-700/80',
          variant === 'white' && 'text-gray-600'
        ]"
      >
        {{ tagline }}
      </p>
      <slot name="tagline"></slot>

      <!-- Description -->
      <p
        v-if="description"
        :class="[
          'mb-1',
          descriptionSize || 'text-xs sm:text-sm',
          descriptionClamp ? `line-clamp-${descriptionClamp}` : 'truncate',
          variant === 'primary' && 'text-white/80',
          variant === 'light' && 'text-primary-700/80',
          variant === 'white' && 'text-gray-600'
        ]"
      >
        {{ description }}
      </p>
      <slot name="description"></slot>

      <!-- Default Slot -->
      <slot></slot>

      <!-- Footer Slot -->
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Variants
  variant: {
    type: String,
    default: 'white', // 'primary', 'light', 'white'
    validator: (value) => ['primary', 'light', 'white'].includes(value)
  },
  
  // Image props
  image: String,
  imageAlt: String,
  imageHeight: String,
  imageAspect: String, // 'square', 'video', etc.
  imageRounded: {
    type: Boolean,
    default: true
  },
  imageHover: {
    type: Boolean,
    default: false
  },
  
  // Content props
  title: String,
  titleSize: String,
  titleTruncate: {
    type: Boolean,
    default: true
  },
  titleClamp: [String, Number], // e.g., '2' for line-clamp-2
  tagline: String,
  taglineSize: String,
  taglineTruncate: {
    type: Boolean,
    default: true
  },
  description: String,
  descriptionSize: String,
  descriptionClamp: [String, Number], // e.g., '3' for line-clamp-3
  
  // Interaction
  clickable: {
    type: Boolean,
    default: false
  },
  
  // Custom classes
  cardClasses: String
})

const emit = defineEmits(['click'])

const handleClick = () => {
  if (props.clickable) {
    emit('click')
  }
}
</script>

