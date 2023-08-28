
<template>
    <j-modal title="菜单管理" visible :maskClosable="false" :width="1000" @ok="handleSave" @cancel="emits('close')"
        :confirmLoading="loading">
        <Menu @change="onChange"></Menu>
    </j-modal>
</template>

<script setup lang='ts'>
import { saveMenu } from '@/api/menu';


const emits = defineEmits(['close'])

const loading = ref<boolean>(false)
const menuData = ref<any>([])

const handleSave =async () => {
    const res = await saveMenu(menuData.value)
    if(res.status === 200){
        emits('close')
    }
}
const onChange = (item)=>{
    menuData.value = item
}


</script>

<style scoped lang='less'></style>