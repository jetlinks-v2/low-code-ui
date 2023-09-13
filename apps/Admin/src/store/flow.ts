import { defineStore } from 'pinia'

export const useFlowStore = defineStore('flow', () => {
    const nodeMap = new Map()
    const isEdit = ref(null)
    const selectedNode = ref({})
    const selectFormItem = ref(null)
    const design = ref({
        // formId: null,
        // formName: "未命名表单",
        // logo: {
        //     icon: "el-icon-eleme",
        //     background: "#1e90ff"
        // },
        // settings: {
        //     commiter: [],
        //     admin: [],
        //     sign: false,
        //     notify: {
        //         types: ["APP"],
        //         title: "消息通知标题"
        //     }
        // },
        // groupId: undefined,
        // formItems: [],
        process: {
            id: 'root',
            parentId: null,
            type: 'ROOT',
            name: '发起人',
            desc: '任何人',
            active: false,
            props: { assignedUser: [], formPerms: [] },
            children: {
                id: 'node_888640864603',
                parentId: 'root',
                props: {},
                type: 'CONDITIONS',
                name: '条件分支',
                active: false,
                children: {
                    id: 'node_888640882274',
                    parentId: 'node_888640864603',
                    type: 'EMPTY',
                    active: false,
                },
                branchs: [
                    {
                        id: 'node_888640882246',
                        parentId: 'node_888640864603',
                        type: 'CONDITION',
                        props: {
                            groupsType: 'OR',
                            groups: [{ groupType: 'AND', cids: [], conditions: [] }],
                            expression: '',
                        },
                        name: '条件1',
                        active: false,
                        children: {
                            id: 'node_889222751712',
                            parentId: 'node_888640882246',
                            props: {
                                assignedType: 'ASSIGN_USER',
                                mode: 'AND',
                                sign: false,
                                nobody: { handler: 'TO_PASS', assignedUser: [] },
                                timeLimit: {
                                    timeout: { unit: 'H', value: 0 },
                                    handler: {
                                        type: 'REFUSE',
                                        notify: { once: true, hour: 1 },
                                    },
                                },
                                assignedUser: [],
                                formPerms: [],
                                selfSelect: { multiple: false },
                                leaderTop: { endCondition: 'TOP', endLevel: 1 },
                                leader: { level: 1 },
                                role: [],
                                refuse: { type: 'TO_END', target: '' },
                                formUser: '',
                            },
                            type: 'APPROVAL',
                            name: '审批人',
                            children: {},
                            active: false,
                        },
                    },
                    {
                        id: 'node_888640888799',
                        parentId: 'node_888640864603',
                        type: 'CONDITION',
                        props: {
                            groupsType: 'OR',
                            groups: [{ groupType: 'AND', cids: [], conditions: [] }],
                            expression: '',
                        },
                        name: '条件2',
                        active: true,
                        // 并行分支
                        children: {
                            id: 'node_889251728116',
                            parentId: 'node_888640888799',
                            props: {},
                            type: 'CONCURRENTS',
                            name: '并行分支',
                            active: true,
                            children: {
                                id: 'node_889251733649',
                                parentId: 'node_889251728116',
                                type: 'EMPTY',
                                children: {},
                                active: true,
                            },
                            branchs: [
                                {
                                    id: 'node_889251745120',
                                    name: '审批节点',
                                    parentId: 'node_889251728116',
                                    type: 'APPROVAL',
                                    props: {
                                        assignedType: 'ASSIGN_USER',
                                        mode: 'AND',
                                        sign: false,
                                        nobody: { handler: 'TO_PASS', assignedUser: [] },
                                        timeLimit: {
                                            timeout: { unit: 'H', value: 0 },
                                            handler: {
                                                type: 'REFUSE',
                                                notify: { once: true, hour: 1 },
                                            },
                                        },
                                        assignedUser: [],
                                        formPerms: [],
                                        selfSelect: { multiple: false },
                                        leaderTop: { endCondition: 'TOP', endLevel: 1 },
                                        leader: { level: 1 },
                                        role: [],
                                        refuse: { type: 'TO_END', target: '' },
                                        formUser: '',
                                        style: { margin: '30px' },
                                        isBranchNode: true,
                                    },
                                    children: {},
                                    active: true,
                                },
                                {
                                    id: 'node_889251743503',
                                    name: '办理节点',
                                    parentId: 'node_889251728116',
                                    type: 'DEAL',
                                    props: {
                                        shouldAdd: false,
                                        assignedUser: [],
                                        formPerms: [],
                                        style: { margin: '30px' },
                                        isBranchNode: true,
                                    },
                                    children: {},
                                    active: false,
                                },
                            ],
                        },
                    },
                ],
            },
        }
        // remark: "备注说明"
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
