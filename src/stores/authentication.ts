import { defineStore } from 'pinia'
import { useStorage, StorageSerializers } from '@vueuse/core'

import { resetApiClientToken, signIn, signOut } from '@/support/google-clients'
import { useNotificationStore } from '@/stores/notification'

export const useAuthenticationStore = defineStore('authentication', {
  state: () => {
    return {
      token: useStorage('auth/token', null, undefined, {
        serializer: StorageSerializers.object
      }) as any
    }
  },
  actions: {
    signIn(tokenClient: any): void {
      signIn(tokenClient, (resp: any) => {
        if (resp.error !== undefined) {
          throw resp
        }

        const notificationStore = useNotificationStore()

        this.token = resp
        notificationStore.setNotification(true, 'Signed in')
      })
    },
    signOut(): void {
      const notificationStore = useNotificationStore()

      signOut(this.token)

      this.token = null

      notificationStore.setNotification(true, 'Signed out')
    },
    expiredToken(): void {
      const notificationStore = useNotificationStore()

      this.token = null
      notificationStore.setNotification(false, 'Logged out expired token')

      resetApiClientToken()
    }
  },
  getters: {
    isAuthenticated: (state) => state.token !== null,
  }
})
