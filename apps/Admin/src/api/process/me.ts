import { request } from '@jetlinks/core'


/**
 * 流程列表
 * @returns 
 */
export const getMeProcessList = (data: any, type: string,todo:boolean) => request.post(`/process/runtime/processes/${type}/_query?history=${todo}`, data);

//签收
export const _claim = (taskId: string, data: any) => request.post(`/process/runtime/task/${taskId}/_claim`, data);
//保存
export const _save = (taskId: string, data: any) => request.post(`/process/runtime/task/${taskId}/_save`, data);
//完成
export const _complete = (taskId: string, data: any) => request.post(`/process/runtime/task/${taskId}/_complete`, data);
//驳回
export const _reject = (taskId: string, data: any) => request.post(`/process/runtime/task/${taskId}/_reject`, data);

//获取流程详情
export const getProcessDetail = (id: string) => request.get(`/process/runtime/process/detail/${id}`);

//获取待办流程详情
export const getProcessTodoDetail = (id: string,taskId:string) => request.get(`/process/runtime/process/todo/${id}/${taskId}`);