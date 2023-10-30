<template>
  <page-container>
    <div class="box">
      <FormDesigner @back="onBack" @saveData="onSave" type="workflow" :data="data?.configuration" :value="{}" :mode="undefined" />
    </div>
  </page-container>
</template>

<script lang="ts" setup>
import { _detail, _update } from '@/api/process/form'
import { onlyMessage } from '@jetlinks/utils'
import { onMounted, ref } from 'vue'
import { router } from '@jetlinks/router'
import { omit } from 'lodash-es'

const route = useRoute()
const data = ref<any>()

const queryDetail = (id) => {
    _detail(id).then(resp => {
        if(resp.success){
            data.value = resp.result
        }
    })
}

const onSave = (dt: any) => {
  const obj = dt?.children?.length ? dt : {}
    _update({
        ...omit(data.value, ['id', 'creatorId', 'creatorName', 'modifierId', 'modifyTime']),
        configuration: obj
    }).then(resp => {
        if(resp.success){
            onlyMessage('操作成功！')
            router.replace(`/flow-engine/form`)
        }
    })
}

onMounted(() => {
    queryDetail(route.params.id)
})

const onBack = () => {
  router.replace(`/flow-engine/form`)
}
</script>

<style lang="less" scoped>
.box {
  background-color: #fff;
  height: calc(100vh - 122px);
}
</style>