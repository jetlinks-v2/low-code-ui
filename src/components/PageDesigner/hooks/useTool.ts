import { debounce } from "lodash-es"
import { appendChildItem, deleteDataByKey } from "../utils/utils"
import { Modal } from 'jetlinks-ui-components'

const useTool = () => {
    const designer: any = inject('PageDesigner')
    const delVisible = ref<boolean>(false)

    const isEditModel = computed(() => {
        return unref(designer?.model) === 'edit'
    })

    const isDragArea = computed(() => {
        return unref(isEditModel)
    })

    const _model = computed(() => {
        return unref(designer?.model)
    })

    // 设置数据被选中
    const setSelection = (node: any) => {
        if (node === 'root') {
            designer.selected.value = [designer.pageData.value]
        } else {
            designer.selected.value = [node]
        }
        designer.isShowConfig.value = true
    }

    const setModel = (_type: 'preview' | 'edit') => {
        designer.model.value = _type
    }

    const onAddChild = (newData: any, parent: any) => {
        const arr = appendChildItem(designer.pageData.value?.children, newData, parent)
        designer.pageData.value = {
            ...designer.pageData.value,
            children: arr || [],
        }
        setSelection(newData || 'root')
    }

    const onDelete = debounce(() => {
        const arr = designer.selected.value || []
        if (!arr?.length) return
        delVisible.value = true
        Modal.confirm({
            title: '确定删除组件及其配置？',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                delVisible.value = false
                // 删除数据
                const _data = deleteDataByKey(designer.pageData.value.children, designer.selected.value)
                designer.pageData.value = {
                    ...designer.pageData.value,
                    children: _data?.arr || [],
                }
                setSelection(_data?.data || 'root')
            },
            onCancel() {
                delVisible.value = false
            },
        })
    }, 200)

    // 复制
    const onCopy = () => {
        // const list = cloneDeep(designer.selected.value).filter((item: any) => {
        //     return ![
        //         'collapse-item',
        //         'tabs-item',
        //         'grid-item',
        //         'table-item',
        //         'space-item',
        //     ].includes(item.type)
        // })
        // if (unref(isSelectedRoot) || focused.value) return
        // formDesigner.setCopyData(props.data?.id, list || [])
    }

    // 剪切
    const onShear = debounce(() => {
        // if (unref(isSelectedRoot) || focused.value) return
        // formDesigner.setCopyData(props.data?.id, selected.value || [])
        // const _data: any = deleteDataByKey(formData.value.children, selected.value)
        // formData.value = {
        //     ...formData.value,
        //     children: _data?.arr || [],
        // }
        // setSelection(_data?.data || 'root')
    }, 200)

    // 粘贴
    const onPaste = () => {
        // if (!selected.value?.length || focused.value) return
        // const obj = formDesigner.getCopyData()
        // const list = (obj?.list || []).map((item) => {
        //     return {
        //         ...item,
        //         formItemProps: {
        //             ...item?.formItemProps,
        //             label:
        //                 obj.key === props.data?.id
        //                     ? 'copy_' + item.formItemProps?.label
        //                     : item.formItemProps?.label,
        //             name:
        //                 obj.key === props.data?.id
        //                     ? 'copy_' + item.formItemProps?.name
        //                     : item.formItemProps?.name,
        //         },
        //         key: item.key + '_' + uid(),
        //         children: handleCopyData(item?.children || []),
        //     }
        // })
        // if (list.length && selected.value?.length) {
        //     const dt = selected.value?.[selected.value.length - 1]
        //     if (dt?.key === 'root') {
        //         formData.value = {
        //             ...formData.value,
        //             children: [...formData.value?.children, ...list],
        //         }
        //     } else {
        //         formData.value = {
        //             ...formData.value,
        //             children: copyDataByKey(formData.value?.children, list, dt),
        //         }
        //     }
        //     setSelection(list?.[list.length - 1] || 'root')
        //     formDesigner.deleteData()
        // }
    }

    return {
        isEditModel,
        isDragArea,
        _model,
        setSelection,
        onDelete,
        onAddChild,
        onCopy,
        onShear,
        onPaste,
        setModel
    }
}

export default useTool
