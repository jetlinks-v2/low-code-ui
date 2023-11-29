import Selection from '../Selection/index'
import { defineComponent, inject } from 'vue'
import { useTool, usePageProvider, useLifeCycle } from '../../hooks'
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
        const { executionMounted } = useLifeCycle(props.data.componentProps, {}, isEditModel)
        const PageProvider = usePageProvider()
        const designer = inject<any>('PageDesigner')

        const _data = computed(() => {
            return props.data
        })

        const columns = computed(() => {
            return props.data.componentProps.columns
        })

        const onSearch = (params: any) => {
            PageProvider.add?.(props.data.key, params)
        }

        onMounted(() => {
            executionMounted()
        })

        onBeforeMount(() => {
            if (isEditModel) {
                designer.dependencies.value[props.data.key] = props.data.name || props.data.key
            }
        })

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
