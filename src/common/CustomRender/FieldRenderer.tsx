import { Dropdown } from "../Dropdown/Dropdown";
import InputTextArea from "../Input/InputTextArea";
import type { DropdownOptions } from "../Dropdown/type";
import Android12Switch from "../Switch/Switch";
import InputTextField from "../Input/InputTextField";

export enum FieldType {
  SWITCH = "switch",
  DROPDOWN = "dropdown",
  INPUT_WITH_TYPE_PASSWORD = "input_pw",
  INPUT_WITH_TYPE_TEXT = "input_text",
  TEXTAREA = "textarea",
  DATE = "date",
}
export type IFormField = {
  id: string;
  label?: string;
  type: FieldType;
  placeholder?: string;
  options: DropdownOptions[];
  value: any;
  disabled?: boolean;
  onChange: (value: any) => void;
  customProps?: Record<string, any>; // ✅ Thêm dòng này
};
interface IFieldRendererProps extends Omit<IFormField, "id"> {
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
  onChange,
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
        <Dropdown
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
          // placeholder={placeholder}
          // value={value}
          // disabled={disabled}
          // onChange={(e) => onChange(e.target.value)}
          type="password"
          canCopy
          realease3phrase
          // readOnly
          showEyeIcon
          value={value}
          onChange={onChange}
          {...(customProps || {})} // ✅ Truyền toàn bộ prop riêng vào
        />
      );
    case FieldType.INPUT_WITH_TYPE_TEXT:
      return (
        <InputTextField
          // placeholder={placeholder}
          // value={value}
          // disabled={disabled}
          // onChange={(e) => onChange(e.target.value)}
          error={error as boolean}
          type="text"
          clearable
          value={value}
          onChange={onChange}
          {...(customProps || {})} // ✅ Truyền toàn bộ prop riêng vào
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
