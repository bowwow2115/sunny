/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly DEV: boolean
  readonly PROD: boolean
  readonly MODE: string
  readonly BASE_URL: string
  /** Dev server proxy target for `/sunny` (Vite only; not bundled) */
  readonly VITE_API_PROXY_TARGET?: string
  /** TripleDES key/IV (optional; defaults match legacy embedded values) */
  readonly VITE_TRIPLEDES_KEY?: string
  readonly VITE_TRIPLEDES_IV?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
