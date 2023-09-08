// import DragGableWrap from '../../Draggable/DragGableWrap'
import './index.less';
import { Card, AIcon, Scrollbar, Empty, Dropdown, Menu, MenuItem, Button, Modal } from 'jetlinks-ui-components';
// import { cloneDeep } from 'lodash-es';
import { useProduct } from '@/store';
// import { uid } from '@/components/FormDesigner/utils/uid';
import { withModifiers } from 'vue';
import { uid } from '@/components/FormDesigner/utils/uid';
import { map } from 'lodash-es';
import { copyDataByKey } from '@/components/FormDesigner/utils/utils';

const Template = defineComponent({
    name: 'Template',
    inheritAttrs: false,
    setup() {
        const product = useProduct()
        const designer: any = inject('FormDesigner')

        const list = computed(() => {
            return product.data?.[0]?.others?.formTemplate || []
        })

        // const handleClone = (element) => {
        //     // TODO 多个数据拖拽
        //     return cloneDeep({
        //         ...element.template?.[0],
        //         key: `${element.template?.[0]?.type}_${uid()}_template`
        //     })
        // }

        const renderContent = (element) => {
            return <Dropdown
                trigger={['contextmenu']}
                onContextmenu={withModifiers(() => { }, ['stop'])}
                v-slots={{
                    overlay: () => {
                        return (
                            <Menu>
                                <MenuItem key="delete"><Button danger type="link" onClick={() => {
                                    Modal.confirm({
                                        title: '确定删除模板及其配置？',
                                        okText: '确认',
                                        cancelText: '取消',
                                        onOk() {
                                            const arr = product.data?.[0]?.others?.formTemplate || []
                                            const _index = arr.findIndex(item => item.key === element.key)
                                            arr.splice(_index, 1)
                                            const _data = {
                                                ...product.data?.[0],
                                                others: {
                                                    ...product.data?.[0]?.others,
                                                    formTemplate: arr
                                                }
                                            }
                                            product.update(_data)
                                        },
                                    });

                                }}>删除</Button></MenuItem>
                            </Menu>
                        )
                    }
                }}
            >
                <Card hoverable>
                    <div class="filed-item-card-item">
                        <AIcon type="AppstoreFilled" style={{ fontSize: '25px' }} />
                        <span>{element?.name}</span>
                    </div>
                </Card>
            </Dropdown>
        }

        const slots = {
            item: ({ element }) => {
                return (
                    <div class="filed-item-card">
                        {renderContent(element)}
                    </div>
                )
            }
        }

        // const options = {
        //     animation: 150,
        //     direction: 'horizontal',
        //     scroll: false,
        //     sort: false,
        //     group: { name: "j-canvas", pull: 'clone', put: false },
        //     ghostClass: 'ghost',
        //     clone: handleClone
        // }
        // <DragGableWrap
        //     list={list.value}
        //     {...options}
        //     class={"filed-item-children"}
        //     tag={'div'}
        //     v-slots={slots}
        //     item-key="template"
        //     data-layout-type={'filed-item'}
        // ></DragGableWrap>

        return () => {
            return (
                <Scrollbar height={'100%'}>
                    <div class="filed-template">
                        {
                            list.value.length ?
                                list.value.map(item => {
                                    return <div class={"filed-item-children"} onClick={() => {
                                        if (item?.template?.length) {
                                            const arr = (item?.template || []).map(i => {
                                                return {
                                                    ...i,
                                                    key: `${i?.type}_${uid()}_template`
                                                }
                                            })
                                            if (!designer.selected.value?.length || map(designer.selected.value, 'key').includes('root')) {
                                                designer.formData.value = {
                                                    ...designer.formData.value,
                                                    children: [...designer.formData.value?.children, ...arr],
                                                }
                                            } else {
                                                const dt = designer.selected.value[designer.selected.value.length - 1]
                                                const children = copyDataByKey(designer.formData.value?.children, arr, dt)
                                                designer.formData.value = {
                                                    ...designer.formData.value,
                                                    children
                                                }
                                            }
                                            designer.setSelection(arr?.[arr.length - 1] || 'root')
                                        }
                                    }}>
                                        {slots.item({ element: item })}
                                    </div>
                                })
                                : <Empty style={{ marginTop: '200px' }} />
                        }
                    </div>
                </Scrollbar>
            )
        };
    },
});

export default Template;