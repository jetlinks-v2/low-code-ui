<template>
  <div class="engine">
    <Header />
    <DragContent>
      <div class="engine-warp">
        <Tree />
        <Content />
      </div>
    </DragContent>
    <div class="footer">
      <j-scrollbar>
        <div class="items">
          <div v-for="(item, index) in path" class="item">
            <div class="icon"><img :src="typeImages[item.type]"></div>
            <div class="title" @click="onClick(item)">{{ item.title }}</div>
            <div v-if="path.length !== index + 1" class="path"> > </div>
          </div>
        </div>
      </j-scrollbar>
    </div>
  </div>
</template>

<script setup name="Engine">
import { Header, Tree, Content } from './components'
import { typeImages } from '@LowCode/components/ProJect/index'
import { useEngine, useProduct } from '@LowCode/store'
import {storeToRefs} from "pinia";
import { DragContent } from '@LowCode/components/index'
import { omit} from 'lodash-es'

const engine = useEngine()
const product = useProduct()
const path = ref([])

const { files, activeFile } = storeToRefs(engine)

const onClick = (data) => {
  engine.selectFile(data.id)
  engine.addFile(data)
}

watch(() => activeFile.value, () => {
  path.value = product.getParent({ id: activeFile.value })
}, { immediate: true })

// onBeforeRouteLeave((to, form, next) => {
//   console.log('to===', to)
//    const item =  omit(product.data[0], ['children'])
//    console.log('item===',item,product.data[0])
//   // product.update({
//   //   ...item,
//   //   others: {
//   //     ...item?.others,
//   //     activeFile: activeFile.value,
//   //     files: files.value
//   //   }
//   // },()=>{
//     // next()
//   // })    
// })

</script>

<style scoped lang="less">
.engine {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;

  .engine-warp {
    display: flex;
    height: calc(100% - 56px);
  }

  .footer {
    display: flex;
    border-top: 1px solid #D9D9D9;
    user-select: none;
    height: 44px;
    line-height: 44px;
    width: 100%;
    padding: 0 10px;
    align-items: center;
    font-size: 16px;

    .items {
      display: flex;
      width: 100%;

      .item {
        display: flex;
        white-space: nowrap;

        .icon {
          margin: 0 5px;
          width: 22px;
          height: 22px;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .title {
          cursor: pointer;
        }

        .path {
          margin: 0 12px;
        }
      }
    }
  }
}
</style>
