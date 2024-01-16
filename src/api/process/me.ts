import { request } from '@/utils/axios'


/**
 * 流程列表
 * @returns 
 */
export const getMeProcessList = (data: any, type: string,todo:boolean) => request.post(`/process/runtime/processes/${type}/_query?history=${todo}`, data);

//发起人
export const getInitiatorList = (type:string,todo:boolean,data?:any) => request.post(`/process/runtime/processes/${type}/_query/no-paging?history=${todo}&distinctBy=creatorId`, data);

//签收
export const _claim = (taskId: string, data: any) => request.post(`/process/runtime/task/${taskId}/_claim`, data);
//保存
export const _save = (taskId: string, data: any) => request.post(`/process/runtime/task/${taskId}/_save`, data);
//完成
export const _complete = (taskId: string, data: any) => request.post(`/process/runtime/task/${taskId}/_complete`, data);
//驳回
export const _reject = (taskId: string, data: any) => request.post(`/process/runtime/task/${taskId}/_reject`, data);

//获取流程详情
export const getProcessDetail = (id: string,todo:boolean) => request.get(`/process/runtime/process/detail/${id}?history=${todo}`);

//获取待办流程详情
export const getProcessTodoDetail = (id: string,taskId:string) => request.get(`/process/runtime/process/todo/${id}/${taskId}`);

//获取指定审批人列表
export const getApprover = (taskId:string,data:any) => request.post(`/process/runtime/taskLink/${taskId}/_query`,data)

//删除草稿流程

export const _delete = (processId: string,data?:any) => request.put(`/process/runtime/${processId}/_delete`, data);
//获取用户
export const getUserList = (data: any) => request.post('/user/_query', data);

//批量签收
export const _claimBatch = ( data: any) => request.post(`/process/runtime/task/batch-claim`, data);
//批量完成
export const _completeBatch = ( data: any) => request.post(`/process/runtime/task/batch-complete`, data);
//批量驳回
export const _rejectBatch= ( data: any) => request.post(`/process/runtime/task/batch-reject`, data);
