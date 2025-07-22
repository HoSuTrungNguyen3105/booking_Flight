import { Switch } from "@mui/material";
import { Dropdown } from "../Dropdown/Dropdown";
import InputTextArea from "../Input/InputTextArea";
import TextArea from "../Input/TextArea";
import type { DropdownOptions } from "../Dropdown/type";
import Android12Switch from "../Switch/Switch";

export enum FieldType {
  SWITCH = "switch",
  DROPDOWN = "dropdown",
  INPUT = "input",
  TEXTAREA = "textarea",
  DATE = "date",
}
type IFormField = {
  id?: string;
  label?: string;
  type: FieldType;
  placeholder?: string;
  options: DropdownOptions[];
  value: any;
  disabled?: boolean;
  onChange: (value: any) => void;
};
interface IFieldRendererProps extends Omit<IFormField, "id" | "label"> {
  disabled?: boolean;
  onChange: (value: any) => void;
}

const FieldRenderer = ({
  type,
  placeholder,
  options,
  value,
  disabled,
  onChange,
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
        <Dropdown
          sx={{ width: "100%" }}
          placeholder={placeholder}
          options={options}
          value={value}
          disabled={disabled}
          onChange={onChange}
        />
      );

    case FieldType.INPUT:
      return (
        <TextArea
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case FieldType.TEXTAREA:
      return (
        <InputTextArea
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          //onChange={(e) => onChange(e.target.value)}
        />
      );

    default:
      return null;
  }
};
export default FieldRenderer;
