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

const Hero = () => {
  return (
    <Box
      sx={{
        height: "auto",
        maxHeight: "350vh",
        textAlign: "center",
        color: "white",
      }}
    >
      <Box textAlign={"center"}>
        <Typography variant="h1" color="gray">
          Discover
        </Typography>
        <Typography variant="subtitle2" color="gray">
          Discover, search and filter best events in London.
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
        {[...Array(32)].map((_, i) => (
          <EventCard
            key={i + 21}
            url="1"
            from="20"
            color="blue"
            when="Tue, Sep 21, 2024 19:00"
            name="Event name goes here"
            venue="Royal Albert Hall"
            image=""
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
        {[...Array(12)].map((_, i) => (
          <EventCard
            key={i + 5}
            url="1"
            from="20"
            color="blue"
            when="Tue, Sep 21, 2024 19:00"
            name="Event name goes here"
            venue="Royal Albert Hall"
            image=""
          />
          //   <Typography variant="subtitle1">Card {i + 1}</Typography>
          // </EventCard>
        ))}
      </CardGroup>

      <CardGroup
        url="/products"
        title="Featured Products"
        color={theme.palette.primary.light}
        background="#f5f5f5"
      >
        {[...Array(32)].map((_, i) => (
          <EventCard
            key={i + 1}
            url="1"
            from="20"
            color="blue"
            when="Tue, Sep 21, 2024 19:00"
            name="Event name goes here"
            venue="Royal Albert Hall"
            image=""
          />
          //   <Typography variant="subtitle1">Card {i + 1}</Typography>
          // </EventCard>
        ))}
      </CardGroup>
    </Box>
  );
};

export default Hero;
