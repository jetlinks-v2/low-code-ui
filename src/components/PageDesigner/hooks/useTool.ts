const useTool = () => {
    const designer: any = inject('FormDesigner')

    const isEditModel = computed(() => {
        return unref(designer?.model) === 'edit'
    })

    const isDragArea = computed(() => {
        return unref(isEditModel)
    })

    return {
        isEditModel,
        isDragArea
    }
}

export default useTool
