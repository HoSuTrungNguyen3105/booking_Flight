import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import economy from "../../svgs/EconomySeats.png";
import business from "../../svgs/BusinessSeats.png";
import plane3 from "../../svgs/Plane1.png";

// const topInfo = [
//   { code: "SFO", desc: "California, US" },
//   { code: "NRT", desc: "Tokyo, Japan" },
//   { code: "Feb 25 | 7:00AM", desc: "Departing" },
//   { code: "Mar 21 | 12:15PM", desc: "Arriving" },
// ];

type SeatSelectProps = {
  topInfo: {
    code: string;
    info: string;
  }[];
};

const SeatSelect: React.FC<SeatSelectProps> = ({ topInfo }) => {
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
      {/* PLANE */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          mx: "auto",
        }}
      >
        <Box
          component="img"
          src={plane3}
          sx={{
            width: "100%",
            height: 450,
            objectFit: "contain",
          }}
        />
      </Box>

      {/* RIGHT AREA */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 712,
          height: 850,
          border: "1px solid #f2f0f0",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* TOP INFO */}
        <Box
          sx={{
            height: 80,
            display: "flex",
            backgroundColor: "#27273F",
          }}
        >
          {topInfo.map((item, index) => (
            <Box
              key={index}
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
                {item.info}
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
          <SeatCard
            title="Economy"
            img={economy}
            features={[
              "Built-in entertainment system",
              "Complimentary snacks and drinks",
              "One free carry-on and personal item",
            ]}
          />

          {/* FIRST */}
          <SeatCard
            title="First"
            img={economy}
            features={["Extended leg room", "Premium dining", "Lounge access"]}
          />

          {/* BUSINESS */}
          <SeatCard
            title="Business class"
            img={business}
            selected
            features={[
              "Extended leg room",
              "First two checked bags free",
              "Priority boarding",
              "Personalized service",
              "Enhanced food and drink service",
              "Seats recline 40% more than economy",
            ]}
          />
        </Box>

        {/* BUTTONS */}
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

const SeatCard = ({
  title,
  img,
  features,
  selected = false,
}: {
  title: string;
  img: string;
  features: string[];
  selected?: boolean;
}) => (
  <Box sx={{ border: 1, borderColor: "black", maxWidth: 350 }}>
    <Box
      component="img"
      src={img}
      sx={{ width: "100%", height: 200, objectFit: "contain" }}
    />

    <Box sx={{ px: 4, mt: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography sx={{ fontSize: 20, fontWeight: 600, color: "#6E7491" }}>
          {title}
        </Typography>

        {selected && (
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
        )}
      </Box>

      <Box component="ul" sx={{ mt: 3, pl: 3, fontSize: 14 }}>
        {features.map((f, i) => (
          <li key={i} style={{ color: "#6E7491" }}>
            {f}
          </li>
        ))}
      </Box>
    </Box>
  </Box>
);

export default SeatSelect;
