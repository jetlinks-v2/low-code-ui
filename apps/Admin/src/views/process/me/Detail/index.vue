
<template>
    <j-drawer visible :closable="false" @close="emit('close')" title="流程详情" size="large">
        <j-select v-if="type == 'todo'" showSearch v-model:value="taskId" class="top" :options="options"
            placeholder="请选择办理的节点" @change="onChange">
        </j-select>
        <j-tabs v-model:activeKey="activeKey" type="card" v-if="type !== 'todo' || !!taskId">
            <j-tab-pane key="form" tab="表单">
                <FlowForm :info="info" :nodeId="taskNodeId" :type="type" @close="closeDrawer"/>
            </j-tab-pane>
            <j-tab-pane key="chart" tab="流程图">
                <FlowChart :info="info" />
            </j-tab-pane>
            <j-tab-pane key="history" tab="流程记录">
                <FlowHistory :info="info" />
            </j-tab-pane>
        </j-tabs>
    </j-drawer>
</template>

<script setup lang='ts' name="Detail">
import FlowForm from './components/FlowForm.vue'
import FlowChart from './components/FlowChart.vue'
import FlowHistory from './components/FlowHistory.vue'
import { getProcessDetail, getProcessTodoDetail } from '@/api/process/me';

const props = defineProps({
    current: {
        type: Object,
        default: {}
    },
    type: {
        type: String,
        default: ''
    },
    history:{
        type:Boolean,
        default:false
    }
})

const emit = defineEmits(['close'])

const activeKey = ref('form')
const info = ref<any>({})
const options = ref([])
const taskId = ref(undefined)
const taskNodeId = ref()
const getDetail = async (taskId?: string) => {
    const res = taskId ? await getProcessTodoDetail(props.current.id, taskId) : await getProcessDetail(props.current.id,props.history)
    if (res.status === 200) {
        info.value = res.result
    }
}

const onChange = (e, options) => {
    taskNodeId.value = options.nodeId
    getDetail(e)
}

const closeDrawer = ()=>{
    emit('close')
}

onMounted(() => {
    const arr = props.current.identityLinks?.filter(
        item => item.linkType.value === 'assignee' && item.state.value === 'todo'
    )
    options.value = arr?.map(item => ({
        // label: `${item.taskName}-${item.taskName}`,
        label:item.taskName,
        value: item.taskId,
        nodeId: item.nodeId
    }))
    if (props.type !== 'todo') {
        getDetail()
    }

    // console.log('arr--', props.current.identityLinks, arr)
})
</script>

<style scoped lang='less'>
.top {
    margin-bottom: 10px;
    width: 200px;
}
</style>