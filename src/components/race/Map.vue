<template>
  <div class="max-h-full max-w-full flex-1 overflow-clip rounded-xl">
    <div class="bg-primary relative z-20 h-16 px-4 py-2 text-white">
      <h2 class="text-primary-foreground text-lg font-semibold">Live Race Track</h2>
      <p class="text-primary-foreground/80 text-sm" v-if="gameStore.currentLeg">
        {{ gameStore.race!.legs.findIndex((leg) => leg === gameStore.currentLeg) + 1 }}. Ayak -
        {{ gameStore.currentLeg.length }}m
      </p>
      <p v-if="gameStore.race?.over">The race is completed. Check the results from the right panel!</p>
    </div>
    <div class="relative mx-auto aspect-square max-h-[calc(100%_-_4rem)] max-w-full">
      <div class="start-line"></div>
      <div class="finish-line"></div>
      <svg ref="svgMap$" viewBox="0 0 700 700" class="">
        <template v-if="gameStore.currentLeg?.pathCommands">
          <template v-for="i in 10" :key="i">
            <!-- black line -->
            <path
              class="path"
              ref="path$"
              :d="pathFromCommands(offsetPath(gameStore.currentLeg.pathCommands, 50 * (i - 1), 0))"
            />
            <!-- white line -->
            <path
              class="path2"
              :d="pathFromCommands(offsetPath(gameStore.currentLeg.pathCommands, 50 * (i - 1), 0))"
            />
            <!-- red dashed lines -->
            <path
              class="path3"
              :d="pathFromCommands(offsetPath(gameStore.currentLeg.pathCommands, 50 * (i - 1), 0))"
            />
          </template>
        </template>
      </svg>
    </div>
  </div>
  <div
    ref="horse$"
    class="horse hide absolute top-0 left-0"
    v-for="competitor in gameStore.currentLeg?.competitors"
    :key="competitor.horse.name"
  ></div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/store/gameStore'
import { offsetPath, pathFromCommands } from '@/utils'
import { onMounted, onUnmounted, ref, watch } from 'vue'

const gameStore = useGameStore()

const path$ = ref<SVGPathElement[] | null>(null)
const horse$ = ref<HTMLElement[] | null>(null)
const svgMap$ = ref<SVGSVGElement | null>(null)

watch(
  () => horse$.value,
  (newVal) => {
    gameStore.horses$ = newVal
  },
)

watch(
  () => path$.value,
  (newVal) => {
    gameStore.path$ = newVal
  },
)

onMounted(() => {
  if (!svgMap$.value) {
    return
  }

  gameStore.svgMap$ = svgMap$.value
})

onUnmounted(() => {
  gameStore.svgMap$ = null
})
</script>

<style scoped>
@reference "tailwindcss";

svg {
  background-color: green;
}

.path {
  fill: none;
  stroke: black;
  stroke-width: 30;
}

.path2 {
  fill: none;
  stroke: white;
  stroke-width: 20;
}

.path3 {
  fill: none;
  stroke: red;
  stroke-width: 4;
  stroke-dasharray: 30 15;
  stroke-linecap: round;
}

.horse {
  width: 182px; 
  height: 462px; 
  background-image: url('/horse-sprite.png');
  background-repeat: no-repeat;
  animation: horse-animation 0.3s steps(5) infinite; 
  transform: scale(0);
  filter: hue-rotate(250deg) saturate(1.2) brightness(1.1);
}

.horse.hovered {
  border: 20px solid blue;
  border-radius: 9999px;
  /* glow effect */
  box-shadow: 0 0 55px 15px rgba(0, 0, 255, 0.7);
}

.horse.hide {
  display: none;
}

@keyframes horse-animation {
  from {
    background-position: 0 0; 
  }
  to {
    background-position: -1820px 0;
  }
}

.finish-line {
  @apply absolute top-0 right-0 left-0 z-10 h-4;
  background: repeating-linear-gradient(90deg, #000 0px, #000 5%, #fff 5%, #fff 10%);
  z-index: 1;
}

.start-line {
  @apply absolute right-0 bottom-0 left-0 z-10 h-4;
  background: repeating-linear-gradient(90deg, #0066ff 0px, #0066ff 5%, #fff 5%, #fff 10%);
  z-index: 1;
}
</style>
