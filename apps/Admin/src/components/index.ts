import type { App } from 'vue'
import TitleComponent from './TitleComponent/index.vue'
import ImageUpload from "./Upload/Image/ImageUpload.vue";
import FormDesigner from './FormDesigner/index.vue';

export default  {
    install(app: App) {
        app.component('TitleComponent', TitleComponent)
          .component('ImageUpload', ImageUpload)
          .component('FormDesigner', FormDesigner)
    }
}
