import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import economy from "../../svgs/EconomySeats.png";
import business from "../../svgs/BusinessSeats.png";
import { useState } from "react";
import type { DataFlight, Seat } from "../../utils/type";

type SeatSelectProps = {
  flight: DataFlight;
  selectedSeats: Seat[];
  onSeatTypeChange: (type: string) => void; // callback khi đổi type
};

const SeatSelect = ({
  flight,
  selectedSeats,
  onSeatTypeChange,
}: SeatSelectProps) => {
  const [selectedType, setSelectedType] = useState<string>("ECONOMY");

  const handleSelectType = (type: string) => {
    setSelectedType(type);
    onSeatTypeChange(type);
  };

  const totalPrice = selectedSeats.reduce((total, seat) => {
    let basePrice = 0;
    switch (selectedType) {
      case "ECONOMY":
        basePrice = flight.priceEconomy ?? 0;
        break;
      case "BUSINESS":
        basePrice = flight.priceBusiness ?? 0;
        break;
      case "FIRST":
        basePrice = flight.priceFirst ?? 0;
        break;
    }
    const seatExtra = seat.price ?? 0;
    return total + basePrice + seatExtra;
  }, 0);

  return (
    <Box sx={{ px: 2, mt: 2 }}>
      {/* SEAT OPTIONS */}
      <Box
        sx={{
          display: "flex",
          gap: 4,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <SeatCard
          title="Economy"
          img={economy}
          selected={selectedType === "ECONOMY"}
          onClick={() => handleSelectType("ECONOMY")}
        />
        <SeatCard
          title="First"
          img={economy}
          selected={selectedType === "FIRST"}
          onClick={() => handleSelectType("FIRST")}
        />
        <SeatCard
          title="Business class"
          img={business}
          selected={selectedType === "BUSINESS"}
          onClick={() => handleSelectType("BUSINESS")}
        />
      </Box>

      {/* TOTAL PRICE */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6">
          Tổng tiền: {totalPrice.toLocaleString("vi-VN")} VND
        </Typography>
      </Box>

      {/* BUTTONS */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
        <Button
          variant="outlined"
          sx={{ borderColor: "#605DEC", color: "#605DEC" }}
        >
          Save and close
        </Button>
        <Link to="/payment">
          <Button variant="contained" sx={{ backgroundColor: "#605DEC" }}>
            Payment
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

type SeatCardProps = {
  title: string;
  img: string;
  selected?: boolean;
  onClick: () => void;
};

const SeatCard = ({ title, img, selected = false, onClick }: SeatCardProps) => (
  <Box
    sx={{
      border: 1,
      borderColor: selected ? "#605DEC" : "black",
      maxWidth: 350,
      cursor: "pointer",
      transition: "all 0.2s",
      "&:hover": { transform: "scale(1.03)", borderColor: "#605DEC" },
    }}
    onClick={onClick}
  >
    <Box
      component="img"
      src={img}
      sx={{ width: "100%", height: 200, objectFit: "contain" }}
    />
    <Box sx={{ px: 4, mt: 3 }}>
      <Typography sx={{ fontSize: 20, fontWeight: 600, color: "#6E7491" }}>
        {title}
      </Typography>
      {selected && (
        <Box
          sx={{
            backgroundColor: "#5CD6C0",
            color: "#FAFAFA",
            px: 1,
            py: "2px",
            borderRadius: 1,
            fontSize: 12,
          }}
        >
          Selected
        </Box>
      )}
    </Box>
  </Box>
);

export default SeatSelect;
