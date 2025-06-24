import { Controller } from "react-hook-form";
import DatePickerFunc from "../DayPicker";

export const DatetimePicker = (name: string, control: any) => (
  <Controller
    control={control}
    name={name}
    render={({ field }) => (
      <DatePickerFunc
        usecase="date"
        size="medium"
        format="YYYY.MM.DD HH:mm"
        value={field.value}
        onChange={field.onChange}
      />
    )}
  />
);
