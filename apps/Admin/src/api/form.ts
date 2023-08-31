import { request } from '@jetlinks/core'

//获取用户列表
export const getUserList = (data:any) => request.post('/user/_query',data);

//获取全部用户列表不分页
export const getUser_PaginateNot = (data:any) => request.post('/user/_query/no-paging',data);

//获取角色列表
export const getRoleList = (data:any,type:Boolean = true) => request.post(`/role/group/detail/_query/tree?queryByRole=${type}`,data);

//获取组织列表
export const  getTissue = (data:any) => request.post('/organization/_all/tree',data) 

 /**
  * 查询产品列表(分页)
  * @param data 查询条件
  */
 export const queryProductList = (data: any) => request.post('/device-product/_query', data)

 /**
  * 查询设备列表(分页)
  */
 export const queryDeviceList = (data:any) => request.post('/device-instance/_query', data)