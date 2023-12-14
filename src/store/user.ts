import { defineStore } from 'pinia'
import { detail } from '@LowCode/api/user'

type UserInfo = {
    name: string
    icon: string
}

export const useUserStore = defineStore('lowcode_user', () => {
    const userInfo = ref<Partial<UserInfo>>({})
    const isAdmin = ref(false)

    /**
     * 设置用户信息
     * @param data
     */
    const setUserInfo = (data: Partial<UserInfo>) => {
        userInfo.value = data
    }

    const setIsAdmin = (type: boolean) => {
        isAdmin.value = type
    }

    /**
    * 获取用户信息
    */
    const getUserInfo = async () => {
        const resp = await detail()
        if (resp.success) {
          setUserInfo(resp.result)
          setIsAdmin(resp.result.username === 'admin')
        }
    }

    return {
        isAdmin,
        userInfo,
        getUserInfo,
        setUserInfo,
        setIsAdmin
    }
})
