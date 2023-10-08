
<template>
    <div>
        <div class="title"> 王刚的请假审批单</div>
        <div class="items">
            <j-scrollbar>
                <j-form :layout="'vertical'" ref="formRef" :model="modelRef">
                    <j-form-item label="请假类型" name="type" validateFirst :rules="[
                        { required: true, message: '请选择请假类型' }
                    ]">
                        <j-select v-model:value="modelRef.type" placeholder="请选择请假类型">
                            <j-select-option value="start">病假</j-select-option>
                        </j-select>
                    </j-form-item>
                    <j-form-item label="请假类型" name="type" validateFirst :rules="[
                        { required: true, message: '请选择请假类型' }
                    ]">
                        <j-select v-model:value="modelRef.type" placeholder="请选择请假类型">
                            <j-select-option value="start">病假</j-select-option>
                        </j-select>
                    </j-form-item>
                    
                    <j-form-item label="起止时间" name="time" validateFirst :rules="[
                        { required: true, message: '请选择起止时间' },
                    ]">
                        <j-range-picker v-model:value="modelRef.time" show-time />
                    </j-form-item>
                    <j-form-item label="起止时间" name="time" validateFirst :rules="[
                        { required: true, message: '请选择起止时间' },
                    ]">
                        <j-range-picker v-model:value="modelRef.time" show-time />
                    </j-form-item>
                    <j-form-item label="起止时间" name="time" validateFirst :rules="[
                        { required: true, message: '请选择起止时间' },
                    ]">
                        <j-range-picker v-model:value="modelRef.time" show-time />
                    </j-form-item>
                    <j-form-item label="起止时间" name="time" validateFirst :rules="[
                        { required: true, message: '请选择起止时间' },
                    ]">
                        <j-range-picker v-model:value="modelRef.time" show-time />
                    </j-form-item>

                    <j-form-item label="起止时间" name="time" validateFirst :rules="[
                        { required: true, message: '请选择起止时间' },
                    ]">
                        <j-range-picker v-model:value="modelRef.time" show-time />
                    </j-form-item>
                    <j-form-item label="起止时间" name="time" validateFirst :rules="[
                        { required: true, message: '请选择起止时间' },
                    ]">
                        <j-range-picker v-model:value="modelRef.time" show-time />
                    </j-form-item>
                    <j-form-item label="起止时间" name="time" validateFirst :rules="[
                        { required: true, message: '请选择起止时间' },
                    ]">
                        <j-range-picker v-model:value="modelRef.time" show-time />
                    </j-form-item>
                    <j-form-item label="请假类型" name="type" validateFirst :rules="[
                        { required: true, message: '请选择请假类型' }
                    ]">
                        <j-select v-model:value="modelRef.type" placeholder="请选择请假类型">
                            <j-select-option value="start">病假</j-select-option>
                        </j-select>
                    </j-form-item>
                </j-form>
            </j-scrollbar>
        </div>
        <div class="bottom">
            <j-button danger class="btn">驳回</j-button>
            <j-button  type="primary" class="btn">通过</j-button>
            <j-button  type="primary" class="btn">保存</j-button>
        </div>
    </div>
</template>

<script setup lang='ts'>

const props = defineProps({
    current: {
        type: Object,
        default: {}
    }
})

const formRef = ref()
const modelRef = reactive({
    type: undefined,
    time: undefined,
    url: undefined,
    description: ''
})

</script>

<style scoped lang='less'>
.title {
    width: 100%;
    text-align: center;
    margin-bottom: 5px;
    font-size: 20px;
}
.items{
    height: calc(100vh - 240px);
    background-color: #EEE;
    padding: 12px;
}
.bottom{
    margin-top: 10px;
    .btn{
        margin-right: 15px;
    }
}
</style>