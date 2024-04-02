<script setup lang="ts">
//import AuthenticationControls from '@/components/AuthenticationControls.vue'

defineProps<{
  showAuthenticationControls: boolean
}>()
</script>

<template>
  <nav class="navbar">
    <div class="container pt-2 pb-2">
      <span class="logo-container navbar-brand">
        <img src="@/assets/logo.png" class="img-fluid" alt="TheTouch.live" />
      </span>
      <!--
        <AuthenticationControls v-if="showAuthenticationControls" />
      -->
    </div>
  </nav>
</template>

<style scoped>
.logo-container {
width: 100%;
max-width: 180px;
}
</style>
