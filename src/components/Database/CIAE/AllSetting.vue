<template>
  <j-drawer
      visible
      title="配置"
      placement="right"
      :style="{ position: 'absolute', zIndex: 1030 }"
      :closable="false"
      :width="500"
      :get-container="warp"
      @close="cancel"
  >
    <j-scrollbar>
      <j-form
          ref="formRef"
          :model="formModel"
          layout="vertical"
      >
        <j-form-item name="sourceType" label="数据支持">
          <TypeSelect
              v-model:value="formModel.sourceType"
              :multiple="true"
              :options="[
                  { label: '导入', value: 'importCommand' },
                  { label: '导出', value: 'exportCommand' },
              ]"
          />
        </j-form-item>
        <!--    命令下拉配置    -->
        <j-form-item
            v-if="formModel.sourceType.includes('importCommand')"
            name="importCommand"
            :rules="[{ validator: commandValidator }]"
        >
          <Command v-model:value="formModel.importCommand" title="导入" :id="props.id"/>
        </j-form-item>
        <j-form-item
            v-if="formModel.sourceType.includes('exportCommand')"
            name="exportCommand"
            :rules="[{ validator: commandValidator }]"
        >
          <Command v-model:value="formModel.exportCommand" title="导出" :id="props.id"/>
        </j-form-item>
        <j-form-item name="fileName" label="请为文件命名" :rules="[{ validator: fileValidator }]">
          <FileName v-model:value="formModel.fileName" />
        </j-form-item>
      </j-form>
    </j-scrollbar>
    <template #footer>
      <j-button style="margin-right: 8px" @click="cancel">取消</j-button>
      <j-button type="primary" @click="save">确定</j-button>
    </template>
  </j-drawer>
</template>

<script setup name="AllSetting">
import Command from './Command.vue'
import { regular } from '@jetlinks-web/utils'
import FileName from './FileName.vue'
import TypeSelect from '../components/settingModal/ID/typeSelect.vue'
import { omit } from 'lodash-es'

const props = defineProps({
  value: {
    type: Object,
    default: () => ({})
  },
  warp: {
    type: Object,
    default: undefined
  },
  id: {
    type: String,
    default: undefined
  }
})

const emit = defineEmits(['save', 'cancel'])

const formRef = ref()
const formModel = reactive({
  importCommand: undefined,
  exportCommand: undefined,
  fileName: undefined,
  sourceType: [],
  ...props.value
})

const fileValidator = (_, value) => {

  if (value) {
    if (value.length > 64) {
      return Promise.reject('最多可输入64位字符')
    }

    if (regular.isTextReg(value)) {
      return Promise.reject('文件名不能包含中文')
    }
  }
  return Promise.resolve()
}

const commandValidator = (_, value) => {
  if (value) {
    if (!value.commandId) {
      return Promise.reject('请选择指令')
    }
    return Promise.resolve()
  } else {
    return Promise.reject('请选择命令下拉配置')
  }
}

const cancel = () => {
  emit('cancel')
}

const save = () => {
  formRef.value.validate().then(res => {
    if (res) {
      emit('save', omit(formModel, ['sourceType']))
    }
  })
}

onMounted(() => {
  formModel.sourceType = []
  if (formModel.importCommand) {
    formModel.sourceType.push('importCommand')
  }
  if (formModel.exportCommand) {
    formModel.sourceType.push('exportCommand')
  }
})

</script>

<style scoped>

</style>
