import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Grid,
  Card,
  CardMedia,
  Divider,
  Stepper,
  type StepIconProps,
  stepConnectorClasses,
  StepConnector,
  styled,
  Step,
  StepLabel,
} from "@mui/material";
import { BookOnline, Info, Search } from "@mui/icons-material";
import type { Hotel } from "../../../../utils/type";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetHotelByHotelCode } from "../../../../context/Api/useGetApi";

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[800],
    }),
  },
}));

const ColorlibStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme }) => ({
  backgroundColor: "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...theme.applyStyles("dark", {
    backgroundColor: theme.palette.grey[700],
  }),
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        backgroundImage:
          "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
        boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
      },
    },
    {
      props: ({ ownerState }) => ownerState.completed,
      style: {
        backgroundImage:
          "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
      },
    },
  ],
}));
type HotelDetailProps = { code: string };
const HotelDetailPage = () => {
  const location = useLocation();
  const state = location.state as HotelDetailProps;
  const code = state?.code;
  const navigate = useNavigate();

  const { dataHotelByHotelCode } = useGetHotelByHotelCode(code);
  const hotel = dataHotelByHotelCode?.data;

  const [tab, setTab] = React.useState(0);
  const handleChange = (_: React.SyntheticEvent, newValue: number) =>
    setTab(newValue);

  function ColorlibStepIcon(props: StepIconProps) {
    const { active, completed, className } = props;

    const icons: { [index: string]: React.ReactElement<unknown> } = {
      1: <Search />,
      2: <Info />,
      3: <BookOnline />,
    };

    return (
      <ColorlibStepIconRoot
        ownerState={{ completed, active }}
        className={className}
      >
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    );
  }

  const steps = [
    "Select campaign settings",
    "Create an ad group",
    "Create an ad",
  ];

  useEffect(() => {
    if (!code) {
      navigate(-1);
    }
  }, [code, navigate]);

  return (
    <Box sx={{ padding: 8, bgcolor: "#fafafa", minHeight: "100vh" }}>
      {/* Header */}
      <Button variant="contained" onClick={() => navigate(-1)}>
        {" "}
        Return{" "}
      </Button>
      <Stepper
        alternativeLabel
        activeStep={1}
        connector={<ColorlibConnector />}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {hotel?.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {hotel?.address}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {hotel?.city}
          </Typography>
        </Box>

        <Box textAlign="right">
          <Typography variant="h6" fontWeight="bold">
            €136.31 <Typography component="span">/ person</Typography>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total: {hotel?.price}
          </Typography>
          <Button variant="contained" sx={{ mt: 1 }}>
            View rooms
          </Button>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Tabs */}
      <Tabs value={tab} onChange={handleChange} textColor="primary">
        <Tab label="Photos" />
        <Tab label="Rooms" />
        <Tab label="Map" />
        <Tab label="Services" />
        <Tab label="Description" />
        <Tab label="Reviews" />
        <Tab label="Conditions" />
      </Tabs>

      <Divider sx={{ my: 2 }} />

      {/* Photos Section */}
      {tab === 0 && (
        <Grid container spacing={2}>
          <Grid size={8}>
            <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
              <CardMedia
                component="img"
                height="400"
                src={hotel?.imageUrl}
                alt="Hotel pool view"
              />
            </Card>
          </Grid>

          <Grid size={4}>
            <Grid container spacing={2}>
              {[
                "https://cf.bstatic.com/xdata/images/hotel/max1024x768/172562014.jpg",
                "https://cf.bstatic.com/xdata/images/hotel/max1024x768/172561991.jpg",
                "https://cf.bstatic.com/xdata/images/hotel/max1024x768/172562027.jpg",
                "https://cf.bstatic.com/xdata/images/hotel/max1024x768/172561999.jpg",
              ].map((src, idx) => (
                <Grid size={6} key={idx}>
                  <Card sx={{ borderRadius: 2, overflow: "hidden" }}>
                    <CardMedia component="img" height="120" image={src} />
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default HotelDetailPage;
