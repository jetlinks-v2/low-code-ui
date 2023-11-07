
<template>
    <j-modal visible :width="type === 'submit' ? 900 : 400" :footer="null" @cancel="emit('close')">
        <j-form :layout="'vertical'" ref="formRef" :model="modelRef" v-if="type !== 'submit'">
            <div class="title">{{ title }}</div>
            <div>
                <!-- <div style="margin-bottom: 10px;" v-if="type === 'refuse'"> 驳回后将结束流程</div> -->
                <j-form-item name="comment" label="审批意见" :rules="required ? [
                    { required: true, message: '请填写审批意见' }
                ] : []">
                    <j-textarea v-model:value="modelRef.comment" placeholder="请填写审批意见" :maxlength="200" showCount />
                </j-form-item>
                <div class="footer">
                    <j-button style="margin-right: 20px;" @click="emit('close')">取消</j-button>
                    <j-button type="primary" @click="onSave">确定</j-button>
                </div>
            </div>
        </j-form>
        <div v-else>
            <!-- <j-form-item name="user" label="您可以指定下一个节点的办理人">
                    <j-select v-model:value="modelRef.user" placeholder="请选择" :options="approverOptions">
                    </j-select>
                </j-form-item> -->
            <span>您可以指定下一个节点的审批人</span>
            <j-tabs v-model:activeKey="activeKey">
                <j-tab-pane v-for="item in tabs" :key="item.key" :tab="item.tab">
                    <Select :type="item.key" :user=user :candidates="candidates" @selected="selectUser" />
                </j-tab-pane>
            </j-tabs>
            <div class="footer">
                    <j-button style="margin-right: 20px;" @click="emit('close')">取消</j-button>
                    <j-button type="primary" @click="onSave">确定</j-button>
                </div>
        </div>
    </j-modal>
</template>

<script setup lang='ts'>
import Select from './Select.vue';
import { onlyMessage } from '@jetlinks/utils'
const props = defineProps({
    type: {
        type: String,
        default: 'pass'
    },
    current: {
        type: Object,
        default: {}
    },
    required: {
        type: Boolean,
        default: false
    },
    taskId: {
        type: String,
        default: ''
    },
    candidates: {
        type: Object,
        default: {}
    },
    defaultComment: {
        type: String,
        default: ''
    }
})
type Emits = {
    (e: 'save', data: any): void;
    (e: 'close'): void
};
const emit = defineEmits<Emits>();
const activeKey = ref('org')
const tabs = [{
    key: 'org',
    tab: '组织'
}, {
    key: 'role',
    tab: '角色'
},
    // {
    //     key:'user',
    //     tab:'用户'
    // }
]
const user = ref()
const formRef = ref()
const modelRef = reactive({
    comment: props?.defaultComment || undefined,
    user: 'none'
})
const approverOptions = ref<any[]>([{
    label: '不指定',
    value: undefined
}])
const title = computed(() => {
    if (props.type === 'pass') {
        return '通过'
    } else if (props.type === 'submit') {
        return '提交'
    } else {
        return '驳回'
    }
})

const selectUser = (data) => {
    user.value = data
}
const onSave = async () => {
    if (props.type !== 'submit') {
        const res = await formRef.value.validate()
        if (res) {
            emit('save', res)
            emit('close')
        }
    }
    if (props.type === 'submit') {
        emit('save', user.value)
    }
}

</script>

<style scoped lang='less'>
.title {
    font-size: 18px;
    margin-bottom: 20px;
    font-weight: 500;
    line-height: 24px;
    color: #333333;
}

.footer {
    text-align: right;
    margin-top: 35px;
}
</style>