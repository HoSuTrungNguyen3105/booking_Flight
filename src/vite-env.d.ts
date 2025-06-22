/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_REACT_APP_URL: "http://localhost:3000/";
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
