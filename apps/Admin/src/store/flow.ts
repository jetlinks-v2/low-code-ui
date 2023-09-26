import { defineStore } from 'pinia'
import type { INode, IConfig, IModelBaseInfo } from '@/views/process/model/Detail/typings.d.ts'
interface IModel {
    config: Partial<IConfig>;
    nodes: Partial<INode>;
}

const defaultModel = {
    config: {},
    nodes: {
        id: 'root',
        parentId: null,
        type: 'ROOT',
        name: '发起人',
        active: false,
        props: { assignedUser: [] },
    }
}

export const useFlowStore = defineStore('flow', () => {
    const nodeMap = new Map()
    // const isEdit = ref(null)
    const selectedNode = ref({})
    // const selectFormItem = ref(null)
    // 流程模型数据
    const model = ref<IModel>({
        config: {},
        nodes: {}
    })
    // 流程模型基础信息
    const modelBaseInfo = ref<Partial<IModelBaseInfo>>({})

    /**
     * 设置节点信息
     * @param data
     */
    const setSelectedNode = (data: any) => {
        selectedNode.value = data
    }

    /**
     * 设置模型数据
     * @param data 
     */
    const setModel = (data: any) => {
        model.value = !Object.keys(data).length ? defaultModel : data
    }
    /**
     * 设置模型基础信息
     * @param data 
     */
    const setModelBaseInfo = (data: any) => {
        modelBaseInfo.value = data
    }

    /**
     * 是否可编辑
     * @param data 
     */
    // const setIsEdit = (data: any) => {
    //     isEdit.value = data
    // }

    return {
        selectedNode,
        // isEdit,
        nodeMap,
        model,
        modelBaseInfo,
        // selectFormItem,
        setModel,
        // setIsEdit,
        setSelectedNode,
        setModelBaseInfo
    }
})
