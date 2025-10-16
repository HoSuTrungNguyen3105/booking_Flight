import InputTextArea from "../Input/InputTextArea";
import Android12Switch from "../Switch/Switch";
import InputTextField from "../Input/InputTextField";
import type { SxProps } from "@mui/system";
// import JobTypeSelector from "../Setting/JobTypeSelector";
import SelectDropdown, { type ActionType } from "../Dropdown/SelectDropdown";
import InputNumber from "../Input/InputNumber";

type FieldValue = boolean | string | number | null;

export enum FieldType {
  SWITCH = "switch",
  DROPDOWN = "dropdown",
  INPUT_WITH_TYPE_PASSWORD = "input_pw",
  INPUT_WITH_TYPE_TEXT = "input_text",
  TEXTAREA = "textarea",
  DATE = "date",
  INPUT_WITH_NUMBER = "input_number",
  CHECKBOX_SELECT = "checkbox_select",
}

type FormField = {
  id: string;
  type: FieldType;
  placeholder?: string;
  options: ActionType[];
  value: FieldValue;
  sx?: SxProps;
  readOnly?: boolean;
  disabled?: boolean;
  onChange?: (value: FieldValue) => void;
  // customProps?: Record<string, any>;
};

export type IFormField = {
  label?: string;
  visible?: boolean;
  required?: boolean;
  fields: FormField[];
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
  error,
  readOnly,
  onChange,
  sx,
}: IFieldRendererProps) => {
  switch (type) {
    case FieldType.SWITCH:
      return (
        <Android12Switch
          checked={value as boolean}
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
          value={value as string | number}
          disabled={disabled}
          onChange={onChange}
        />
      );

    case FieldType.INPUT_WITH_TYPE_PASSWORD:
      return (
        <InputTextField
          {...sx}
          type="password"
          canCopy
          showEyeIcon
          readOnly={!readOnly}
          value={value as string}
          onChange={onChange}
        />
      );
    case FieldType.INPUT_WITH_TYPE_TEXT:
      return (
        <InputTextField
          {...sx}
          error={error as boolean}
          type="text"
          clearable
          readOnly={readOnly}
          value={value as string}
          onChange={onChange}
          placeholder={placeholder}
        />
      );
    case FieldType.INPUT_WITH_NUMBER:
      return (
        <InputNumber
          {...sx}
          value={value as number}
          onChange={onChange}
          placeholder={placeholder}
          isSeparator
          min={0}
          size="small"
          textAlign="right"
        />
      );
    case FieldType.TEXTAREA:
      return (
        <InputTextArea
          readOnly={readOnly}
          placeholder={placeholder}
          value={value as string}
          disabled={disabled}
        />
      );
  }
};
export default FieldRenderer;
