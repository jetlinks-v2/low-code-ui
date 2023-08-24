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
            <component :is="Panels[item.key]" />
          </j-collapse-panel>
        </j-collapse>
      </j-form>
    </div>
  </Scrollbar>
</template>
  
<script lang="ts" setup>
import { ref, computed, watchEffect } from 'vue'
import { Scrollbar } from 'jetlinks-ui-components'
import Base from './components/Base.vue'
import InputLimit from './components/InputLimit.vue'
import Rules from './components/Rules/index.vue'
import Descriptions from './components/Descriptions.vue'
import Event from './components/Event.vue'
import Status from './components/Status.vue'
import Source from './components/Source.vue'
import Form from './components/Form.vue'
import Grid from './components/Grid.vue'
import UploadLimit from './components/UploadLimit.vue'
import TabsConfig from './components/TabsConfig.vue'
import Space from './components/Space.vue'
import { map } from 'lodash-es'
import { getConfigList } from './utils'
import { useTarget } from '../../../hooks'

const formRef = ref<any>()

const { target } = useTarget()

const _type = computed(() => {
  return target?.value?.type || 'root'
})

const Panels = {
  Base,
  InputLimit,
  Rules,
  Descriptions,
  Event,
  Status,
  Source,
  Form,
  Grid,
  UploadLimit,
  TabsConfig,
  Space
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
    .validateFields()
    .then((values) => {
      console.log('Received values of form: ', values)
    })
    .catch((info) => {
      console.log('Validate Failed:', info)
    })
}

defineExpose({ onSave })
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