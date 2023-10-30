import { request } from '@jetlinks/core'

/**
 * 获取当前用户可访问菜单 包含权限
 * @param data 
 * @returns 
 */
export const getOwnMenuThree = (data: any) => request.post<any>('/menu/user-own/tree', data)

//获取系统树形菜单
export const getAllMenuTree = (data: any) => request.post<any>('/menu/_all/tree', data)

//修改菜单
export const saveMenu = (data: any) => request.patch(`/menu/iot/_all`, data);

//删除菜单
export const delMenu = (data: any) => request.post<any>('/menu/_delete', data)