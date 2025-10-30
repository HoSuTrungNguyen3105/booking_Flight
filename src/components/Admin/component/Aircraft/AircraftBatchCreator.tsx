import { memo, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import type { Aircraft } from "../../../../utils/type";
import { useToast } from "../../../../context/ToastContext";
import { useCreateAircraftBatchFlight } from "../../../../context/Api/usePostApi";
import { useGetAircraftCode } from "../../../../context/Api/useGetApi";
import InputTextField from "../../../../common/Input/InputTextField";
import { ResponseCode } from "../../../../utils/response";

type AircraftError = {
  code: string;
  errorCode: string;
  errorMessage: string;
};

type ReturnProps = {
  onSuccess: () => void;
};

type AircraftProps = Omit<Aircraft, "flights">;

const AircraftBatchCreator = ({ onSuccess }: ReturnProps) => {
  const [aircrafts, setAircrafts] = useState<AircraftProps[]>([
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

  const { refetchGetAircraftCodeData } = useGetAircraftCode();

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
    field: keyof AircraftProps,
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
      if (response?.resultCode === ResponseCode.SUCCESS) {
        toast(response?.resultMessage);
        // setAircrafts([{ code: "", model: "", range: 0 }]);
        refetchGetAircraftCodeData();
        const errorMap: Record<number, string> = {};
        response.list?.forEach((res: AircraftError, idx: number) => {
          if (res.errorCode !== ResponseCode.SUCCESS) {
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
    </Box>
  );
};

export default memo(AircraftBatchCreator);
