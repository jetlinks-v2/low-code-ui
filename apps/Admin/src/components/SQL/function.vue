<template>
  <div class="sql-warp">
    <j-monaco-editor
      v-model="code"
      language="javascript"
      :registrationTypescript="registrationTypescript"
      @change="onChange"
    />

  </div>
</template>

<script setup name="Functions">
import { useProduct } from '@/store'
import { executeReq } from '@/api/basis'
import { debounce } from 'lodash-es'
import { providerEnum } from '@/components/ProJect/index'

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
  others: {
    type: Object,
    default: () => ({})
  }
})

const project = useProduct()

const code = ref(props.code)
const registrationTypescript = ref({
  name: 'typescript',
  typescript: ''
})

const getTSTips = async () => {
  const modules = await project.getServerModulesData()
  const resp = await executeReq(providerEnum.Function, 'CreateScriptCompletion', {
    modules: modules,
    extensions: []
  } )
  if (resp.success) {
    registrationTypescript.value.typescript = resp.result
  }
}

const onChange = debounce((v) => {
  code.value = v
  const { configuration, ...extra} = props
  project.update({
    ...extra,
    configuration: {
      script: v
    }
  })
}, 1000)

watch(() => props.configuration.script, () => {
  code.value = props.configuration.script
}, { immediate: true })

getTSTips()

</script>

<style scoped lang="less">
.sql-warp {
  height: 100%;

  :deep(.editor) {
    height: 100%;
  }
}
</style>
