import React from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Typography,
} from "@mui/material";
import LegendItem from "../Admin/component/Seat/ButtonSeat/LegendItem";
import PassengerChooseSeat from "./PassengerChooseSeat";
// import Seat from "./Seat";
// import "./styles.css";

const OrderSeat: React.FC = () => {
  return (
    <Grid size={12}>
      <CardContent>
        <LegendItem />
        <PassengerChooseSeat />
      </CardContent>
    </Grid>
  );
};

export default OrderSeat;
