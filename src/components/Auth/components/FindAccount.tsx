import { FormControl, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import InputTextField from "../../../common/Input/InputTextField";
interface FindAccountProps {
  control: any;
}
const FindAccount = ({ control }: FindAccountProps) => {
  return (
    <>
      <FormControl fullWidth>
        <Typography variant="body1" mb={0.5}>
          Email
        </Typography>
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <InputTextField {...field} placeholder="Nhập email của bạn" />
          )}
        />
      </FormControl>
    </>
  );
};

export default FindAccount;
