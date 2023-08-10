import type { App } from 'vue'
import TitleComponent from './TitleComponent/index.vue'
import ImageUpload from "./Upload/Image/ImageUpload.vue";
import QuickEditTable from './QuickEditTable/index.vue'
import Search from './Search'
import DragBox from "./DragBox";
export default  {
    install(app: App) {
        app.component('TitleComponent', TitleComponent)
          .component('ImageUpload', ImageUpload)
          .component('QuickEditTable', QuickEditTable)
          .component('ProSearch', Search)
          .component('DragBox', DragBox)
    }
}
