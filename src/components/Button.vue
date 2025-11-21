<template>
  <component
    :is="tag"
    :type="tag === 'button' ? type : undefined"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center space-x-2 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
      sizeClasses,
      variantClasses,
      disabled && 'opacity-50 cursor-not-allowed',
      fullWidth && 'w-full',
      customClass
    ]"
    @click="handleClick"
  >
    <!-- Loading Spinner -->
    <svg
      v-if="loading"
      class="animate-spin"
      :class="spinnerSize"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>

    <!-- Icon Slot (left) -->
    <slot name="icon"></slot>

    <!-- Button Content -->
    <span v-if="!loading || showTextWhenLoading">
      <slot>{{ label }}</slot>
    </span>
    <span v-else-if="loadingText">
      {{ loadingText }}
    </span>

    <!-- Icon Slot (right) -->
    <slot name="iconRight"></slot>
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Variants
  variant: {
    type: String,
    default: 'primary', // 'primary', 'secondary', 'danger', 'ghost', 'outline'
    validator: (value) => ['primary', 'secondary', 'danger', 'ghost', 'outline'].includes(value)
  },
  
  // Sizes
  size: {
    type: String,
    default: 'md', // 'xs', 'sm', 'md', 'lg'
    validator: (value) => ['xs', 'sm', 'md', 'lg'].includes(value)
  },
  
  // States
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loadingText: String,
  showTextWhenLoading: {
    type: Boolean,
    default: false
  },
  
  // Content
  label: String,
  
  // HTML attributes
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value)
  },
  tag: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'a', 'router-link'].includes(value)
  },
  
  // Layout
  fullWidth: {
    type: Boolean,
    default: false
  },
  
  // Custom
  customClass: String
})

const emit = defineEmits(['click'])

const sizeClasses = computed(() => {
  const sizes = {
    xs: 'px-2.5 py-1 text-xs',
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }
  return sizes[props.size]
})

const spinnerSize = computed(() => {
  const sizes = {
    xs: 'h-3 w-3',
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }
  return sizes[props.size]
})

const variantClasses = computed(() => {
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'text-gray-700 hover:bg-gray-50 focus:ring-gray-400',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-400'
  }
  return variants[props.variant]
})

const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

