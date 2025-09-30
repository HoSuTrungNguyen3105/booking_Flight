import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import type { Airport } from "../../../utils/type";

const AirportBatchCreator: React.FC = () => {
  const [airports, setAirports] = useState<Airport[]>([
    { code: "", name: "", city: "", country: "" },
  ]);

  const handleChange = (index: number, field: keyof Airport, value: string) => {
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
    // try {
    //   const res = await axios.post("/api/airports", airports);
    //   console.log("Response:", res.data);
    //   alert("Tạo sân bay thành công!");
    // } catch (error) {
    //   console.error(error);
    //   alert("Có lỗi khi tạo sân bay!");
    // }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2} fontWeight="bold">
        Tạo danh sách sân bay
      </Typography>

      {airports.map((airport, index) => (
        <Card
          key={index}
          sx={{ mb: 2, p: 2, border: "1px solid #ddd", borderRadius: 2 }}
        >
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid size={3}>
                <TextField
                  label="Code"
                  value={airport.code}
                  onChange={(e) =>
                    handleChange(index, "code", e.target.value.toUpperCase())
                  }
                  fullWidth
                  inputProps={{ maxLength: 10 }}
                />
              </Grid>
              <Grid size={3}>
                <TextField
                  label="Name"
                  value={airport.name}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid size={3}>
                <TextField
                  label="City"
                  value={airport.city}
                  onChange={(e) => handleChange(index, "city", e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid size={2}>
                <TextField
                  label="Country"
                  value={airport.country}
                  onChange={(e) =>
                    handleChange(index, "country", e.target.value)
                  }
                  fullWidth
                />
              </Grid>
              <Grid size={1}>
                <IconButton
                  color="error"
                  onClick={() => handleRemoveAirport(index)}
                  disabled={airports.length === 1}
                >
                  <Delete />
                </IconButton>
              </Grid>
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
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default AirportBatchCreator;
