/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EBAY_CLIENT_ID: string;
  readonly VITE_EBAY_CLIENT_SECRET: string;
  readonly VITE_EBAY_REDIRECT_URI: string;
  readonly VITE_EBAY_ENVIRONMENT: 'sandbox' | 'production';
  // więcej zmiennych środowiskowych...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
