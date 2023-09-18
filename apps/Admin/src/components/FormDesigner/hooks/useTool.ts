const useTool = () => {
    const designer: any = inject('FormDesigner')

    const isEditModel = computed(() => {
        return unref(designer?.model) === 'edit'
    })

    const isDragArea = computed(() => {
        return unref(isEditModel)
    })

    const layoutPadStyle = computed(() => {
        return { padding: unref(isEditModel) ? '16px' : '0px' }
    })

    return {
        isEditModel,
        isDragArea,
        layoutPadStyle
    }
}

export default useTool
