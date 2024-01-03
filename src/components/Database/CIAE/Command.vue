<template>
  <div style="display: flex;gap:6px;align-items: center">
    <div v-if="title" style="width: 76px"> {{ title }}: </div>
    <j-select
        showSearch
        :filter-option="filterOption"
        :options="commandSupportOptions"
        v-model:value="myValue.commandSupportId"
        placeholder="请选择"
        style="width: 100%"
        @change="valueChange"
    >

    </j-select>
    <j-select
        showSearch
        :filter-option="filterOption"
        :options="dictOptions"
        v-model:value="myValue.commandId"
        placeholder="请选择指令"
        style="width: 100%"
        @change="valueChange"
    >

    </j-select>
  </div>
</template>

<script setup name="Command">

import {useRequest} from "@jetlinks-web/hooks";
import {queryDraftCommands} from "@LowCode/api/form";
import {useProduct} from "@LowCode/store";

const props = defineProps({
  value: {
    type: Object,
    default: undefined
  },
  id: {
    type: String,
    default: undefined
  },
  title: {
    type: String,
    default: undefined
  }
})

const emit = defineEmits(['update:value'])

const myValue = reactive({
  commandSupportId: undefined,
  commandId: undefined,
  ...props.value
})

const filterOption = (input, option) => {
  const str = option.label || option.value;
  console.log(str, option)
  return String(str).toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const project = useProduct()

const dictOptionsMap = ref(new Map())

const dictOptions = computed(() => {
  return dictOptionsMap.value.get(myValue.commandSupportId)
})

const {data: commandSupportOptions, run: apiRun} = useRequest(queryDraftCommands,
    {
      immediate: false,
      onSuccess(res) {

        const filterArr = res.result.filter(item => item.id !== props.id)

        const arr = filterArr.map(item => {
          const commands = item.command?.map(a => ({
            value: a.id,
            label: a.name
          })) || []

          const _commandId = `${item.moduleId}.${item.id}`

          dictOptionsMap.value.set(_commandId, commands)

          return {
            label: item.name,
            value: _commandId,
          }
        })

        return arr || []
      }
    }
)

const valueChange = () => {
  emit('update:value', myValue)
}

apiRun(project.info.draftId, [])

</script>

<style scoped>

</style>
