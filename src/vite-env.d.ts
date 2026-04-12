/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EMAILJS_PUBLIC_KEY?: string
  readonly VITE_EMAILJS_SERVICE_ID?: string
  readonly VITE_EMAILJS_USER_TEMPLATE_ID?: string
  readonly VITE_EMAILJS_OWNER_TEMPLATE_ID?: string
  readonly VITE_PRIMARY_CTA_URL?: string
  readonly VITE_SECONDARY_CTA_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
