<template>
  <div class="md:w-1/4 flex flex-col" v-if="gameStore.currentLeg || raceLegs">
    <div
      class="bg-card overflow-hidden rounded-xl border border-gray-100 shadow-sm"
      v-if="gameStore.currentLeg"
    >
      <div class="bg-primary px-6 py-4">
        <h2 class="text-secondary text-lg font-semibold">Live Standings</h2>
      </div>
      <div class="max-h-64 overflow-y-auto">
        <div class="divide-y divide-gray-100">
          <div
            v-for="(competitor, index) in competitors"
            :key="index"
            class="cursor-pointer px-6 py-3 transition-colors hover:bg-gray-100"
            @mouseenter="competitor.isHovered = true"
            @mouseleave="competitor.isHovered = false"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div
                  class="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
                  :style="{
                    backgroundColor: competitor.horse.color,
                    color: getContrastColor(competitor.horse.color),
                  }"
                >
                  {{ index + 1 }}
                </div>
                <span class="text-card-foreground text-sm font-medium">{{
                  competitor.horse.name
                }}</span>
              </div>
              <div class="text-right">
                <span class="text-muted-foreground text-xs"
                  >{{ Math.round(competitor.position) }}%</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Race Legs -->
    <div
      class="bg-card mt-2 overflow-auto rounded-xl border border-gray-100 shadow-sm flex-1"
      v-if="raceLegs"
    >
      <div class="bg-accent px-6 py-4">
        <h2 class="text-accent-foreground text-lg font-semibold">Race Legs</h2>
      </div>
      <div class="p-2">
        <Accordion :items="raceLegs">
          <template v-for="(leg, index) in raceLegs" :key="index" #[`content-${index}`]="{ item }">
            <div class="space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-muted-foreground">Distance:</span>
                <span class="text-card-foreground font-medium">{{ item.distance }}m</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-muted-foreground">Status:</span>
                <span
                  :class="[
                    'font-medium',
                    item.status === 'completed'
                      ? 'text-green-600'
                      : item.status === 'running'
                        ? 'text-blue-600'
                        : 'text-muted-foreground',
                  ]"
                >
                  {{ item.status }}
                </span>
              </div>

              <div v-if="item.competitors.length > 0" class="mt-4">
                <h4 class="text-card-foreground mb-2 text-sm font-medium">Competing Horses:</h4>
                <div class="space-y-2">
                  <div
                    v-for="(competitor, compIndex) in item.competitors"
                    :key="compIndex"
                    class="bg-muted/50 flex items-center justify-between rounded p-2 text-xs"
                  >
                    <div class="flex items-center space-x-2">
                      <span
                        v-if="competitor.rank"
                        class="bg-secondary text-secondary-foreground flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold"
                        :style="{
                          backgroundColor: competitor.horse.color,
                          color: getContrastColor(competitor.horse.color),
                        }"
                      >
                        {{ competitor.rank }}
                      </span>
                      <span class="font-medium">{{ competitor.horse.name }}</span>
                    </div>
                    <div class="text-right">
                      <span v-if="competitor.finishTime" class="text-muted-foreground">
                        {{ formatTime(competitor.finishTime) }}
                      </span>
                      <span v-else-if="item.status === 'running'" class="text-blue-600">
                        Racing...
                      </span>
                      <span v-else class="text-muted-foreground"> Not Started </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Accordion>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/store/gameStore'
import { computed } from 'vue'
import { getContrastColor } from '@/utils'
import Accordion from '../ui/Accordion.vue'

const gameStore = useGameStore()

const horses = computed(() => gameStore.horses)
const competitors = computed(() => gameStore.currentLeg?.competitors ?? [])
const race = computed(() => gameStore.race)

const raceLegs = computed(() => {
  if (race.value?.legs) {
    const status = (leg: any) => {
      if (leg.completed) return 'Completed'
      if (leg.isRunning) return 'Running'
      return 'Pending'
    }

    return race.value.legs.map((leg, index) => ({
      title: `${index + 1}. Leg - ${leg.length}m - ${status(leg)}`,
      distance: leg.length,
      status: status(leg),
      competitors: leg.competitors,
    }))
  }
})

function formatTime(milliseconds: number) {
  const seconds = milliseconds / 1000
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = (seconds % 60).toFixed(2)
  return `${minutes}:${remainingSeconds.padStart(5, '0')}`
}
</script>

<style scoped></style>
