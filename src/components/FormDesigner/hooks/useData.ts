const useData = (_data: any) => {
    const designer: any = inject('FormDesigner')

    const isEditModel = computed(() => {
        return unref(designer?.model) === 'edit'
    })

    const isDragArea = computed(() => {
        return isEditModel.value
    })

    const layoutPadStyle = computed(() => {
        return { padding: isEditModel.value ? '16px' : '0px' }
    })

    return {
        isEditModel,
        isDragArea,
        layoutPadStyle
    }
}

export default useData
