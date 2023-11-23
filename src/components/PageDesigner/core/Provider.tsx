import { defineComponent, provide, reactive } from 'vue'
import { PageSymbol } from './context'

export default defineComponent({
    name: 'PageProvider',
    props: {},
    setup: (props, { slots }) => {
        const context = reactive({})

        const pageEntity = {
            context,
            add(key: string, data: any) {
                context[key] = data
            },
            remove(key: string) {
                delete context[key]
            }
        }

        provide(PageSymbol, pageEntity)

        return () => slots?.default?.()
    }
})
