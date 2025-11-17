import React from "react";
import { CardContent, Grid } from "@mui/material";
import LegendItem from "../Admin/component/Seat/ButtonSeat/LegendItem";
import PassengerChooseSeat from "../Sample/PassengerChooseSeat";

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
