import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Grid,
  Chip,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Add, Close, CloudUpload } from "@mui/icons-material";
import {
  useCreateTerminalBulk,
  // useCreateTerminalSingle,
  type CreateTerminalDto,
} from "../../../../../context/Api/usePostApi";

interface CreateTerminalDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// interface TerminalFormData {
//   code: string;
//   name: string;
//   description: string;
//   type: string;
//   airportId: string;
// }

const CreateTerminalDialog: React.FC<CreateTerminalDialogProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [mode, setMode] = useState<"single" | "multi">("single");
  const [formData, setFormData] = useState<CreateTerminalDto[]>([
    {
      code: "",
      name: "",
      description: "",
      type: "DOMESTIC",
      airportId: "",
    },
  ]);

  const handleAddGate = () => {
    setFormData((prev) => [
      ...prev,
      {
        code: "",
        airportId: "",
        name: "",
        description: "",
        type: "DOMESTIC",
      },
    ]);
  };

  const handleChange = (index: number, key: string, value: string) => {
    setFormData((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );
  };

  const handleRemoveGate = (index: number) => {
    setFormData((prev) => prev.filter((_, i) => i !== index));
  };
  const [bulkData, setBulkData] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const steps = ["Chọn phương thức", "Nhập thông tin", "Xác nhận"];
  const { refetchCreateTerminalBulk } = useCreateTerminalBulk();
  // const { refetchCreateTerminalSingle }= useCreateTerminalSingle();

  const handleCreateTypeSubmit = async () => {
    setLoading(true);
    setMessage(null);

    try {
      // // Parse bulk data
      // const terminals = bulkData
      //   .split("\n")
      //   .filter((line) => line.trim())
      //   .map((line) => {
      //     const [code, name, type = "DOMESTIC"] = line
      //       .split(",")
      //       .map((item) => item.trim());
      //     return { code, name, type, airportId: "default-airport-id" };
      //   });
      const res = await refetchCreateTerminalBulk();
    } catch (error) {
      setMessage({ type: "error", text: "Lỗi kết nối máy chủ" });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setActiveStep(0);
    setMode("single");
    // setFormData({
    //   code: "",
    //   name: "",
    //   description: "",
    //   type: "DOMESTIC",
    //   airportId: "",
    // });
    setBulkData("");
    setMessage(null);
    onClose();
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Chọn phương thức tạo terminal
            </Typography>
            <Grid container spacing={2}>
              <Grid size={6}>
                <Box
                  sx={{
                    border:
                      mode === "single"
                        ? "2px solid #1976d2"
                        : "1px solid #ddd",
                    borderRadius: 2,
                    p: 3,
                    textAlign: "center",
                    cursor: "pointer",
                    bgcolor: mode === "single" ? "#f0f7ff" : "white",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "#1976d2",
                      bgcolor: "#f0f7ff",
                    },
                  }}
                  onClick={() => setMode("single")}
                >
                  <Add sx={{ fontSize: 48, color: "#1976d2", mb: 1 }} />
                  <Typography variant="h6" gutterBottom>
                    Tạo đơn lẻ
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tạo từng terminal một với đầy đủ thông tin chi tiết
                  </Typography>
                </Box>
              </Grid>
              <Grid size={6}>
                <Box
                  sx={{
                    border:
                      mode === "multi" ? "2px solid #1976d2" : "1px solid #ddd",
                    borderRadius: 2,
                    p: 3,
                    textAlign: "center",
                    cursor: "pointer",
                    bgcolor: mode === "multi" ? "#f0f7ff" : "white",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "#1976d2",
                      bgcolor: "#f0f7ff",
                    },
                  }}
                  onClick={() => setMode("multi")}
                >
                  <CloudUpload sx={{ fontSize: 48, color: "#1976d2", mb: 1 }} />
                  <Typography variant="h6" gutterBottom>
                    Tạo hàng loạt
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tạo nhiều terminal cùng lúc bằng cách nhập dữ liệu theo định
                    dạng
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Thông tin terminal
            </Typography>
            {formData.map((item, index) => (
              <Box
                key={index}
                sx={{ mb: 3, p: 2, border: "1px solid #ccc", borderRadius: 2 }}
              >
                <Grid container spacing={2}>
                  <Grid size={6}>
                    <TextField
                      fullWidth
                      label="Mã terminal *"
                      value={item.code}
                      onChange={(e) =>
                        handleChange(
                          index,
                          "code",
                          e.target.value.toUpperCase()
                        )
                      }
                      placeholder="VD: T1, T2"
                    />
                  </Grid>
                  <Grid size={6}>
                    <TextField
                      fullWidth
                      label="Tên terminal *"
                      value={item.name}
                      onChange={(e) =>
                        handleChange(index, "name", e.target.value)
                      }
                      placeholder="VD: Terminal Quốc tế"
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Mô tả"
                      multiline
                      rows={3}
                      value={item.description}
                      onChange={(e) =>
                        handleChange(index, "description", e.target.value)
                      }
                      placeholder="Mô tả về terminal..."
                    />
                  </Grid>
                </Grid>

                {/* Nếu là multi thì có nút xóa từng form */}
                {mode === "multi" && formData.length > 1 && (
                  <Button
                    color="error"
                    variant="outlined"
                    sx={{ mt: 1 }}
                    onClick={() => handleRemoveGate(index)}
                  >
                    Xóa form này
                  </Button>
                )}
              </Box>
            ))}

            {/* Nếu là multi thì hiển thị nút Thêm */}
            {mode === "multi" && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddGate}
              >
                + Thêm terminal
              </Button>
            )}
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Xác nhận thông tin
            </Typography>
            {mode === "single" ? (
              (() => {
                const singleData = Array.isArray(formData)
                  ? formData[0]
                  : formData;
                if (!singleData) return null;

                return (
                  <Box sx={{ p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                    <Typography>
                      <strong>Mã:</strong> {singleData.code}
                    </Typography>
                    <Typography>
                      <strong>Tên:</strong> {singleData.name}
                    </Typography>
                    <Typography>
                      <strong>Mô tả:</strong>{" "}
                      {singleData.description || "Không có"}
                    </Typography>
                  </Box>
                );
              })()
            ) : (
              <Box sx={{ maxHeight: 200, overflow: "auto" }}>
                {/* {console.log(" MODE MULTI, bulkData:", bulkData)} */}
                {(bulkData ?? "")
                  .split("\n")
                  .filter((line) => line.trim())
                  .map((line, index) => {
                    console.log("➡️ line:", line);
                    return (
                      <Typography key={index} sx={{ m: 0.5 }}>
                        {line.length}
                      </Typography>
                    );
                  })}
              </Box>
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Tạo Terminal Mới</Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {message && (
          <Alert severity={message.type} sx={{ mb: 2 }}>
            {message.text}
          </Alert>
        )}

        {renderStepContent()}
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          onClick={() =>
            activeStep > 0 ? setActiveStep(activeStep - 1) : handleClose()
          }
          disabled={loading}
        >
          {activeStep === 0 ? "Hủy" : "Quay lại"}
        </Button>

        <Button
          variant="contained"
          onClick={() => {
            if (activeStep < steps.length - 1) {
              setActiveStep(activeStep + 1);
            } else {
              // mode === "single" ? handleSingleSubmit() : handleBulkSubmit();
            }
          }}
          // disabled={
          //   loading ||
          //   (activeStep === 1 &&
          //     mode === "single" &&
          //     (!formData.map.code || !formData.name))
          // }
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading
            ? "Đang xử lý..."
            : activeStep === steps.length - 1
            ? "Xác nhận tạo"
            : "Tiếp theo"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTerminalDialog;
