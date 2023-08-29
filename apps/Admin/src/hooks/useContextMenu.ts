import { onMounted, onUnmounted, ref } from "vue";

export const useContextMenu = (containerRef: any, menuRef: any) => {

    const showMenu = ref(false);
    const x = ref(0);
    const y = ref(0);

    const handleContextMenu =async(e) => {

        e.preventDefault();
        e.stopPropagation();
        showMenu.value = true;
        await nextTick()
        positionMenu(e.clientX, e.clientY)
        // x.value = e.clientX;
        // y.value = e.clientY;
    };

    const closeMenu = () => {
        showMenu.value = false;
    }

    //判断菜单展开位置
    const positionMenu =async (a, b) => {
        //window 宽高
        const { innerWidth, innerHeight } = window

        
        const menuHeight = menuRef.value?.offsetHeight
        
        // console.log('menuRef.value',menuRef.value)
        // console.log('menuHeight',menuHeight)

        x.value = a + 150 > innerWidth ? innerWidth - 170 : a;
        y.value = b + menuHeight > innerHeight ? innerHeight - menuHeight - 10 : b;
    }

    onMounted(() => {
        const div = containerRef.value;
        //监听右键
        div.addEventListener('contextmenu', handleContextMenu)
        window.addEventListener("click", closeMenu, true);
        // 触发 window 点击事件的时候执行函数
        window.addEventListener("contextmenu", closeMenu, true);
    });


    onUnmounted(() => {
        const div = containerRef.value;
        div?.removeEventListener("contextmenu", handleContextMenu);
        window.removeEventListener("click", closeMenu, true);
        window.removeEventListener("contextmenu", closeMenu, true);
    })
    return {
        showMenu,
        x,
        y,
    };
}
