import type { App } from 'vue'
import TitleComponent from './TitleComponent/index.vue'
import ImageUpload from "./Upload/Image/ImageUpload.vue";
import VirtualList from './VirtualList/index.vue'
import QuickEditTable from './QuickEditTable/index.vue'

export default  {
    install(app: App) {
        app.component('TitleComponent', TitleComponent)
          .component('ImageUpload', ImageUpload)
          .component('VirtualList', VirtualList)
          .component('QuickEditTable', QuickEditTable)
    }
}
