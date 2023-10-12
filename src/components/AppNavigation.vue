<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const iconClass = (path: string, inactiveIcon: string, activeIcon: string) => {
  return [
      'bi',
    router.currentRoute.value.path === path ? activeIcon : inactiveIcon,
  ]
}
</script>

<template>
  <div class="bg-danger bg-gradient">
    <div class="d-flex justify-content-around">
      <button class="btn text-white fw-semibold" type="button" @click="router.push('/')">
        <i :class="iconClass('/', 'bi-clock', 'bi-clock-fill')"></i><br>Schedule
      </button>
      <button class="btn text-white fw-semibold" type="button" @click="router.push('/standings')">
        <i :class="iconClass('/standings', 'bi-file-ruled','bi-file-ruled-fill')"></i><br>Standings
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>