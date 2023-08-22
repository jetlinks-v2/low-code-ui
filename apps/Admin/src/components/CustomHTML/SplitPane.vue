<script setup lang="ts">
import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'
</script>

<template>
  <splitpanes>
    <pane :size="60" :min-size="10">
      <splitpanes horizontal>
        <pane :size="80" :min-size="20">
          <slot name="editor"></slot>
        </pane>
        <pane :size="20" :min-size="10">
          <slot name="console"></slot>
        </pane>
      </splitpanes>
    </pane>
    <pane :size="40" :min-size="10">
      <slot name="preview"></slot>
    </pane>
  </splitpanes>
</template>

<style lang="less" scoped>
.splitpanes__pane {
  height: 100%;
  width: 100%;
}
:deep(.splitpanes__splitter) {
  background-color: #2a2a2a;
  position: relative;
  min-width: 2px;
  min-height: 2px;
}
:deep(.splitpanes__splitter):hover {
  background-color: #028bfc;
  min-width: 3px;
  min-height: 3px;
}
</style>
