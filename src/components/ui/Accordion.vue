<template>
  <div class="space-y-2">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="bg-card overflow-hidden rounded-lg border border-gray-100 shadow-sm"
    >
      <button
        @click="toggleItem(index)"
        class="bg-accent hover:bg-accent/80 flex w-full items-center justify-between px-4 py-3 text-left transition-colors focus:outline-none"
      >
        <span class="text-accent-foreground font-medium">{{ item.title }}</span>
        <ChevronDown
          :class="[
            'h-4 w-4 transition-transform duration-200',
            openItems.has(index) ? 'rotate-180' : '',
          ]"
        />
      </button>
      <div v-show="openItems.has(index)" class="bg-card border-t border-gray-100 p-4">
        <slot :name="`content-${index}`" :item="item" :index="index"> </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'
import { ref } from 'vue'

interface AccordionItem {
  title: string
  [key: string]: any
}

defineProps<{
  items: AccordionItem[]
}>()

const openItems = ref(new Set<number>())

function toggleItem(index: number) {
  if (openItems.value.has(index)) {
    openItems.value.delete(index)
  } else {
    openItems.value.add(index)
  }
}
</script>
