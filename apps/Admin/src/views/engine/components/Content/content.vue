<template>
  <div class="content-warp">
    <Project />
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
