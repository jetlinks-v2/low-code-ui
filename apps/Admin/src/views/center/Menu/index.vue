
<template>
    <j-modal title="菜单管理" visible :maskClosable="false" :width="1000" @ok="handleSave" @cancel="emits('close')"
        :confirmLoading="loading">
        <Menu @change="onChange" :projectData="list" :projectId="data?.id"></Menu>
    </j-modal>
</template>

<script setup lang='ts'>
import { saveMenu } from '@/api/menu';
import { useProduct } from '@/store/product';


const emits = defineEmits(['close'])

const props = defineProps({
    data: Object
})

const product = useProduct()
const list = ref<any>([])

const loading = ref<boolean>(false)
const menuData = ref<any>([])

const handleSave = async () => {
    const res = await saveMenu(menuData.value)
    if (res.status === 200) {
        emits('close')
    }
}
const onChange = (item) => {
    menuData.value = item
}


const getTree = () => {
    product.queryProduct(props.data?.draftId, () => {
        const maps = product.getDataMap()
        const copyData = JSON.parse(JSON.stringify([...maps.values()]))
        console.log('copyData',copyData)
        list.value = copyData.filter(item => {
            // console.log(item)
            return item.others && item.others?.menu && item.others?.menu.main
        }).map(item => {
            item.parentFullId = maps.get(item.parentId).fullId
            return item
        })
    })
}

onMounted(() => {
    getTree()
})

onUnmounted(()=>{
    product.initProjectState()
})
</script>

<style scoped lang='less'></style>