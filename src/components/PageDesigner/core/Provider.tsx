import { defineComponent, provide, reactive } from 'vue'
import { PageSymbol } from './context'

export default defineComponent({
    name: 'PageProvider',
    props: {},
    setup: (props, { slots }) => {
        const context = reactive({})

        const _slots = reactive({})

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

        provide(PageSymbol, pageEntity)

        return () => slots?.default?.()
    }
})
