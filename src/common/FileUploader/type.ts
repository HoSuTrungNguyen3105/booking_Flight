export const KB_TO_BYTES = 1024;
export const SIZE_TYPE = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
export type FileUploaderProps = {
  width?: string;
  height?: string;
  accept?: string;
  maxSize?: string;
  inputType?: "input" | "thumbnails" | "read-only";
  name: string;
  value?: TFileUploader[];
  onChange?: (value: TFileUploader[]) => void;
  maxFiles?: number;
  multiple?: boolean;
  hidePreview?: boolean;
  disabled?: boolean;
};

export type TFileUploader = {
  preview: string;
  raw: File;
  size: number;
  name: string;
  type: string;
  fileName: string;
};
