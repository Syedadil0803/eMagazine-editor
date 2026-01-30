/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_AUTH_API_URL: string;
    readonly VITE_CONTENT_API_URL: string;
    readonly VITE_EDITOR_API_URL: string;
    readonly VITE_APPROVAL_API_URL: string;
    readonly VITE_EDITOR_WEBSITE: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

declare module '*.module.scss' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
}
