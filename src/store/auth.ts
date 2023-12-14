import { defineStore } from '@jetlinks-web/stores'
import { ref } from 'vue'
import { isArray } from 'lodash-es'
import { handleAuthMenu } from '@LowCode/utils'

export const useAuthStore = defineStore('lowcode_auth', () => {
    const permissions = ref<Record<string, string[]>>({})

    const setPermission = (code: string, buttons: string[]) => {
      permissions.value[code] = buttons
    }

    const cleanPermission = () => {
      permissions.value = {}
    }

    const getPermission = (code: string): string[] => {
      if (code) {
        return permissions.value[code]
      }

      return []
    }

    const hasPermission = (code: string | string[]): boolean => {
      const codes = isArray(code) ? code : [code]
      return codes.some((key) => {
        const [ menuCode, button ] = key.split(':')
        return !!getPermission(menuCode)?.includes(button)
      })
    }

    const handlePermission = (data: any) => {
        cleanPermission()
        handleAuthMenu(data, setPermission)
    }

    return {
      permissions,
      getPermission,
      setPermission,
      cleanPermission,
      handlePermission,
      hasPermission
    }
})
