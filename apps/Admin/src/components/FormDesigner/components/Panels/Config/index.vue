<template>
  <Scrollbar>
    <div class="header">组件配置</div>
    <div class="config-container" id="config-container">
      <j-form ref="formRef" :model="formState" layout="vertical">
        <j-collapse
          v-model:activeKey="activeKey"
          :expand-icon-position="'right'"
          :bordered="false"
        >
          <j-collapse-panel v-for="item in panelsList" :key="item.key">
            <template #header>
              <TitleComponent :data="item.header" />
            </template>
            <component :is="Panels[item.key]" @refresh="onRefresh" />
          </j-collapse-panel>
        </j-collapse>
      </j-form>
    </div>
  </Scrollbar>
</template>
  
<script lang="ts" setup>
import { ref, computed, watchEffect, inject, watch, unref, reactive } from 'vue'
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

const formRef = ref<any>()

const { target } = useTarget()
const formState = reactive({ ...unref(target) })

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
  SourceForm,
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
      console.error('Validate Failed:', info)
    })
}

const onRefresh = (obj: any) => {
  if (obj?.key) {
    if (obj.key === 'root') {
      designer.formData.value = {
        ...obj,
        children: designer.formData.value?.children || [],
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

watch(
  () => target.value,
  (newVal) => {
    Object.assign(formState, newVal)
    if (unref(designer.errorKey)?.length) {
      setTimeout(() => {
        onSave()
      })
    }
  },
  {
    immediate: true,
    deep: true,
  },
)
</script>

<style lang="less" scoped>
.header {
  font-size: 18px;
  font-weight: 500;
  border-bottom: 1px solid #f0f0f0;
  height: 40px;
  display: flex;
  align-items: center;
  padding-left: 16px;
}
.config-container {
  height: 100%;
  padding: 16px;
  position: relative;

  :deep(.ant-collapse) {
    background-color: #fff;
    .ant-collapse-item {
      border: none !important;
      margin-bottom: 2px;
      .ant-collapse-header {
        background-color: #fafafa !important;
        padding: 13px;
        .title {
          margin: 0;
        }
        span {
          color: #333333;
        }
      }
    }
  }
}
</style>
