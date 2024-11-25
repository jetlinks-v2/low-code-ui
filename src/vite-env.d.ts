interface ImportMetaEnv {
    readonly VITE_APP_BASE_API: string;
    readonly VITE_APP_WS_URL: string;
    readonly VITE_TOKEN_KEY: string;
    readonly MODE: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}
