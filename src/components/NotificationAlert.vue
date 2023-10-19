<script setup lang="ts">
import { useNotificationStore } from '@/stores/notification'

const notificationStore = useNotificationStore()

const alertClasses = () => {
  const classes = [
    'toast',
    'align-items-center',
    notificationStore.notification.message !== null ? 'show' : 'hide',
    'border-0',
    'text-white',
    'border-radius-0'
  ]

  if (notificationStore.notification.success !== null) {
    classes.push(notificationStore.notification.success ? 'bg-success' : 'bg-danger')
  }

  return classes
}

const hideNotification = (): void => {
  notificationStore.hideNotification()
}
</script>

<template>
  <div class="toast-container translate-middle-x">
    <div :class="alertClasses()">
      <div class="d-flex">
        <div class="toast-body">
          <strong>{{ notificationStore.notification.message }}</strong>
        </div>
        <button
          type="button"
          class="btn-close me-2 m-auto btn-close-white"
          aria-label="Close"
          @click="hideNotification"
        ></button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
