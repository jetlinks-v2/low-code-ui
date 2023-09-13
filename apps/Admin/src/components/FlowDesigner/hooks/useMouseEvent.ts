import { ref } from 'vue'
import type { Ref } from 'vue'

export const useMouseEvent = (): {
    scale: Ref<number>,
    offsetX: Ref<number>,
    offsetY: Ref<number>,
    onMousewheel: (event: WheelEvent) => void,
    startDrag: (event: MouseEvent) => void,
    dragging: (event: MouseEvent) => void,
    endDrag: (event: MouseEvent) => void,
} => {
    // 缩放
    const scale = ref<number>(1)
    const onMousewheel = ({ deltaY }) => {
        if (deltaY < 0) {
            scale.value = parseFloat(
                (scale.value >= 1 ? 1 : scale.value + 0.1).toFixed(1),
            )
        } else {
            scale.value = parseFloat(
                (scale.value <= 0.5 ? 0.5 : scale.value - 0.1).toFixed(1),
            )
        }
    }

    // 拖拽
    const isDragging = ref<boolean>(false)
    const initialX = ref<number>(0)
    const initialY = ref<number>(0)
    const offsetX = ref<number>(0)
    const offsetY = ref<number>(0)
    const startDrag = (event) => {
        isDragging.value = true
        initialX.value = initialX.value || event.clientX
        initialY.value = initialY.value || event.clientY
    }
    const dragging = (event) => {
        if (isDragging.value) {
            const deltaX = event.clientX - initialX.value
            const deltaY = event.clientY - initialY.value
            offsetX.value = deltaX
            offsetY.value = deltaY
        }
    }
    const endDrag = (event) => {
        isDragging.value = false
        initialX.value = event.clientX
        initialY.value = event.clientY
    }

    return {
        scale,
        offsetX,
        offsetY,
        onMousewheel,
        startDrag,
        dragging,
        endDrag,
    }
}
