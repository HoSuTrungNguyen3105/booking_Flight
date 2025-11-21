import InputTextArea from "../Input/InputTextArea";
import Android12Switch from "../Switch/Switch";
import InputTextField from "../Input/InputTextField";
import type { SxProps } from "@mui/system";
import SelectDropdown, { type ActionType } from "../Dropdown/SelectDropdown";
import InputNumber from "../Input/InputNumber";
import { memo } from "react";
import DateTimePickerComponent from "../DayPicker/index";

export type FieldValue = boolean | string | number | null;

export enum SearchFieldType {
  SWITCH = "switch",
  DROPDOWN = "dropdown",
  DATE = "date",
  INPUT_WITH_TYPE_TEXT = "input_text",
  INPUT_WITH_NUMBER = "input_number",
  CHECKBOX_SELECT = "checkbox_select",
}

type SearchFieldRenderProps = {
  id: string;
  type: SearchFieldType;
  placeholder?: string;
  size: number;
  options?: ActionType[];
  value: FieldValue;
  sx?: SxProps;
  readOnly?: boolean;
  disabled?: boolean;
  onChange?: (value: FieldValue) => void;
};

export type ISearchFieldRender = {
  label?: string;
  visible?: boolean;
  required?: boolean;
  fields: SearchFieldRenderProps[];
};

interface IFieldRendererProps extends Omit<SearchFieldRenderProps, "id"> {
  error?: boolean | string;
  disabled?: boolean;
  onChange: (value: FieldValue) => void;
}

const SearchFieldRender = ({
  type,
  placeholder,
  options,
  value,
  disabled,
  error,
  readOnly,
  onChange,
  sx,
}: IFieldRendererProps) => {
  const renderBox = () => {
    switch (type) {
      case SearchFieldType.SWITCH:
        return (
          <Android12Switch
            checked={value as boolean}
            disabled={disabled}
            onChange={(e) => onChange(e.target.checked)}
          />
        );

      case SearchFieldType.DROPDOWN:
        return (
          <SelectDropdown
            sx={{ width: "100%", ...sx }}
            placeholder={placeholder}
            options={options as ActionType[]}
            value={value as string | number}
            disabled={disabled}
            onChange={onChange}
          />
        );

      case SearchFieldType.INPUT_WITH_TYPE_TEXT:
        return (
          <InputTextField
            sx={sx}
            error={Boolean(error)}
            type="text"
            clearable
            readOnly={readOnly}
            value={value as string}
            onChange={onChange}
            placeholder={placeholder}
          />
        );

      case SearchFieldType.INPUT_WITH_NUMBER:
        return (
          <InputNumber
            sx={{ width: "100%", ...sx }}
            value={value as number}
            onChange={onChange}
            placeholder={placeholder}
            isSeparator
            min={0}
            size="small"
            textAlign="left"
          />
        );

      case SearchFieldType.DATE:
        return (
          <DateTimePickerComponent
            value={value as number}
            onChange={onChange}
            language="en"
          />
        );

      default:
        return null;
    }
  };

  return renderBox();
};

export default memo(SearchFieldRender);
