import { useMagicKeys, useElementHover } from '@vueuse/core'
import useTool from './useTool'

const useKeys = (canvasRef: any) => {
    const designer: any = inject('PageDesigner')
    const keys = useMagicKeys()
    const focused = useElementHover(canvasRef)
    const { isEditModel, onCopy, onShear, onPaste, onDelete } = useTool()
    
    // 删除
    watch(
        () => [keys?.['Backspace']?.value, keys?.['Delete']?.value],
        ([v1, v2]) => {
            if ((v1 || v2) && isEditModel.value && designer.focus?.value) {
                if (!designer?.delVisible?.value) {
                    onDelete?.()
                }
            }
        },
    )

    // watch(
    //     () => [keys?.['Ctrl']?.value, keys?.['Meta']?.value],
    //     ([v1, v2]) => {
    //         // designer._ctrl.value = v1 || v2
    //     },
    // )

    watch(
        () => [keys?.['Ctrl+C']?.value, keys?.['Meta+C']?.value],
        ([v1, v2]) => {
            if ((v1 || v2) && isEditModel?.value && designer?.focus?.value) {
                onCopy?.(designer?.data?.id)
            }
        },
    )

    watch(
        () => [keys?.['Ctrl+X']?.value, keys?.['Meta+X']?.value],
        ([v1, v2]) => {
            if ((v1 || v2) && isEditModel?.value && designer?.focus?.value) {
                onShear?.(designer?.data?.id)
            }
        },
    )

    watch(
        () => [keys?.['Ctrl+V']?.value, keys?.['Meta+V']?.value],
        ([v1, v2]) => {
            if ((v1 || v2) && isEditModel?.value && designer?.focus?.value) {
                onPaste?.(designer?.data?.id)
            }
        },
    )

    watch(
        () => focused?.value,
        (newValue) => {
            if (designer.focus) {
                designer.focus.value = newValue
            }
        },
        {
            immediate: true,
            deep: true
        }
    )

    return {
        keys,
        focused
    }
}

export default useKeys
