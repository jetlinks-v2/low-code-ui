
<template>
   <j-modal visible :width="500" @cancel="emit('close')" @ok="onSave" :title="data?.id ? '编辑菜单' : '新增菜单'">
      <j-form :layout="'vertical'" ref="formRef" :model="modelRef">
         <j-form-item name="name" validateFirst :rules="[
            { max: 8, message: '最多输入8个字符' },
            { min: 2, message: '最少输入2个字符' },
            { required: true, message: '请输入菜单名称' },
         ]">
            <template #label>
               <span>菜单名称</span>
               <j-tooltip title="分组名称将应用于系统菜单名称、页面路径等位置，建议设置2-8个字符" >
                <AIcon type="ExclamationCircleOutlined" style="margin-left: 5px;"/>
              </j-tooltip>
            </template>
            <j-input v-model:value="modelRef.name" placeholder="请输入菜单名称" />
         </j-form-item>
         <j-form-item ref="uploadIcon" label="icon" name="icon" :rules="[
            {
               required: true,
               message: '请上传图标',
               trigger: 'change',
            },
         ]" style="flex: 0 0 186px">
            <div class="icon-upload has-icon" v-if="modelRef.icon">
               <AIcon :type="modelRef.icon" style="font-size: 90px" />
               <span class="mark" @click="dialogVisible = true">点击修改</span>
            </div>

            <div v-else @click="dialogVisible = true" class="icon-upload no-icon">
               <span>
                  <AIcon type="PlusOutlined" style="font-size: 30px" />
                  <!-- <p>点击选择图标</p> -->
               </span>
            </div>
         </j-form-item>
      </j-form>
   </j-modal>
   <SaveIcon v-if="dialogVisible" v-model:visible="dialogVisible" @confirm="(typeStr: string) => choseIcon(typeStr)" :selected="modelRef.icon"/>
</template>
   
<script setup lang='ts' name="Save">
import { randomString } from '@jetlinks/utils';
import SaveIcon from './SaveIcon.vue'
import { FormInstance } from 'ant-design-vue';

const props = defineProps({
   data: {
      type: Object,
      default: {}
   },
})
type Emits = {
   (e: 'ok', data: any): void;
   (e: 'close'): void
};
const emit = defineEmits<Emits>();
const uploadIcon = ref<FormInstance>();
const formRef = ref()

const modelRef = reactive({
   //  title: props.data.title || '',
   // id: props.data.id || '',
   name: props.data.name || '',
   icon: props.data.icon || ''
})

const dialogVisible = ref(false);

const choseIcon = (typeStr: string) => {
   modelRef.icon = typeStr;
   uploadIcon.value?.clearValidate();
}

const onSave = async()=>{
   const res = await formRef.value?.validate()
   if(res){
      const code =props.data.code ||  randomString(8)
      const id = props.data.id || randomString(16)
      emit('ok',{
         ...props.data,
         ...res,
         id,
         owner:'iot',
         code,
         url:`/preview/${id}`,
         children: props.data.children || []
      })
   }
}


// onMounted(()=>{
//    console.log('props',props.data)
// })
</script>
   
<style scoped lang='less'>
:deep(.ant-form-item-control-input-content) {
   .icon-upload {
      width: 100px;
      height: 100px;
      border: 1px dashed #d9d9d9;
      font-size: 14px;
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      cursor: pointer;
      transition: 0.5s;

      &:hover {
         border-color: #415ed1;
      }
   }

   .has-icon {
      position: relative;
      text-align: center;

      .mark {
         position: absolute;
         left: 0;
         top: 0;
         display: none;
         background-color: rgba(0, 0, 0, 0.35);
         color: #fff;
         width: 100%;
         height: 100%;
         font-size: 16px;
         align-items: center;
         justify-content: center;
      }

      &:hover .mark {
         display: flex;
      }
   }

   .no-icon {
      background-color: rgba(0, 0, 0, 0.06);
   }
}
</style>