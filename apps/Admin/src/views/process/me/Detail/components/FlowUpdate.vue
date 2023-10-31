
<template>
    <j-modal visible @cancel="emit('close')" title="办理详情" :width="700" @ok="emit('close')">
        <j-tabs v-model:activeKey="activeKey" type="card">
            <j-tab-pane v-for="item in tabs" :key="item.key" :tab="item.label">
                <j-scrollbar style="height: calc(100vh - 350px)">
                    <div v-for="item in formList">
                        
                        <div v-if="item.multiple">
                            <div>{{ item?.config.formName }}</div>
                            <JProTable :columns="item.columns" model="table" :scroll="{ x: 600 }"
                                :dataSource="activeKey == 'before' ? item.beforeDataSource : item.afterDataSource"
                                :noPagination="true" />
                        </div>

                        <div v-else>
                            <div>{{ item?.config.formName }}</div>
                            <Preview :value="activeKey == 'before' ? item.beforeData : item.afterData" :disabled="true"
                                :data="item?.config?.configuration" />
                        </div>
                    </div>
                </j-scrollbar>

            </j-tab-pane>
        </j-tabs>
    </j-modal>
</template>

<script setup lang='ts'>
import Preview from '@/components/FormDesigner/preview.vue'

const props = defineProps({
    current: {
        type: Object,
        default: {}
    },
    info: Object,
})
type Emits = {
    (e: 'close'): void
};
const emit = defineEmits<Emits>();

const tabs = [
    { key: 'before', label: '办理前' },
    { key: 'after', label: '办理后' }
]

const activeKey = ref('before')
const formMap = new Map()
const formList = ref<any>([])

const handleBefore = (val, newVal) => {
    const obj = {}
    val?.forEach(item => {
        obj[item.property] = item.before
    })
    return {
        ...newVal,
        ...obj
    }
}



onMounted(() => {
    console.log('history--------', props.current)

    props.current.forEach(item => {
        props.info?.form.forEach(it => {
            if (item.others.formId === it.formId) {
                formMap.set(
                    item.others.formId,
                    {
                        ...item,
                        config: it
                    }
                )
            }
        })
    })

    const arr = [...formMap.values()].map(item => ({
        ...item,
        beforeData: handleBefore(item.others?.diff, item.others.after),
        afterData: item.others.after,
        columns: item.config.configuration?.children?.map(e => ({
            title: e.formItemProps.label,
            dataIndex: e.formItemProps.name,
            ellipsis: true
        })),
        beforeDataSource: [handleBefore(item.others?.diff, item.others.after)],
        afterDataSource: [item.others.after]
    }))
    formList.value = arr
    console.log('arr--', arr)
})
</script>

<style scoped lang='less'></style>