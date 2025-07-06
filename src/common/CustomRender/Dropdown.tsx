// import { Controller } from "react-hook-form";
// import type { DropdownOptions } from "../Dropdown/type";
// import { Dropdown } from "../Dropdown/Dropdown";
// export type DropdownOptions = {
//   label: string;
//   value: string | number;
//   [key: string]: any; // Cho phép thêm các thuộc tính mở rộng
// };
// export const DropdownField = ({
//   name,
//   control,
//   options,
//   placeholder = "",
//   fullWidth = false,
//   onCustomChange,
//   disabled = false,
//   readonly = false,
//   multiple = false,
// }: DropdownOptions) => {
//   return (
//     <Controller
//       name={name}
//       control={control}
//       render={({ field }) => {
//         let selectedValue;

//         if (multiple && Array.isArray(field.value)) {
//           selectedValue = options.filter((opt) =>
//             field.value.includes(opt.value)
//           );
//         } else {
//           selectedValue =
//             options.find((opt) => opt.value === field.value) ||
//             (field.value ? { label: field.value, value: field.value } : null);
//         }

//         return (
//           <Dropdown
//             options={options}
//             value={selectedValue}
//             onChange={(event, selected) => {
//               const value = multiple
//                 ? selected?.map((item: DropdownOptions) => item.value) || []
//                 : selected?.value || "";
//               field.onChange(value);
//               if (onCustomChange && selected) {
//                 onCustomChange(selected);
//               }
//             }}
//             placeholder={placeholder}
//             sx={{ width: fullWidth ? "150%" : "100%" }}
//             disabled={disabled}
//             readonly={readonly}
//             multiple={multiple}
//           />
//         );
//       }}
//     />
//   );
// };
