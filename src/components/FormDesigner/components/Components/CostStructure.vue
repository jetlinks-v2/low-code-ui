<template>
  <j-form class="structure" layout="vertical">
    <j-button v-for="(i,index) in structure" class="structureBtn" :style="{ backgroundColor: select.includes(i.value) ? i.activeColor : '#d7d7d7' }" @click="()=>choseItem(i)">{{ i.label }}</j-button>
    <template v-for="i in structure" :model="formData">
        <j-row v-if="select.includes(i.value)" :gutter="[96]" style="margin-top: 20px;">
            <j-col :span="14">
                <j-form-item  :label="i.label"> 
                    <j-input :addonAfter="i.addonAfter"></j-input> 
                </j-form-item>
            </j-col>
            <j-col :span="8">
                <j-form-item  label="缴费周期"> 
                    <j-select :options="cycleOptions"></j-select> 
                </j-form-item>
            </j-col>
        </j-row>
    </template>
  </j-form>
</template>

<script lang="ts" setup>
const structure = [
    {
        label:'租金',
        value:'rent',
        activeColor:'#caf982',
        addonAfter:'元'
    },{
        label:'服务费',
        value:'service',
        activeColor:'#facd91',
        addonAfter:'元'
    },{
        label:'押金',
        value:'cashPledge',
        activeColor:'#ffff80',
        addonAfter:'元'
    },{
        label:'物业费',
        value:'propertyFee',
        activeColor:'#bbe7fb',
        addonAfter:'元/m²'
    },{
        label:'能源费',
        value:'energyCost',
        activeColor:'#e0bfff',
        addonAfter:'元/m²'
    },{
        label:'其他',
        value:'other',
        activeColor:'#b9ffff',
    }
]
const cycleOptions = [
    {
        label:'一次性',
        value:'once'
    },{
        label:'年付',
        value:'year'
    },{
        label:'半年付',
        value:'half'
    },{
        label:'季付',
        value:'season'
    },{
        label:'月付',
        value:'month'
    }
]

const select = ref<any>([])
const choseItem = (data:any)=>{
   const selectSet = new Set(select.value)
   if(selectSet.has(data.value)){
    selectSet.delete(data.value)
   }else{
    selectSet.add(data.value)
   }
   select.value = [...selectSet.values()]
}
</script>
<style lang="less" scoped>
.structure{
    .structureBtn{
        margin-right: 10px;
    }
}
:deep(.ant-input-group-addon){
    border: none;
    background-color: #fff;
}
</style>