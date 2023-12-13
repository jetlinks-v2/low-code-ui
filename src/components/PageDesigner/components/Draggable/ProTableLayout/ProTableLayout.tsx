import {ProTable, Ellipsis, Row, Col, AIcon, Space, Tooltip, Button, Popconfirm, Tag} from 'jetlinks-ui-components'
import Selection from '../../Selection/index'
import {defineComponent, withModifiers} from 'vue'
import {useTool, usePubsub, useLifeCycle, usePageProvider} from '../../../hooks'
import {request as axiosRequest} from '@jetlinks-web/core'
import DraggableLayout from '../DraggableLayout'
import generatorData from '@LowCode/components/PageDesigner/utils/generatorData'
import { h } from 'vue'
import '../index.less'
import {Card, BadgeStatus} from '@LowCode/components'
import {get} from "lodash-es";
import ProTableModal from '../../BaseComponent/MyModal';
import dayjs from 'dayjs'
// import {handleDataSourceFn} from "../../../utils/utils";
export default defineComponent({
    name: 'ProTableLayout',
    inheritAttrs: false,
    customOptions: {},
    props: {
        data: {
            type: Object,
            default: () => ({})
        },
        parent: {
            type: Array,
            default: () => []
        },
    },
    setup(props) {
        const {isDragArea, isEditModel, onAddChild, paramsUtil, _global} = useTool()
        const pageProvider = usePageProvider()
        const tableRef = ref()
        const isSelected = ref(false)
        const selectedRowKeys = ref([])

        const modalVisible = ref<boolean>(false)
        const dataModal = ref()

        const _data = computed(() => {
            return props.data
        })

        const $self = reactive({
            visible: true,
            params: {},
            dataSource: []
        })

        const _refFn = {
            selectedRowKeys,
            onReload: () => {
                if(unref(isEditModel)) return
                tableRef.value?.reload()
            },
            setIsSelected: (flag: boolean) => {
                if(unref(isEditModel)) return
                isSelected.value = flag
            },
            setVisible: (flag: boolean) => {
                if(unref(isEditModel)) return
                $self.visible = flag
            },
            setDataSource: (arr: any) => {
                if(unref(isEditModel)) return
                $self.dataSource = arr
            },
            setParams: (_obj: any) => {
                if(unref(isEditModel)) return
                $self.params = _obj
            }
        }
        const handleResponderFn = ($dep?: string, $depValue?: any) => {
            const _responder = props.data?.componentProps?.responder?.responder
            if (_responder) {
                const handleResultFn = new Function('$self', '$dep', '$depValue', _responder)
                handleResultFn($self, $dep, $depValue)
            }
        }

        usePubsub(props.data.key, $self, props.data?.componentProps?.responder?.dependencies, handleResponderFn, props.data?.name)
        const handleAdd = () => {
            const _item = generatorData({
                type: 'table-item',
                children: [],
                componentProps: {},
            })
            onAddChild(_item, props.data)
        }

        const buttonRender = () => {
            const headerChildren = (unref(_data)?.children || [])?.[0]
            if (headerChildren) {
                return (
                    <Selection
                        class={unref(isDragArea) && 'drag-area'}
                        data={headerChildren}
                        tag="div"
                        hasCopy={false}
                        hasDel={true}
                        parent={unref(_data)}
                    >
                        <DraggableLayout
                            data-layout-type={'table-item'}
                            data={headerChildren?.children || []}
                            parent={headerChildren}
                        />
                    </Selection>
                )
            } else {
                if (unref(isEditModel)) {
                    return <div class="draggable-add">
                        <div class="draggable-add-btn" onClick={withModifiers(() => {
                            handleAdd()
                        }, ['stop'])}><span>添加操作按钮</span>
                        </div>
                    </div>
                }
            }
        }

        const actionRender = (_actions: any[], _record: any) => {
            return <Space>
                {
                    _actions.map(item => {
                        const _props = {
                            danger: item.danger,
                            key: item.key,
                            icon: item.icon ? <AIcon type={item.icon}/> : ''
                        }
                        if (item.event) {
                            if (item.event?.type === 'confirm') {
                                return <Tooltip title={item?.text}>
                                    <Popconfirm title={item.event?.confirmText || '确认吗？'} onConfirm={() => {
                                        if (item.event?.okCode && !unref(isEditModel)) {
                                            const handleResultFn = new Function('record', 'refs', 'util', 'global', item.event?.okCode)
                                            handleResultFn(_record, {
                                                tableRef
                                            }, paramsUtil, _global)
                                        }
                                    }}>
                                        <Button type='link' {..._props} />
                                    </Popconfirm>
                                </Tooltip>
                            } else if (item.event?.type === 'modal' || item.event?.type === 'drawer') {
                                return <Tooltip title={item?.text}>
                                    <Button type='link' {..._props} onClick={() => {
                                        if (!unref(isEditModel)) {
                                            dataModal.value = {
                                                width: item.event?.width || 520,
                                                footerVisible: item.event?.footerVisible,
                                                data: _record,
                                                pageType: item.event?.pageType || 'form',
                                                code: item.event?.pageData,
                                                title: item.event?.title || item?.text,
                                                createdCode: item.event?.createdCode,
                                                okCode: item.event?.okCode,
                                                cancelCode: item.event?.cancelCode,
                                                modalType: item.event?.type || 'modal',
                                            }
                                            modalVisible.value = true
                                        }
                                    }}/>
                                </Tooltip>
                            } else {
                                return <Tooltip title={item?.text}><Button type='link' {..._props} onClick={() => {
                                    if (item.event?.okCode && !unref(isEditModel)) {
                                        const handleResultFn = new Function('record', 'refs', 'util', 'global', item.event?.okCode)
                                        handleResultFn(_record, {
                                            tableRef
                                        }, paramsUtil, _global)
                                    }
                                }}/></Tooltip>
                            }
                        }
                        return <Tooltip title={item?.text}><Button type='link' {..._props}/></Tooltip>
                    })
                }
            </Space>
        }

        const columns = computed(() => {
            const arr = props.data.componentProps.columns.map((item: any) => {
                if (item.render) {
                    item.scopedSlots = true
                }
                return item
            })
            if (props.data.componentProps?.action?.visible) {
                arr.push({
                    title: '操作',
                    dataIndex: 'jetlinks_actions',
                    scopedSlots: true,
                    width: props.data.componentProps?.action?.width || 200,
                    render: (record: any) => {
                        return actionRender(props.data.componentProps?.action?.actions || [], record)
                    }
                })
            }
            return arr
        })

        const _dataSource = computed(() => {
            return $self.dataSource || props.data.componentProps.dataSource
        })

        const columnsSlots = computed(() => {
            return columns.value?.reduce((prev: Record<string, any>, next) => {
                if (next.render) {
                    if(next.dataIndex === 'jetlinks_actions'){
                        prev[next.dataIndex] = next.render
                    } else {
                        const components = {
                            BadgeStatus,
                            Tag
                        }
                        const render = new Function('record', 'h', 'components', 'utils', next.render)
                        prev[next.dataIndex] = (record: any) => render(record, h, components, {})
                    }
                }
                return prev
            }, {}) || {}
        })

        const noPagination = computed(() => {
            return !props.data.componentProps.paginationSetting?.open
        })

        const hasRequest = computed(() => {
            const {request} = props.data.componentProps
            return !!request?.query && !isEditModel.value
        })

        const handleRequestFn = async (paramsData: any) => {
            const { request, handleResult } = props.data.componentProps
            const resp = await axiosRequest.post(request.query, paramsData)
            if (handleResult) {
                const handleResultFn = new Function('result', handleResult)
                resp.result = handleResultFn(resp.result)
            }
            return resp
        }

        const defaultParams = computed(() => {
            try {
                return JSON.parse(props.data.componentProps?.request?.defaultParams)
            } catch (e) {
                return undefined
            }
        })

        const _model = computed(() => {
            if (props.data.componentProps?.viewType?.model?.length === 2) {
                return {
                    model: '',
                    modelValue: props.data.componentProps?.viewType?.modelValue || 'TABLE'
                }
            }
            return {
                model: props.data.componentProps?.viewType?.model?.[0] || 'TABLE'
            }
        })

        const handleFn = (code: string, _record: any) => {
            if (!code) return ''
            const handleResultFn = new Function('record', 'util', code)
            return handleResultFn(_record, { dayjs })
        }

        const onSelectChange = (item: any, state: boolean) => {
            const arr = new Set(selectedRowKeys.value);
            if (state) {
                arr.add(item?.id);
            } else {
                arr.delete(item?.id);
            }
            selectedRowKeys.value = [...arr.values()];
        };

        const selectAll = (selected: Boolean, selectedRows: any,changeRows:any) => {
            if (selected) {
                changeRows.map((i: any) => {
                    if (!selectedRowKeys.value.includes(i.id)) {
                        selectedRowKeys.value.push(i.id)
                    }
                })
            } else {
                const arr = changeRows.map((item: any) => item.id)
                const _ids: string[] = [];
                selectedRowKeys.value.forEach((i: any) => {
                    if (!arr.includes(i)) {
                        _ids.push(i)
                    }
                })
                selectedRowKeys.value = _ids
            }
        }

        const statusConfig = (emphasisField: any, _record: any) => {
            if (emphasisField?.showStatus) {
                return {
                    showStatus: true,
                    status: get(_record, (emphasisField?.status || '')?.split('.')),
                    statusText: get(_record, (emphasisField?.statusText || '')?.split('.')),
                    statusColor: JSON.parse(emphasisField?.statusColor || "{}")
                }
            }
            return {
                showStatus: false
            }
        }

        const getButtonData = (arr: any[], _button: any[]) => {
            arr.forEach(item => { // 'table-item-actions'
                if (item.type === 'button') {
                    _button.push(item)
                }
                if (item.children?.length) {
                    getButtonData(item.children, _button)
                }
            })
        }

        const _actions = computed(() => {
            if (props.data?.componentProps?.action?.visible) {
                return (props.data.componentProps?.action?.actions || []).map(item => {
                    const _props = {
                        danger: item.danger,
                        key: item.key,
                        icon: item.icon,
                        text: item.text,
                    }
                    if (item.event) {
                        if (item.event?.type === 'confirm') {
                            return {
                                ..._props,
                                permissionProps: (_record: any) => ({
                                    tooltip: {
                                        title: item?.text,
                                    },
                                    popConfirm: {
                                        title: item.event?.confirmText || '确认吗？',
                                        onConfirm: async () => {
                                            if (item.event?.okCode && !unref(isEditModel)) {
                                                const handleResultFn = new Function('record', 'refs', 'util', 'global', item.event?.okCode)
                                                handleResultFn(_record, {
                                                    tableRef
                                                }, paramsUtil, _global)
                                            }
                                        },
                                    },
                                })
                            }
                        } else if (item.event?.type === 'modal' || item.event?.type === 'drawer') {
                            return {
                                ..._props,
                                permissionProps: (_record: any) => ({
                                    tooltip: {
                                        title: item?.text,
                                    },
                                    onClick: () => {
                                        if (!unref(isEditModel)) {
                                            dataModal.value = {
                                                data: _record,
                                                pageType: item.event?.pageType || 'form',
                                                code: item.event?.pageData,
                                                title: item.event?.title || item?.text,
                                                createdCode: item.event?.createdCode,
                                                okCode: item.event?.okCode,
                                                cancelCode: item.event?.cancelCode,
                                                modalType: item.event?.type || 'modal',
                                            }
                                            modalVisible.value = true
                                        }
                                    },
                                })
                            }
                        } else {
                            return {
                                ..._props,
                                permissionProps: (_record: any) => ({
                                    tooltip: {
                                        title: item?.text,
                                    },
                                    onClick: () => {
                                        if (item.event?.okCode && !unref(isEditModel)) {
                                            const handleResultFn = new Function('record', 'refs', 'util', 'global', item.event?.okCode)
                                            handleResultFn(_record, {
                                                tableRef
                                            }, paramsUtil, _global)
                                        }
                                    },
                                })
                            }
                        }
                    }
                    return _props
                })
            }
            return []
        })

        const cardRender = (_record: any) => {
            return <Card
                actions={_actions.value}
                record={_record}
                {...statusConfig(props.data.componentProps?.viewType?.cardConfig?.emphasisField, _record)}
                v-slots={{
                    img: () => {
                        return <img
                            width={80}
                            height={80}
                            src={props.data.componentProps?.viewType?.cardConfig?.customIcon || '/images/list-page/table-card-default.png'}/>
                    },
                    content: () => {
                        return <div>
                            <Ellipsis>
                                <h3>{handleFn(props.data.componentProps?.viewType?.cardConfig?.titleCode, _record)}</h3>
                            </Ellipsis>
                            <Row gutter={24}>
                                <Col span={12}>
                                    <div>{props.data.componentProps?.viewType?.cardConfig?.field1Title}</div>
                                    <Ellipsis>{handleFn(props.data.componentProps?.viewType?.cardConfig?.field1Code, _record)}</Ellipsis>
                                </Col>
                                <Col span={12}>
                                    <div>{props.data.componentProps?.viewType?.cardConfig?.field2Title}</div>
                                    <Ellipsis>{handleFn(props.data.componentProps?.viewType?.cardConfig?.field2Code, _record)}</Ellipsis>
                                </Col>
                            </Row>
                        </div>
                    }
                }}
            >
            </Card>
        }

        const {executionMounted} = useLifeCycle(props.data.componentProps, {..._refFn}, isEditModel)

        // handleDataSourceFn(props.data?.componentProps?.request || {}, unref(isEditModel)).then((_val: any) => {
        //     if (_val && Array.isArray(_val)) {
        //         $self.dataSource = _val
        //     }
        // })

        onMounted(() => {
            executionMounted()
            pageProvider.addRef?.(props.data.key, {..._refFn})
        })

        return () => {

            return (
                <Selection {...useAttrs()} hasDrag={true} hasDel={true} hasCopy={true} data={unref(_data)} parent={props.parent}>
                    <ProTable
                        ref={tableRef}
                        columns={columns.value}
                        dataSource={_dataSource.value}
                        {..._model.value}
                        params={$self.params}
                        noPagination={noPagination.value}
                        pagination={props.data.componentProps.paginationSetting?.pagination}
                        request={hasRequest.value ? handleRequestFn : undefined}
                        defaultParams={defaultParams.value}
                        rowSelection={
                            isSelected.value
                                ? {
                                    selectedRowKeys: selectedRowKeys.value,
                                    onSelect: onSelectChange,
                                    onSelectAll: selectAll,
                                    onSelectNone: () => selectedRowKeys.value = []
                                }
                                : false
                        }
                        v-slots={{
                            headerTitle: buttonRender,
                            card: cardRender,
                            ...columnsSlots.value
                        }}
                    >
                    </ProTable>
                    {modalVisible.value && <ProTableModal type={'table'} data={dataModal.value} onSave={(flag: boolean) => {
                        if (flag) {
                            tableRef.value?.reload()
                            modalVisible.value = false
                        }
                    }} onClose={() => {
                        modalVisible.value = false
                    }}/>}
                </Selection>
            )
        }
    }
})
