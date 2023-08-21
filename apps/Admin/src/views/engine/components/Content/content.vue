<template>
  <div class="content-warp">
    <Project :data="data.children" v-if="data.type==='module'"/>
    <FormDesigner v-else-if="data.type === 'page-form'"/>
    <CRUD v-else-if="data.type === 'CRUD'" />
  </div>
</template>

<script setup name="ContentWarp">
import Project from '@/components/ProJect/index.vue'
import { providerEnum } from '@/components/ProJect'

const props = defineProps({
    data: {
        type: Object,
        default: {}
    },
})

</script>

<style scoped lang="less">
.content-warp {
  height: 100%;
}
</style>
