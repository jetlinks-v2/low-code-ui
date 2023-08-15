
<template>
    <div>
        <List v-if="isShow" :data="props.data"/> 
        <Empty v-else/>
    </div>
</template>

<script setup lang='ts' name="Project">
import Empty from './Empty/index.vue'
import List from './List/index.vue'


const props = defineProps({
    data: {
        type: Array,
        default: []
    }
})

const isShow = computed(() => props.data?.length > 0)

watchEffect(()=>{
    console.log('props.data-----',props.data)
})

</script>

<style scoped lang='less'></style>