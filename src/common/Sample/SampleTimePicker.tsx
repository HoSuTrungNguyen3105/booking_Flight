import { Box } from "@mui/material";
import {
  Single24Timepicker,
  Single12Timepicker,
  MultiTimepicker,
} from "../TimePicker";
const SampleTimePicker = () => {
  return (
    <Box display={"flex"} flexDirection={"row"} gap={4}>
      <Box display={"flex"} flexDirection={"column"} gap={1}>
        <Single24Timepicker />
        <Single24Timepicker status="Disable" />
        <Single24Timepicker status="ReadOnly" />
        <Single24Timepicker type="Confirmed" />
        <Single24Timepicker type="Error" />
        <Single24Timepicker type="Warning" />
      </Box>
      <Box display={"flex"} flexDirection={"column"} gap={1}>
        <MultiTimepicker />
        <MultiTimepicker status="Disable" />
        <MultiTimepicker status="ReadOnly" />
        <MultiTimepicker type="Confirmed" />
        <MultiTimepicker type="Error" />
        <MultiTimepicker type="Warning" />
      </Box>
      <Box display={"flex"} flexDirection={"column"} gap={1}>
        <Single12Timepicker />
        <Single12Timepicker status="Disable" />
        <Single12Timepicker status="ReadOnly" />
        <Single12Timepicker type="Confirmed" />
        <Single12Timepicker type="Error" />
        <Single12Timepicker type="Warning" language="kr" />
      </Box>
    </Box>
  );
};
export default SampleTimePicker;
