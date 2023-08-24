
<template>
    <j-modal title="菜单管理" visible :maskClosable="false" width="900px" @ok="handleSave" @cancel="emits('close')"
        :confirmLoading="loading">
        <Menu></Menu>
    </j-modal>
</template>

<script setup lang='ts'>

const emits = defineEmits(['close'])

const loading = ref<boolean>(false)

const handleSave = () => {

}

</script>

<style scoped lang='less'></style>