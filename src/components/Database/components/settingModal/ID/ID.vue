<template>

  <j-drawer
      visible
      title="配置"
      placement="right"
      :style="{ position: 'absolute', zIndex: 1030 }"
      :closable="false"
      :width="500"
      :get-container="WarpRef"
      @close="cancel"
  >
    <j-form
        ref="formRef"
        :model="formModel"
        layout="vertical"
    >
      <j-form-item
          label="生成编码"
          required
          :rules="[{ required: true, message: '请选择生成编码'}]"
      >
        <j-card-select
            :options="[
              {
                label: '系统随机',
                value: 'system'
              },
              {
                label: '按规则',
                value: 'rule'
              }
            ]"
            :column="2"
            :showImage="false"
            @change="change"
            v-model:value="mySpecType"
        />
      </j-form-item>
      <j-form-item
          v-if="mySpecType?.[0] === 'rule'"
          label="规则配置"
          required
      >
        <Config v-model:value="formModel.defaultValueSpec" />
      </j-form-item>
    </j-form>
    <template #footer>
      <j-button style="margin-right: 8px" @click="cancel">取消</j-button>
      <j-button type="primary" @click="save">确定</j-button>
    </template>
  </j-drawer>

</template>

<script setup name="IDModal">
import { WARP_REF} from "@LowCode/components/Database/util";
import {inject} from "vue";
import Config from './config.vue'
import { addItem } from './util'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  warp: {
    type: Object
  },
  publish: {
    type: Boolean,
    default: false
  }
})

const formRef = ref()
const WarpRef = inject(WARP_REF)

const emit = defineEmits(['cancel', 'save'])

const formModel = reactive({
  defaultValueSpec: undefined,
  ...props.data
})

const mySpecType = ref('system')

const cancel = () => {
  emit('cancel')
}

const save = () => {
  formRef.value.validate().then(res => {
    if (res) {
      emit('save', {
        ...props.data,
        ...formModel.value
      })
    }
  })
}

const change = (key) => {
  console.log(key, key[0] === 'rule')
  if (key[0] === 'rule') {
    const item = addItem()
    formModel.defaultValueSpec = [item]
  } else {
    formModel.defaultValueSpec = undefined
  }
}

</script>

<style scoped>

</style>
