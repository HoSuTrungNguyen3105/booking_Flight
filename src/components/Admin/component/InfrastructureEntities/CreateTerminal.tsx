import React, { useState, useCallback } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import { Plus, Trash } from "lucide-react";
import { useCreateTerminalBulk } from "../../../../context/Api/usePostApi";
import type { CreateTerminalDto } from "../../../../utils/type";
import { useNavigate } from "react-router-dom";
import {
  mapStringToDropdown,
  useFindAllAirportIds,
  useFindAllTerminalTypes,
} from "../../../../context/Api/useGetApi";
import SelectDropdown from "../../../../common/Dropdown/SelectDropdown";
import InputTextField from "../../../../common/Input/InputTextField";
import { useToast } from "../../../../context/ToastContext";
import { ResponseCode } from "../../../../utils/response";

export type TerminalType = "DOMESTIC" | "INTERNATIONAL" | "CARGO";

// export interface CreateTerminalReq {
//   code: string;
//   name: string;
//   description?: string;
//   type: TerminalType;
//   airportId: string;
// }

interface TerminalBatchCreatorProps {
  onClose: () => void;
  //   createBatchTerminal: (
  //     terminals: CreateTerminalReq[]
  //   ) => Promise<{ resultCode: string; list?: any[] }>;
}

const DEFAULT_TERMINAL: CreateTerminalDto = {
  code: "",
  name: "",
  description: "",
  type: "DOMESTIC",
  airportId: "",
};

export const TerminalBatchCreator = () => {
  const [terminals, setTerminals] = useState<CreateTerminalDto[]>([
    DEFAULT_TERMINAL,
  ]);
  const toast = useToast();
  const { dataFindAllAirportIds } = useFindAllAirportIds();
  const optionDataAllAirportIds = mapStringToDropdown(
    dataFindAllAirportIds?.list?.map((e) => e.code) || []
  );
  const { dataTerminalTypes } = useFindAllTerminalTypes();
  const optionDataTerminalTypes = mapStringToDropdown(
    dataTerminalTypes?.data || []
  );
  const navigate = useNavigate();
  const { refetchCreateTerminalBulk } = useCreateTerminalBulk();
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback(
    (index: number, field: keyof CreateTerminalDto, value: any) => {
      setTerminals((prev) =>
        prev.map((t, i) => (i === index ? { ...t, [field]: value } : t))
      );
    },
    []
  );

  const handleAddTerminal = () =>
    setTerminals((prev) => [...prev, DEFAULT_TERMINAL]);

  const handleRemoveTerminal = (index: number) => {
    setTerminals((prev) => prev.filter((_, i) => i !== index));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await refetchCreateTerminalBulk(terminals);
      toast(res?.resultMessage || "Succes");
      if (res?.resultCode === ResponseCode.SUCCESS) {
        const errorMap: Record<number, string> = {};
        const newTerminals = terminals.map((t, idx) => {
          // const item = res.resultMessage?.[idx];
          //   if (item?.resultCode !== "00") {
          //     errorMap[idx] = item?.resultMessage || "Unknown error";
          //     return t;
          //   }
          // toast(item || "Succes");
          navigate("/admin/TerminalContainer");
          return DEFAULT_TERMINAL;
        });
        setTerminals(newTerminals);
        setErrors(errorMap);
        if (Object.keys(errorMap).length === 0) () => navigate(-1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Create Terminals in Bulk
      </Typography>

      {terminals.map((t, idx) => (
        <Card
          key={idx}
          sx={{ mb: 2, border: "1px solid #ddd", borderRadius: 2 }}
        >
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid size={3}>
                <InputTextField
                  placeholder="Code"
                  value={t.code}
                  onChange={(e) => handleChange(idx, "code", e.toUpperCase())}
                  error={!!errors[idx]}
                />
              </Grid>
              <Grid size={3}>
                <InputTextField
                  placeholder="Name"
                  value={t.name}
                  onChange={(e) => handleChange(idx, "name", e)}
                />
              </Grid>
              <Grid size={3}>
                <SelectDropdown
                  placeholder="Airport ID"
                  options={optionDataAllAirportIds}
                  value={t.airportId}
                  onChange={(e) => handleChange(idx, "airportId", e)}
                />
                {/* <TextField
                  fullWidth
                  label="Airport ID"
                  value={t.airportId}
                  onChange={(e) =>
                    handleChange(idx, "airportId", e.target.value)
                  }
                /> */}
              </Grid>
              <Grid size={3}>
                <SelectDropdown
                  options={optionDataTerminalTypes}
                  value={t.type}
                  onChange={(e) => handleChange(idx, "type", e as TerminalType)}
                />
                {/* <TextField
                  select
                  fullWidth
                  label="Type"
                  value={t.type}
                  onChange={(e) =>
                    handleChange(idx, "type", e.target.value as TerminalType)
                  }
                >
                  <MenuItem value="DOMESTIC">DOMESTIC</MenuItem>
                  <MenuItem value="INTERNATIONAL">INTERNATIONAL</MenuItem>
                  <MenuItem value="CARGO">CARGO</MenuItem>
                </TextField> */}
              </Grid>
              <Grid size={12}>
                <InputTextField
                  placeholder="Description"
                  value={t.description}
                  onChange={(e) => handleChange(idx, "description", e)}
                />
              </Grid>

              <Grid size={12} display="flex" justifyContent="flex-end">
                <Button
                  color="error"
                  startIcon={<Trash size={16} />}
                  onClick={() => handleRemoveTerminal(idx)}
                  disabled={terminals.length === 1}
                >
                  Remove
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

      <Box display="flex" gap={2} mt={2}>
        <Button
          variant="outlined"
          startIcon={<Plus size={16} />}
          onClick={handleAddTerminal}
        >
          Add Terminal
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit"}
        </Button>
      </Box>
    </Box>
  );
};
