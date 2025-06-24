import "./time-picker.scss";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useEffect, useState } from "react";
import { InputAdornment, TextField, Box } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { koKR, enUS, jaJP } from "@mui/x-date-pickers/locales";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import type { TimePickerProps } from "./type";
import type { Moment } from "moment";
import moment from "moment";
enum typeEnum {
  Error = "Error",
  Warning = "Warning",
  Confirmed = "Confirmed",
}

const MUITimePickertypeIcon = {
  type: {
    [typeEnum.Error]: "icon-ban-time-picker",
    [typeEnum.Confirmed]: "icon-confirmed",
    [typeEnum.Warning]: "icon-warning",
  },
};

export const MultiTimepicker = ({
  type,
  status = "Default",
  size = "medium",
}: TimePickerProps) => {
  const gettypeIcon = () => {
    if (!type) {
      return `timepicker`;
    }
    return `timepicker ${MUITimePickertypeIcon.type[type]}`;
  };
  const [ReadOnly, setReadOnly] = useState(
    status === "ReadOnly" ? true : false
  );
  const [Disable, setDisable] = useState(status === "Disable" ? true : false);
  const getIcon = () => {
    if (type === "Error") {
      return (
        <i
          className="icon-bann-time-picker"
          aria-hidden="true"
          aria-label="icon-error"
        ></i>
      );
    } else if (type === "Confirmed") {
      return (
        <CheckCircleRoundedIcon
          className="text-teal-500 text-xl"
          aria-label="icon-confirmed"
        />
      );
    } else if (type === "Warning") {
      return (
        <ErrorRoundedIcon
          className="text-yellow-500 text-xl"
          aria-label="icon-warning"
        />
      );
    }
  };
  const [value, setValue] = useState<Moment | null>(null);
  useEffect(() => {
    setValue(moment());
  }, []);
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Box className="container">
        <Box className="Multi-default" data-testid="Multi">
          <TimePicker
            ampm={false}
            views={["hours"]}
            readOnly={ReadOnly}
            disabled={Disable}
            value={value}
            className={gettypeIcon()}
            slots={{
              textField: TextField,
            }}
            slotProps={{
              textField: (params: Record<string, any>) => ({
                ...params,
                InputProps: {
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {params.InputProps?.endAdornment}
                      <InputAdornment position="start" className="icon">
                        {getIcon()}
                      </InputAdornment>
                    </>
                  ),
                  placeholder: "HH",
                },
              }),
              inputAdornment: {
                position: "start",
                sx: { margin: 0 },
              },
              nextIconButton: {
                sx: { padding: 8, paddingRight: 2 },
              },
            }}
          />
          <TimePicker
            views={["minutes"]}
            ampm={false}
            readOnly={ReadOnly}
            disabled={Disable}
            value={value}
            className={gettypeIcon()}
            timeSteps={{ minutes: 1 }}
            slotProps={{
              textField: () => ({
                InputProps: {
                  endAdornment: (
                    <>
                      <InputAdornment position="start" className="icon">
                        {getIcon()}
                      </InputAdornment>
                    </>
                  ),
                },
                placeholder: "MM",
              }),
              inputAdornment: {
                position: "start",
                sx: { margin: 0 },
              },
              nextIconButton: {
                sx: { padding: 8, paddingRight: 2 },
              },
            }}
          />
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export const Single24Timepicker = ({
  type,
  status = "Default",
  size = "medium",
}: TimePickerProps) => {
  const gettypeIcon = () => {
    if (!type) {
      return `timepicker`;
    }
    return `timepicker ${MUITimePickertypeIcon.type[type]}`;
  };
  const getIcon = () => {
    if (type === "Error") {
      return (
        <i
          className="icon-bann-time-picker"
          aria-hidden="true"
          aria-label="icon-error"
        ></i>
      );
    } else if (type === "Confirmed") {
      return (
        <CheckCircleRoundedIcon
          className="text-teal-500 text-xl"
          aria-label="icon-confirmed"
        />
      );
    } else if (type === "Warning") {
      return (
        <ErrorRoundedIcon
          className="text-yellow-500 text-xl"
          aria-label="icon-warning"
        />
      );
    }
  };
  const [ReadOnly, setReadOnly] = useState(
    status === "ReadOnly" ? true : false
  );
  const [Disable, setDisable] = useState(status === "Disable" ? true : false);
  const [value, setValue] = useState<Moment | null>(null);
  useEffect(() => {
    setValue(moment());
  }, []);
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Box className="container" data-testid="Single24">
        {/*Single type (24h)*/}
        <TimePicker
          timeSteps={{ minutes: 15 }}
          thresholdToRenderTimeInASingleColumn={96}
          readOnly={ReadOnly}
          disabled={Disable}
          value={value}
          ampm={false}
          className={gettypeIcon()}
          slotProps={{
            textField: () => ({
              InputProps: {
                endAdornment: (
                  <>
                    <InputAdornment position="start" className="icon">
                      {getIcon()}
                    </InputAdornment>
                  </>
                ),
              },
              placeholder: "HH:MM",
            }),
            inputAdornment: {
              position: "start",
              sx: { margin: 0 },
            },
            nextIconButton: {
              sx: { padding: 8, paddingRight: 2 },
            },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
};

export const Single12Timepicker = ({
  type,
  status = "Default",
  size = "medium",
  language = "en",
}: TimePickerProps) => {
  const gettypeIcon = () => {
    if (!type) {
      return `timepicker`;
    }
    return `timepicker ${MUITimePickertypeIcon.type[type]}`;
  };
  const getIcon = () => {
    if (type === "Error") {
      return (
        <i
          className="icon-bann-time-picker"
          aria-hidden="true"
          aria-label="icon-error"
        ></i>
      );
    } else if (type === "Confirmed") {
      return (
        <CheckCircleRoundedIcon
          className="text-teal-500 text-xl"
          aria-label="icon-confirmed"
        />
      );
    } else if (type === "Warning") {
      return (
        <ErrorRoundedIcon
          className="text-yellow-500 text-xl"
          aria-label="icon-warning"
        />
      );
    }
  };
  const [ReadOnly, setReadOnly] = useState(
    status === "ReadOnly" ? true : false
  );
  const [Disable, setDisable] = useState(status === "Disable" ? true : false);
  const [value, setValue] = useState<Moment | null>(null);

  // useEffect(() => {
  //   moment.locale(language);
  //   setValue(moment());
  // }, [language]);

  useEffect(() => {
    moment.locale(language);
    setValue(moment());

    const timer = setInterval(() => {
      setValue(moment());
    }, 60 * 1000); // Cập nhật mỗi phút

    return () => clearInterval(timer); // Dọn dẹp khi unmount
  }, [language]);

  const localeText =
    language === "kr"
      ? koKR.components.MuiLocalizationProvider.defaultProps.localeText
      : language === "jp"
      ? jaJP.components.MuiLocalizationProvider.defaultProps.localeText
      : enUS.components.MuiLocalizationProvider.defaultProps.localeText;

  return (
    <LocalizationProvider dateAdapter={AdapterMoment} localeText={localeText}>
      <Box className="container" data-testid="Single12">
        {/*Single type (12h)*/}
        <TimePicker
          readOnly={status === "ReadOnly"}
          disabled={status === "Disable"}
          value={value}
          format="A hh:mm"
          className={gettypeIcon()}
          slotProps={{
            textField: () => ({
              // textField: {
              //   sx: {
              //     "& .container MuiBox-root": {
              //       border: "none",
              //     },
              //     "& .MuiOutlinedInput-notchedOutline": {
              //       border: "none",
              //     },
              //   },
              // },
              InputProps: {
                endAdornment: (
                  <>
                    <InputAdornment position="start" className="icon">
                      {getIcon()}
                    </InputAdornment>
                  </>
                ),
              },
              placeholder: "-- HH:MM",
            }),
            inputAdornment: {
              position: "start",
              sx: { padding: 0, margin: 0 },
            },
            nextIconButton: {
              sx: { padding: 8, paddingRight: 2 },
            },
            popper: {
              sx: {
                "& .css-1annikf-MuiMultiSectionDigitalClock-root": {
                  display: "flex",
                  flexDirection: "row-reverse",
                },
                "& [aria-label='Select meridiem']": {
                  order: 2,
                },
                "& [aria-label='Select hours']": {
                  order: 1,
                },
                "& [aria-label='Select minutes']": {
                  order: -1,
                },
              },
            },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
};
