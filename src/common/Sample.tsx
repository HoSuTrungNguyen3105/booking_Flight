// // import React, { useState } from "react";
// // import {
// //   Box,
// //   Typography,
// //   Button,
// //   IconButton,
// //   Card,
// //   CardContent,
// //   Avatar,
// // } from "@mui/material";
// // import FavoriteIcon from "@mui/icons-material/Favorite";
// // import EditIcon from "@mui/icons-material/Edit";
// // import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
// // import Grid from "@mui/material/Grid"; // ✅ Đúng

// // interface FlightInfo {
// //   airlineLogo: string;
// //   departure: string;
// //   arrival: string;
// //   time: string;
// //   duration: string;
// //   date: string;
// // }

// // const sampleFlights: FlightInfo[] = [
// //   {
// //     airlineLogo:
// //       "https://upload.wikimedia.org/wikipedia/en/e/e0/American_Airlines_logo_2013.svg",
// //     departure: "03:40",
// //     arrival: "05:40",
// //     time: "HKG - NRT",
// //     duration: "2h",
// //     date: "Oct 15, 2022",
// //   },
// //   {
// //     airlineLogo:
// //       "https://upload.wikimedia.org/wikipedia/en/4/4c/United_Airlines_Logo.svg",
// //     departure: "07:28",
// //     arrival: "10:05",
// //     time: "SFO - LAX",
// //     duration: "2h 37m",
// //     date: "Oct 16, 2022",
// //   },
// // ];

// // const Sample: React.FC = () => {
// //   const [favorites, setFavorites] = useState<number[]>([]);

// //   const toggleFavorite = (index: number) => {
// //     setFavorites((prev) =>
// //       prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
// //     );
// //   };

// //   return (
// //     <Box p={4} bgcolor="#f5f7fb" minHeight="100vh">
// //       <Typography variant="h4" fontWeight="bold" mb={4}>
// //         Upcoming Flights
// //       </Typography>
// //       <Grid container spacing={3}>
// //         {sampleFlights.map((flight, index) => (
// //           //   < item xs={12} md={6} key={index}>
// //           <Grid>
// //             <Card sx={{ borderRadius: 4, position: "relative" }}>
// //               <CardContent>
// //                 <Box display="flex" alignItems="center" mb={2}>
// //                   <Avatar
// //                     src={flight.airlineLogo}
// //                     alt="airline-logo"
// //                     sx={{ width: 56, height: 56, mr: 2 }}
// //                   />
// //                   <Box>
// //                     <Typography variant="h6">{flight.time}</Typography>
// //                     <Typography variant="body2" color="text.secondary">
// //                       {flight.duration}
// //                     </Typography>
// //                   </Box>
// //                   <Box flexGrow={1} />
// //                   <IconButton onClick={() => toggleFavorite(index)}>
// //                     <FavoriteIcon
// //                       color={favorites.includes(index) ? "error" : "disabled"}
// //                     />
// //                   </IconButton>
// //                 </Box>
// //                 <Box
// //                   display="flex"
// //                   justifyContent="space-between"
// //                   alignItems="center"
// //                 >
// //                   <Box>
// //                     <Typography variant="body2" color="text.secondary">
// //                       Departure
// //                     </Typography>
// //                     <Typography variant="h6">{flight.departure}</Typography>
// //                   </Box>
// //                   <FlightTakeoffIcon fontSize="large" color="primary" />
// //                   <Box>
// //                     <Typography variant="body2" color="text.secondary">
// //                       Arrival
// //                     </Typography>
// //                     <Typography variant="h6">{flight.arrival}</Typography>
// //                   </Box>
// //                 </Box>
// //                 <Box
// //                   mt={2}
// //                   display="flex"
// //                   justifyContent="space-between"
// //                   alignItems="center"
// //                 >
// //                   <Typography variant="body2" color="text.secondary">
// //                     {flight.date}
// //                   </Typography>
// //                   <Button variant="contained" color="primary">
// //                     Book
// //                   </Button>
// //                 </Box>
// //               </CardContent>
// //               <IconButton
// //                 sx={{ position: "absolute", top: 8, right: 8 }}
// //                 aria-label="edit"
// //               >
// //                 <EditIcon />
// //               </IconButton>
// //             </Card>
// //           </Grid>
// //         ))}
// //       </Grid>
// //     </Box>
// //   );
// // };

// // export default Sample;

// import React, { useState } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   IconButton,
//   Card,
//   CardContent,
//   Avatar,
//   Grid,
// } from "@mui/material";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import EditIcon from "@mui/icons-material/Edit";
// import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";

// export type DataFlight = {
//   flightId?: number;
//   flightNo?: string;
//   scheduledDeparture: string;
//   scheduledArrival: string;
//   departureAirport: string;
//   arrivalAirport: string;
//   status: string;
//   aircraftCode: string;
//   actualDeparture?: string;
//   actualArrival?: string;
// };

// const sampleFlights: DataFlight[] = [
//   {
//     flightId: 1,
//     flightNo: "VN123",
//     scheduledDeparture: "2025-06-25T03:40:00Z",
//     scheduledArrival: "2025-06-25T05:40:00Z",
//     departureAirport: "SGN",
//     arrivalAirport: "HAN",
//     status: "On Time",
//     aircraftCode: "A321",
//   },
//   {
//     flightId: 2,
//     flightNo: "VN456",
//     scheduledDeparture: "2025-06-26T07:28:00Z",
//     scheduledArrival: "2025-06-26T10:05:00Z",
//     departureAirport: "DAD",
//     arrivalAirport: "SGN",
//     status: "Delayed",
//     aircraftCode: "B787",
//   },
// ];

// const formatTime = (iso: string) =>
//   new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
// const formatDate = (iso: string) => new Date(iso).toLocaleDateString();

// const Sample: React.FC = () => {
//   const [favorites, setFavorites] = useState<number[]>([]);

//   const toggleFavorite = (index: number) => {
//     setFavorites((prev) =>
//       prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
//     );
//   };

//   return (
//     <Box p={4} bgcolor="#f5f7fb" minHeight="100vh">
//       <Typography variant="h4" fontWeight="bold" mb={4}>
//         Upcoming Flights
//       </Typography>
//       <Grid container spacing={3}>
//         {sampleFlights.map((flight, index) => (
//           <Grid>
//             <Card sx={{ borderRadius: 4, position: "relative" }}>
//               <CardContent>
//                 <Box display="flex" alignItems="center" mb={2}>
//                   <Avatar
//                     src={`https://api.dicebear.com/7.x/identicon/svg?seed=${flight.aircraftCode}`} // icon tạm cho hãng
//                     alt="airline-logo"
//                     sx={{ width: 56, height: 56, mr: 2 }}
//                   />
//                   <Box>
//                     <Typography variant="h6">
//                       {flight.departureAirport} - {flight.arrivalAirport}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       {flight.aircraftCode} • {flight.status}
//                     </Typography>
//                   </Box>
//                   <Box flexGrow={1} />
//                   <IconButton onClick={() => toggleFavorite(index)}>
//                     <FavoriteIcon
//                       color={favorites.includes(index) ? "error" : "disabled"}
//                     />
//                   </IconButton>
//                 </Box>

//                 <Box
//                   display="flex"
//                   justifyContent="space-between"
//                   alignItems="center"
//                 >
//                   <Box>
//                     <Typography variant="body2" color="text.secondary">
//                       Departure
//                     </Typography>
//                     <Typography variant="h6">
//                       {formatTime(flight.scheduledDeparture)}
//                     </Typography>
//                   </Box>
//                   <FlightTakeoffIcon fontSize="large" color="primary" />
//                   <Box>
//                     <Typography variant="body2" color="text.secondary">
//                       Arrival
//                     </Typography>
//                     <Typography variant="h6">
//                       {formatTime(flight.scheduledArrival)}
//                     </Typography>
//                   </Box>
//                 </Box>

//                 <Box
//                   mt={2}
//                   display="flex"
//                   justifyContent="space-between"
//                   alignItems="center"
//                 >
//                   <Typography variant="body2" color="text.secondary">
//                     {formatDate(flight.scheduledDeparture)}
//                   </Typography>
//                   <Button variant="contained" color="primary">
//                     Book
//                   </Button>
//                 </Box>
//               </CardContent>
//               <IconButton
//                 sx={{ position: "absolute", top: 8, right: 8 }}
//                 aria-label="edit"
//               >
//                 <EditIcon />
//               </IconButton>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// };

// export default Sample;
import { Box, Typography } from "@mui/material";
import type { ResponseMessage } from "../utils/type";
import { Button } from "./Button/Button";
import { useEffect, useState } from "react";
import Modal from "./Modal/Modal";
import TextArea from "./Input/TextArea";
import { useToast } from "../context/ToastContext";
import { Controller, useForm } from "react-hook-form";
import { useFetch } from "../context/use[custom]/useFetch";
// type SampleData = {
//   id: number;
//   title: string;
// };

type SampleParams = {
  limit: number;
  offset: number;
};

const Sample = () => {
  const { refetch } = useFetch<ResponseMessage, SampleParams>({
    message: {
      success: "이것이 나타날 토스트입니다.",
    },
    url: "/posts",
    // params: { limit: 10, offset: 100 },
  });
  const { control, watch, register, reset } = useForm({
    defaultValues: {
      name: "",
    },
  });
  const toast = useToast();
  const handleOpenToaats = () => {
    toast("이것이 나타날 토스트입니다이것이 나타날 토스트입니다", "success");
  };
  const [isDisable, setIsDisable] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const name = watch("name");
  const [error, setError] = useState<string>("");
  useEffect(() => {
    setIsDisable(name.trim() === "");
  }, [name]);
  useEffect(() => {
    if (open) {
      reset();
      setError("");
    }
  }, [open]);
  const handleSubmit = () => {
    // if (name.trim() === "error") {
    setError("이름을 입력해주세요.");
    toast("이름을 입력해주세요.", "error");
    return;
    // }
    // setOpen(true);
    // setError("");
    // setIsDisable(true);
  };

  return (
    <Box>
      <Box display={"flex"}>
        <Box>
          <Box display={"flex"} gap={3} paddingTop={5} paddingLeft={5}>
            <Button
              appearance="contained"
              priority="primary"
              onClick={() => handleOpen()}
              label="Button"
              iconPosition="trailing"
              size="large"
            />
            <Modal
              open={open}
              title="이나타날 토스트입니다."
              title2="이나타."
              hideCloseBtn
              disabled={isDisable}
              handleClose={handleClose}
              submitLabel="이것이"
              errorMessage={error}
              handleSubmit={handleSubmit}
              contentArea={
                <Box>
                  <Typography fontWeight="bold">
                    이것이 나타날 토스트입니다
                  </Typography>
                  <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <TextArea {...register("name")} {...field} />
                    )}
                  />
                </Box>
              }
            />
          </Box>

          {/*disable*/}
          <Button
            appearance="contained"
            priority="custom"
            label="단추단추"
            onClick={() => handleSubmit()}
            size="large"
            customLabelColor="#000000"
            customColor="#fdd835" // 🌟 vàng sáng nổi bật
          />
          <Button
            appearance="contained"
            priority="custom"
            onClick={() => handleOpenToaats()}
            customLabelColor="#000000"
            isHovered={false}
            label="단추단추"
            customColor="#ffa500" // 🌟 vàng sáng nổi bật
            size="large"
          />
          <Button
            appearance="contained"
            priority="custom"
            label="단추단추"
            onClick={() => refetch()}
            size="large"
            customLabelColor="#000000"
            disabled
            customColor="#fdd835" // 🌟 vàng sáng nổi bật
          />
          <Button
            appearance="contained"
            priority="custom"
            onClick={() => refetch()}
            customLabelColor="#000000"
            isHovered={false}
            label="단추단추"
            customColor="#ffa500" // 🌟 vàng sáng nổi bật
            size="large"
            disabled
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Sample;
