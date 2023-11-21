import { defineStore } from 'pinia'

import type { NotificationState } from '@/types'

const messageAppearsDurationMS = (2 * 1000)

export const useNotificationStore = defineStore('notification', {
  state: (): NotificationState => {
    return {
      notification: {
        success: null,
        message: null
      },
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
      }, messageAppearsDurationMS)
    },
    hideNotification(): void {
      this.notification = {
        success: null,
        message: null
      }
    }
  }
})
