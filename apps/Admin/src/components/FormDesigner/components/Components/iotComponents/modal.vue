<template>
  <j-modal title="名称" visible @cancel="closeModal" :width="1000" @ok="submitData">
    <pro-search type="simple" :columns="columns" @search="handleSearch"></pro-search>
    <JProTable
        :columns="columns"
        :request="type === 'product' ? queryProductList : queryDeviceList"
        ref="tableRef"
        :defaultParams="{
        sorts: [{ name: 'createTime', order: 'desc' }],
        }"
        :params="params"
        :gridColumn="2"
        :gridColumns="[2]"
        :rowSelection="{
                              selectedRowKeys: _selectedRowKeys,
                              onSelect: onSelectChange,
                              onSelectNone: onSelectNone,
                              onSelectAll: onAllSelect
                          }"
        class="table"
      >
      <template #card="slotProps">
                    <Card
                        :value="slotProps"
                        v-bind="slotProps"
                        :status="slotProps.state"
                        :active="_selectedRowKeys.includes(slotProps.id)"
                        @click="()=>onSelectChange(slotProps)"
                        :statusText="slotProps.state === 1 ? '正常' : '禁用'"
                        :statusNames="{
                            1: 'processing',
                            0: 'error',
                        }" 
                    >
                        <template #img>
                            <slot name="img">
                                <img
                                    :src="
                                        slotProps.photoUrl ||
                                      ''
                                    "
                                    class="productImg"
                                />
                            </slot>
                        </template>
                        <template #content>
                            <j-ellipsis style="width: calc(100% - 100px); margin-bottom: 18px;"
                                ><span
                                    style="font-weight: 600; font-size: 16px"
                                >
                                    {{ slotProps.name }}
                                </span></j-ellipsis 
                            >
                            <j-row>
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        ID
                                    </div>
                                    <div>{{ slotProps?.id}}</div>
                                </j-col>
                            </j-row>
                        </template>
                    </Card>
                </template>
                <template #state="slotProps">
                    <BadgeStatus
                        :text="slotProps.state === 1 ? '正常' : '禁用'"
                        :status="slotProps.state"
                        :statusNames="{
                            1: 'processing',
                            0: 'error',
                        }"
                    />
                </template>
    </JProTable>
  </j-modal>
</template>

<script lang="ts" setup>
import { queryProductList,queryDeviceList } from '@/api/form'
import { inject } from 'vue'
const props = defineProps({
  select:{
    type: Array,
    default: []
  },
})
const type = inject('type')
const columns = [
{
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        scopedSlots: true,
        width: 200,
        ellipsis: true,
        search:{
          type:'string'
        }
    },
    {
        title: '产品名称',
        dataIndex: 'name',
        key: 'name',
        width: 220,
        ellipsis: true,
        search:{
          type:'string'
        }
    },{
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        ellipsis: true,
        width: 90,
        search:{
          type:'select',
          options: [
                    {
                        label: '正常',
                        value: 1,
                    },
                    {
                        label: '禁用',
                        value: 0,
                    },
                ],
        }
    },
]
const _selectedRowKeys:any = ref([])
const emit = defineEmits(['close','updateData'])
const params = ref()
const handleSearch = () =>{

}
let selectData:any = []
const onSelectChange = (row: any) => {
    const arr = new Set(_selectedRowKeys.value);
    const index = _selectedRowKeys.value.indexOf(row.id);
    if(index === -1){
        arr.add(row.id)
        selectData.push({
          name:row.name,
          id:row.id
        })
    }else{
        arr.delete(row.id)
        selectData.splice(index,1)
    }
    _selectedRowKeys.value = [...arr.values()];
};

const onSelectNone = () => {
    _selectedRowKeys.value = [];
    selectData = []
};

const onAllSelect = (selected: Boolean, selectedRows: any,changeRows:any) => {
    if (selected) {
            changeRows.map((i: any) => {
                if (!_selectedRowKeys.value.includes(i.id)) {
                    _selectedRowKeys.value.push(i.id)
                    selectData.push({
                      name:i.name,
                      id:i.id
                    })
                }
            })
        } else {
            const arr = changeRows.map((item: any) => item.id)
            const _ids: string[] = [];
            const _row: any[] = [];
            selectData.map((i: any) => {
                if (!arr.includes(i.id)) {   
                    _ids.push(i.id)
                    _row.push({
                      name:i.name,
                      id:i.id
                    })
                }
            })
            _selectedRowKeys.value = _ids;
            selectData = _row;
        }     
}
const closeModal = () =>{
  emit('close')
}

const submitData = () =>{
  emit('updateData',selectData)
}

onMounted(()=>{
  if(props.select.length){
    selectData = props.select 
    _selectedRowKeys.value =  props.select.map((item:any)=>{
      return item.id
    })
  }
})
</script>
<style lang="less" scoped>
.table {
    height: 400px;
    overflow: auto;
    min-height: auto;
}
</style>