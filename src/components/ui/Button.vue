<template>
  <button :class="buttonClasses" :disabled="disabled || loading" @click="handleClick">
    <component v-if="loading" :is="Loader2" class="icon spinner" />
    <component v-else-if="icon" :is="icon" class="icon" />
    {{ label }}
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Loader2 } from 'lucide-vue-next'

const props = defineProps<{
  label?: string
  disabled?: boolean
  type?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium' | 'large'
  icon?: any
  onClick?: () => void
  fullWidth?: boolean
  className?: string
  loading?: boolean
}>()

const buttonClasses = computed(() => {
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'gap-2',
    'font-medium',
    'rounded-lg',
    'transition-colors',
    'duration-100',
    'active:scale-99',
    'disabled:scale-100',
    'shadow-md',
    'disabled:shadow-none',
  ]

  const sizeClasses = {
    small: ['px-3', 'py-1.5', 'text-sm'],
    medium: ['px-4', 'py-2', 'text-base'],
    large: ['px-6', 'py-3', 'text-lg'],
  }

  const typeClasses = {
    primary: [
      'bg-primary',
      'text-white',
      'shadow-gray-800/30',
      'hover:bg-primary/90',
      'hover:bg-gray-700',
      'disabled:bg-primary/50',
      'disabled:border-primary/50',
    ],
    secondary: [
      'bg-secondary',
      'text-gray-900',
      'hover:bg-gray-100',
      'disabled:bg-gray-100',
      'disabled:text-gray-400',
      'disabled:border-gray-200',
    ],
    danger: [
      'bg-red-600',
      'text-white',
      'border-red-600',
      'hover:bg-red-700',
      'disabled:bg-red-400',
      'disabled:border-red-400',
    ],
  }

  const currentSize = props.size || 'medium'
  const currentType = props.type || 'primary'

  const classes = [...baseClasses, ...sizeClasses[currentSize], ...typeClasses[currentType]]

  if (props.fullWidth) {
    classes.push('w-full')
  }

  if (props.disabled || props.loading) {
    classes.push('cursor-not-allowed')
  } else {
    classes.push('cursor-pointer')
  }

  if (props.className) {
    classes.push(props.className)
  }

  return classes.join(' ')
})

const handleClick = () => {
  if (!props.disabled && !props.loading && props.onClick) {
    props.onClick()
  }
}
</script>

<style scoped>
.icon {
  width: 1rem;
  height: 1rem;
}

.spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
