import InputTextArea from "../Input/InputTextArea";
import type { DropdownOptions } from "../Dropdown/type";
import Android12Switch from "../Switch/Switch";
import InputTextField from "../Input/InputTextField";
import type { Theme } from "@mui/material/styles";
import type { SxProps } from "@mui/system";
import JobTypeSelector from "../Setting/JobTypeSelector";
import SelectDropdown from "../Dropdown/SelectDropdown";

export enum FieldType {
  SWITCH = "switch",
  DROPDOWN = "dropdown",
  INPUT_WITH_TYPE_PASSWORD = "input_pw",
  INPUT_WITH_TYPE_TEXT = "input_text",
  TEXTAREA = "textarea",
  DATE = "date",
  CHECKBOX_SELECT = "checkbox_select",
}

type FormField = {
  id: string;
  label?: string;
  type: FieldType;
  placeholder?: string;
  options: DropdownOptions[];
  valueIncheckbox?: string[];
  value: any;
  sx?: SxProps<Theme>;
  disabled?: boolean;
  onChange?: (value: any) => void;
  customProps?: Record<string, any>;
};

export type IFormField = {
  disabled?: boolean;
  fields: FormField;
};

interface IFieldRendererProps extends Omit<FormField, "id"> {
  error?: boolean | string;
  disabled?: boolean;
  onChange: (value: any) => void;
}

const FieldRenderer = ({
  type,
  placeholder,
  options,
  value,
  disabled,
  valueIncheckbox = [],
  error,
  onChange,
  sx,
  customProps,
}: IFieldRendererProps) => {
  switch (type) {
    case FieldType.SWITCH:
      return (
        <Android12Switch
          checked={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
        />
      );

    case FieldType.DROPDOWN:
      return (
        <SelectDropdown
          sx={{ width: "100%" }}
          placeholder={placeholder}
          options={options}
          value={value}
          disabled={disabled}
          onChange={onChange}
          {...(customProps || {})} // ✅ Truyền toàn bộ prop riêng vào
        />
      );

    case FieldType.INPUT_WITH_TYPE_PASSWORD:
      return (
        <InputTextField
          {...sx}
          type="password"
          canCopy
          // realease3phrase
          showEyeIcon
          value={value}
          onChange={onChange}
          {...(customProps || {})} // ✅ Truyền toàn bộ prop riêng vào
        />
      );
    case FieldType.INPUT_WITH_TYPE_TEXT:
      return (
        <InputTextField
          {...sx}
          error={error as boolean}
          type="text"
          clearable
          value={value}
          onChange={onChange}
          {...(customProps || {})} // ✅ Truyền toàn bộ prop riêng vào
        />
      );
    case FieldType.CHECKBOX_SELECT:
      return (
        <JobTypeSelector
          valueInCheckBox={valueIncheckbox}
          error={error as boolean}
          value={value}
          onChange={onChange}
          {...sx}
          {...(customProps || {})} // ✅ Truyền toàn bộ prop riêng vào
        />
      );

    case FieldType.TEXTAREA:
      return (
        <InputTextArea
          placeholder={placeholder}
          value={value}
          disabled={disabled}
        />
      );
  }
};
export default FieldRenderer;
