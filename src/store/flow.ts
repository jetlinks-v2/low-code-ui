import { defineStore } from '@jetlinks-web/stores'
import { cloneDeep } from 'lodash-es'
import type { INode, IConfig, IModelBaseInfo } from '@LowCode/views/process/model/Detail/typings.d.ts'
interface IModel {
    config: Partial<IConfig>;
    nodes: Partial<INode>;
}

export const defaultModel = {
    config: {
        forms: [],
    },
    nodes: {
        id: 'ROOT_1',
        parentId: null,
        type: 'ROOT',
        name: '发起申请',
        active: false,
        props: { assignedUser: [], formBinds: {} },
    },
}

export const useFlowStore = defineStore('lowcode_flow', () => {
    const nodeMap = new Map()
    const selectedNode = ref<any>({})
    // 流程模型数据
    const model = ref<IModel>({
        // config: {},
        // nodes: {}
        ...defaultModel
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
        model.value = !Object.keys(data).length ? cloneDeep(defaultModel) : data
    }
    /**
     * 设置模型基础信息
     * @param data
     */
    const setModelBaseInfo = (data: any) => {
        modelBaseInfo.value = data
    }

    return {
        selectedNode,
        nodeMap,
        model,
        modelBaseInfo,
        setModel,
        setSelectedNode,
        setModelBaseInfo
    }
})
