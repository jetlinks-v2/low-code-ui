
<template>
    <div style="width: 100%;">
        <List :data="list" />
        <!--        <Empty v-else/>-->
    </div>
</template>

<script setup lang='ts' name="Project">
import { useProduct, useEngine } from '@LowCode/store';
import List from './List/index.vue'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es';


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

    if (sortKey === 'default') {
        return value
    } else {
        const result = value?.sort((a, b) => {
            if (sortKey === 'name' || sortKey === 'type') {
                return a[sortKey].localeCompare(b[sortKey], 'zh-CN')
            } else {
                return dayjs(b.others[sortKey]).valueOf() - dayjs(a.others[sortKey]).valueOf()
            }
        })
        return result
    }
}

watchEffect(() => {
    if (props.data) {
        console.log('list', props.data)
        const arr = cloneDeep(props.data)
        list.value = handleSort(arr)
    }
})

</script>

<style scoped lang='less'></style>
