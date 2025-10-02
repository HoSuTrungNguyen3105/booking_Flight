import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { Add, Delete, Send } from "@mui/icons-material";
import axios from "axios";

export interface UpdateItem {
  userId: number;
  employeeNo: string;
}

type UpdateEmployeeIDProps = {
  updateItem: UpdateItem[];
};

const BatchUpdateEmployeeNo: React.FC<UpdateEmployeeIDProps> = ({
  updateItem,
}) => {
  const [updates, setUpdates] = useState<UpdateItem[]>(updateItem);

  const handleChange = (index: number, field: keyof UpdateItem, value: any) => {
    const newUpdates = [...updates];
    (newUpdates[index][field] as any) = value;
    setUpdates(newUpdates);
  };

  const handleAddRow = () => {
    setUpdates([...updates, { userId: 0, employeeNo: "" }]);
  };

  const handleRemoveRow = (index: number) => {
    setUpdates(updates.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      const payload = { updates };
      const res = await axios.patch("/users/employee-no/batch", payload);
      console.log("Response:", res.data);
      alert("Batch update thành công!");
    } catch (error) {
      console.error(error);
      alert("Có lỗi khi gọi API");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        Batch Update Employee No
      </Typography>

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
            <TextField
              type="number"
              label="User ID"
              value={row.userId}
              onChange={(e) =>
                handleChange(index, "userId", Number(e.target.value))
              }
              sx={{ flex: 1 }}
            />
            <TextField
              label="Employee No"
              value={row.employeeNo}
              onChange={(e) =>
                handleChange(index, "employeeNo", e.target.value)
              }
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
    </Box>
  );
};

export default BatchUpdateEmployeeNo;
