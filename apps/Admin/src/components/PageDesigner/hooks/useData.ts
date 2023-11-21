const useData = (_data: any) => {
    const designer: any = inject('FormDesigner')

    const isEditModel = computed(() => {
        return unref(designer?.model) === 'edit'
    })

    const isDragArea = computed(() => {
        return isEditModel.value
    })

    return {
        isEditModel,
        isDragArea
    }
}

export default useData
