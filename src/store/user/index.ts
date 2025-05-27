import { defineStore } from 'pinia'
import pinia from '@/store'
import { userLogin } from '@/service/user'
import type { PersistenceOptions } from 'pinia-plugin-persistedstate'

export interface UserState {
  username: string
  accessToken: string
  roles: string[]
}
export const useUserStoreHook = defineStore('userInfo', {
  state: (): UserState => ({
    username: '张三',
    accessToken: '',
    roles: ['admin'],
  }),
  getters: {},
  actions: {
    storeUserLogin(data: any) {
      return userLogin(data)
        .then((res: any) => {
          this.username = res.data.username
          this.accessToken = res.data.accessToken
          this.roles = res.data.roles
        })
        .catch((err: any) => {
          console.log(err)
        })
    },
  },
  persist: {
    key: 'userInfo',
    storage: sessionStorage,
    paths: ['accessToken'],
  } as PersistenceOptions,
})

export function useUserStore() {
  return useUserStoreHook(pinia)
}
