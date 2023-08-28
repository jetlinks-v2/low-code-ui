
<template>
    <div>
        <p>支持交互事件、样式配置</p>
        <div class="select">
            <j-select style="width: 100%;" v-model:value="language">
                <j-select-option value="javascript">JS</j-select-option>
                <j-select-option value="css">CSS</j-select-option>
            </j-select>
        </div>
        <EditorModal v-if="language==='javascript'" v-model:value="target.onChange" language="javascript"/>
        <EditorModal v-else v-model:value="target.componentProps.style" language="css"/>
    </div>
</template>

<script setup>
import { useTarget } from '../../../../hooks'

const language = ref('javascript')

const { target } = useTarget()



</script>

<style scoped lang='less'>
.select{
    margin-bottom: 5px;
}

</style>