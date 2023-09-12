import { defineStore } from 'pinia'

export const useFlowStore = defineStore('flow', () => {
    const nodeMap = new Map()
    const isEdit = ref(null)
    const selectedNode = ref({})
    const selectFormItem = ref(null)
    const design = ref({
        formId: null,
        formName: "未命名表单",
        logo: {
            icon: "el-icon-eleme",
            background: "#1e90ff"
        },
        settings: {
            commiter: [],
            admin: [],
            sign: false,
            notify: {
                types: ["APP"],
                title: "消息通知标题"
            }
        },
        groupId: undefined,
        formItems: [],
        process: {
            id: "root",
            parentId: null,
            type: "ROOT",
            name: "发起人",
            desc: "任何人",
            props: {
                assignedUser: [],
                formPerms: []
            },
            children: {}
        },
        remark: "备注说明"
    })

    /**
     * 设置节点信息
     * @param data
     */
    const setSelectedNode = (data: any) => {
        selectedNode.value = data
    }

    const loadForm = (data: any) => {
        design.value = data
    }

    /**
     * 是否可编辑
     * @param data 
     */
    const setIsEdit = (data: any) => {
        isEdit.value = data
    }

    return {
        selectedNode,
        isEdit,
        nodeMap,
        design,
        selectFormItem,
        loadForm,
        setIsEdit,
        setSelectedNode
    }
})
