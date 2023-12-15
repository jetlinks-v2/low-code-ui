
<template>
  <j-modal visible :footer="null" :width="500" :closable="false" @cancel="emit('close')">
    <div class="form">
      <j-form :layout="'vertical'" ref="formRef" :model="modelRef">
        <j-form-item name="title" validateFirst :rules="[
          { max: 64, message: '最多输入64个字符' },
          { pattern: regular.modalReg, message: '字母+数字+下划线组成，并以字母开头' },
          { validator: isOnlyName, trigger: 'change' }
        ]">
          <template #label>
            {{ `${titleType} ${props.provider ? providerMap[props.provider] : ''}` }}
          </template>
          <j-input v-model:value="modelRef.title" placeholder="名称需在当前模块下唯一" ref="inputRef">
            <template #prefix>
              <div class="input-img"><img :src="typeImages[provider]"></div>
            </template>
          </j-input>
        </j-form-item>
      </j-form>
    </div>

  </j-modal>
</template>

<script setup lang='ts' name="InputModal">

import { regular } from '@jetlinks-web/utils';
// import { providerList } from './index';
import { onKeyStroke } from '@vueuse/core'
import { providerEnum, providerMap,typeImages } from '../../index'
import { useEngine, useProduct } from '@LowCode/store'
import { randomString, generateSerialNumber } from '@jetlinks-web/utils'

const engine = useEngine()
const product = useProduct()

type Emits = {
  (e: 'save', data: any): void;
  (e: 'close'): void
};
const emit = defineEmits<Emits>();

const props = defineProps({
  provider: {
    type: String,
    default: ''
  },
  data: {
    type: Object,
    default: () => ({})
  },
  type: {
    type: String,
    default: 'Add'
  },
  nameList: {
    type: Array,
    default: () => []
  }
})

const modelRef = reactive({
  title: props.data.title || '',
  id: props.data.id || randomString(16),
  type: props.data.type || props.provider,
  parentId: props.data.parentId || engine.activeFile,
  children: props.data.children || []
})
const formRef = ref()
const inputRef = ref()

const titleType = computed(() => props.type === 'Add' ? '新增' : '重命名')

const isOnlyName = async (_, value) => {
  const pass = props.nameList.some(item => {
    if (props.type === 'Add') {
      return item === value
    } else {
      return item === value && value !== props.data.title
    }
  })

  if (!value) {
    return Promise.reject(`请输入名称`)
  }
  if (value && pass) {
    return Promise.reject(`名称"${value}"已被占用，请重新命名`)
  } else {
    return Promise.resolve()
  }
}

const getConfiguration = (type) => {
  switch (type) {
    case providerEnum.SQL:
      return {
        sql: undefined
      };
    case providerEnum.CRUD:
      const productId = product.info.id.substr(0, 4)
      const _moduleId = props.data.parentId || engine.activeFile
      const moduleId = _moduleId.substr(0, 4)
      console.log(product.info.id, _moduleId)
      const tableName = product.info.id === _moduleId ? `${productId}_${generateSerialNumber(3)}` : `${productId}_${moduleId}_${generateSerialNumber(3)}`
      return {
        tableName: tableName,
        columns: []
      };
    case providerEnum.CIDE:

      return {

      }
    case providerEnum.Function:
      return {
        lang: undefined,
        script: ''
      };
    case providerEnum.FormPage:
      return {
        type: 'form',
        code: ''
      };
    case providerEnum.ListPage:
      return {
        type: 'list',
        code: ''
      };
    case providerEnum.HtmlPage:
      return {
        type: 'html',
        code: ''
      };
    case providerEnum.PageDesign:
      return {
        type: 'page-design',
        code: ''
      };
  }
}

const handleOthers = (type, title) => {
  const others: any = {
    type
  }
  if ([providerEnum.ListPage, providerEnum.HtmlPage].includes(type)) {
    others.menu = {
      main: true,
      name: '',
      icon: '',
      pageName: title
    }
  }
  return others
}

onKeyStroke('Enter', async () => {
  const res = await formRef.value.validate()
  if (res && modelRef.title) {
    emit('save', {
      ...modelRef,
      name: modelRef.title,
      configuration: props.data.configuration ? props.data.configuration : getConfiguration(modelRef.type),
      others: props.data.others ? props.data.others : handleOthers(modelRef.type, modelRef.title)
    })
  }
})

onMounted(() => {
  setTimeout(() => {
    inputRef.value?.focus()
  }, 300)
})


</script>

<style scoped lang='less'>
:deep(.ant-form-vertical .ant-form-item-label) {
  text-align: center;

  .form_item_title {
    font-size: 16px;
  }
}
.input-img{
  width: 20px;
  height: 20px;
  img{
    width: 100%;
    height: 100%;
  }
}
</style>
