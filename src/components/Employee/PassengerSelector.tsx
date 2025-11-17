import { useState } from "react";
import { Box, Typography, Button, Divider, Grid } from "@mui/material";

type PassengerType = "Adult" | "Student" | "Child" | "Infant";

interface PassengerCount {
  male: number;
  female: number;
}

const initialPassengers: Record<PassengerType, PassengerCount> = {
  Adult: { male: 1, female: 0 },
  Student: { male: 0, female: 0 },
  Child: { male: 0, female: 0 },
  Infant: { male: 0, female: 0 },
};

interface Props {
  departureDate: string; // định dạng: "Nov.26,2025(Wed)"
  //   passengers: Record<string, PassengerCount>; // ví dụ: { "Adult": {male:1,female:0}, ... }
}

const FlightPassengerSelector: React.FC<Props> = ({ departureDate }) => {
  const [passengers, setPassengers] =
    useState<Record<PassengerType, PassengerCount>>(initialPassengers);

  const handleIncrement = (type: PassengerType, gender: "male" | "female") => {
    setPassengers((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [gender]: prev[type][gender] + 1,
      },
    }));
  };

  const handleDecrement = (type: PassengerType, gender: "male" | "female") => {
    setPassengers((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [gender]: Math.max(prev[type][gender] - 1, 0),
      },
    }));
  };

  //   const totalPassengers = Object.values(passengers).reduce(
  //     (total, p) => total + p.male + p.female,
  //     0
  //   );

  const totalPassengers = Object.values(passengers).reduce(
    (sum, p) => sum + p.male + p.female,
    0
  );

  const passengerText = Object.entries(passengers)
    .flatMap(([type, count]) => {
      const parts = [];
      if (count.male > 0) parts.push(`Male ${type} ${count.male} person(s)`);
      if (count.female > 0)
        parts.push(`Female ${type} ${count.female} person(s)`);
      return parts;
    })
    .join(" / ");

  return (
    <Box
      sx={{
        maxWidth: "1200px",
        mx: "auto",
        p: 2,
        mt: 1,
        border: "1px solid #ddd",
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        Select Passengers
      </Typography>
      <Box
        sx={{
          border: "1px solid #ddd",
          borderRadius: 2,
          p: 2,
          maxWidth: 700,
          mx: "auto",
        }}
      >
        <Box sx={{ display: "flex", mb: 1 }}>
          <Typography sx={{ fontWeight: 600, width: 150 }}>
            Departure date
          </Typography>
          <Typography>{departureDate}</Typography>
        </Box>
        <Divider sx={{ mb: 1 }} />
        <Box sx={{ display: "flex" }}>
          <Typography sx={{ fontWeight: 600, width: 150 }}>
            Number of people
          </Typography>
          <Typography>
            {passengerText} = Total {totalPassengers} person(s)
          </Typography>
        </Box>
      </Box>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {Object.entries(passengers).map(([type, count]) => (
          <Grid
            key={type}
            size={6} // 4 cột trên 1 hàng
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              border: "1px solid #ddd",
              borderRadius: 1,
              p: 1,
            }}
          >
            <Typography sx={{ fontWeight: 600, mb: 1 }}>{type}</Typography>
            <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
              {(["male", "female"] as const).map((gender) => (
                <Box
                  key={gender}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <Typography sx={{ fontSize: 12 }}>
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        handleDecrement(type as PassengerType, gender)
                      }
                    >
                      -
                    </Button>
                    <Box sx={{ width: 24, textAlign: "center" }}>
                      {count[gender]}
                    </Box>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        handleIncrement(type as PassengerType, gender)
                      }
                    >
                      +
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>
        ))}
      </Grid>

      <Typography sx={{ mt: 2, fontWeight: 600 }}>
        Total Passengers: {totalPassengers}
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
        <Button variant="outlined" color="inherit">
          Back
        </Button>
        <Button variant="contained" color="primary">
          Next: Choose Seats
        </Button>
      </Box>
    </Box>
  );
};

export default FlightPassengerSelector;
