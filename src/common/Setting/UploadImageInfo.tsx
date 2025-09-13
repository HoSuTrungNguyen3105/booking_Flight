import { Box, FormControl, Stack, Typography } from "@mui/material";
import { memo } from "react";
import type { UserData } from "../../utils/type";
import { FileUpload } from "../FileUploader";
import { INPUT_TYPE, type TFileUploader } from "../FileUploader/type";

interface IUserInfoSectionProps {
  myInfo?: UserData;
  onChange: (field: keyof UserData, value: string) => void;
  handleUploadFile: (files: TFileUploader[]) => void;
}

const UploadImageInfo = ({
  myInfo,
  onChange,
  handleUploadFile,
}: IUserInfoSectionProps) => {
  return (
    <Box
      sx={{
        margin: 1,
        border: 1,
        borderColor: "grey.200",
        backgroundColor: "white",
        padding: "10px 16px",
      }}
    >
      <Stack spacing={2} sx={{ width: "384px" }}>
        <FormControl fullWidth>
          <Typography variant="body2" mb={0.5}>
            Image (선택)
          </Typography>
          <FileUpload
            name="productImage"
            onChange={(files) => handleUploadFile(files)}
            accept=".jpg,.png"
            maxFiles={5}
            maxSize="10 MB"
            inputType={INPUT_TYPE.THUMBNAIL}
          />
        </FormControl>
      </Stack>
    </Box>
  );
};

export default memo(UploadImageInfo);
