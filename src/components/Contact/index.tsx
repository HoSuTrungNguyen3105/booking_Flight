import React from "react";
import { Box, Container, Typography, Button, Stack } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import theme from "../../scss/theme";

const ContactPage: React.FC = () => {
  return (
    <>
      {/* Section 1 - Title */}
      <Box sx={{ bgcolor: "#fff", py: 6 }}>
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography
            variant="h3"
            fontWeight={700}
            color="text.primary"
            gutterBottom
          >
            Contact us
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please feel free to contact us through the following communication
            channels for any questions, concerns, or suggestions you may have.
          </Typography>
        </Container>
      </Box>

      {/* Section 2 - Customer service */}
      <Box sx={{ bgcolor: theme.palette.grey[100], py: 6 }}>
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography
            variant="h5"
            fontWeight={700}
            color="text.primary"
            gutterBottom
          >
            Customer service
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Our customer service is available Monday through Friday from{" "}
            <strong>9:00 AM</strong> to <strong>6:00 PM</strong>, and on
            weekends from <strong>10:00 AM</strong> to <strong>6:00 PM</strong>.
            Please click the button below for live assistance.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="center"
            spacing={2}
          >
            <Button
              variant="outlined"
              color="primary"
              endIcon={<ArrowForwardIcon />}
            >
              Live assistance
            </Button>
            <Button
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIcon />}
            >
              Drop us an e-mail
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Section 3 - Help section */}
      <Box sx={{ bgcolor: "#fff", py: 6 }}>
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography
            variant="h5"
            fontWeight={700}
            color="text.primary"
            gutterBottom
          >
            How can we help you?
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Would you like to browse through the help section to find the answer
            to your question before asking us?
          </Typography>
          <Button
            variant="contained"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            href="/help"
          >
            Help page
          </Button>
        </Container>
      </Box>

      {/* Section 4 - Communication details */}
      <Box sx={{ bgcolor: theme.palette.grey[100], py: 6 }}>
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography
            variant="h5"
            fontWeight={700}
            color="text.primary"
            gutterBottom
          >
            Communication details
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            You can directly write us to <br />
            <strong>hello@modern-ticketing.com</strong>
            <br />
            <br />
            or call us at <br />
            <strong>+44 7445 5100000</strong>
            <br />
            <br />
            <strong>Our office address is</strong>
            <br />
            233 North Road, Southbank, W2 2UL, London, UK
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            endIcon={<ArrowForwardIcon />}
          >
            Open maps
          </Button>
        </Container>
      </Box>
    </>
  );
};

export default ContactPage;
