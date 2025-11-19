import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  Rating,
  Divider,
  Slider,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import InputTextField from "../../common/Input/InputTextField";

const FlightsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  searchParams.get("from");

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

  //   const filteredHotels = hotels.filter((h) => {
  //     if (filter.freeCancel && !h.freeCancel) return false;
  //     if (filter.payLater && !h.payLater) return false;
  //     if (filter.minRating > 0 && h.rating < filter.minRating) return false;
  //     return true;
  //   });

  const handleNvigate = (code: string) => {
    navigate("/hotels/detail", {
      state: { code },
    });
  };

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

      {/* Hotel List */}
      <Grid container spacing={3} sx={{ flex: 1 }}>
        {/* {filteredHotels.map((hotel) => (
          <Grid size={12} key={hotel.id}>
            <Card sx={{ display: "flex", boxShadow: 3, borderRadius: 2 }}>
              <CardMedia
                component="img"
                sx={{ width: 280, borderRadius: "8px 0 0 8px" }}
                image={hotel.imageUrl}
                alt={hotel.name}
              />
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight="bold">
                  {hotel.name}
                </Typography>
                <Chip label={hotel.hotelCode} />
                <Typography variant="body2" color="text.secondary">
                  {hotel.city} • {hotel.distanceToCenter} km from City centre
                </Typography>
                <Rating value={hotel.rating} precision={0.5} readOnly />
                <Stack direction="row" spacing={1} mt={1}>
                  {hotel.isPrime && (
                    <Box
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        bgcolor: "#004080",
                        color: "#fff",
                        borderRadius: 1,
                        fontSize: 12,
                      }}
                    >
                      Prime discount
                    </Box>
                  )}
                  {hotel.freeWifi && (
                    <Typography fontSize={13} color="green">
                      Free WiFi
                    </Typography>
                  )}
                  {hotel.covidMeasures && (
                    <Typography fontSize={13} color="blue">
                      COVID-19 measures
                    </Typography>
                  )}
                </Stack>
                {hotel.discountPercent && (
                  <Typography
                    variant="body2"
                    color="error"
                    sx={{ mt: 1, fontWeight: "bold" }}
                  >
                    -{hotel.discountPercent}% OFF
                  </Typography>
                )}
              </CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  p: 3,
                  bgcolor: "#f9fafb",
                  borderRadius: "0 8px 8px 0",
                }}
              >
                <Typography variant="h6" fontWeight="bold" color="#00647A">
                  €{hotel.price.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  per night
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => handleNvigate(hotel?.hotelCode || "")}
                  sx={{
                    mt: 1.5,
                    bgcolor: "#00647A",
                    "&:hover": { bgcolor: "#004d5e" },
                  }}
                >
                  Select
                </Button>
              </Box>
            </Card>
          </Grid>
        ))} */}
      </Grid>
    </Box>
  );
};

export default FlightsPage;
