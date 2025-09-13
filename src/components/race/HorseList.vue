<template>
  <div class="w-full md:w-1/5 max-h-full">
    <div class="rounded-xl border border-gray-100 shadow-sm overflow-hidden max-h-full flex flex-col">
      <div class="bg-primary px-4 py-2 text-white">
        <h2 class="text-lg font-semibold text-primary-foreground">Horse List</h2>
        <p class="text-primary-foreground/80 text-sm">{{ gameStore.horses.length }} Competitors</p>
      </div>
      <div class="max-h-full overflow-y-auto">
        <div class="divide-y divide-gray-100">
          <div
            v-for="(horse, index) in gameStore.horses"
            :key="index"
            class="px-3 py-2 hover:bg-muted/50 transition-colors"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div
                  class="w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium"
                  :style="{ backgroundColor: horse.color, color: getContrastColor(horse.color) }"
                >
                  {{ index + 1 }}
                </div>
                <div>
                  <p class="font-medium text-primary text-sm">{{ horse.name }}</p>
                  <p class="text-xs text-gray-500">Form: {{ horse.condition.toFixed() }}/100</p>
                </div>
              </div>
              <div class="text-right">
                <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: horse.color }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/store/gameStore'
import { getContrastColor } from '@/utils';


const gameStore = useGameStore()
</script>

<style scoped></style>
