
<template>
    <div class="content">
        <div class="top">
            <j-button type="link" class="btn" @click="onAction({}, 'save')">+ 新增菜单</j-button>
            <AIcon type="QuestionCircleOutlined" class="icon" @click="() => setVisible(true)" />
        </div>
        <j-scrollbar style="height: 330px;">
            <j-tree v-model:selectedKeys="selectedKeys" draggable :tree-data="treeData" blockNode
                :autoExpandParent="autoExpandParent" v-model:expandedKeys="expandedKeys"
                :fieldNames="{ title: 'name', key: 'id' }" @drop="onDrop" @expand="onExpand">
                <template #title="item">
                    <div :class="{
                        'tree-content': true,
                        'project': props.checkedKey?.includes(item.options?.pageId)
                    }">
                        <div class="tree-content-title">
                            <AIcon :type="item.icon || item.others?.menu?.icon" />
                            <div style="margin-left: 10px">{{ item.name }}</div>
                            <j-badge v-if="item.options?.projectId === projectId" color="#315EFB"
                                style="margin-left: 10px;"></j-badge>
                        </div>
                        <div @click="(e) => e.stopPropagation()" style="display: flex;">
                            <j-tooltip title="编辑">
                                <j-button type="link" style="padding: 0;" @click="onAction(item, 'save')">
                                    <AIcon type="EditOutlined" />
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
    <a-image 
        style="display: none;" 
        :preview="{
            visible: visibleImg,
            onVisibleChange: setVisible,
        }" 
        :src="getImage('/menu/menu.png')" />
    <Save v-if="visible" @close="visible = false" :data="treeItem" @ok="onOk" :projectId="projectId"/>
    <DelModal v-if="visibleDel" @close="visibleDel = false" @ok="onDel" :data="treeItem" />
</template>

<script setup lang='ts' name="TreeDrag">
import { cloneDeep } from 'lodash-es';
import { DeleteTreeById, getTreeLevel, handleSort, handleTreeModal } from '../index'
import { AntTreeNodeDropEvent, TreeProps } from 'ant-design-vue/es/tree/Tree';
import { onlyMessage, getImage } from '@jetlinks/utils';
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
const visibleImg = ref<boolean>(false)


const countMap = ref(new Map())
const expandMap = new Map()

//引用关系
const handleTree = (tree) => {
    const arr = cloneDeep(tree)
    arr.forEach(item => {
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

//判断children下的pageId
const deleteMap = (arr)=>{
    arr.forEach(item=>{
        if(item.options?.pageId){
            countMap.value.set(item.options.pageId, countMap.value.get(item.options.pageId) - 1)
        }
        if(item.children){
            deleteMap(item.children)
        }
        return;
    })
}

const onDel = (item) => {
    treeData.value = DeleteTreeById(treeData.value, item.id)
    deleteMap([item])
    visibleDel.value = false
}

const onOk = (data: any) => {
    const arr = handleTreeModal(treeData.value, data)
    treeData.value = arr
    visible.value = false
}

const setVisible = (value) => {
    visibleImg.value = value
}

//拖拽
const onDrop = (info: AntTreeNodeDropEvent) => {
    // console.log('info-----------', info.dropToGap,info)
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
    // const data = [...treeData.value]
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
        console.log('-----------',info,)
        loop(data, dropKey, (item: any,index:number,arr:any) => {
            item.children = item.children || [];
            // where to insert 示例添加到头部，可以是随意位置
            console.log('item--------',item)
            arr.splice(index + 1, 0, dragObj);

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
    const level = getTreeLevel(data)

    if (level > 2) {
        onlyMessage('仅支持3级菜单', 'warning')
    } else {
        treeData.value = data;
    }
}

const onExpand = (keys) => {
    // console.log('keys', keys)
    autoExpandParent.value = false
}

const getKeyByValue = (arr) => {
    const keys: any = []
    const ids = treeData.value.map(item=>item.id)
    for (const [key, value] of expandMap.entries()) {
        if (arr.includes(value)) {
            keys.push(key);
        }
    }
    //父级不展开
    return keys.filter(item=>!ids.includes(item))
}

watch(
    () => props.list,
    (val: any) => {
        countMap.value.clear()
        treeData.value = [...val,...treeData.value]
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
        // console.log('----',handleSort(val))
        emit('changeTree', handleSort(val))
    },
    { deep: true, immediate: true }
)

//左边控制右边展开
watch(
    () => props.checkedKey,
    (val) => {
        const arr = getKeyByValue(val)
        expandedKeys.value = arr
        autoExpandParent.value = true
    },
    { deep: true, immediate: true }
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
                    {

                    }
                ],
            },
        ],
        sorts: [{ name: 'sortIndex', order: 'asc' }],
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
        line-height: 40px;
        height: 40px;
        background-color: #F8F8F8;

        .btn {
            color: #333333;
        }

        .icon {
            color: #00000050;
            font-size: 16px;
            margin-right: 20px;
        }
    }

    :deep(.ant-tree .ant-tree-node-content-wrapper.ant-tree-node-selected) {
        background-color: #FFF;
    }

    .tree-content {
        display: flex;
        min-height: 32px;

        &.project {
            background-color: #F6F7F9;
            border-radius: 4px;
            color: #315EFB;
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
