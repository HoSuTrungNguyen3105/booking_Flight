import React, { useState } from "react";
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
import type { CreateAirportReq } from "../../../utils/type";
import InputTextField from "../../../common/Input/InputTextField";
import { useCreateBatchAirport } from "../../Api/usePostApi";
type ReturnProps = {
  onClose: () => void;
};
const AirportBatchCreator: React.FC<ReturnProps> = ({ onClose }) => {
  const { refetchCreateBatchAirport } = useCreateBatchAirport();
  const [airports, setAirports] = useState<CreateAirportReq[]>([
    { code: "", name: "", city: "", country: "" },
  ]);
  const [errors, setErrors] = useState<Record<number, string>>({});

  const handleChange = (
    index: number,
    field: keyof CreateAirportReq,
    value: string
  ) => {
    const newAirports = [...airports];
    newAirports[index][field] = value;
    setAirports(newAirports);
  };

  const handleAddAirport = () => {
    setAirports([...airports, { code: "", name: "", city: "", country: "" }]);
  };

  const handleRemoveAirport = (index: number) => {
    const newAirports = airports.filter((_, i) => i !== index);
    setAirports(newAirports);
  };

  const handleSubmit = async () => {
    try {
      const res = await refetchCreateBatchAirport(airports);

      if (res?.resultCode === "00") {
        const errorMap: Record<number, string> = {};
        const newAirports = [...airports];

        res?.list?.forEach((item, idx) => {
          if (item.errorCode !== "00") {
            errorMap[idx] = item.errorMessage;
          } else {
            newAirports[idx] = { code: "", name: "", city: "", country: "" };
          }
        });

        setAirports(newAirports);
        setErrors(errorMap);

        if (Object.keys(errorMap).length === 0) {
          onClose();
        }
      }
    } catch (error) {
      console.error(error);
      alert("Có lỗi khi tạo sân bay!");
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2} fontWeight="bold">
        Tạo danh sách sân bay
      </Typography>

      <Button onClick={onClose}>Return</Button>

      {airports.map((airport, index) => (
        <Card
          key={index}
          sx={{ mb: 2, p: 2, border: "1px solid #ddd", borderRadius: 2 }}
        >
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid size={3}>
                <InputTextField
                  value={airport.code}
                  onChange={(e) => handleChange(index, "code", e.toUpperCase())}
                />
              </Grid>
              <Grid size={3}>
                <InputTextField
                  value={airport.name}
                  onChange={(e) => handleChange(index, "name", e)}
                />
              </Grid>
              <Grid size={3}>
                <InputTextField
                  value={airport.city}
                  onChange={(e) => handleChange(index, "city", e)}
                />
              </Grid>
              <Grid size={2}>
                <InputTextField
                  placeholder="country"
                  value={airport.country}
                  onChange={(e) => handleChange(index, "country", e)}
                />
              </Grid>
              <Grid size={1}>
                <IconButton
                  color="primary"
                  onClick={() => handleRemoveAirport(index)}
                  disabled={airports.length === 1}
                >
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
            {errors[index] && (
              <Typography color="error" variant="caption">
                {errors[index]}
              </Typography>
            )}
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
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default AirportBatchCreator;
