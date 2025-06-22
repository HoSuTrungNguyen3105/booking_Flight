import { Controller } from "react-hook-form";
import { toast } from "react-toastify";
import InputField from "../Input/InputField";

export const Input = (
  name: string,
  control: any,
  placeholder?: string,
  isPassword?: boolean,
  isEditable: boolean = true
) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <InputField
        value={field.value}
        onChange={(value) => {
          if (!isEditable) {
            toast.warning("This field cannot be edited!");
            return;
          }
          field.onChange(value);
        }}
        isPassword={isPassword ?? false}
        placeholder={placeholder}
        sx={{ width: "50%" }}
      />
    )}
  />
);
