<template>
  <div
    :class="[
      'animate-pulse',
      baseClasses,
      customClass
    ]"
  >
    <!-- Card Skeleton -->
    <div v-if="type === 'card'" :class="cardClasses">
      <div
        v-if="showImage"
        :class="[
          'bg-gray-200 rounded mb-2',
          imageHeight || 'h-36 sm:h-48 lg:h-56',
          imageAspect && `aspect-${imageAspect}`
        ]"
      ></div>
      <div class="space-y-2">
        <div
          v-if="showTitle"
          :class="[
            'bg-gray-200 rounded',
            titleHeight || 'h-4',
            titleWidth || 'w-3/4'
          ]"
        ></div>
        <div
          v-if="showDescription"
          v-for="n in descriptionLines"
          :key="n"
          :class="[
            'bg-gray-200 rounded',
            descriptionHeight || 'h-3',
            n === descriptionLines ? descriptionWidth || 'w-5/6' : 'w-full'
          ]"
        ></div>
      </div>
    </div>

    <!-- List Skeleton -->
    <div v-else-if="type === 'list'" :class="listClasses">
      <div
        v-for="n in lines"
        :key="n"
        class="flex items-center space-x-3"
        :class="listItemSpacing || 'py-2'"
      >
          <div
            v-if="showAvatar"
            :class="[
              'bg-gray-200 rounded-full shrink-0',
              avatarSize || 'w-12 h-12'
            ]"
          ></div>
        <div class="flex-1 space-y-1">
          <div
            :class="[
              'bg-gray-200 rounded',
              titleHeight || 'h-4',
              titleWidth || 'w-3/4'
            ]"
          ></div>
          <div
            v-if="showDescription"
            :class="[
              'bg-gray-200 rounded',
              descriptionHeight || 'h-3',
              descriptionWidth || 'w-1/2'
            ]"
          ></div>
        </div>
      </div>
    </div>

    <!-- Text Skeleton -->
    <div v-else-if="type === 'text'" :class="textClasses">
      <div
        v-for="n in lines"
        :key="n"
        :class="[
          'bg-gray-200 rounded',
          textHeight || 'h-4',
          n === lines ? textWidth || 'w-5/6' : 'w-full',
          textSpacing || 'mb-2'
        ]"
      ></div>
    </div>

    <!-- Image Skeleton -->
    <div
      v-else-if="type === 'image'"
      :class="[
        'bg-gray-200 rounded',
        imageHeight || 'h-40 sm:h-48 lg:h-56',
        imageAspect && `aspect-${imageAspect}`,
        imageWidth || 'w-full'
      ]"
    ></div>

    <!-- Custom Skeleton -->
    <div v-else-if="type === 'custom'">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Type of skeleton
  type: {
    type: String,
    default: 'card', // 'card', 'list', 'text', 'image', 'custom'
    validator: (value) => ['card', 'list', 'text', 'image', 'custom'].includes(value)
  },
  
  // Variant (for different color schemes)
  variant: {
    type: String,
    default: 'default', // 'default', 'primary'
    validator: (value) => ['default', 'primary'].includes(value)
  },
  
  // Card props
  showImage: {
    type: Boolean,
    default: true
  },
  showTitle: {
    type: Boolean,
    default: true
  },
  showDescription: {
    type: Boolean,
    default: true
  },
  descriptionLines: {
    type: Number,
    default: 2
  },
  
  // List props
  lines: {
    type: Number,
    default: 3
  },
  showAvatar: {
    type: Boolean,
    default: false
  },
  avatarSize: String,
  listItemSpacing: String,
  
  // Sizing
  imageHeight: String,
  imageWidth: String,
  imageAspect: String, // 'square', 'video', etc.
  titleHeight: String,
  titleWidth: String,
  descriptionHeight: String,
  descriptionWidth: String,
  textHeight: String,
  textWidth: String,
  textSpacing: String,
  
  // Custom classes
  customClass: String,
  cardClasses: String,
  listClasses: String,
  textClasses: String
})

const baseClasses = computed(() => {
  if (props.variant === 'primary') {
    return 'bg-primary-700 border border-white/30 rounded-lg p-2 shadow space-y-2'
  }
  return ''
})

const cardClasses = computed(() => {
  if (props.cardClasses) return props.cardClasses
  if (props.variant === 'primary') {
    return 'space-y-2'
  }
  return 'bg-gray-100 rounded-lg p-3 shadow-md'
})

const listClasses = computed(() => {
  if (props.listClasses) return props.listClasses
  return 'space-y-2'
})

const textClasses = computed(() => {
  if (props.textClasses) return props.textClasses
  return 'space-y-2'
})
</script>

