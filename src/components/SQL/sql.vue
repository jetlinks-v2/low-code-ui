<template>
  <div class="sql-warp">
    <j-monaco-editor
      v-model="code"
      language="sql"
      :registrationTips="registrationTips"
      @change="onChange"
    />

  </div>
</template>

<script setup name="SQL">
import {useProduct} from '@LowCode/store'
import { providerEnum } from '@LowCode/components/ProJect/index'
import { debounce } from 'lodash-es'
import { language as sqlLanguage } from './util'

const props = defineProps({
  configuration: {
    type: Object,
    default: () => ({})
  },
  provider: {
    type: String,
    default: undefined
  },
  title: {
    type: String,
    default: undefined
  },
  type: {
    type: String,
    default: undefined
  },
  parentId: {
    type: String,
    default: undefined
  },
  id: {
    type: String,
    default: undefined
  },
  name:{
    type: String,
    default: undefined
  },
  others: {
    type: Object,
    default: () => ({})
  }
})

const project = useProduct()

const code = ref(props.code)
const registrationTips = ref({
  name: 'sql'
})

const getAllCrud = () => {
  const list = project.getDataMapByType(providerEnum.CRUD)
  const tips = []

  const sqlConfigKey = ['builtinFunctions', 'keywords', 'operators']
  sqlConfigKey.forEach(key => {
    sqlLanguage[key].forEach(sql => {
      tips.push({
        label: sql,
        insertText: sql
      })
    })
  })
  // 转化为语法提示
  list.filter(item => item.configuration?.tableName).forEach(item => {
    console.log(item.configuration)
    const config = item.configuration
    tips.push({
      label: `SELECT * FROM ${config.tableName}`,
      insertText: `SELECT * FROM ${config.tableName}`,
      kind: 18,
    })

    if (config.columns) {
      config.columns.forEach(c => {
        tips.push({
          label: `${config.tableName}.${c.name}`,
          insertText: `${c.name}`,
          kind: 18,
        })
      })
    }
  })

  registrationTips.value.suggestions = tips
}

const onChange = debounce((v) => {
  code.value = v
  const { configuration, ...extra} = props
  project.update({
    ...extra,
    configuration: {
      sql: v
    }
  })
}, 1000)

watch(() => props.configuration.code, () => {
  code.value = props.configuration.sql
},{ immediate: true })

getAllCrud()

</script>

<style scoped lang="less">
.sql-warp {
  height: 100%;

  :deep(.editor) {
    height: 100%;
  }
}
</style>
