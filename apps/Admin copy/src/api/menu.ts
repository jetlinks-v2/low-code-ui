import { request } from '@jetlinks/core'

/**
 * 获取当前用户可访问菜单 包含权限
 * @param data 
 * @returns 
 */
export const getOwnMenuThree = (data: any) => request.post<any>('/menu/user-own/tree', data)
