import { useState } from "react";
import { Box, Button, Typography, Stack } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import type { Aircraft } from "../../../common/Setting/type";
import InputTextField from "../../../common/Input/InputTextField";
// type AircraftProps ={
//     code : Aircraft
// }
const AircraftBatchCreator = () => {
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([
    { code: "", model: "", range: 0 },
  ]);
  const [loading, setLoading] = useState(false);
  //   const [snackbar, setSnackbar] = useState({
  //     open: false,
  //     message: "",
  //     severity: "success",
  //   });

  const addAircraft = () => {
    setAircrafts([...aircrafts, { code: "", model: "", range: 0 }]);
  };

  const removeAircraft = (index: number) => {
    if (aircrafts.length > 1) {
      setAircrafts(aircrafts.filter((_, i) => i !== index));
    }
  };

  const updateAircraft = (
    index: number,
    field: keyof Aircraft,
    value: string | number
  ) => {
    const updated = [...aircrafts];

    if (field === "range") {
      updated[index][field] = Number(value);
    } else {
      updated[index][field] = value as string;
    }

    setAircrafts(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);

    // Validate data
    const invalidAircrafts = aircrafts.filter(
      (ac) => !ac.code || !ac.model || !ac.range
    );
    console.log("invalidAircrafts", invalidAircrafts);
    if (invalidAircrafts.length === 0) {
      console.log(" no invalidAircrafts", invalidAircrafts);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/sys/flights/aircraft/batch",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(aircrafts),
        }
      );

      const result = await response.json();

      if (response.ok) {
        // setSnackbar({
        //   open: true,
        //   message: "Batch created successfully!",
        //   severity: "success",
        // });
        setAircrafts([{ code: "", model: "", range: 0 }]); // Reset form
      } else {
        // setSnackbar({
        //   open: true,
        //   message: result.message || "Error creating batch",
        //   severity: "error",
        // });
      }
    } catch (error) {
      // setSnackbar({ open: true, message: "Network error", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: "100%" }}>
      <Stack sx={{ p: 3 }}>
        <Box px={2} py={1} borderBottom={1} borderColor="grey.200">
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
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 2,
                }}
              >
                <InputTextField
                  clearable
                  value={aircraft.code}
                  onChange={(e) => updateAircraft(index, "code", e)}
                  placeholder="e.g., B738"
                />
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
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={addAircraft}
            >
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
      </Stack>

      {/* <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        // {/* <Alert severity={snackbar.severity}>
        //   {snackbar.message}
        // </Alert> 
      </Snackbar> */}
    </Box>
  );
};

export default AircraftBatchCreator;
