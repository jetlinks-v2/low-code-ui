import Selection from '../Selection/index'
import './index.less'
import { withModifiers } from 'vue'
import { Table, AIcon, Button, TableColumn, FormItem } from 'jetlinks-ui-components'
import { cloneDeep, get, omit, set } from 'lodash-es'
import { useProps, useTool } from '../../hooks'
import generatorData from '../../utils/generatorData'
import { uid } from '../../utils/uid'
import componentMap from '../../utils/componentMap'
import { queryOptions } from '../../utils/utils'

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
        },
        visible: {
            type: Boolean,
            default: true
        },
        editable: {
            type: Boolean,
            default: true
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

        const data = ref<any[]>([])

        watchEffect(() => {
            data.value = get(designer.formState, __path.value) || []
        })

        const handleAdd = () => {
            const _item = generatorData({
                type: props.data?.type + '-item',
                key: `table-item_${uid()}`,
                componentProps: {
                    name: '列名' + uid(6),
                    colSpan: 1,
                    align: 'left',
                },
                children: [
                    generatorData({
                        type: 'input',
                        name: '列名',
                        children: [],
                    })
                ]
            })
            designer.onAddChild(_item, props.data)
        }

        const onAddIndex = () => {
            const _index = unref(list).findIndex(item => {
                return item.children?.[0]?.type === 'table-item-index'
            })
            if (_index === -1) {
                const _item = generatorData({
                    type: props.data?.type + '-item',
                    children: [
                        generatorData({
                            type: 'table-item-index',
                            name: '',
                            children: []
                        })
                    ],
                    componentProps: {
                        name: '索引',
                        width: 60,
                        colSpan: 1,
                        align: 'left',
                    },
                })
                designer.onAddChild(_item, props.data, 'start')
            }
        }

        const onAddAction = () => {
            const _index = unref(list).findIndex(item => {
                return item.children?.[0]?.type === 'table-item-actions'
            })
            if (_index === -1) {
                const _item = generatorData({
                    type: props.data?.type + '-item',
                    componentProps: {
                        name: '操作',
                        width: 60,
                        colSpan: 1,
                        align: 'left',
                    },
                    children: [
                        generatorData({
                            type: 'table-item-actions',
                            name: '',
                            children: []
                        })
                    ],
                })
                designer.onAddChild(_item, props.data, 'end')
            }
        }

        const onChange = () => {
            designer?.onChange?.()
        }

        const componentRender = (dt: any, __data: any) => {
            const _path1 = [...unref(__path), dt?.index, __data?.formItemProps.name]
            const TypeComponent = componentMap[__data?.type || 'input']
            const _props = useProps(__data, unref(designer.formData), props.editable, designer.disabled, unref(designer.mode))
            const options = ref<any[]>(_props.componentProps.options)
            const treeData = ref<any[]>(_props.componentProps.treeData)
            const __value = ref<any>(get(designer.formState, _path1))

            if (!isEditModel.value && unref(designer.mode) && ['select', 'select-card', 'tree-select'].includes(__data?.type)) {
                queryOptions(__data.componentProps.source).then(resp => {
                    if (['select', 'select-card'].includes(__data?.type)) {
                        options.value = resp
                    } else {
                        treeData.value = resp
                    }
                })
            }

            return <FormItem class="table-item" {...omit(__data?.formItemProps, 'label')} name={[unref(_formItemProps)?.name, dt.index, __data?.formItemProps?.name]}>
                {
                    __data?.type === 'switch' ?
                        <TypeComponent
                            {..._props?.componentProps}
                            checked={__value.value}
                            onUpdate:checked={(newValue) => {
                                set(designer.formState, _path1, newValue)
                            }}
                            onChange={onChange}
                        /> : <TypeComponent
                            {..._props?.componentProps}
                            options={unref(options)}
                            treeData={unref(treeData)}
                            value={__value.value}
                            onUpdate:value={(newValue) => {
                                set(designer.formState, _path1, newValue)
                            }}
                            onChange={onChange}
                        />
                }
            </FormItem>
        }

        const renderContent = (element: any, dt: any) => {
            if (element.children?.[0]?.type === 'table-item-index') {
                return (dt?.index || 0) + 1
            } else if (element.children?.[0]?.type === 'table-item-actions') {
                return <Button onClick={() => {
                    data.value.splice(dt?.index, 1)
                }} type="link" danger><AIcon type="DeleteOutlined" /></Button>
            } else {
                return componentRender(dt, element?.children?.[0])
            }
        }

        const editContent = (element: any, dt: any) => {
            return <Selection
                class={
                    unref(isDragArea) && 'drag-area'
                }
                data={element}
                tag="div"
                hasCopy={!['table-item-index', 'table-item-actions'].includes(element.children?.[0]?.type)}
                hasDel={true}
                hasMask={true}
                parent={unref(list)}
            >
                {renderContent(element, dt)}
            </Selection>
        }

        return () => {
            return (
                <Selection {...useAttrs()} style={unref(layoutPadStyle)} hasDrag={true} hasDel={true} hasCopy={true} data={unref(_data)} parent={props.parent}>
                    <div class={'table'}>
                        <FormItem {...unref(_formItemProps)} validateFirst={true}>
                            <Table
                                pagination={false}
                                dataSource={isEditModel.value ? [{}] : data.value}
                                scroll={{ y: props.data.componentProps?.height, x: 'max-content' }}
                            >
                                {
                                    unref(list).map(element => {
                                        return <TableColumn
                                            key={element.key}
                                            {...omit(element.componentProps, ['name', 'align'])}
                                            align={element?.componentProps?.align || props.data.componentProps?.align}
                                            v-slots={{
                                                title: () => {
                                                    return element.componentProps?.name
                                                },
                                                default: (dt: any) => {
                                                    return editContent(element, dt)
                                                }
                                            }}
                                        />
                                    })
                                }
                            </Table>
                            {
                                !unref(isEditModel) && <Button onClick={() => {
                                    data.value.push({})
                                }} style={{ width: '100%', marginTop: '10px' }}><AIcon type="PlusOutlined" />新增</Button>
                            }
                            {
                                unref(isEditModel) &&
                                <div class="draggable-add">
                                    <div class="draggable-add-btn" style={{ width: '200px' }}>
                                        <span onClick={withModifiers(handleAdd, ['stop'])}>添加列</span>
                                        {
                                            !unref(list).find(item => item.children?.[0]?.type === 'table-item-index') &&
                                            <span onClick={withModifiers(onAddIndex, ['stop'])} style={{ marginLeft: '10px' }}>添加索引</span>
                                        }
                                        {
                                            !unref(list).find(item => item.children?.[0]?.type === 'table-item-actions') &&
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
