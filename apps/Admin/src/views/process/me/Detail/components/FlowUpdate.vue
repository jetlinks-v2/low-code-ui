
<template>
    <j-modal visible @cancel="emit('close')" title="办理详情" :width="700" @ok="emit('close')">
        <j-tabs v-model:activeKey="activeKey" type="card">
            <j-tab-pane v-for="item in tabs" :key="item.key" :tab="item.label">
                <div v-if="formConfig?.multiple">
                    <JProTable :columns="columns" model="table" :dataSource="dataSource" :noPagination="true" />
                </div>
                <div v-else>
                    <div>{{ formConfig?.formName }}</div>
                    <Preview :value="formValue" :data="formConfig?.configuration" />
                </div>
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
const formConfig = ref<any>({})
const formValue = ref<any>({})
const columns = ref<any>([])
const dataSource = ref<any>([])
const init = reactive<any>({
    columns:undefined,
    data:undefined,
    
})



onMounted(() => {
    const config = props.info?.form?.find(item => item.formId === props.current.others.formId)
    formConfig.value = config
    formValue.value = config.data
    console.log('config----', config,props.current)
    const arr = formConfig.value?.configuration.children?.map(item => ({
        title: item.formItemProps.label,
        dataIndex: item.formItemProps.name,
        ellipsis: true,
    }))
    columns.value = arr
    dataSource.value = [config.data]

    init.columns = arr
    init.data = config.data
    // console.log(columns.value, config.data)
})

watch(
    () => activeKey.value,
    (val) => {
        if (val === 'after') {
            const obj={}
             props.current.others.diff.forEach(item=>{
                obj[item.property]=item.after
            })
            console.log('diff------',obj,init.data)
            //不同值
            const diff = {
                ...init.data,
                ...obj,
            }
            dataSource.value = [diff] 
            formValue.value ={
                ...diff,
                kg1:false
            }
           
        }
        if(val === 'before'){
            dataSource.value = [{...init.data}]
            // console.log('before------',init.data)
            formValue.value = init.data
        }
    },
    { deep: true, immediate: true }
)

</script>

<style scoped lang='less'></style>