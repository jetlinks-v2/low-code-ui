<template>
  <Scrollbar>
    <div class="header"><h3>页面搭建</h3></div>
    <div class="config-container" id="config-container">
      <j-form ref="formRef" :model="target" layout="vertical">
        <j-collapse
          v-model:activeKey="activeKey"
          :expand-icon-position="'right'"
        >
          <j-collapse-panel
            v-for="item in panelsList"
            :key="item.key"
            :header="item.header"
          >
            <component :is="Panels[item.key]" @refresh="onRefresh" />
          </j-collapse-panel>
        </j-collapse>
      </j-form>
    </div>
  </Scrollbar>
</template>
  
<script lang="ts" setup>
import { ref, computed, watchEffect, inject, watch, unref } from 'vue'
import { Scrollbar } from 'jetlinks-ui-components'
import Base from './components/Base.vue'
import Status from './components/Status.vue'
import Source from './components/Source.vue'
import SourceForm from './components/SourceForm.vue'
import Form from './components/Form.vue'
import Grid from './components/Grid.vue'
import Config from './components/Config.vue'
import { map } from 'lodash-es'
import { getConfigList } from './utils'
import { useTarget } from '../../../hooks'
import { updateData } from '../../../utils/utils'
import { useFocusWithin } from '@vueuse/core'

const formRef = ref<any>()
const { focused } = useFocusWithin(formRef)

const { target } = useTarget()

const designer: any = inject('FormDesigner')

const _type = computed(() => {
  return target?.value?.type || 'root'
})

const Panels = {
  Form,
  Base,
  Config,
  Status,
  Source,
  Grid,
  SourceForm
}

const panelsList = computed(() => {
  return getConfigList(_type.value)
})

const activeKey = ref<string[]>(map(panelsList.value, 'key'))

watchEffect(() => {
  activeKey.value = map(panelsList.value, 'key')
})

const onSave = () => {
  formRef.value
    ?.validateFields()
    .then((values) => {
      console.log('Received values of form: ', values)
    })
    .catch((info) => {
      console.log('Validate Failed:', info)
    })
}

const onRefresh = (obj: any) => {
  if (obj?.key) {
    if (obj.key === 'root') {
      designer.formData.value = {
        ...obj,
        children: designer.formData.value?.children || []
      }
    } else {
      const arr = updateData(unref(designer.formData)?.children, obj)
      designer.formData.value = {
        ...designer.formData.value,
        children: arr,
      }
      designer.setSelection(obj)
    }
  }
}

watch(
  () => designer.errorKey?.value,
  (newValue) => {
    if (unref(newValue)?.length) {
      onSave()
    }
  },
  {
    immediate: true,
    deep: true,
  },
)

watch(focused, focused => {
  designer.focus = focused
})
</script>

<style lang="less" scoped>
.header {
  margin-top: 15px;
}
.config-container {
  height: 100%;
  margin-top: 10px;
  position: relative;
}
</style>
