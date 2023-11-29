import {ProTable, Ellipsis, Row, Col, AIcon, Space, Tooltip, Button} from 'jetlinks-ui-components'
import Selection from '../../Selection/index'
import { defineComponent, withModifiers } from 'vue'
import {useTool, usePageDependencies, usePageProvider} from '../../../hooks'
import { request as axiosRequest } from '@jetlinks-web/core'
import DraggableLayout from '../DraggableLayout'
import generatorData from '@LowCode/components/PageDesigner/utils/generatorData'
import '../index.less'
import {Card} from '@LowCode/components'
import {get} from "lodash-es";

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
        const { isDragArea, isEditModel, onAddChild } = useTool()
        const pageProvider = usePageProvider()
        const { dependencies: params } = usePageDependencies(props.data.componentProps?.responder?.dependencies)
        const route = useRoute()
        const tableRef = ref()

        const _data = computed(() => {
            return props.data
        })

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

        const actionRender = (_actions: any[]) => {
            return <Space>
                {
                    _actions.map(item => {
                        const _props = {
                            danger: item.danger,
                            key: item.key,
                            icon: item.icon ? <AIcon type={item.icon}/> : ''
                        }
                        return <Tooltip title={item?.text}><Button type='link' {..._props} /></Tooltip>
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
                    render: () => {
                        return actionRender(props.data.componentProps?.action?.actions || [])
                    }
                })
            }
            return arr
        })

        const dataSource = computed(() => {
            return props.data.componentProps.dataSource
        })

        const columnsSlots = computed(() => {
            return columns.value?.reduce((prev: Record<string, any>, next) => {
                if (next.render) {
                    prev[next.dataIndex] = next.render
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
            const handleResultFn = new Function('record', code)
            return handleResultFn.call(this, _record)
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
                // TODO: 卡片actions处理
                return props.data.componentProps?.action?.actions || []
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

        const onCreatedFn = (code?: string) => {
            if (code && !isEditModel.value) {
                const context = {
                    context: pageProvider.context,
                    axios: axiosRequest,
                    route: route,
                    refs: {
                        tableRef
                    }
                }
                const fn = new Function('context', code)
                fn(context)
            }
        }

        onCreatedFn(props.data.componentProps?.onCreated)

        onMounted(() => {
            onCreatedFn(props.data.componentProps?.onCreated)
        })

        return () => {

            return (
                <Selection {...useAttrs()} hasDrag={true} hasDel={true} hasCopy={true} data={unref(_data)} parent={props.parent}>
                    <ProTable
                        ref={tableRef}
                        columns={columns.value}
                        dataSource={dataSource.value}
                        {..._model.value}
                        params={params.value}
                        noPagination={noPagination.value}
                        pagination={props.data.componentProps.paginationSetting?.pagination}
                        request={hasRequest.value ? handleRequestFn : undefined}
                        defaultParams={defaultParams.value}
                        v-slots={{
                            headerTitle: buttonRender,
                            card: cardRender,
                            ...columnsSlots.value
                        }}
                    >
                    </ProTable>
                </Selection>
            )
        }

    }
})
