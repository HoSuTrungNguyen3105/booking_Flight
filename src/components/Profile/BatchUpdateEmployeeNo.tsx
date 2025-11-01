import React, { useCallback, useState } from "react";
import { Button, IconButton, Stack, Typography, Paper } from "@mui/material";
import { Add, Delete, Send } from "@mui/icons-material";
import {
  useUpdateBatchEmployeeNo,
  type BatchEmployeeNoReq,
  type BatchUpdateEmployeesDto,
} from "../../context/Api/usePostApi";
import { useToast } from "../../context/ToastContext";
import InputTextField from "../../common/Input/InputTextField";
import type { ReqUpdateEmployeeNo } from "./ManageMyInfo";
import { ResponseCode } from "../../utils/response";

type UpdateEmployeeIDProps = {
  updateItem: ReqUpdateEmployeeNo[];
  onSuccess: () => void;
  onClose: () => void;
};

const BatchUpdateEmployeeNo: React.FC<UpdateEmployeeIDProps> = ({
  updateItem,
  onSuccess,
  onClose,
}) => {
  const [updates, setUpdates] = useState<ReqUpdateEmployeeNo[]>(updateItem);
  const handleChange = (
    index: number,
    field: keyof BatchEmployeeNoReq,
    value: string | number
  ) => {
    const newUpdates = [...updates];
    (newUpdates[index][field] as string | number) = value;
    setUpdates(newUpdates);
  };

  const handleAddRow = () => {
    setUpdates([...updates, { userId: 0, name: "", employeeNo: "" }]);
  };

  const handleRemoveRow = (index: number) => {
    setUpdates(updates.filter((_, i) => i !== index));
  };

  const { refetchUpdateBatchEmployeeNo } = useUpdateBatchEmployeeNo();
  const toast = useToast();

  const handleSubmit = useCallback(async () => {
    try {
      const payload: BatchUpdateEmployeesDto = { updates };
      const res = await refetchUpdateBatchEmployeeNo(payload);
      if (res?.resultCode === ResponseCode.SUCCESS) {
        toast(res.resultMessage, "success");
        onSuccess();
      }
    } catch (error) {
      console.error(error);
      alert("Có lỗi khi gọi API");
    }
  }, [refetchUpdateBatchEmployeeNo, onSuccess, toast]);

  return (
    <>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        Batch Update Employee No
      </Typography>
      <Button
        sx={{ width: "20rem", justifyContent: "flex-start" }}
        onClick={onClose}
        variant="outlined"
      >
        Return
      </Button>

      <Stack spacing={2}>
        {updates.map((row, index) => (
          <Paper
            key={index}
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <InputTextField
              type="number"
              placeholder="User ID "
              value={String(row.userId)}
              onChange={(e) => handleChange(index, "userId", Number(e))}
              sx={{ flex: 1 }}
            />
            <InputTextField
              value={row.name}
              placeholder="Employee name"
              readOnly
              // onChange={(e) => handleChange(index, "employeeNo", e)}
              sx={{ flex: 2 }}
            />
            <InputTextField
              value={row.employeeNo}
              placeholder="Employee No"
              onChange={(e) => handleChange(index, "employeeNo", e)}
              sx={{ flex: 2 }}
            />
            <IconButton
              color="error"
              onClick={() => handleRemoveRow(index)}
              sx={{ flexShrink: 0 }}
            >
              <Delete />
            </IconButton>
          </Paper>
        ))}

        <Button
          variant="outlined"
          startIcon={<Add />}
          onClick={handleAddRow}
          sx={{ alignSelf: "flex-start" }}
        >
          Thêm dòng
        </Button>

        <Button
          variant="contained"
          startIcon={<Send />}
          onClick={handleSubmit}
          sx={{ alignSelf: "flex-start" }}
        >
          Gửi batch update
        </Button>
      </Stack>
    </>
  );
};

export default BatchUpdateEmployeeNo;
