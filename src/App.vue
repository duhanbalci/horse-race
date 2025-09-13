<template>
  <div class="w-screen md:h-screen flex flex-col">
    <Header />
    <div class="flex w-full flex-col lg:flex-row py-4 gap-2 px-2 flex-1 overflow-hidden">
      <HorseList />
      <Map />
      <RightPanel />
    </div>
  </div>
</template>

<script setup lang="ts">
import Header from './components/race/Header.vue';
import HorseList from './components/race/HorseList.vue';
import Map from './components/race/Map.vue';
import RightPanel from './components/race/RightPanel.vue';

</script>

<style scoped></style>
