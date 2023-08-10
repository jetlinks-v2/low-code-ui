
<template>
  <div style="width: 600px;height: 600px;background-color: cadetblue;" >
    <ContextMenu type="empty" @select="handleChange" >
      <div v-for="item in arr"  style="width: 100px;height: 100px;background-color: aliceblue;" >
        <ContextMenu type="list" :data="item" @select="handleChange">
          {{ item.name }}
        </ContextMenu>
      </div>
    </ContextMenu>
  </div>
  <InputModal v-if="visible" @close="visible = false" @save="onSave" :provider="provider"/>
</template>

<script setup lang='ts' name="List">
import ContextMenu from '../components/ContextMenu/index.vue'
import InputModal from '../components/Action/InputModal.vue'

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

const visible = ref<boolean>(false)
const provider = ref<string>('')


const onSave = (data)=>{
  console.log('data------',data)
}


const handleChange = (key:any,data:any)=>{
  console.log('---------',key,data)
  visible.value = true
  provider.value = key
}

</script>

<style scoped lang='less'></style>