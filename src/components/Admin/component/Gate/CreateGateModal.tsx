import { useCallback, useState } from "react";
import {
  Box,
  Button,
  Grid,
  Divider,
  Paper,
  Typography,
  Stack,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import SelectDropdown, {
  type ActionType,
} from "../../../../common/Dropdown/SelectDropdown";
import InputTextField from "../../../../common/Input/InputTextField";
import theme from "../../../../scss/theme";
import {
  useFindAllGateStatuses,
  useFindTerminalIDStatuses,
} from "../../../Api/useGetApi";
import BaseModal from "../../../../common/Modal/BaseModal";
import { Loading } from "../../../../common/Loading/Loading";
import {
  useCreateBatchGate,
  useUpdateGate,
  type CreateGateProps,
} from "../../../Api/usePostApi";
import type { UpdateGateProps } from "../../TerminalContainer";
import type { Gate } from "../../../../utils/type";
import { useToast } from "../../../../context/ToastContext";

type IGateModalProps = {
  terminalId: string;
  mode: "create" | "update";
  open: boolean;
  data: Gate;
  setData: React.Dispatch<React.SetStateAction<UpdateGateProps>>;
  onClose: () => void;
  onSuccess: () => void;
};

const ManageGateModal = ({
  mode,
  terminalId,
  open,
  onClose,
  data,
  setData,
  onSuccess,
}: IGateModalProps) => {
  const [formData, setFormData] = useState<CreateGateProps[]>([
    { code: "", terminalId, status: "" },
  ]);

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateGateProps, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { dataGateStatuses } = useFindAllGateStatuses();
  const { dataTerminalIDStatuses } = useFindTerminalIDStatuses();
  const { refetchCreateBatchGate } = useCreateBatchGate();
  const { refetchUpdateGate } = useUpdateGate({ id: data.id });
  const toast = useToast();
  const terminalOptions: ActionType[] = (
    dataTerminalIDStatuses?.list ?? []
  ).map((t) => ({
    value: t.value,
    label: t.label,
    color: "#880e4f",
  }));

  const handleAddGate = () => {
    setFormData((prev) => [...prev, { code: "", terminalId, status: "" }]);
  };

  const handleRemoveGate = (index: number) => {
    setFormData((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (
    index: number,
    field: keyof CreateGateProps,
    value: string
  ) => {
    setFormData((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value, terminalId } : item
      )
    );
  };

  const gateStatusOptions: ActionType[] =
    (dataGateStatuses?.data || []).map((status) => {
      switch (status) {
        case "AVAILABLE":
          return {
            value: status,
            label: "Khả dụng",
            color: theme.palette.info.light,
          };
        case "OCCUPIED":
          return {
            value: status,
            label: "Đang sử dụng",
            color: theme.palette.warning.main,
            disabled: mode !== "update",
          };
        case "MAINTENANCE":
          return {
            value: status,
            label: "Bảo trì",
            color: theme.palette.info.main,
            disabled: mode !== "update",
          };
        case "CLOSED":
          return {
            value: status,
            label: "Đã đóng",
            color: theme.palette.error.main,
            disabled: mode !== "update",
          };
        default:
          return {
            value: status,
            label: status,
            color: theme.palette.grey[500],
          };
      }
    }) ?? [];

  const handleSelectChange =
    (field: keyof CreateGateProps) => (value: string | number) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    };

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    if (mode === "create") {
      try {
        const cleaned = formData.filter((g) => g.code.trim() !== "");
        const res = await refetchCreateBatchGate(cleaned);

        if (res?.resultCode === "00") {
          onSuccess();
          onClose();
        }
      } catch (error) {
        console.error("Batch create error:", error);
      } finally {
        setIsSubmitting(false);
      }
    } else if (mode === "update") {
      try {
        const res = await refetchUpdateGate({
          code: data.code,
          status: data.status,
        });

        if (res?.resultCode === "00") {
          onSuccess();
          onClose();
        } else {
          toast(res?.resultMessage || "Error", "error");
        }
      } catch (error) {
        console.error("Update gate error:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [
    mode,
    formData,
    data,
    onSuccess,
    onClose,
    refetchCreateBatchGate,
    refetchUpdateGate,
  ]);

  const renderActions = useCallback(() => {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        <Grid size={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 2,
              flexWrap: "wrap",
            }}
          >
            <Button
              onClick={handleSubmit}
              variant="contained"
              startIcon={!isSubmitting ? <AddIcon /> : <Loading />}
              disabled={isSubmitting}
              sx={{ borderRadius: 2, px: 3 }}
            >
              {isSubmitting ? "Đang xử lý..." : "Tạo Cổng"}
            </Button>
          </Box>
        </Grid>
      </Box>
    );
  }, [handleSubmit, isSubmitting]);

  const renderCreateForm = () => (
    <>
      {formData.map((gate, index) => (
        <Grid
          key={index}
          container
          spacing={2}
          alignItems="center"
          sx={{ borderBottom: "1px solid #eee", mb: 1, pb: 1 }}
        >
          <Grid size={4}>
            <InputTextField
              value={gate.code}
              placeholder="Gate Code (VD: G01)"
              onChange={(v) => handleChange(index, "code", v)}
            />
          </Grid>

          <Grid size={5}>
            <Stack sx={{ width: "10rem" }}>
              <SelectDropdown
                value={gate.status}
                options={gateStatusOptions}
                onChange={(v) => handleChange(index, "status", v as string)}
              />
            </Stack>
          </Grid>

          <Grid size={2}>
            <Button color="error" onClick={() => handleRemoveGate(index)}>
              <DeleteIcon />
            </Button>
          </Grid>
        </Grid>
      ))}

      <Typography variant="body1">Terminal : {terminalId}</Typography>

      <Button onClick={handleAddGate} startIcon={<AddIcon />} sx={{ mt: 1 }}>
        Thêm dòng mới
      </Button>
    </>
  );

  const renderUpdateForm = () => (
    <Grid container spacing={2}>
      <Grid size={6}>
        <InputTextField
          value={data.code}
          placeholder="Gate Code (VD: G01)"
          onChange={(v) => setData({ ...data, code: v })}
        />
      </Grid>

      <Grid size={6}>
        <SelectDropdown
          value={data.status}
          options={gateStatusOptions}
          onChange={(v) => setData({ ...data, status: v as string })}
        />
      </Grid>
    </Grid>
  );

  const renderContent = useCallback(() => {
    return (
      <Paper
        sx={{ p: 2, minWidth: "30rem", overflow: "auto", height: "10rem" }}
      >
        {mode === "create" ? renderCreateForm() : renderUpdateForm()}
      </Paper>
    );
  }, [formData, data, gateStatusOptions, terminalId]);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Tạo Cổng Mới"
      subtitle="Thêm cổng mới vào hệ thống quản lý sân bay"
      Icon={AddIcon}
      slots={{ content: renderContent(), actions: renderActions() }}
    />
  );
};

export default ManageGateModal;
