<template>
  <div class="content-warp">
    <Project :data="props.data.children"/>
  </div>
</template>

<script setup name="ContentWarp">
import Project from '@/components/Project/index.vue'

const props = defineProps({
    data: {
        type: Object,
        default: {}
    },
})


</script>

<style scoped lang="less">

</style>
