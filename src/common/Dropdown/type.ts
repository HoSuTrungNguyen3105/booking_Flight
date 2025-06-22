import type { AutocompleteCloseReason, SxProps } from "@mui/material";

export type DropdownOptions = {
  label: string;
  value: string | number;
  [key: string]: any; // Cho phép thêm các thuộc tính mở rộng
};

export type DropdownStatus = "error" | "confirmed" | "warning" | "default";

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
  filterSelectedOptions?: boolean; // ✅ mới thêm
  autoHighlight?: boolean; // ✅ mới thêm
  openOnFocus?: boolean;
  disableCloseOnSelect?: boolean;
  onChange: (
    event: React.SyntheticEvent<Element, Event>,
    newValue: DropdownOptions[] | null | DropdownOptions
  ) => void;
};

export type DropdownOptionTypes = {
  label: string;
  type: string;
  value: string | number;
};
