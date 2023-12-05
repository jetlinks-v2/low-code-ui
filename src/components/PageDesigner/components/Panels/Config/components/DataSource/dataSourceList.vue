<template>
  <a-auto-complete
    v-model:value="myValue"
    :options="options"
    placeholder="请输入数据源地址"
    @search="handleSearch"
    @change="change"
  />
</template>

<script setup name="DataSourceList">
import {queryEndCommands} from '@LowCode/api/form'
import {useProduct} from "@LowCode/store";
import {cloneDeep} from "lodash-es";

const props = defineProps({
  value: {
    type: String,
    default: undefined
  }
})

const emit = defineEmits(['update:value'])

const {info} = useProduct()
const myValue = ref(props.value)
const options = ref([])
let optionsCache = []

const change = () => {
  emit('update:value', myValue.value)
}

const handleQuery = (arr) => {
  const commandMap = new Map()
  arr.forEach((item) => {
    if (item.command) {
      item.command.forEach((i) => {
        const url = `low-code/runtime/${info.id}/${info.id}.${item.moduleId}.${item.id}/${i.id}`
        const label = `${item.moduleName}-${item.name}-${i.name}`
        commandMap.set(url, {
          label: label,
          value: url
        })
      })
    }
  })
  return [...commandMap.values()]
}

const getQuery = async () => {
  const res = await queryEndCommands(info.id, [])
  if (res.status === 200) {
    const arr = handleQuery(res.result)
    options.value = arr
    optionsCache = cloneDeep(arr)
  }
}

/**
 * 根据关键词提示
 * @param searchText 关键词
 */
const handleSearch = (searchText) => {
  options.value = optionsCache.filter(
    (item) => !!item.label?.includes(searchText),
  );
  if (!options.value.length) {
    options.value.unshift({ label: searchText, value: searchText });
  }
};

getQuery()
</script>

<style scoped>

</style>
