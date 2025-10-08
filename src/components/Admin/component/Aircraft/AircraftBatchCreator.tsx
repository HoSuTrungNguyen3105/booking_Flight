import { memo, useCallback, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import DeleteIcon from "../../../../svgs/delete-2-svgrepo.svg";
import type { Aircraft } from "../../../../utils/type";
import { useToast } from "../../../../context/ToastContext";
import {
  useCreateAircraftBatchFlight,
  useDeleteAircraftFlight,
} from "../../../Api/usePostApi";
import { useGetAircraftCode } from "../../../Api/useGetApi";
import InputTextField from "../../../../common/Input/InputTextField";
import DialogConfirm from "../../../../common/Modal/DialogConfirm";

type AircraftError = {
  code: string;
  errorCode: string;
  errorMessage: string;
};

type ReturnProps = {
  onSuccess: () => void;
};

const AircraftBatchCreator = ({ onSuccess }: ReturnProps) => {
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([
    { code: "", model: "", range: 0 },
  ]);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const { refetchCreateAircraftBatchFlightData } =
    useCreateAircraftBatchFlight();

  const [errors, setErrors] = useState<Record<number, string>>({});

  const addAircraft = () => {
    setAircrafts([...aircrafts, { code: "", model: "", range: 0 }]);
  };

  const { getAircraftCodeData, refetchGetAircraftCodeData } =
    useGetAircraftCode();
  const [aircraftCodeState, setAircraftCodeState] = useState<string>("");
  const [pageDetail, setPageDetail] = useState(false);
  const [toggleOpenModal, setToggleOpenModal] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string>("");

  const { refetchDeleteAircraftFlight, loadingDeleteAircraftFlight } =
    useDeleteAircraftFlight(selectedCode);

  const handleViewSeats = (code: string) => {
    setAircraftCodeState(code);
    setPageDetail(true);
  };

  const handleDeleteAircraft = useCallback(async () => {
    setToggleOpenModal(false);
    if (!selectedCode) return;

    try {
      await refetchDeleteAircraftFlight();
      await refetchGetAircraftCodeData();
    } catch (error) {
      console.error("Lỗi khi xóa máy bay:", error);
    }
  }, [refetchDeleteAircraftFlight, selectedCode]);

  const removeAircraft = (index: number) => {
    if (aircrafts.length > 1) {
      setAircrafts(aircrafts.filter((_, i) => i !== index));
      const newErrors = { ...errors };
      delete newErrors[index];
      setErrors(newErrors);
    }
  };

  const updateAircraft = (
    index: number,
    field: "code" | "range" | "model",
    value: string | number
  ) => {
    const updated = [...aircrafts];

    if (field === "range") {
      updated[index].range = Number(value);
    } else {
      updated[index][field] = value as string;
    }

    setAircrafts(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await refetchCreateAircraftBatchFlightData(aircrafts);
      if (response?.resultCode === "00") {
        toast(response?.resultMessage);
        // setAircrafts([{ code: "", model: "", range: 0 }]);
        refetchGetAircraftCodeData();
        const errorMap: Record<number, string> = {};
        response.list?.forEach((res: AircraftError, idx: number) => {
          if (res.errorCode !== "00") {
            errorMap[idx] = res.errorMessage;
          }
        });
        setErrors(errorMap);

        if (Object.keys(errorMap).length === 0) {
          setAircrafts([{ code: "", model: "", range: 0 }]);
          onSuccess();
        }
      } else {
        toast(response?.resultMessage || "Error while create");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: "100%" }}>
      <Button variant="contained" onClick={onSuccess}>
        {" "}
        Return
      </Button>
      {aircrafts.map((aircraft, index) => (
        <Box
          key={index}
          sx={{ mb: 2, p: 2, border: "1px solid #ddd", borderRadius: 1 }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Aircraft No.{index + 1}</Typography>
            {aircrafts.length > 1 && (
              <Button
                variant="text"
                endIcon={<Delete />}
                onClick={() => removeAircraft(index)}
              />
            )}
          </Box>
          <Box sx={{ display: "grid", gap: 2 }}>
            <Box>
              <InputTextField
                clearable
                value={aircraft.code}
                onChange={(e) => updateAircraft(index, "code", e)}
                placeholder="e.g., B738"
              />
              {errors[index] && (
                <Typography color="error" variant="caption">
                  {errors[index]}
                </Typography>
              )}
            </Box>
            <InputTextField
              clearable
              value={aircraft.model}
              onChange={(e) => updateAircraft(index, "model", e)}
              placeholder="e.g., Boeing 737-800"
            />
            <InputTextField
              value={String(aircraft.range)}
              onChange={(e) => updateAircraft(index, "range", e)}
              placeholder="e.g., 5600"
            />
          </Box>
        </Box>
      ))}

      <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
        <Button variant="outlined" startIcon={<Add />} onClick={addAircraft}>
          Add Aircraft
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ flexGrow: 1 }}
        >
          {loading ? "Creating..." : "Create Batch Aircraft"}
        </Button>
      </Box>
      <DialogConfirm
        icon={DeleteIcon}
        cancelLabel="Hủy"
        open={toggleOpenModal}
        onClose={() => setToggleOpenModal(false)}
        onConfirm={handleDeleteAircraft}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa máy bay ${selectedCode} không? Hành động này không thể hoàn tác.`}
        confirmLabel={
          loadingDeleteAircraftFlight ? "Đang xóa..." : "Xác nhận xóa"
        }
      />
    </Box>
  );
};

export default memo(AircraftBatchCreator);
