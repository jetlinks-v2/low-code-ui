<template>
    <div>
        <p>支持交互事件、样式配置</p>
        <!-- <EditorModal /> -->
        <!-- onChange -->
        <j-button @click="onClick">提交</j-button>
    </div>
</template>

<script lang="ts" setup>
import { insertCustomCssToHead } from "../../../../utils/utils"
import { useTarget } from '../../../../hooks'

const { target } = useTarget()

const onClick = () => {
    insertCustomCssToHead({}, target.value.key)
}
</script>