import { ProTable, Button } from 'jetlinks-ui-components'
import Selection from '../../Selection/index'
import { defineComponent, inject } from 'vue'
import { useTool, usePageProvider } from '../../../hooks'
import TableSkeleton from './Skeleton'

export default defineComponent({
    name: 'ProTableLayout',
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
    },
    setup(props) {
        const { isDragArea, isEditModel } = useTool()
        const PageProvider = usePageProvider()

        const _data = computed(() => {
            return props.data
        })

        const columns = computed(() => {
            return props.data.componentProps.columns
        })

        const dataSource = computed(() => {
            return props.data.componentProps.dataSource
        })

        const params = computed(() => {
            return PageProvider.context.params
        })

        const columnsSlots = computed(() => {
            return props.data.componentProps.columns?.reduce((prev: Record<string, Function>, next) => {
                if (next.render) {
                    prev[next.dataIndex] = next.render
                }
                return prev
            }, {}) || {}
        })

        const noPagination = computed(() => {
            return !props.data.componentProps.paginationSetting?.open
        })

        const headerTitleRender = () => {
            return (
                <Selection {...useAttrs()}>
                    <Button type="dashed" style={{ width: '100px' }}>+</Button>
                </Selection>
            )
        }

        return () => {
            return (
                <Selection {...useAttrs()} hasDrag={true} hasDel={true} hasCopy={true} data={unref(_data)} parent={props.parent}>
                    <ProTable
                        columns={columns.value}
                        dataSource={dataSource.value}
                        modelValue={'TABLE'}
                        params={params}
                        noPagination={noPagination.value}
                        pagination={props.data.componentProps.paginationSetting?.pagination}
                        v-slots={{
                            headerTitle: headerTitleRender,
                            ...columnsSlots.value
                        }}
                    >


                    </ProTable>

                </Selection>
            )
        }

    }
})
