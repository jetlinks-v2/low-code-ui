
<template>
    <j-modal visible :footer="null" :width="500" :closable="false" @cancel="emit('close')">
        <j-form :layout="'vertical'" ref="formRef" :model="modelRef">
            <j-form-item name="title" validateFirst :rules="[
                { max: 64, message: '最多输入64个字符' },
                { pattern: regular.modalReg, message: '字母+数字+下划线组成，并以字母开头' },
                { validator: isOnlyName, trigger: 'change' }
            ]">
                <template #label>
                    {{ `${titleType} ${props.provider ? providerMap[props.provider] : ''}` }}
                </template>
                <j-input v-model:value="modelRef.title" placeholder="请输入" ref="inputRef"/>
            </j-form-item>
        </j-form>
    </j-modal>
</template>

<script setup lang='ts' name="InputModal">

import { regular } from '@jetlinks/utils';
// import { providerList } from './index';
import { onKeyStroke } from '@vueuse/core'
import { providerEnum, providerMap } from '../../index'
import { useEngine, useProduct } from '@/store'
import { randomString, generateSerialNumber } from '@jetlinks/utils'

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
    nameList:{
        type:Array,
        default:() => []
    }
})

const modelRef = reactive({
    title: props.data.title || '',
    id:props.data.id || randomString(16),
    type:props.data.type || props.provider,
    parentId:props.data.parentId || engine.activeFile,
    children:props.data.children || []
})
const formRef = ref()
const inputRef = ref()

const titleType = computed(() => props.type === 'Add' ? '新增' : '重命名')

const isOnlyName = async (_,value)=>{
    const pass =props.nameList.some(item=>{
      if(props.type === 'Add'){
        return item ===value
      }else{
        return item === value && value!==props.data.title
      }
    })
    
    if(!value){
      return Promise.reject(`请输入名称`)
    }
    if(value && pass){
        return  Promise.reject(`名称"${value}"已被占用，请重新命名`)
    }else{
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
      const moduleId = (props.data.parentId || engine.activeFile).substr(0, 4)
      return {
        tableName: `${productId}_${moduleId}_${generateSerialNumber(3)}`,
        columns: []
      };
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
  }
}

const handleOthers = (type, title) => {
  const others: any = {
    type
  }
  if ([providerEnum.ListPage, providerEnum.HtmlPage].includes(type)){
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
            configuration:props.data.configuration?props.data.configuration: getConfiguration(modelRef.type),
            others: handleOthers(modelRef.type, modelRef.title)
        })
    }
})

onMounted(()=>{
    inputRef.value?.focus()
    window.navigator.clipboard.writeText('')
})


</script>

<style scoped lang='less'></style>
