import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import economy from "../../svgs/EconomySeats.png";
import business from "../../svgs/BusinessSeats.png";
import plane3 from "../../svgs/Plane1.png";
import { uniqueId } from "lodash";

const SeatSelect: React.FC = () => {
  return (
    <Box
      sx={{
        px: { xs: 2, sm: 4 },
        display: "flex",
        flexDirection: { xs: "column", lg: "row" },
        justifyContent: "space-between",
        gap: 4,
        mt: 2,
      }}
    >
      {/* PLANE IMAGE */}
      <Box
        sx={{
          width: "100%",
          height: "100%",
          mx: { xs: "auto", lg: 0 },
          maxWidth: { sm: 400 },
          maxHeight: { sm: 850 },
        }}
      >
        <Box
          component="img"
          src={plane3}
          sx={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </Box>

      {/* RIGHT PANEL */}
      <Box
        sx={{
          width: "100%",
          maxWidth: { md: 712 },
          height: { md: 850 },
          border: "1px solid #f2f0f0",
          //   mt: 5,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* TOP INFO BAR */}
        <Box
          sx={{
            height: 80,
            display: "flex",
            backgroundColor: "#27273F",
          }}
        >
          {[
            { code: "SFO", desc: "California, US" },
            { code: "NRT", desc: "Tokyo, Japan" },
            { code: "Feb 25 | 7:00AM", desc: "Departing" },
            { code: "Mar 21 | 12:15PM", desc: "Arriving" },
          ].map((item, index) => (
            <Box
              key={uniqueId()}
              sx={{
                flex: 1,
                px: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                cursor: index > 1 ? "pointer" : "default",
                "&:hover": index > 1 ? { backgroundColor: "#605DEC" } : {},
              }}
            >
              <Typography
                sx={{
                  color: "#FAFAFA",
                  fontSize: { xs: 12, sm: 14, md: 18 },
                  fontWeight: index < 2 ? "bold" : "normal",
                }}
              >
                {item.code}
              </Typography>
              <Typography sx={{ color: "#E9E8FC", fontSize: 12 }}>
                {item.desc}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* SEAT OPTIONS */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
          }}
        >
          {/* ECONOMY */}
          <Box sx={{ border: 1, borderColor: "black", maxWidth: 350 }}>
            <Box
              component="img"
              src={economy}
              sx={{ width: "100%", height: "100%", objectFit: "contain" }}
            />

            <Box sx={{ px: 4, mt: 3 }}>
              <Typography
                sx={{ fontSize: 20, fontWeight: 600, color: "#6E7491" }}
              >
                Economy
              </Typography>

              <Typography sx={{ color: "#7C8DB0", fontSize: 14, mt: 1 }}>
                Rest and recharge during your flight with extended leg room,
                personalized service, and a multi-course meal service
              </Typography>

              <Box
                component="ul"
                sx={{ mt: 3, color: "#6E7491", fontSize: 14, pl: 3 }}
              >
                <li>Built-in entertainment system</li>
                <li>Complimentary snacks and drinks</li>
                <li>One free carry-on and personal item</li>
              </Box>
            </Box>
          </Box>

          <Box sx={{ border: 1, borderColor: "black", maxWidth: 350 }}>
            <Box
              component="img"
              src={business}
              sx={{ width: "100%", height: "100%", objectFit: "contain" }}
            />

            <Box sx={{ px: 4, mt: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  sx={{ fontSize: 20, fontWeight: 600, color: "#6E7491" }}
                >
                  Business class
                </Typography>

                <Box
                  sx={{
                    backgroundColor: "#5CD6C0",
                    color: "#FAFAFA",
                    px: 1,
                    py: "2px",
                    borderRadius: "4px",
                    fontSize: 12,
                  }}
                >
                  Selected
                </Box>
              </Box>

              <Typography sx={{ color: "#7C8DB0", fontSize: 14, mt: 1 }}>
                Rest and recharge during your flight with extended leg room,
                personalized service, and a multi-course meal service
              </Typography>

              <Box component="ul" sx={{ mt: 3, pl: 3, fontSize: 14 }}>
                {[
                  "Extended leg room",
                  "First two checked bags free",
                  "Priority boarding",
                  "Personalized service",
                  "Enhanced food and drink service",
                  "Seats that recline 40% more than economy",
                ].map((item, i) => (
                  <li key={i} style={{ color: "#6E7491" }}>
                    {item}
                  </li>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <Button
            variant="outlined"
            sx={{
              display: { xs: "none", sm: "block" },
              borderColor: "#605DEC",
              color: "#605DEC",
              "&:hover": {
                backgroundColor: "#605DEC",
                color: "#FAFAFA",
              },
            }}
          >
            Save and close
          </Button>

          <Link to="/payment">
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#605DEC",
                "&:hover": {
                  backgroundColor: "white",
                  color: "#605DEC",
                  border: "1px solid #605DEC",
                },
              }}
            >
              Payment
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default SeatSelect;
