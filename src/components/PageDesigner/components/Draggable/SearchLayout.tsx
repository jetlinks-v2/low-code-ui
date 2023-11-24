import { ProTable, Button } from 'jetlinks-ui-components'
import Selection from '../Selection/index'
import { defineComponent, inject } from 'vue'
import { useTool, usePageProvider } from '../../hooks'
import Search from '../../../Search/Search.vue'

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

        const onSearch = (params: any) => {
            PageProvider.add?.('params', params)
        }

        return () => {
            return (
                <Selection {...useAttrs()} hasDrag={true} hasDel={true} hasCopy={true} data={unref(_data)} parent={props.parent}>
                    <Search
                        columns={columns.value}
                        onSearch={onSearch}
                    />

                </Selection>
            )
        }

    }
})
