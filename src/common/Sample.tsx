// import React, { useState } from "react";
// import {
//   Box,
//   Typography,
//   Button,
//   IconButton,
//   Card,
//   CardContent,
//   Avatar,
// } from "@mui/material";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import EditIcon from "@mui/icons-material/Edit";
// import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
// import Grid from "@mui/material/Grid"; // ✅ Đúng

// interface FlightInfo {
//   airlineLogo: string;
//   departure: string;
//   arrival: string;
//   time: string;
//   duration: string;
//   date: string;
// }

// const sampleFlights: FlightInfo[] = [
//   {
//     airlineLogo:
//       "https://upload.wikimedia.org/wikipedia/en/e/e0/American_Airlines_logo_2013.svg",
//     departure: "03:40",
//     arrival: "05:40",
//     time: "HKG - NRT",
//     duration: "2h",
//     date: "Oct 15, 2022",
//   },
//   {
//     airlineLogo:
//       "https://upload.wikimedia.org/wikipedia/en/4/4c/United_Airlines_Logo.svg",
//     departure: "07:28",
//     arrival: "10:05",
//     time: "SFO - LAX",
//     duration: "2h 37m",
//     date: "Oct 16, 2022",
//   },
// ];

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
//           //   < item xs={12} md={6} key={index}>
//           <Grid>
//             <Card sx={{ borderRadius: 4, position: "relative" }}>
//               <CardContent>
//                 <Box display="flex" alignItems="center" mb={2}>
//                   <Avatar
//                     src={flight.airlineLogo}
//                     alt="airline-logo"
//                     sx={{ width: 56, height: 56, mr: 2 }}
//                   />
//                   <Box>
//                     <Typography variant="h6">{flight.time}</Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       {flight.duration}
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
//                     <Typography variant="h6">{flight.departure}</Typography>
//                   </Box>
//                   <FlightTakeoffIcon fontSize="large" color="primary" />
//                   <Box>
//                     <Typography variant="body2" color="text.secondary">
//                       Arrival
//                     </Typography>
//                     <Typography variant="h6">{flight.arrival}</Typography>
//                   </Box>
//                 </Box>
//                 <Box
//                   mt={2}
//                   display="flex"
//                   justifyContent="space-between"
//                   alignItems="center"
//                 >
//                   <Typography variant="body2" color="text.secondary">
//                     {flight.date}
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

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Card,
  CardContent,
  Avatar,
  Grid,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EditIcon from "@mui/icons-material/Edit";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";

export type DataFlight = {
  flightId?: number;
  flightNo?: string;
  scheduledDeparture: string;
  scheduledArrival: string;
  departureAirport: string;
  arrivalAirport: string;
  status: string;
  aircraftCode: string;
  actualDeparture?: string;
  actualArrival?: string;
};

const sampleFlights: DataFlight[] = [
  {
    flightId: 1,
    flightNo: "VN123",
    scheduledDeparture: "2025-06-25T03:40:00Z",
    scheduledArrival: "2025-06-25T05:40:00Z",
    departureAirport: "SGN",
    arrivalAirport: "HAN",
    status: "On Time",
    aircraftCode: "A321",
  },
  {
    flightId: 2,
    flightNo: "VN456",
    scheduledDeparture: "2025-06-26T07:28:00Z",
    scheduledArrival: "2025-06-26T10:05:00Z",
    departureAirport: "DAD",
    arrivalAirport: "SGN",
    status: "Delayed",
    aircraftCode: "B787",
  },
];

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const formatDate = (iso: string) => new Date(iso).toLocaleDateString();

const Sample: React.FC = () => {
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (index: number) => {
    setFavorites((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <Box p={4} bgcolor="#f5f7fb" minHeight="100vh">
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Upcoming Flights
      </Typography>
      <Grid container spacing={3}>
        {sampleFlights.map((flight, index) => (
          <Grid>
            <Card sx={{ borderRadius: 4, position: "relative" }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar
                    src={`https://api.dicebear.com/7.x/identicon/svg?seed=${flight.aircraftCode}`} // icon tạm cho hãng
                    alt="airline-logo"
                    sx={{ width: 56, height: 56, mr: 2 }}
                  />
                  <Box>
                    <Typography variant="h6">
                      {flight.departureAirport} - {flight.arrivalAirport}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {flight.aircraftCode} • {flight.status}
                    </Typography>
                  </Box>
                  <Box flexGrow={1} />
                  <IconButton onClick={() => toggleFavorite(index)}>
                    <FavoriteIcon
                      color={favorites.includes(index) ? "error" : "disabled"}
                    />
                  </IconButton>
                </Box>

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Departure
                    </Typography>
                    <Typography variant="h6">
                      {formatTime(flight.scheduledDeparture)}
                    </Typography>
                  </Box>
                  <FlightTakeoffIcon fontSize="large" color="primary" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Arrival
                    </Typography>
                    <Typography variant="h6">
                      {formatTime(flight.scheduledArrival)}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  mt={2}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(flight.scheduledDeparture)}
                  </Typography>
                  <Button variant="contained" color="primary">
                    Book
                  </Button>
                </Box>
              </CardContent>
              <IconButton
                sx={{ position: "absolute", top: 8, right: 8 }}
                aria-label="edit"
              >
                <EditIcon />
              </IconButton>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Sample;
