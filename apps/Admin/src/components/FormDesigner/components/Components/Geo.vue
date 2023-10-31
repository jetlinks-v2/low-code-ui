<template>
    <div>
        <a-select :options="geoList" :open="selectRef.open" showSearch allowClear v-model:value="_value" placeholder="请选择" :disabled="disabled"
            @search="onSearch" @change="onChange" @dropdownVisibleChange="onDrop" @blur="onBlur">
            <template #dropdownRender="{ menuNode: menu }">
                <j-spin :spinning="selectRef.loading">
                    <v-nodes :vnodes="menu" />
                </j-spin>
            </template>
        </a-select>
    </div>
</template>

<script  setup>
import { getGeoTree, GeoTreeByName } from '@/api/form'
import { debounce } from "lodash-es";


const props = defineProps({
    value: {
        type: String,
        default: undefined
    },
    disabled: {
        type: Boolean,
        default: false
    },
    // level: {
    //     type: String,
    //     default: 'all'
    // },
    geoType: {
        type: String,
        default: 'country'
    }
})
const emit = defineEmits(['update:value'])

const VNodes = (_, { attrs }) => {
    return attrs.vnodes
}
const geoList = ref()
const _value = ref()
const geoType = ref(props.geoType)

const selectRef = reactive({
    open: false,
    loading: false,
})

const TreeMap = new Map()

//处理tree的name
const handleTree = (tree, name) => {
    if (tree.length === 0) return []
    return tree.map(item => {
        if (name) {
            item.name = `${name}/${item.name}`
        }
        if (item.children) {
            item.children = handleTree(item.children, item.name)
        }
        TreeMap.set(item.id, item)
        return item
    })
}

const getTree = async (option) => {
    selectRef.loading = true
    const res = await getGeoTree(geoType.value, {
        paging: false,
        "terms": [
            {
                "value": option ? option.key : 1,
                "termType": "eq",
                "column": option ? "parentId" : 'level'
            }
        ]
    }).finally(() => selectRef.loading = false)
    if (res.status === 200) {

        if (res.result.length === 0) {
            selectRef.open = false
        } else {
            geoList.value = res.result?.map(item => ({
                label: option ? `${option.label}/${item.name}` : item.name,
                value: option ? `${option.value}/${item.name}` : item.name,
                key: item.id
            }))
        }
    }
}


const onSearch = debounce(async (inputValue) => {
    // console.log('----e', inputValue)
    if (inputValue) {
        selectRef.loading = true
        const res = await GeoTreeByName(geoType.value, {
            "paging": false,
            terms: [
                {
                    "value": `%${inputValue}%`,
                    "termType": "like",
                    "column": "name"
                }
            ]
        }).finally(() => selectRef.loading = false)
        if (res.status === 200) {
            handleTree(res.result)
            const arr = [...TreeMap.values()].filter(item => item.name.includes(inputValue))

            // console.log(arr, [...TreeMap.values()])
            geoList.value = arr.map(item => ({
                key: item.id,
                label: item.name,
                value: item.name
            }))
        }
    }
}, 300)



const onChange = (value, options) => {
    // console.log('value', value, options)
    if (value) {
        getTree(options)
    } else {
        selectRef.open = false
        getTree()
    }
    changeValue(value)
}

const onDrop = (value) => {
    if (value) {
        selectRef.open = value
    }
    if (!value && !_value.value) {
        selectRef.open = value
    }
}

const onBlur = ()=>{
    selectRef.open = false
}


onMounted(() => {
    getTree()
})

const changeValue = (value) => {
    emit('update:value', value)
}


watch(
    () => props.value,
    () => {
        _value.value = props.value
    },
    { deep: true, immediate: true }
)
</script>
<style lang="less" scoped></style>