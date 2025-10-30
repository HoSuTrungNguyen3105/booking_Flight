import type {
  AutocompleteCloseReason,
  ChipProps,
  SxProps,
} from "@mui/material";
import type { ReactNode } from "react";

export type DropdownOptions = {
  label: string | ReactNode;
  value: string | number;
};

export type DropdownStatus = ChipProps["color"];
// "error" | "confirmed" | "warning" | "default";
export type DropdownOptionType = {
  selectedOption?: DropdownOptionTypes;
  onChange?: (
    event: React.SyntheticEvent,
    newValue: DropdownOptionTypes
  ) => void;
  value?: DropdownOptionTypes;
  options?: DropdownOptionTypes[];
  sx?: SxProps;
  label?: string;
  customInput?: React.ReactNode;
  onOpen?: (event: React.SyntheticEvent) => void;
  onClose?:
    | ((event: React.SyntheticEvent, reason: AutocompleteCloseReason) => void)
    | undefined;
  multiple?: boolean;
  placeholder?: string;
};

export type DropdownType = {
  options?: DropdownOptions[];
  value: DropdownOptions[] | DropdownOptions | null;
  sx?: SxProps;
  onInputChange?: (value: string) => void; // thêm callback riêng
  label?: string;
  customInput?: React.ReactNode;
  onOpen?: (event: React.SyntheticEvent) => void;
  onClose?:
    | ((event: React.SyntheticEvent, reason: AutocompleteCloseReason) => void)
    | undefined;
  multiple?: boolean;
  placeholder?: string;
  status?: DropdownStatus;
  readonly?: boolean;
  disabled?: boolean;
  filterSelectedOptions?: boolean;
  autoHighlight?: boolean;
  openOnFocus?: boolean;
  disableCloseOnSelect?: boolean;
  onChange?: (option: DropdownOptions | null) => void;
};

export type DropdownOptionTypes = {
  label: string;
  type: string;
  value: string | number;
};

export type ChildContent = {
  content1?: React.ReactNode;
  content2?: React.ReactNode;
  content3?: React.ReactNode;
  content4?: React.ReactNode;
};

export type ContentBlock = {
  descContent?: ChildContent;
  content: ChildContent;
  gridSize?: number; // Kích thước lưới, mặc định là 3
  contentLabels?: string[]; // Mỗi label ứng với content1 -> content4
  extraContent?: []; // Thêm nội dung phụ nếu cần
  bigContent?: boolean; // Thêm prop này để xác định có hiển thị content lớn hay khôn
  getContentStyle?: (content: ChildContent) => React.CSSProperties;
  getDescContentStyle?: (descContent: ChildContent) => React.CSSProperties;
  hasLine?: boolean;
  highlight?: boolean;
  color?: string;
};

export type TableInfoProps = {
  title: string;
  description: string;
  content: ContentBlock[];
  buttonLabel?: string;
  buttonOnChange?: () => void;
  getReviewStatusStyle?: (status: string) => React.CSSProperties;
};
