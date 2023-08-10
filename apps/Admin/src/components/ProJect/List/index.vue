
<template>
  <div style="width: 600px;height: 600px;background-color: cadetblue;" >
    <ContextMenu type="empty">
      <div v-for="item in arr"  style="width: 100px;height: 100px;background-color: aliceblue;" >
        <ContextMenu type="list" :id="item.id" @select="handleChange">
          {{ item.name }}
        </ContextMenu>
      </div>
    </ContextMenu>
  </div>
</template>

<script setup lang='ts' name="List">
import ContextMenu from '../components/ContextMenu/index.vue'

const arr = [
  {
    id:'id1',
    name:'name1'
  },
  {
    id:'id2',
    name:'name2'
  }
]


const handleChange = (key:any,id:any)=>{
  console.log('---------',key,id)
}

</script>

<style scoped lang='less'></style>