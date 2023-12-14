<template>
  <div>
    <ButtonConfig :value="target.componentProps.event" @change="onDataChange"/>
  </div>
</template>

<script setup lang='ts'>
import {useTarget} from "@LowCode/components/PageDesigner/hooks";
import ButtonConfig from '../ButtonConfig/index.vue'

const {target} = useTarget();

const emits = defineEmits(["refresh"]);

const onDataChange = (val: any) => {
  target.value.componentProps.event = val
  emits("refresh", target.value);
};
</script>