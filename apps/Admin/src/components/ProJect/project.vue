
<template>
    <div style="width: 100%;">
        <List :data="list" />
<!--        <Empty v-else/>-->
    </div>
</template>

<script setup lang='ts' name="Project">
import List from './List/index.vue'


const props = defineProps({
    data: {
        type: Array,
        default: []
    },
})

const isShow = computed(() => props.data?.length > 0)
const list = ref<any>([])

watchEffect(()=>{
    if(props.data){
        list.value = props.data
    }
})

</script>

<style scoped lang='less'></style>
