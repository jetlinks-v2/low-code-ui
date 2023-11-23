import { ProTable, Button } from 'jetlinks-ui-components'
import Selection from '../../Selection/index'
import { defineComponent, inject } from 'vue'
import { useTool, UsePageProvider } from '../../../hooks'
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
        const PageProvider = UsePageProvider()

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
            console.log('pro-table-layout:params', params)
            return PageProvider.context.params
        })

        const columnsSlots = computed(() => {
            return props.data.componentProps.columns?.reduce((prev: Record<string, Function>, next) => {
                console.log(next.dataIndex, next.render)
                if (next.render) {
                    prev[next.dataIndex] = (...args: any) => next.render(args)
                }
                return prev
            }, {}) || {}
        })


        const headerTitleRender = () => {
            return (<Button type="dashed" style={{ width: '100px' }}>+</Button>)
        }

        return () => {
            console.log(columnsSlots.value)
            return (
                <Selection {...useAttrs()} hasDrag={true} hasDel={true} hasCopy={true} data={unref(_data)} parent={props.parent}>
                    <ProTable
                        columns={columns.value}
                        dataSource={dataSource.value}
                        modelValue={'TABLE'}
                        params={params}
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
