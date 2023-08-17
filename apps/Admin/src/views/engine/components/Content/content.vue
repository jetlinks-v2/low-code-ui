<template>
  <div class="content-warp">
    <Project :data="props.data.children" v-if="props.data.type==='module'"/>
    <FormDesigner v-else-if="props.data.type === 'page-form'"/>
  </div>
</template>

<script setup name="ContentWarp">
import Project from '@/components/ProJect/index.vue'

const props = defineProps({
    data: {
        type: Object,
        default: {}
    },
})

</script>

<style scoped lang="less">

</style>
