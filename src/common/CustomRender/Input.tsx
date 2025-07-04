// import { Controller } from "react-hook-form";
// import { toast } from "react-toastify";
// import InputField from "../Input/InputField";

// interface InputProps {
//   name: string;
//   control: any;
//   placeholder?: string;
//   isPassword?: boolean;
//   isEditable?: boolean;
//   sx?: any;
// }

// const StyledInput = ({
//   name,
//   control,
//   placeholder,
//   isPassword = false,
//   isEditable = true,
//   sx = {},
// }: InputProps) => {
//   return (
//     <Controller
//       name={name}
//       control={control}
//       render={({ field }) => (
//         <InputField
//           value={field.value}
//           onChange={(value) => {
//             if (!isEditable) {
//               toast.warning("This field cannot be edited!");
//               return;
//             }
//             field.onChange(value);
//           }}
//           isPassword={isPassword}
//           placeholder={placeholder}
//           sx={{ width: "50%", ...sx }}
//         />
//       )}
//     />
//   );
// };

// export default StyledInput;
import { Controller } from "react-hook-form";
import { toast } from "react-toastify";
import InputField from "../Input/InputField";
import { forwardRef } from "react";

interface InputProps {
  name: string;
  control: any;
  placeholder?: string;
  isPassword?: boolean;
  isEditable?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

// Dùng forwardRef để nhận ref từ cha
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      name,
      control,
      placeholder,
      isPassword = false,
      isEditable = true,
      disabled,
      style,
      onKeyDown,
    },
    ref
  ) => {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <InputField
            {...field}
            ref={ref} // chuyển ref vào input bên trong
            isPassword={isPassword}
            placeholder={placeholder}
            disabled={disabled}
            onKeyDown={onKeyDown}
            sx={{ width: "50%", ...style }}
            onChange={(value) => {
              if (!isEditable) {
                toast.warning("This field cannot be edited!");
                return;
              }
              field.onChange(value);
            }}
          />
        )}
      />
    );
  }
);

export default Input;
