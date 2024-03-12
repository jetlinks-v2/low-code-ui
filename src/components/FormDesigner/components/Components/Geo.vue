<template>
    <div v-if="type === 'tree'">
        <j-tree-select :tree-data="geoList" :fieldNames="{ label: format, value: 'code' }" @select="handleSelect"
            :disabled="disabled" placeholder='请选择' v-model:value="_value" v-model:treeExpandedKeys="treeExpandedKeys">
        </j-tree-select>
    </div>
    <j-space v-else class="select">
        <div v-for="(item, index) in  selectRef.list " style="padding: 0 6px;">
            <j-select :fieldNames="{ label: format, value: 'code' }" :options="item" v-model:value="selectRef.value[index]"
                :disabled="disabled" placeholder='请选择' style="min-width: 100px;"
                @change="(value, options) => handleChange(value, options, index)">
            </j-select>
        </div>
    </j-space>
</template>

<script  setup>
import { getGeoTree } from '@LowCode/api/form'


const props = defineProps({
    value: {
        type: Object,
        default: undefined
    },
    disabled: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        default: 'tree'
    },
    format: {
        type: String,
        default: 'name'
    }
})
const emit = defineEmits(['update:value', 'change'])

const geoList = ref([])
const _value = ref()
const selectRef = reactive({
    list: [undefined],
    value: [undefined]
})
const treeExpandedKeys = ref([])

//处理tree的name
const handleTree = (tree) => {
    if (tree.length === 0) return []
    return tree.map(item => {
        item.nameCode = `${item.name} | ${item.code}`
        if (item.children) {
            item.children = handleTree(item.children)
        }
        return item
    })
}


const getTree = async () => {
    const res = await getGeoTree({ "paging": false, "sorts": [{ "name": "sortIndex", "order": "asc" }] })
    if (res.status === 200) {
        geoList.value = handleTree(res.result)
        selectRef.list[0] = geoList.value
    }
}

const findParent = (data, target, result) => {
    for (let item of data) {
        if (item.id === target?.id) {
            //将查找到的目标数据加入结果数组中
            result.unshift(item)
            return true
        }
        if (item.children && item.children.length > 0) {
            //根据查找到的结果往上找父级节点
            let isFind = findParent(item.children, target, result)
            if (isFind) {
                result.unshift(item)
                return true
            }
        }
    }
    //走到这说明没找到目标
    return false
}

const handleProps = (value) => {
    const arr = []
    findParent(geoList.value, value, arr)
    selectRef.value = arr.map((item, index) => {
        selectRef.list[0] = geoList.value
        if (item.children) {
            selectRef.list[index + 1] = item.children
        }

        return item.code
    })


}

const handleSelect = (_, node) => {
    delete node.children
    emit('update:value', node)
    emit('change', node)
}

const handleChange = (_, options, index) => {
    selectRef.value = selectRef.value.map((item, idx) => {
        if (idx <= index) {
            return item
        } else {
            return undefined
        }
    })
    selectRef.list.length = index + 1
    if (options.children) {
        selectRef.list[index + 1] = options.children
        emit('update:value',{})
    } else {
        emit('update:value', options)
        emit('change', options)
    }
}



onMounted(() => {
    getTree()
})



watch(
    () => props.value,
    (val) => {
        console.log(props.value)
        if (val && JSON.stringify(val) !== "{}") {
            // console.log('props.value', props.value)
            if (props.type === 'tree') {
                _value.value = props.value?.code
                const arr = []
                findParent(geoList.value, val, arr)
                treeExpandedKeys.value = arr.map(item => item.code)
            } else {
                handleProps(val)
            }
        }

    },
    { deep: true }
)
</script>
<style lang="less" scoped>
.select {
    display: flex;
}
</style>
