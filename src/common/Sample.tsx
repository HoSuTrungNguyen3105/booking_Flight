import { Box, Typography } from "@mui/material";
import type { ResponseMessage } from "../utils/type";
import { Button } from "./Button/Button";
import { useEffect, useState } from "react";
import TextArea from "./Input/TextArea";
import { useToast } from "../context/ToastContext";
import { Controller, useForm } from "react-hook-form";
import { useFetch } from "../context/use[custom]/useFetch";
import ContentModal from "./Modal/ContentModal";

type SampleParams = {
  limit: number;
  offset: number;
};

const Sample = () => {
  const { refetch } = useFetch<ResponseMessage, SampleParams>({
    message: {
      success: "이것이 나타날 토스트입니다.",
    },
    url: "/posts",
  });
  const { control, watch, register, reset } = useForm({
    defaultValues: {
      name: "",
    },
  });
  const toast = useToast();
  const handleOpenToaats = () => {
    toast("이것이 나타날 토스트입니다이것이 나타날 토스트입니다", "success");
  };
  const [isDisable, setIsDisable] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const name = watch("name");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setIsDisable(name.trim() === "");
  }, [name]);

  useEffect(() => {
    if (open) {
      reset();
      setError("");
    }
  }, [open]);

  const handleSubmit = () => {
    setError("이름을 입력해주세요.");
    toast("이름을 입력해주세요.", "error");
    return;
  };

  return (
    <Box>
      <Box display={"flex"}>
        <Box>
          <Box display={"flex"} gap={3} paddingTop={5} paddingLeft={5}>
            <Button
              appearance="contained"
              priority="primary"
              onClick={() => handleOpen()}
              label="Button"
              iconPosition="trailing"
              size="large"
            />
            <ContentModal
              open={open}
              title="이나타날 토스트입니다."
              title2="이나타."
              hideCloseBtn
              disabled={isDisable}
              handleClose={handleClose}
              submitLabel="이것이"
              errorMessage={error}
              handleSubmit={handleSubmit}
              contentArea={
                <Box>
                  <Typography fontWeight="bold">
                    이것이 나타날 토스트입니다
                  </Typography>
                  <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <TextArea {...register("name")} {...field} />
                    )}
                  />
                </Box>
              }
            />
          </Box>

          <Button
            appearance="contained"
            priority="custom"
            label="단추단추"
            onClick={() => handleSubmit()}
            size="large"
            customLabelColor="#000000"
            customColor="#fdd835"
          />

          <Button
            appearance="contained"
            priority="custom"
            onClick={() => handleOpenToaats()}
            customLabelColor="#000000"
            isHovered={false}
            label="단추단추"
            customColor="#ffa500"
            size="large"
          />

          <Button
            appearance="contained"
            priority="custom"
            label="단추단추"
            onClick={() => refetch()}
            size="large"
            customLabelColor="#000000"
            disabled
            customColor="#fdd835" // 🌟 vàng sáng nổi bật
          />

          <Button
            appearance="contained"
            priority="custom"
            onClick={() => refetch()}
            customLabelColor="#000000"
            isHovered={false}
            label="단추단추"
            customColor="#ffa500" // 🌟 vàng sáng nổi bật
            size="large"
            disabled
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Sample;
