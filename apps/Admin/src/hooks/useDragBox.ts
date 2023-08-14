import {onUnmounted, Ref} from "vue";

type Options = {
  min: number
  max: number
  position?: 'x' | 'y'
}

export const useDragBox = (target: Ref<HTMLElement>, dragBox: Ref<HTMLElement>, options?: Options) => {

  const min = options?.min || 40
  const max = options?.max || 40

  const mouseDown = (a: MouseEvent) => {
    const position = options?.position || 'x'
    const start = position === 'y' ? a.clientY : a.clientX

    document.body.style.cursor = position === 'x' ? 'col-resize' : 'row-resize'

    document.onmousemove = (e) => {
      const end = position === 'y' ? e.clientY : e.clientX

      let moveLen = end

      if (moveLen < min) {
        moveLen = min
      }

      if (moveLen > max) {
        moveLen = max
      }

      dragBox.value.style.width = moveLen + 'px'

    }

    document.onmouseup = (e) => {
      document.onmousemove = null;
      document.onmouseup = null;
      document.body.style.cursor = 'default';
      (target.value as any).releaseCapture?.()
    }
  }

  const dragController = () => {
    console.log('dragController', target.value)
    if (target.value) {
      target.value.addEventListener('mousedown', mouseDown)
    }
  }

  onMounted(() => {
    nextTick(() => {
      dragController()
    })
  })

}
