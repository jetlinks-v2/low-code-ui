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
        <j-form-item name="sourceType" label="数据来源">
          <j-select
              v-model:value="formModel.sourceType"
            :options="[
                { label: '数据字典', value: 'dict' },
                { label: '手动录入', value: 'manual' },
                { label: '增删改查', value: 'command' },
            ]"
          />
        </j-form-item>
        <!--    命令下拉配置    -->
        <j-form-item v-if="formModel.sourceType === 'command'" name="command" :rules="[{ required: true, message: '请选择命令下拉配置'}]">

        </j-form-item>
        <!--    手动下拉配置    -->
        <j-form-item v-if="formModel.sourceType === 'manual'" name="manual" :rules="[{ required: true, message: '请选择手动下拉配置'}]">

        </j-form-item>
        <!--    字典下拉配置    -->
        <j-form-item v-if="formModel.sourceType === 'dict'" name="dict" :rules="[{ required: true, message: '请选择字典下拉配置'}]">

        </j-form-item>
      </j-form>
    </j-scrollbar>
    <template #footer>
      <j-button style="margin-right: 8px" @click="cancel">取消</j-button>
      <j-button type="primary" @click="save">确定</j-button>
    </template>
  </j-drawer>
</template>

<script setup name="SettingModal">

const props = defineProps({
  value: {
    type: Object,
    default: () => ({})
  },
  warp: {
    type: Object,
    default: undefined
  }
})

const emit = defineEmits(['save', 'cancel'])

const formModel = reactive({
  sourceType: undefined,
  ...props.value
})

const cancel = () => {
  emit('cancel')
}

const save = () => {
  emit('save', formModel)
}

</script>

<style scoped>

</style>
