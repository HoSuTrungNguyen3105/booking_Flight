// import { Slider } from "@mui/material";
import { Box, Stack, Typography } from "@mui/material";
import ButtonCircle from "../../common/CustomRender/ButtonCircle";
import CardGroup from "../../common/CustomRender/CardGroup";
import theme from "../../scss/theme";
import InputTextField from "../../common/Input/InputTextField";
import {
  ControlCameraTwoTone,
  RoomService,
  Search,
  Sports,
} from "@mui/icons-material";
import EventCard from "../../common/CustomRender/EventCard";
import { useGetAllHotels, useGetFlightData } from "../../context/Api/useGetApi";
import { useNavigate } from "react-router-dom";

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
      }}
    >
      <Box padding={1} textAlign={"center"}>
        <Typography variant="h3" color="gray">
          Discover the best flights for your points.
        </Typography>
        <Typography variant="subtitle1" color="gray">
          Discover, search and filter best events in London.This is the fastest
          search engine for award travel. Explore availability across entire
          regions, search with instant results, create free alerts and more to
          find the best flights for your points.
        </Typography>
      </Box>

      <Box
        sx={{
          maxWidth: "80%",
          overflow: "hidden",
          margin: "30px auto",
        }}
      >
        <InputTextField endIcon={<Search />} />
      </Box>

      <Box sx={{ position: "relative", zIndex: 2 }}>
        <Stack
          direction="row" // nằm ngang
          spacing={5} // khoảng cách giữa các nút
          justifyContent="center" // căn giữa theo chiều ngang
          alignItems="center" // căn giữa theo chiều dọc
          sx={{ flexWrap: "wrap", mt: 2 }}
        >
          <ButtonCircle
            icon={<ControlCameraTwoTone />}
            text="Concert"
            url="list"
          />
          <ButtonCircle icon={<RoomService />} text="Kids" url="list" />
          <ButtonCircle icon={<Sports />} text="Sports" url="list" />
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
            // venue="Royal Albert Hall"
            image={e.imageUrl}
          />
          //   <Typography variant="subtitle1">Card {i + 1}</Typography>
          // </EventCard>
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
            // venue="Royal Albert Hall"
            // image={''}
          />
          //   <Typography variant="subtitle1">Card {i + 1}</Typography>
          // </EventCard>
        ))}
      </CardGroup>
    </Box>
  );
};

export default Hero;
