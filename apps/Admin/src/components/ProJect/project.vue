
<template>
    <div style="width: 100%;">
        <List :data="list" />
        <!--        <Empty v-else/>-->
    </div>
</template>

<script setup lang='ts' name="Project">
import { useProduct, useEngine } from '@/store';
import List from './List/index.vue'
import dayjs from 'dayjs'


const props = defineProps({
    data: {
        type: Array,
        default: []
    },
})
const product = useProduct()
const engine = useEngine()

const list = ref<any>([])

const handleSort = (value) => {
    
    const sortKey = product.getById(engine.activeFile)?.others?.sorts

    const result = value?.sort((a,b)=>{
        if(sortKey==='name' || sortKey==='type'){
            return a[sortKey].localeCompare(b[sortKey],'zh-CN')
        }else{
            return  dayjs(b.others[sortKey]).valueOf() - dayjs(a.others[sortKey]).valueOf()
        }
    })
    // console.log('result',result)
    return result
}

watchEffect(() => {
    if (props.data) {
        // console.log('list', props.data)
        list.value = handleSort(props.data)
    }
})

</script>

<style scoped lang='less'></style>
