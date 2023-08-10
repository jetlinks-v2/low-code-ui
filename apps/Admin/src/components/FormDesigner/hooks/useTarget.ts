import { inject, computed } from 'vue'

const useTarget = () => {
    const { state, setSelection } = inject('FormDesigner')

    // 判断是否为编辑、预览、查看
    const isEditModel = computed(() => {
        return /^(edit|config)$/.test(state.mode)
    })

    const target = computed(() => {
        return state.selected
    })

    return {
        state,
        isEditModel,
        setSelection,
        target
    }
}

export default useTarget; 