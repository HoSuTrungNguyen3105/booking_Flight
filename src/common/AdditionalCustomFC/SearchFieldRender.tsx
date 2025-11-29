import InputTextArea from "../Input/InputTextArea";
import Android12Switch from "../Switch/Switch";
import InputTextField from "../Input/InputTextField";
import { height, type SxProps } from "@mui/system";
import SelectDropdown, { type ActionType } from "../Dropdown/SelectDropdown";
import InputNumber from "../Input/InputNumber";
import { memo } from "react";
import DateTimePickerComponent from "../DayPicker/index";
import { Box, IconButton } from "@mui/material";
import type { ReactNode } from "react";

export type FieldValue = boolean | string | number | null;

export enum SearchFieldType {
  SWITCH = "switch",
  DROPDOWN = "dropdown",
  ICON = "icon",
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
  onClick?: () => void;
  startIcon?: ReactNode;
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
  onClick,
  sx,
  startIcon,
}: IFieldRendererProps) => {
  const renderBox = () => {
    const commonStyle = {
      width: "40rem",
      maxWidth: "100%",
      ...sx,
    };

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
            sx={commonStyle}
            placeholder={placeholder}
            options={options as ActionType[]}
            value={value as string | number}
            disabled={disabled}
            onChange={onChange}
            startIcon={startIcon}
          />
        );

      case SearchFieldType.ICON:
        return (
          <IconButton
            onClick={onClick}
            sx={{
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "grey.300",
              boxShadow: 1,
              "&:hover": { bgcolor: "grey.50" },
            }}
            size="small"
          >
            {startIcon}
          </IconButton>
        );

      case SearchFieldType.INPUT_WITH_TYPE_TEXT:
        return (
          <InputTextField
            sx={commonStyle}
            error={Boolean(error)}
            type="text"
            clearable
            readOnly={readOnly}
            value={value as string}
            onChange={onChange}
            placeholder={placeholder}
            startIcon={startIcon}
          />
        );

      case SearchFieldType.INPUT_WITH_NUMBER:
        return (
          <InputNumber
            sx={commonStyle}
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
          <Box sx={commonStyle}>
            <DateTimePickerComponent
              value={value as number}
              onChange={onChange}
              language="en"
            />
          </Box>
        );

      default:
        return null;
    }
  };

  return renderBox();
};

export default memo(SearchFieldRender);
