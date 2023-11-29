import { defineComponent, provide, reactive } from 'vue'
import { PageSymbol } from './context'
import { userRouterParams } from '@jetlinks-web/hooks'

export default defineComponent({
    name: 'PageProvider',
    props: {},
    setup: (props, { slots }) => {
        const context = reactive({})

        const _slots = reactive({})

        const designer: any = inject('PageDesigner')

        const pageEntity = {
            context,
            slots: _slots,
            addSlot(key: string, data: any) {
                _slots[key] = data
            },
            removeSlot(key: string) {
                delete _slots[key]
            },
            add(key: string, data: any) {
                context[key] = data
            },
            remove(key: string) {
                delete context[key]
            },
        }

        const route = useRoute()

        const { params } = userRouterParams()

        watch(() => JSON.stringify(params || '{}'), () => {
            context['page_route_params'] = params || {}
        }, { immediate: true })

        watch(() => JSON.stringify(route.query || '{}'), () => {
            context['page_route_query'] = route.query || {}
        }, { immediate: true })

        onMounted(() => {
            designer.dependencies.value['page_route_params'] = 'page_route_params'
            designer.dependencies.value['page_route_query'] = 'page_route_query'
        })

        provide(PageSymbol, pageEntity)

        return () => slots?.default?.()
    }
})
