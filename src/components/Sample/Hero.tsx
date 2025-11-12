import { Box, Stack } from "@mui/material";
import ButtonCircle from "../../common/AdditionalCustomFC/ButtonCircle";
import CardGroup from "../../common/AdditionalCustomFC/CardGroup";
import { ControlCameraTwoTone, RoomService, Sports } from "@mui/icons-material";
import EventCard from "../../common/AdditionalCustomFC/EventCard";
import { useGetAllHotels, useGetFlightData } from "../../context/Api/useGetApi";
import { useNavigate } from "react-router-dom";
import FlightSearchForm from "./FlightSearchForm";
import AdvancedAnalytics from "../../common/Header/AdvancedAnalytics";

const Hero = () => {
  const { dataGetAllHotels } = useGetAllHotels();
  const { getFlightData } = useGetFlightData();
  const navigate = useNavigate();
  const handleNavigate = (code: string) => {
    navigate("/detail", {
      state: {
        code,
      },
    });
  };

  return (
    <Box
      sx={{
        height: "auto",
        maxHeight: "350vh",
        textAlign: "center",
        color: "white",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Box padding={1} textAlign={"center"}>
        <AdvancedAnalytics />
        <FlightSearchForm />
      </Box>

      <Box sx={{ position: "relative", zIndex: 2 }}>
        <Stack
          direction="row"
          spacing={5}
          justifyContent="center"
          alignItems="center"
          sx={{ flexWrap: "wrap", mt: 2 }}
        >
          <ButtonCircle
            icon={<ControlCameraTwoTone />}
            text="Concert"
            url="list"
          />
          <ButtonCircle icon={<RoomService />} text="Hotels" url="list" />
          <ButtonCircle icon={<Sports />} text="Flights" url="list" />
        </Stack>
      </Box>
      {/* <TicketPage /> */}
      {/* <Box sx={{ position: "relative", zIndex: 2 }}> */}
      <CardGroup
        url="/products"
        title="Featured Products"
        color="primary"
        background="#f5f5f5"
      >
        {dataGetAllHotels?.list?.map((e, i) => (
          <EventCard
            key={i + 21}
            link={() => handleNavigate(e?.hotelCode || "")}
            location={e.address}
            tagColor="blue"
            tagLabel={e.hotelCode || ""}
            price={e.price}
            rating={e.rating}
            name={e.name}
            image={e.imageUrl}
          />
        ))}
      </CardGroup>

      <CardGroup
        url="/products"
        title="Featured Products"
        color="primary"
        background="#f5f5f5"
      >
        {getFlightData?.list?.map((e, i) => (
          <EventCard
            key={i + 5}
            link={() => handleNavigate(e?.flightNo || "")}
            location={e.departureAirport}
            tagColor="blue"
            tagLabel={e.flightNo || ""}
            price={e.priceBusiness || 0}
            rating={0}
            name={e.flightNo || ""}
          />
        ))}
      </CardGroup>
    </Box>
  );
};

export default Hero;
