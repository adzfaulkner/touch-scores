import { defineStore } from 'pinia'

interface Notification {
  success: boolean | null
  message: string | null
}

const defaultState = {
  success: null,
  message: null
}

export const useNotificationStore = defineStore('notification', {
  state: () => {
    return {
      notification: {
        ...defaultState
      } as Notification,
      messageAppearsDurationSeconds: 2 as number
    }
  },
  actions: {
    setNotification(success: boolean, message: string, autoDismiss: boolean = true): void {
      this.notification = {
        success,
        message
      }

      if (!autoDismiss) {
        return
      }

      setTimeout(() => {
        this.hideNotification()
      }, this.messageAppearsDurationSeconds * 1000)
    },
    hideNotification(): void {
      this.notification = {
        ...defaultState
      }
    }
  }
})
