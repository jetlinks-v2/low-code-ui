
<template>
    <div class="content">
        <div class="top">
            <j-button type="primary" @click="onAction({}, 'save')">新增菜单</j-button>
            <AIcon type="QuestionCircleOutlined" style="font-size: 18px;" />
        </div>
        <j-scrollbar style="height: 330px;">
            <j-tree v-model:selectedKeys="selectedKeys" draggable :tree-data="treeData" blockNode :autoExpandParent="autoExpandParent"
                v-model:expandedKeys="expandedKeys" :fieldNames="{ title: 'name', key: 'id' }" @drop="onDrop" @expand="onExpand">
                <template #title="item">
                    <div :class="{
                        'tree-content': true,
                        'project': props.checkedKey?.includes(item.options?.pageId)
                    }">
                        <div class="tree-content-title">
                            <AIcon :type="item.icon || item.others?.menu?.icon" />
                            <div style="margin-left: 10px">{{ item.name }}</div>
                            <j-badge v-if="item.options?.projectId === projectId" color="blue"
                                style="margin-left: 10px;"></j-badge>
                        </div>
                        <div @click="(e) => e.stopPropagation()" style="display: flex;">
                            <j-tooltip title="编辑">
                                <j-button type="link" style="padding: 0;" @click="onAction(item, 'save')">
                                    <AIcon type="FormOutlined" />
                                </j-button>
                            </j-tooltip>
                            <j-tooltip title="删除">
                                <j-button type="link" style="padding: 0;margin-left: 10px;margin-right: 10px;" danger
                                    @click="onAction(item, 'del')">
                                    <AIcon type="DeleteOutlined" />
                                </j-button>
                            </j-tooltip>
                        </div>
                    </div>
                </template>
            </j-tree>
        </j-scrollbar>

    </div>

    <Save v-if="visible" @close="visible = false" :data="treeItem" @ok="onOk" />
    <DelModal v-if="visibleDel" @close="visibleDel = false" @ok="onDel" :data="treeItem" />
</template>

<script setup lang='ts' name="TreeDrag">
import { cloneDeep } from 'lodash-es';
import { DeleteTreeById, getTreeLevel, handleTreeModal } from '../index'
import { AntTreeNodeDropEvent, TreeProps } from 'ant-design-vue/es/tree/Tree';
import { onlyMessage } from '@jetlinks/utils';
import Save from '../components/Save.vue'
import DelModal from '../components/DelModal.vue'
import { getAllMenuTree } from '@/api/menu';

type TreeDataItem = TreeProps['treeData'][];

const props = defineProps({
    list: Array,
    treeData: Array,
    projectId: String,
    checkedKey: Array
})
type Emits = {
    (e: 'changeCount', data: any): void;
    (e: 'changeTree', data: any): void
};
const emit = defineEmits<Emits>();

const treeData = ref<any>([])
const treeItem = ref<any>({})
const selectedKeys = ref<any>([])
const expandedKeys = ref<any>([])
const visible = ref<boolean>(false)
const visibleDel = ref<boolean>(false)
const autoExpandParent = ref<boolean>(false)


const countMap = ref(new Map())
const expandMap = new Map()

const handleTree = (tree) => {
    const arr = cloneDeep(tree)
    arr.forEach(item => {
        if (item.options) {
            if (item.options?.pageId) {
                expandMap.set(item.id, item.options?.pageId)
                if (countMap.value.has(item.options.pageId)) {
                    // debugger;
                    const sum = countMap.value.get(item.options.pageId) + 1
                    countMap.value.set(item.options.pageId, sum)
                } else {
                    countMap.value.set(item.options.pageId, 1)
                }
            }
            if (item.children) {
                handleTree(item.children)
            }
        }
        return;
    });
}

const onAction = (data: any, option: string) => {
    treeItem.value = data
    if (option === 'del') {
        visibleDel.value = true
    } else {
        visible.value = true
    }
}

const onDel = (item) => {
    treeData.value = DeleteTreeById(treeData.value, item.id)
    if (item.options) {
        countMap.value.set(item.options.pageId, countMap.value.get(item.options.pageId) - 1)
    }
    visibleDel.value = false
}

const onOk = (data: any) => {
    const arr = handleTreeModal(treeData.value, data)
    treeData.value = arr
    visible.value = false
}


//拖拽
const onDrop = (info: AntTreeNodeDropEvent) => {
    // console.log('info-----------', info)
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos: any = info.node.pos?.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data: any, key: string | number, callback: any) => {
        data.forEach((item, index) => {
            if (item.id === key) {
                return callback(item, index, data);
            }
            if (item.children) {
                return loop(item.children, key, callback);
            }
        });
    };
    const data = cloneDeep([...treeData.value]);
    let dragObj: any;
    loop(data, dragKey, (item: TreeDataItem, index: number, arr: TreeProps['treeData']) => {
        arr?.splice(index, 1);
        dragObj = item;
    });
    if (!info.dropToGap) {
        // Drop on the content
        loop(data, dropKey, (item: any) => {
            item.children = item.children || [];
            /// where to insert 示例添加到头部，可以是随意位置
            item.children.unshift(dragObj);
        });
    } else if (
        (info.node.children || []).length > 0 && // Has children
        info.node.expanded && // Is expanded
        dropPosition === 1 // On the bottom gap
    ) {
        loop(data, dropKey, (item: any) => {
            item.children = item.children || [];
            // where to insert 示例添加到头部，可以是随意位置
            item.children.unshift(dragObj);
        });
    } else {
        let ar: TreeProps['treeData'] = [];
        let i = 0;
        loop(data, dropKey, (_item: TreeDataItem, index: number, arr: TreeProps['treeData']) => {
            ar = arr;
            i = index;
        });
        if (dropPosition === -1) {
            ar.splice(i, 0, dragObj);
        } else {
            ar.splice(i + 1, 0, dragObj);
        }
    }
    // console.log('data',data)
    const level = getTreeLevel(data)

    if (level > 2) {
        onlyMessage('仅支持3级菜单', 'warning')
    } else {
        treeData.value = data;
    }
}

const onExpand = (keys)=>{
    console.log('keys',keys)
    autoExpandParent.value = false
}

const getKeyByValue = (arr) => {
    const keys: any = []
    for (const [key, value] of expandMap.entries()) {
        if (arr.includes(value)) {
            keys.push(key);
        }
    }
    return keys
}

watch(
    () => props.list,
    (val: any) => {
        countMap.value.clear()
        treeData.value = [...treeData.value, ...val]
        handleTree(treeData.value)
    },
    { immediate: true }
)

watch(
    () => countMap.value,
    (val) => {
        emit('changeCount', val)
    },
    { deep: true, immediate: true }
)

watch(
    () => treeData.value,
    (val) => {
        emit('changeTree', val)
    },
    { deep: true, immediate: true }
)

//左边控制右边展开
watch(
    () => props.checkedKey,
    (val) => {
        console.log('val',val)
        const arr = getKeyByValue(val)
         expandedKeys.value = arr
         autoExpandParent.value = true
    }
)

const getTree = async () => {
    const params = {
        paging: false,
        terms: [
            {
                terms: [
                    {
                        column: 'owner',
                        termType: 'eq',
                        value: 'iot',
                    },

                ],
            },
        ],
    };
    const res = await getAllMenuTree(params)
    if (res.status === 200) {
        treeData.value = res.result
        handleTree(res.result)
    }
}


onMounted(() => {
    getTree()
})


</script>

<style scoped lang='less'>
.content {
    .top {
        margin-bottom: 10px;
        // margin-left: 10px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    :deep(.ant-tree .ant-tree-node-content-wrapper.ant-tree-node-selected) {
        background-color: #FFF;
    }

    .tree-content {
        display: flex;
        min-height: 32px;

        &.project {
            background-color: #d6e4ff8a;
        }

        .tree-content-title {
            display: flex;
            align-items: center;
            // min-width: 250px;
            width: 100%;

        }
    }
}
</style>
