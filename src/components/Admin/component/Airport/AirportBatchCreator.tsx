import React, { useCallback, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import type { CreateAirportReq } from "../../../../utils/type";
import InputTextField from "../../../../common/Input/InputTextField";
import { ResponseCode } from "../../../../utils/response";
import { useCreateBatchAirport } from "../../../../context/Api/AirportApi";

type ReturnProps = {
  onClose: () => void;
};

const DEFAULT_AIRPORT = { code: "", name: "", city: "", country: "" };

const AirportBatchCreator: React.FC<ReturnProps> = ({ onClose }) => {
  const { refetchCreateBatchAirport } = useCreateBatchAirport();
  const [airports, setAirports] = useState<CreateAirportReq[]>([
    DEFAULT_AIRPORT,
  ]);
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback(
    (index: number, field: keyof CreateAirportReq, value: string) => {
      setAirports((prev) =>
        prev.map((airport, i) =>
          i === index ? { ...airport, [field]: value } : airport
        )
      );
    },
    []
  );

  const handleAddAirport = useCallback(() => {
    setAirports((prev) => [...prev, DEFAULT_AIRPORT]);
  }, []);

  const handleRemoveAirport = useCallback((index: number) => {
    setAirports((prev) => prev.filter((_, i) => i !== index));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await refetchCreateBatchAirport(airports);

      if (res?.resultCode === ResponseCode.SUCCESS) {
        const errorMap: Record<number, string> = {};
        const newAirports = airports.map((airport, idx) => {
          const item = res.list?.[idx];
          if (item?.errorCode !== ResponseCode.SUCCESS) {
            errorMap[idx] = item?.errorMessage || "Unknown error";
            return airport;
          }
          return DEFAULT_AIRPORT;
        });

        setAirports(newAirports);
        setErrors(errorMap);

        if (Object.keys(errorMap).length === 0) {
          onClose();
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box p={1} gap={1}>
      <Typography variant="h5" mb={2} fontWeight="bold">
        Tạo danh sách sân bay
      </Typography>

      <Button variant="contained" onClick={onClose}>
        Return
      </Button>

      {airports.map((airport, index) => (
        <Card
          key={index}
          sx={{
            mb: 2,
            mt: 2,
            gap: 2,
            border: "1px solid #ddd",
            borderRadius: 1,
          }}
        >
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid size={3}>
                <InputTextField
                  value={airport.code}
                  onChange={(e) => handleChange(index, "code", e.toUpperCase())}
                  placeholder="code"
                />
              </Grid>
              <Grid size={3}>
                <InputTextField
                  value={airport.name}
                  onChange={(e) => handleChange(index, "name", e)}
                  placeholder="name"
                />
              </Grid>
              <Grid size={3}>
                <InputTextField
                  value={airport.city}
                  onChange={(e) => handleChange(index, "city", e)}
                  placeholder="city"
                />
              </Grid>
              <Grid size={3}>
                <InputTextField
                  placeholder="country"
                  value={airport.country}
                  onChange={(e) => handleChange(index, "country", e)}
                />
              </Grid>
              <Grid size={12}>
                <IconButton
                  color="primary"
                  onClick={() => handleRemoveAirport(index)}
                  disabled={airports.length === 1}
                >
                  <Delete />
                </IconButton>
              </Grid>
              {errors[index] && (
                <Typography color="error" variant="caption">
                  {errors[index]}
                </Typography>
              )}
            </Grid>
          </CardContent>
        </Card>
      ))}

      <Box display="flex" gap={2}>
        <Button
          startIcon={<Add />}
          variant="outlined"
          onClick={handleAddAirport}
        >
          Thêm sân bay
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          {submitting ? "Submitting..." : "Submit"}
        </Button>
      </Box>
    </Box>
  );
};

export default AirportBatchCreator;
