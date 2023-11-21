
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
                            <AIcon :type="item.icon || item.others?.menu?.icon" style="margin-left: 10px;"/>
                            <div style="margin-left: 10px;">
                                <j-ellipsis style="max-width: 250px;">{{ item.others?.menu?.name }}</j-ellipsis>
                            </div>
                        </div>
                        <div style="color: #315EFB;margin-right: 20px;" v-if="countMap.get(item.id)!==0">{{ countMap.get(item.id) }}</div>
                        <!-- <j-badge :count="countMap.get(item.id)" :number-style="{ backgroundColor: '#315efb' }" /> -->
                    </div>
                </div>
            </div>

            <div class="black">
                <j-button @click="toRight">
                    <AIcon type="RightOutlined" />加入右侧
                </j-button>
            </div>
            <div class="right">
                <TreeDrag
                    :list="addTree"
                    @change-count="onCount"
                    @change-tree="onTree"
                    :project-id="projectId"
                    :checkedKey="menuState.checkedKey"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang='ts' name="Menu">
import TreeDrag from './TreeDrag/index.vue'
import { randomString } from '@jetlinks-web/utils';
import { providerEnum } from '@LowCode/components/ProJect/index'

// import { cloneDeep } from 'lodash-es';
// import TreeDrag from './TreeDrag/index.vue'
// import { randomString } from '@jetlinks-web/utils';

const props = defineProps({
    projectData: {
        type: Object,
        default: {}
    },
    projectId: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['change'])

const leftList = ref<any>(props.projectData || [])
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
    const arr = leftList.value.filter(item => menuState.checkedKey.includes(item.id)).map(it => {
        // console.log('-----it', it)
        const id = randomString(16)
        const code = randomString(8)
        const type = it.others.type === providerEnum.HtmlPage ? 'html' : 'list'
        const url = `/preview/${props.projectId}/${it.parentFullId}/${it.id}/${type}/${code}`
        return {
            ...it,
            url,
            id,
            name: it.others.menu?.name,
            owner: 'iot',
            code,
            icon: it.others.menu?.icon,
            parentId: undefined,
            buttons:it.others.menu?.buttons || [],
            options: {
                pageId: it.id,
                projectId: props.projectId,
                LowCode:true,
                show:true
            }
        }
    })

    addTree.value = [...arr]
}


const onCount = (data) => {
    countMap.value = data
}

const onTree = (data) => {
    treeData.value = data
    emit('change', data)
}

watchEffect(() => {
    leftList.value = props.projectData
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
            border: 1px solid #E0E0E0;
            width: 49%;
            border-radius: 5px;

            .left-top {
                // margin-left: 24px;
                // margin-top: 20px;
                line-height: 40px;
                height: 40px;
                background-color: #F8F8F8;
                padding-left: 20px;
            }

            .list {
                padding:5px 10px;

                .list-item {
                    height: 32px;
                    line-height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin: 5px 0;
                    color: #333333;
                    cursor: pointer;

                    &.active {
                        background-color: #F6F7F9;
                        border-radius: 4px;
                        color: #315EFB;
                    }

                    &:hover {
                        background-color: #F6F7F9;
                    }
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
            border: 1px solid #E0E0E0;
            width: 49%;
            border-radius: 5px;

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
