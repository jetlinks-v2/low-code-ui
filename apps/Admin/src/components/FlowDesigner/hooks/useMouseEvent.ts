import {ref} from 'vue'
import type {Ref} from 'vue'
import {difference} from "lodash-es";

export const useMouseEvent = (El: Ref<HTMLDivElement>) => {
  // 缩放
  const scale = ref<number>(1)

  // 拖拽
  const isDragging = ref<boolean>(false)

  const offsetX = ref<number>(0)
  const offsetY = ref<number>(0)

  const diff = {
    x: 0,
    y: 0
  }

  const lastPointermove = {
    x: 0,
    y: 0
  }
  const rootPointer = {
    x: 0,
    y: 0
  }

  /**
   * 获取鼠标点击时，鼠标位于dom的位置
   * @param e
   */
  const handlePointerdown = (e) => {
    const rootEl = El.value.querySelector('._root') as HTMLDivElement
    if (rootEl) {
      isDragging.value = true

      rootPointer.x = rootEl.dataset.x ? Number(rootEl.dataset.x) : 0
      rootPointer.y = rootEl.dataset.y ? Number(rootEl.dataset.y) : 0

      lastPointermove.x = e.clientX
      lastPointermove.y = e.clientY
      El.value.classList.add('_root-dragging')
    }
  }

  const handlePointermove = (e) => {
    if (isDragging.value) {
      const rootEl = El.value.querySelector('._root') as HTMLDivElement
      if (rootEl) {
        const styles = El.value.getBoundingClientRect()

        // difference 用于缩小时，拖动会变慢，需要乘以（1 + 相差倍数）
        const difference = 1 + (1 - scale.value)

        diff.x = (e.clientX - lastPointermove.x + rootPointer.x) * difference
        diff.y = (e.clientY - lastPointermove.y + rootPointer.y) * difference

        if (styles.height >= Math.abs(diff.y) && styles.width >= Math.abs(diff.x)) { // 不能超过父级宽高
          // 保存移动多少距离
          rootEl.dataset.x = String(diff.x)
          rootEl.dataset.y = String(diff.y)
          rootEl.style.transform = `scale(${scale.value}) translate3d(${diff.x}px, ${diff.y}px, 0)`
        }
      }
    }
  }

  const handlePointerup = (e) => {
    isDragging.value = false
    El.value.classList.remove('_root-dragging')
  }

  const handleWheel = (e: WheelEvent) => {
    const deltaY = e.deltaY
    if (deltaY < 0) {
      scale.value = parseFloat(
        (scale.value >= 1 ? 1 : scale.value + 0.1).toFixed(1),
      )
    } else {
      scale.value = parseFloat(
        (scale.value <= 0.5 ? 0.5 : scale.value - 0.1).toFixed(1),
      )
    }
    const rootEl = El.value.querySelector('._root') as HTMLDivElement
    if (rootEl) {
      rootEl.style.transform = `scale(${scale.value}) translate3d(${diff.x}px, ${diff.y}px, 0)`
    }
  }

  const bindEventListener = () => {
    El.value.addEventListener('pointerdown', handlePointerdown)
    El.value.addEventListener('pointermove', handlePointermove);
    El.value.addEventListener('pointerup', handlePointerup);
    El.value.addEventListener('wheel', handleWheel)

  }

  const removeEventListener = () => {
    El.value.removeEventListener('pointerdown', handlePointerdown)
    El.value.removeEventListener('pointermove', handlePointermove);
    El.value.removeEventListener('pointerup', handlePointerup);
    El.value.removeEventListener('wheel', handleWheel)
  }

  nextTick(() => {
    bindEventListener()
  })

  onUnmounted(() => {
    removeEventListener()
  })

}
