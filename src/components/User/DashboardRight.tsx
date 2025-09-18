import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from "@mui/material";
import { Search, Notifications, Settings } from "@mui/icons-material";

export default function DashboardRight() {
  return (
    <Box flex={1} p={3} sx={{ overflowY: "auto", height: "100vh" }}>
      {/* Topbar */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <TextField
          placeholder="Search anything"
          size="small"
          sx={{ width: "30%" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton>
            <Notifications />
          </IconButton>
          <IconButton>
            <Settings />
          </IconButton>
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar src="/avatar.png">MS</Avatar>
            <Box>
              <Typography variant="subtitle2">Martin Septimus</Typography>
              <Typography variant="caption" color="text.secondary">
                Admin
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} mb={3}>
        <Grid size={4}>
          <Card>
            <CardHeader title="Active Flights" />
            <CardContent>
              <Typography variant="h4">76</Typography>
              <Typography variant="body2" color="green">
                +2.54%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={4}>
          <Card>
            <CardHeader title="Cancelled Flights" />
            <CardContent>
              <Typography variant="h4">18</Typography>
              <Typography variant="body2" color="red">
                -1.56%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={4}>
          <Card>
            <CardHeader title="Completed Flights" />
            <CardContent>
              <Typography variant="h4">235</Typography>
              <Typography variant="body2" color="green">
                +3.46%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts & Stats */}
      <Grid container spacing={2} mb={3}>
        <Grid size={4}>
          <Card>
            <CardHeader title="Ticket Sales (Last 6 Months)" />
            <CardContent>
              <Box height={150} bgcolor="#f5f5f5" borderRadius={2} />
              <Typography variant="body2" mt={1}>
                12,500 Tickets sold
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={4}>
          <Card>
            <CardHeader title="Revenue Growth" />
            <CardContent>
              <Box height={150} bgcolor="#f5f5f5" borderRadius={2} />
              <Typography variant="body2" mt={1}>
                +15,800
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={4}>
          <Card>
            <CardHeader title="Customer Growth" />
            <CardContent>
              <Box height={150} bgcolor="#f5f5f5" borderRadius={2} />
              <Typography variant="h6" mt={1}>
                25% From Last Month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* All Bookings */}
      <Card>
        <CardHeader
          title="All Bookings"
          action={<Typography variant="body2">See All</Typography>}
        />
        <CardContent>
          <List>
            {[
              {
                airline: "SkyHigh Airlines",
                from: "JFK",
                to: "LAX",
                time: "10:00 AM - 1:00 PM",
              },
              {
                airline: "Flyfast Airways",
                from: "LHR",
                to: "JFK",
                time: "8:00 AM - 11:00 AM",
              },
              {
                airline: "AeroJet",
                from: "HND",
                to: "SFO",
                time: "2:00 PM - 8:00 AM",
              },
              {
                airline: "Nimbus Airlines",
                from: "SYD",
                to: "SIN",
                time: "6:00 PM - 12:00 AM",
              },
              {
                airline: "JetStream Aviation",
                from: "DXB",
                to: "LHR",
                time: "11:00 PM - 6:00 AM",
              },
            ].map((booking, index) => (
              <>
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar>{booking.airline[0]}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={booking.airline}
                    secondary={`${booking.from} → ${booking.to} | ${booking.time}`}
                  />
                </ListItem>
                {index < 4 && <Divider component="li" />}
              </>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}
