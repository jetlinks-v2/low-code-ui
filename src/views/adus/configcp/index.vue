<!-- 增删改查/高级配置 -->
<template>
    <div class="int-cap" @click="intCapClick(true)">查看接口能力</div>
    <div class="box-div">
        <a-card style="width: 100%">
            <template #extra>
                <a-switch v-model:checked="checkedA" @change="changeA" />
            </template>
            <template #title>开启关系
                <a-tooltip placement="top">
                    <template #title>
                        <span>开启关系后，平台被关联方和关联方同时增加一条数据</span>
                    </template>
                    <AIcon :type="'QuestionCircleOutlined'" />
                </a-tooltip>


            </template>
            <div v-if="checkedA" class="checkedA">
                <table>
                    <tr>
                        <th style="width: 50%;">关系标识</th>
                        <th style="width: 50%;">关系名称</th>
                    </tr>
                    <tr>
                        <td style="text-align: center;">
                            <a-select style="width: 100%" :value="'jack'" :disabled="true">
                                <a-select-option value="jack">Jack</a-select-option>
                                <a-select-option value="disabled" disabled>Disabled</a-select-option>
                            </a-select>
                        </td>
                        <td style="text-align: center;">
                            <a-input placeholder="请为关系命名" :maxlength="16" />
                        </td>
                    </tr>
                </table>
            </div>

        </a-card>
        <a-card style="width: 100%;margin: 20px 0;">
            <template #extra>
                <a-switch v-model:checked="checkedB" @change="changeB" />
            </template>
            <template #title>树形结构</template>
            <div v-if="checkedB">
                <p>card content</p>
                <p>card content</p>
                <p>card content</p>
            </div>

        </a-card>
        <a-card style="width: 100%">
            <template #extra>
                <a-switch v-model:checked="checkedC" @change="changeC" />
            </template>
            <template #title>开启资产</template>
            <div v-if="checkedC" class="checkedC">
                <a-tabs v-model:activeKey="activeKey" type="card">
                    <a-tab-pane key="1" tab="设为资产">
                        <table>
                            <tr>
                                <th style="width: 50%;">资产标识</th>
                                <th style="width: 50%;">资产名称</th>
                            </tr>
                            <tr>
                                <td style="text-align: center;">
                                    <a-select style="width: 100%" :disabled="true" :value="'jack'">
                                        <a-select-option value="jack">Jack</a-select-option>
                                        <a-select-option value="disabled" disabled>Disabled</a-select-option>
                                    </a-select>
                                </td>
                                <td style="text-align: center;">
                                    <a-input placeholder="请输入资产名称" :maxlength="16" />
                                </td>
                            </tr>
                        </table>
                    </a-tab-pane>
                    <a-tab-pane key="2" tab="间接资产">

                        <table>
                            <tr>
                                <th style="width: 50%;">当前表字段</th>
                                <th style="width: 50%;">资产标识</th>
                            </tr>
                            <tr>
                                <td style="text-align: center;">
                                    <a-select style="width: 100%" v-model:value="vl2">
                                        <a-select-option value="jack">Jack</a-select-option>
                                        <a-select-option value="disabled">Disabled</a-select-option>
                                    </a-select>

                                </td>
                                <td style="text-align: center;">
                                    <a-select style="width: 100%" v-model:value="vl3">
                                        <a-select-option value="jack">Jack</a-select-option>
                                        <a-select-option value="disabled">Disabled</a-select-option>
                                    </a-select>
                                </td>
                            </tr>
                        </table>
                    </a-tab-pane>

                </a-tabs>
            </div>

        </a-card>
    </div>
    <detail v-if="showDetail" @cancelModal="cancelModal"></detail>
</template>
<script lang="ts" setup name="configcp" >
import { ref } from 'vue';
import detail from './components/detail.vue'
const activeKey = ref('1');
const checkedA = ref<boolean>(true);
const checkedB = ref<boolean>(true);
const checkedC = ref<boolean>(true);
const showDetail = ref(false)
const vl2 = ref('jack')
const vl3 = ref('jack')

const changeA = (value: boolean) => {
    console.log('changeA', value);
}

const changeB = (value: boolean) => {
    console.log('changeB', value);

}
const changeC = (value: boolean) => {
    console.log('changeC', value);

}
// 查看接口能力
const intCapClick = (mark: boolean) => {
    console.log('查看接口能力');
    showDetail.value = mark

}
const cancelModal = (mark: boolean) => {
    showDetail.value = mark
}
</script>
<style lang="less" scoped>
.int-cap {
    color: #777;
    margin-bottom: 10px;
    text-align: right;
    cursor: pointer;
    user-select: none;
}

.int-cap:hover {
    color: black;
}

.checkedA,
.checkedC {

    table,
    th,
    td {
        border: 1px solid #e7e7e7;
        padding: 10px;
    }

    table {
        width: 100%;
    }

    th {
        height: 40px;
    }
}
</style>