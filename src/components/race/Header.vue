<template>
  <header class="border-b border-gray-100 shadow-sm">
    <div class="max-w-7xl mx-auto px-2 md:px-6 py-2">
      <div class="flex flex-col md:flex-row items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
            <span class="text-xl">🏇</span>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-foreground">Horse Racing</h1>
          </div>
        </div>
        <div class="flex flex-col md:flex-row items-center space-x-3 gap-2 md:gap-0 mt-2 md:mt-0">
          <div class="mr-2 flex items-center space-x-1">
            <Button 
              :label="`${multiplier}X`" 
              size="small" 
              :type="gameStore.speedMultiplier === multiplier ? 'primary' : 'secondary'"
              @click="() => setSpeedMultiplier(multiplier)"
              v-for="multiplier in SPEED_MULTIPLIERS"
              :key="multiplier"
            />
          </div>
          <div class="flex gap-2">
            <Button @click="generateRace" label="Generate Race" :disabled="!!gameStore.race && !gameStore.race.over" />
            <Button @click="startRace" label="Start Race" type="secondary" :disabled="!!gameStore.currentLeg" />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import Button from '../ui/Button.vue'
import { useGameStore } from '@/store/gameStore'
import { SPEED_MULTIPLIERS, type SpeedMultiplier } from '@/constants'

const gameStore = useGameStore()

function generateRace() {
  gameStore.generateNewRace()
}

function startRace() {
  gameStore.startRace()
}

function setSpeedMultiplier(multiplier: SpeedMultiplier) {
  gameStore.setSpeedMultiplier(multiplier)
}
</script>

<style scoped></style>
