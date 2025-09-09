import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import clsx from "clsx";
import moment from "moment";
import { Box } from "@mui/material";
import Calendar from "@mui/icons-material/Event";
import "./_datepicker.scss";
import "./_displaydatepicker.scss";
import DatePickerFunc from ".";
import type { DatePickerProps, ValueDate } from "./type";

export const DatePickerMonth = ({
  value,
  onChange,
  disabled,
  inputClassName,
  readOnly,
  format = "YYYY.MM",
  minDate,
  maxDate,
  status = "default",
  size = "medium",
}: Omit<DatePickerProps, "usecase">) => {
  return (
    <Box
      className={clsx(
        "datemonthpicker datemonthpicker-container ",
        inputClassName,
        {
          "small-size": size === "small",
          "medium-size": size === "medium",
          "large-size": size === "large",
        }
      )}
      sx={{ display: "flex", flexDirection: "column", gap: 2, width: "10rem" }}
    >
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DatePicker
          value={value ? moment(value) : null}
          onChange={(newValue) => {
            onChange?.(newValue?.toISOString() ?? null);
          }}
          views={["month"]}
          format={format}
          disabled={disabled}
          enableAccessibleFieldDOMStructure={false} // ← quan trọng
          readOnly={readOnly}
          minDate={minDate ? moment(minDate) : undefined}
          maxDate={maxDate ? moment(maxDate) : undefined}
          slotProps={{
            inputAdornment: {
              position: "start",
              children: <Calendar />,
            },
            field: { clearable: true },
            toolbar: { hidden: true },
          }}
          className={clsx("datemonthpicker-datepicker-input", status)}
        />
      </LocalizationProvider>
    </Box>
  );
};
export const DatePickerYear = ({
  size,
  value,
  onChange,
  disabled,
  inputClassName,
  readOnly,
  format = "YYYY",
  minDate,
  maxDate,
  status = "default",
}: Omit<DatePickerProps, "usecase">) => {
  return (
    <Box
      className={clsx("dateyearpicker-container", inputClassName, {
        "small-size": size === "small",
        "medium-size": size === "medium",
        "large-size": size === "large",
      })}
      sx={{ display: "flex", flexDirection: "column", gap: 2, width: "10rem" }}
    >
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DatePicker
          value={value ? moment(value) : null}
          onChange={(newValue) => {
            onChange?.(newValue?.toISOString() ?? null);
          }}
          views={["year"]}
          format={format}
          disabled={disabled}
          readOnly={readOnly}
          minDate={minDate ? moment(minDate) : undefined}
          maxDate={maxDate ? moment(maxDate) : undefined}
          slotProps={{
            inputAdornment: {
              position: "start",
              children: <Calendar />,
            },
            field: { clearable: true },
            toolbar: { hidden: true },
          }}
          className={clsx("datepicker-input", status)}
        />
      </LocalizationProvider>
    </Box>
  );
};

interface Props {
  language: "en" | "ko";
}

export const OnlyDatePicker: React.FC<Props> = ({ language }) => {
  const [selectedDate, setSelectedDate] = React.useState<moment.Moment | null>(
    null
  );

  React.useEffect(() => {
    moment.locale(language);
  }, [language]);

  return (
    <Box
      className={clsx("onlydatepicker-container")}
      sx={{ display: "flex", flexDirection: "column", gap: 2, width: "10rem" }}
    >
      <DatePickerFunc
        usecase="date"
        size="medium"
        className="MuiPickersDay-root datepicker"
        format="YYYY.MM.DD"
        value={selectedDate ? selectedDate.toISOString() : null}
        // minDate={moment().toDate()}
        // maxDate={moment().add(1, 'year').toDate()}
        onChange={(value) => setSelectedDate(value ? moment(value) : null)}
      />
    </Box>
  );
};

export const BasicDateField = () => {
  const handleDateChange = (date: ValueDate) => {
    console.log("Selected Date:", date);
  };

  const datePickerProps: DatePickerProps = {
    usecase: "date",
    size: "medium",
    value: null,
    disabled: false,
    readOnly: false,
    status: "default",
    format: "YYYY.MM.DD",
    onChange: handleDateChange,
  };

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 2, width: "10rem" }}
    >
      <DatePickerFunc {...datePickerProps} />
    </Box>
  );
};

export default {
  DatePickerMonth,
  DatePickerYear,
  OnlyDatePicker,
  BasicDateField,
};
