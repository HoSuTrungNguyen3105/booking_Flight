import React from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";
import Umage from "../../svgs/Plane1.png";
type FlightCardProps = {
  from: string;
  to: string;
  image: string;
  price: number;
};

const flights: FlightCardProps[] = [
  {
    from: "Dong Hoi",
    to: "Ho Chi Minh City",
    image: "/images/donghoi.jpg",
    price: 563400,
  },
  { from: "Hue", to: "Hanoi", image: "/images/hue.jpg", price: 680600 },
  {
    from: "Chiang Mai",
    to: "Bangkok",
    image: Umage,
    price: 902577,
  },
  {
    from: "Penang",
    to: "Kuala Lumpur",
    image: "/images/penang.jpg",
    price: 431957,
  },
  {
    from: "Hai Phong",
    to: "Da Nang",
    image: "/images/da_nang.jpg",
    price: 680600,
  },
  {
    from: "Ho Chi Minh City",
    to: "Bali Denpasar",
    image: "/images/bali.jpg",
    price: 1939000,
  },
  {
    from: "Davao City",
    to: "Manila",
    image: "/images/manila.jpg",
    price: 835340,
  },
  {
    from: "Ho Chi Minh City",
    to: "Phuket",
    image: "/images/phuket.jpg",
    price: 2153110,
  },
];

const FlightCard: React.FC<FlightCardProps> = ({ from, to, image, price }) => {
  return (
    <Card sx={{ maxWidth: 350, borderRadius: 3.5 }}>
      <CardMedia component="img" height="140" image={image} alt={to} />
      <CardContent>
        <Typography variant="subtitle2" color="textSecondary">
          {from}
        </Typography>
        <Typography variant="h6" fontWeight={600}>
          ✈ {to}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Start from ₫ {price.toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
};

const FlightGrid: React.FC = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Exclusive Flight Recommendations
      </Typography>
      <Grid container spacing={2}>
        {flights.map((flight, index) => (
          <Grid size={3} key={index}>
            <FlightCard {...flight} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FlightGrid;
