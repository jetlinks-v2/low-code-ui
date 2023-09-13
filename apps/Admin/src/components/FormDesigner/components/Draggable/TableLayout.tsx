import Selection from '../Selection/index'
import './index.less'
import { withModifiers } from 'vue'
import { Table, AIcon, Input, Button, TableColumn, FormItem, Select } from 'jetlinks-ui-components'
import { cloneDeep, get, omit, set } from 'lodash-es'
import { useTool } from '../../hooks'
import generatorData from '../../utils/generatorData'
import { uid } from '../../utils/uid'

export default defineComponent({
    name: 'TableLayout',
    inheritAttrs: false,
    customOptions: {},
    props: {
        data: {
            type: Object,
            default: () => { }
        },
        parent: {
            type: Array,
            default: () => []
        },
        path: {
            type: Array,
            default: () => []
        },
        index: {
            type: Number,
            default: 0
        }
    },
    setup(props) {
        const designer: any = inject('FormDesigner')

        const { isEditModel, isDragArea, layoutPadStyle } = useTool()
        
        const _data = computed(() => {
            return props.data
        })

        const list = computed(() => {
            return props.data?.children || []
        })

        const _formItemProps = computed(() => {
            return props.data?.formItemProps
        })

        const __path = computed(() => {
            let _path: any[] = cloneDeep(props?.path || []);
            const _index: any = props.index || 0;
            if (unref(_formItemProps)?.name) {
                _path[_index] = unref(_formItemProps)?.name
            }
            return _path
        })

        const data = ref<any[]>(get(designer.formState, __path.value) || [{}])

        const handleAdd = () => {
            const _item = generatorData({
                type: props.data?.type + '-item',
                children: [],
                componentProps: {
                    name: '列名' + uid(6)
                },
                formItemProps: {
                    name: uid(6),
                    required: false,
                    rules: []
                }
            })
            designer.onAddChild(_item, props.data, false)
        }

        const onAddIndex = () => {
            const _index = unref(list).findIndex(item => item?.formItemProps?.name === 'index')
            if (_index === -1) {
                const _item = generatorData({
                    type: props.data?.type + '-item',
                    children: [],
                    componentProps: {
                        name: '索引',
                        width: 60,
                    },
                    formItemProps: {
                        name: 'index',
                        required: false,
                        rules: []
                    }
                })
                designer.onAddChild(_item, props.data, true)
            }
        }

        const onAddAction = () => {
            const _index = unref(list).findIndex(item => item?.formItemProps?.name === 'actions')
            if (_index === -1) {
                const _item = generatorData({
                    type: props.data?.type + '-item',
                    children: [],
                    componentProps: {
                        name: '操作',
                        width: 60,
                    },
                    formItemProps: {
                        name: 'actions',
                        required: false,
                        rules: []
                    }
                })
                designer.onAddChild(_item, props.data)
            }
        }

        const renderContent = (element: any, dt: any) => {
            if (element?.formItemProps?.name === 'index') {
                return (dt?.index || 0) + 1
            } else if (element?.formItemProps?.name === 'actions') {
                return <Button onClick={() => {
                    data.value.splice(dt?.index, 1)
                }} type="link" danger><AIcon type="DeleteOutlined" /></Button>
            } else {
                const _path1 = [...unref(__path), dt?.index, element.formItemProps.name]
                const _value = ref<any>(get(designer.formState, _path1))
                watch(
                    () => _value.value, 
                    (newValue) => {
                        set(designer.formState, _path1, newValue)
                    }, 
                    {
                        deep: true
                    }
                )
                return <FormItem class="table-item" {...omit(element?.formItemProps, 'label')} name={[unref(_formItemProps)?.name, dt.index, element?.formItemProps?.name]}>
                    {
                        element?.componentProps.type === 'select' ? 
                        <Select v-model:value={_value.value}></Select> : 
                        <Input v-model:value={_value.value} />
                    }
                </FormItem>
            }
        }

        return () => {
            return (
                <Selection {...useAttrs()} style={unref(layoutPadStyle)} hasDrag={true} hasDel={true} hasCopy={true} data={unref(_data)} parent={props.parent}>
                    <div class={'table'}>
                        <FormItem {...unref(_formItemProps)}>
                            <Table
                                pagination={false}
                                dataSource={data.value}
                            >
                                {
                                    unref(list).map(element => {
                                        return <TableColumn
                                            key={element.key}
                                            {...omit(element.componentProps, 'name')}
                                            v-slots={{
                                                title: () => {
                                                    return <Selection
                                                        class={
                                                            unref(isDragArea) && 'drag-area'
                                                        }
                                                        data={element}
                                                        tag="div"
                                                        hasCopy={!['actions', 'index'].includes(element?.formItemProps?.name)}
                                                        hasDel={true}
                                                        parent={unref(list)}
                                                    >
                                                        {element.componentProps?.name}
                                                    </Selection>
                                                },
                                                default: (dt: any) => {
                                                    return renderContent(element, dt)
                                                }
                                            }}
                                        />
                                    })
                                }
                            </Table>
                            <Button disabled={isEditModel.value} onClick={() => {
                                if (!isEditModel.value) {
                                    data.value.push({})
                                }
                            }} style={{ width: '100%', marginTop: '10px' }}><AIcon type="PlusOutlined" />新增</Button>
                            {
                                unref(isEditModel) &&
                                <div class="draggable-add">
                                    <div class="draggable-add-btn" style={{ width: '200px' }}>
                                        <span onClick={withModifiers(handleAdd, ['stop'])}>添加列</span>
                                        {
                                            !unref(list).find(item => item?.formItemProps?.name === 'index') &&
                                            <span onClick={withModifiers(onAddIndex, ['stop'])} style={{ marginLeft: '10px' }}>添加索引</span>
                                        }
                                        {
                                            !unref(list).find(item => item?.formItemProps?.name === 'actions') &&
                                            <span onClick={withModifiers(onAddAction, ['stop'])} style={{ marginLeft: '10px' }}>添加操作</span>
                                        }
                                    </div>
                                </div>
                            }
                        </FormItem>
                    </div>
                </Selection>
            )
        }
    }
})
