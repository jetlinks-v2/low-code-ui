
<template>
    <div class="content">
        <!-- <div>拖拽页面位置到系统菜单</div> -->
        <div class="menu">
            <div class="left">
                <div class="left-top">
                    <j-checkbox v-model:checked="menuState.checked" @change="onCheck">全选</j-checkbox>
                    <span>已选中 {{ menuState.count }} 个页面</span>
                </div>
                <div class="list">
                    <div v-for="item in leftList" @click="onClick(item)" :class="{
                        'list-item': true,
                        'active': menuState.checkedKey.includes(item.id)
                    }">
                        <div style="display: flex; align-items: center;">
                            <AIcon :type="item.icon" />
                            <div style="margin-left: 10px;">{{ item.name }}</div>
                        </div>
                        <j-badge :count="countMap.get(item.id)" :number-style="{ backgroundColor: '#315efb' }" />
                    </div>
                </div>
            </div>

            <div class="black">
                <j-button @click="toRight">
                    <AIcon type="RightOutlined" />加入右侧
                </j-button>
            </div>
            <div class="right">
                <TreeDrag :list="addTree" @change-count="onCount" @change-tree="onTree" />
            </div>
        </div>
    </div>
</template>

<script setup lang='ts' name="Menu">
import TreeDrag from './TreeDrag/index.vue'
import { randomString } from '@jetlinks/utils';

const props = defineProps({
    projectData: {
        type: Object,
        default: {}
    },
})

const emit = defineEmits(['change'])

const leftList = ref<any>([])
const addTree = ref<any>([])
const treeData = ref<any>([])

const menuState = reactive<any>({
    checked: false,
    count: 0,
    checkedKey: [],
    checkedKeyItem: []
})
const countMap = ref(new Map())



const onClick = (data: any) => {
    menuState.checked = false
    if (menuState.checkedKey.includes(data.id)) {
        menuState.checkedKey = menuState.checkedKey.filter(item => item !== data.id)
    } else {
        menuState.checkedKey = [...new Set([...menuState.checkedKey, data.id])]
    }
    menuState.count = menuState.checkedKey.length
}

const onCheck = (e) => {
    if (e.target.checked) {
        menuState.checkedKey = leftList.value.map(item => item.id)
    } else {
        menuState.checkedKey = []
    }
    menuState.count = menuState.checkedKey.length
}

const toRight = () => {
    // const arr = menuState.checkedKey
    const arr = leftList.value.filter(item => menuState.checkedKey.includes(item.id)).map(it => ({
        ...it,
        id: randomString(16),
        options: {
            pageId: it.id
        }
    }))

    addTree.value = [...arr]
}


const onCount = (data) => {
    countMap.value = data
}

const onTree = (data) => {
    treeData.value = data
    emit('change', data)
}


onMounted(() => {
    const test = [
        {
            id: 'html1',
            name: 'html-1',
            icon: 'EyeOutlined',
            url:"/html1",
            owner:'iot',
            // code:'html1'
        },
        {
            id: 'html2',
            name: 'html-2',
            icon: 'EyeOutlined',
            url:"/html2",
            owner:'iot',
        },
        {
            id: 'html3',
            name: 'html-3',
            icon: 'EyeOutlined'
        }
    ]
    leftList.value = test
})


</script>

<style scoped lang='less'>
.content {
    padding: 0 24px 24px 24px;
    // background-color: #CCC;

    .menu {
        display: flex;
        align-items: center;

        .left {
            background-color: #ffffff;
            height: 400px;
            border: 1px solid #dcdcdc;
            width: 49%;

            .left-top {
                margin-left: 24px;
                margin-top: 20px;
            }

            .list {
                padding: 0 24px 24px 24px;

                .list-item {
                    height: 30px;
                    line-height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin: 10px 0;
                    border-bottom: 1px solid #e6e6e667;
                    cursor: pointer;

                    &.active {
                        background-color: #d6e4ff;
                    }

                    // &:hover {
                    //     background-color: #d6e4ff;
                    // }
                }
            }
        }

        .black {
            margin: 0 20px;
        }

        .right {
            background-color: #ffffff;
            height: 400px;
            width: 49%;
            border: 1px solid #dcdcdc;
            padding: 12px;

            .top {
                margin-bottom: 10px;
                // margin-left: 10px;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
        }
    }
}
</style>
