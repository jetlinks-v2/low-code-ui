
<template>
    <j-drawer visible :closable="false" @close="emit('close')" title="流程详情" size="large" >
        <j-tabs v-model:activeKey="activeKey" type="card">
            <j-tab-pane key="form" tab="表单">
                <FlowForm :current="current"/>
            </j-tab-pane>
            <j-tab-pane key="chart" tab="流程图">
                <FlowChart :current="current"/>
            </j-tab-pane>
            <j-tab-pane key="history" tab="流程记录">
                <FlowHistory :current="current"/>
            </j-tab-pane>
        </j-tabs>
    </j-drawer>
</template>

<script setup lang='ts' name="Detail">
import FlowForm from './components/FlowForm.vue'
import FlowChart from './components/FlowChart.vue'
import FlowHistory from './components/FlowHistory.vue'

const props = defineProps({
    current: {
        type: Object,
        default: {}
    }
})

const emit = defineEmits(['close'])

const activeKey = ref('form')


</script>

<style scoped lang='less'>
</style>