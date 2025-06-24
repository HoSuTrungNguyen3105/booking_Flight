import { Controller } from "react-hook-form";
import type { DropdownOptions } from "../Dropdown/type";
import { Dropdown } from "../Dropdown/Dropdown";

export const DropdownField = (
  name: string,
  control: any,
  options: DropdownOptions[],
  placeholder: string,
  fullWidth?: boolean,
  onCustomChange?: (selected: DropdownOptions) => void
) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => {
      const selectedOption =
        options.find((opt) => opt.value === field.value) ||
        (field.value ? { label: field.value, value: field.value } : null);
      return (
        <Dropdown
          options={options}
          value={selectedOption}
          onChange={(e, selected: DropdownOptions | any) => {
            const value = selected?.value || "";
            field.onChange(value);
            if (selected && onCustomChange) {
              onCustomChange(selected);
            }
          }}
          placeholder={placeholder}
          sx={{ width: fullWidth ? "150%" : "100%" }}
        />
      );
    }}
  />
);
