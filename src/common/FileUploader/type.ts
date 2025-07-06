export const KB_TO_BYTES = 1024;

export const SIZE_TYPE = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

export enum INPUT_TYPE {
  INPUT = "input",
  THUMBNAIL = "thumbnails",
  READONLY = "read-only",
}

export type FileUploaderProps = {
  width?: string;
  height?: string;
  accept?: string;
  maxSize?: string;
  inputType?: INPUT_TYPE;
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
