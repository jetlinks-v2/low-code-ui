
<template>
    <div class="content">
        <div>拖拽页面位置到系统菜单</div>
        <div class="menu">
            <div class="left">
                <div class="left-top">
                    <j-checkbox v-model:checked="menuState.checked">全选</j-checkbox>
                    <span>已选中 {{ menuState.count }} 个页面</span>
                </div>
                <div class="left-items">
                    <div class="item" v-for="item in leftList">{{ item.name }}</div>
                </div>
            </div>
            <div class="black">
                <AIcon type="RightOutlined" />
            </div>
            <div class="right">
                <div>新增</div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts' name="Menu">

const props = defineProps({
    menuData: {
        type: Array,
        default: []
    },
})

const leftList = ref<any>([])
const menuState = reactive({
    checked: false,
    count:0,

})

onMounted(()=>{
    const test = [
        {
            id:'html1',
            name:'html-1',
            icon:''
        },
        {
            id:'html2',
            name:'html-3',
        },
        {
            id:'html3',
            name:'html-3'
        }
    ]
    leftList.value = test
})


</script>

<style scoped lang='less'>
.content {
    padding: 0 24px 24px 24px;
    background-color: #CCC;

    .menu {
        display: flex;
        align-items: center;

        .left {
            background-color: #ffffff;
            height: 300px;
            width: 49%;
            .left-top{
                margin-left: 10px;
            }
            .left-items{
                .item{
                    height: 30px;
                    line-height: 30px;
                }
            }
        }

        .black {
            margin: 0 20px;
        }

        .right {
            background-color: #ffffff;
            height: 300px;
            width: 49%;
        }
    }
}
</style>