import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  Divider,
  Slider,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import InputTextField from "../../common/Input/InputTextField";
import { useSearchFlightFromPassenger } from "../../context/Api/EnumApi";
import type { SearchFlightFromPassengerParams } from "../../utils/type";
import { FlightCard } from "../Sample/FlightCard";
import Umage from "../../svgs/Plane1.png";
import { generateSearchToken } from "../../utils/security";
import { useToast } from "../../context/ToastContext";

type SearchFlightWithNoToken = SearchFlightFromPassengerParams & {
  token: string;
};

const FlightsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const toast = useToast();
  const searchFlightFromPassengerParams = Object.fromEntries(
    searchParams.entries()
  ) as unknown as SearchFlightFromPassengerParams;
  const {
    refetchSearchFlightFromPassenger,
    dataSearchFlightFromPassenger,
    loadingSearchFlightFromPassenger,
  } = useSearchFlightFromPassenger();

  useEffect(() => {
    if (searchParams.toString()) {
      const { token, ...paramsToValidate } =
        searchFlightFromPassengerParams as SearchFlightWithNoToken;
      const expectedToken = generateSearchToken(
        paramsToValidate as Record<string, string>
      );

      if (token !== expectedToken) {
        toast("Invalid search parameters or token!", "error");
        navigate("/"); // Redirect to home or handle error appropriately
        return;
      }

      refetchSearchFlightFromPassenger(searchFlightFromPassengerParams);
    }
  }, [searchParams]);

  const [filter, setFilter] = useState({
    freeCancel: false,
    payLater: false,
    minRating: 0,
  });
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [selectedNeighbourhoods, setSelectedNeighbourhoods] = useState<
    string[]
  >([]);

  const [priceRange, setPriceRange] = useState<number[]>([115, 151]);

  const handleNeighbourhoodChange = (name: string) => {
    setSelectedNeighbourhoods((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setPriceRange(newValue);
    }
  };

  const handleSearch = () => {
    console.log("Search for:", searchText);
    console.log("Neighbourhoods:", selectedNeighbourhoods);
    console.log("Price range:", priceRange);
  };

  const outboundFlights = dataSearchFlightFromPassenger?.data?.outbound || [];
  const inboundFlights = dataSearchFlightFromPassenger?.data?.inbound || [];
  const allFlights = [...outboundFlights, ...inboundFlights];

  return (
    <Box sx={{ display: "flex", p: 3, gap: 3 }}>
      {/* Sidebar Filter */}
      <Box sx={{ width: 250, flexShrink: 0 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Reservation policy
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={filter.freeCancel}
              onChange={(e) =>
                setFilter((f) => ({ ...f, freeCancel: e.target.checked }))
              }
            />
          }
          label="FREE hotel cancellation"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={filter.payLater}
              onChange={(e) =>
                setFilter((f) => ({ ...f, payLater: e.target.checked }))
              }
            />
          }
          label="Pay later"
        />
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          Find a hotel
        </Typography>
        <InputTextField
          placeholder="Hotel name"
          value={searchText}
          onChange={(e) => setSearchText(e)}
        />
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 1, mb: 2 }}
          onClick={handleSearch}
        >
          Search
        </Button>

        <Divider sx={{ mb: 2 }} />

        {/* Neighbourhood */}
        <Typography variant="h6" gutterBottom>
          Neighbourhood
        </Typography>
        <Button
          size="small"
          onClick={() => setSelectedNeighbourhoods([])}
          sx={{ mb: 1 }}
        >
          Clear all
        </Button>

        <Divider sx={{ my: 2 }} />

        {/* Price Range */}
        <Typography variant="h6" gutterBottom>
          Price range
        </Typography>
        <Typography variant="body2" gutterBottom>
          Average
        </Typography>
        <Slider
          value={priceRange}
          onChange={handlePriceChange}
          step={1}
          valueLabelDisplay="auto"
          min={50}
          max={200}
        />
        <Box display="flex" justifyContent="space-between">
          <Typography variant="body2">€{priceRange[0]}</Typography>
          <Typography variant="body2">€{priceRange[1]}</Typography>
        </Box>
      </Box>

      {/* Flight List */}
      <Box sx={{ flex: 1 }}>
        {loadingSearchFlightFromPassenger ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {allFlights.length > 0 ? (
              allFlights.map((flight, index) => (
                <Grid size={4} key={flight.flightId || index}>
                  <FlightCard
                    from={
                      flight.departureAirportRel?.city ||
                      flight.departureAirport
                    }
                    to={flight.arrivalAirportRel?.city || flight.arrivalAirport}
                    image={flight.aircraft?.imageAircraft || Umage}
                    price={flight.priceEconomy || 0}
                  />
                </Grid>
              ))
            ) : (
              <Typography variant="body1" sx={{ p: 2 }}>
                No flights found.
              </Typography>
            )}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default FlightsPage;
