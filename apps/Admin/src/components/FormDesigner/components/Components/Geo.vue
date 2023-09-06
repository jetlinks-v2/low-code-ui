<template>
    <div>
        <a-select :options="geoList" :open="selectRef.open" showSearch allowClear v-model:value="_value" placeholder="请选择"
            @search="onSearch" @change="onChange" @dropdownVisibleChange="onDrop">
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
import { debounce } from '@/components/CustomHTML/utils';


const props = defineProps({
    value: {
        type: String,
        default: undefined
    },
    disabled: {
        type: Boolean,
        default: false
    },
    level: {
        type: String,
        default: 'all'
    },
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


const handleTree = (tree)=>{
    
}

const getTree = async (option) => {
    selectRef.loading = true
    const res = await getGeoTree(geoType.value, {
        paging: false,
        "terms": [
            {
                "value": option ? option.key : geoType.value,
                "termType": "eq",
                "column": "parentId"
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
    console.log('----e', inputValue)
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
    }).finally(()=> selectRef.loading = false)
    if (res.status === 200) {
        console.log(res.result)
        geoList.value = []
    }
}, 300)



const onChange = (value, options) => {
    // console.log('value', value, options)
    if (value) {
        getTree(props.level==='all'? options:'')
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