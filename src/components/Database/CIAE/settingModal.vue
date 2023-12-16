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
        <j-form-item label="开启配置">
          <j-switch v-model:checked="showSourceType" @change="openChange" />
        </j-form-item>
        <j-form-item v-if="showSourceType" name="sourceType" label="数据来源">
          <TypeSelect
              v-model:value="formModel.sourceType"
              :options="[
                   { label: '数据字典', value: 'dict' },
                  { label: '手动录入', value: 'manual' },
                  { label: '增删改查', value: 'command' },
              ]"
              @change="typeChange"
          />
        </j-form-item>
        <!--    命令下拉配置    -->
        <j-form-item
            v-if="formModel.sourceType === 'command'"
            name="command"
            :rules="[
                { required: true, message: '请选择命令下拉配置'},
                { validator: commandValidator }
                ]"
        >
          <Command v-model:value="formModel.command" :id="props.id"/>
        </j-form-item>
        <!--    手动下拉配置    -->
        <j-form-item
            v-if="formModel.sourceType === 'manual'"
            name="manual"
            :rules="[{ validator: manualValidator }]"
        >
          <Manual v-model:value="formModel.manual"/>
        </j-form-item>
        <!--    字典下拉配置    -->
        <j-form-item
            v-if="formModel.sourceType === 'dict'"
            name="dict"
            :rules="[{ required: true, message: '请选择字典下拉配置'}]"
        >
          <j-select
              showSearch
              :options="dictOptions"
              placeholder="请选择数据字典"
              v-model:value="formModel.dict"
          />
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
import {useRequest} from "@jetlinks-web/hooks";
import {dictionaryList} from "@LowCode/api/dictionary";
import Manual from './Manual.vue'
import TypeSelect from "../components/settingModal/ID/typeSelect.vue";
import Command from './Command.vue'

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

const {data: dictOptions} = useRequest(dictionaryList, {
  onSuccess(res) {
    if (res) {
      return res.result.map(item => ({...item, label: item.name, value: item.id}))
    }
    return []
  },
  defaultParams: [{
    sorts: [{name: 'createTime', order: 'desc'}, {name: 'name', order: 'desc'}],
    terms: [{column: 'status', value: 1}]
  }]
})

const formRef = ref()
const formModel = reactive({
  sourceType: undefined,
  command: undefined,
  manual: undefined,
  dict: undefined,
  ...props.value
})

const typeChange = () => {
  formModel.command = undefined
  formModel.manual = undefined
  formModel.dict = undefined
}

const showSourceType = ref(false)

const cancel = () => {
  emit('cancel')
}

const openChange = (v) => {
  if (!v) {
    formModel.sourceType = undefined
    typeChange()
  }
}

const save = () => {
  formRef.value.validate().then(res => {
    if (res) {
      emit('save', formModel)
    }
  })
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

const manualValidator = (_, value) => {
  if (value) {
    console.log(value)
   if (value.length > 10) {
     return Promise.reject('可选项数量已达上限')
   }
    return Promise.resolve()
  } else {
    return Promise.reject('请选择手动下拉配置')
  }
}



onMounted(() => {
  showSourceType.value = !!formModel.sourceType
})

</script>

<style scoped>

</style>
