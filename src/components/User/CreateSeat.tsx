import { Add } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";

const CreateSeat = () => {
  const [createFormOpen, setCreateFormOpen] = useState(false);

  return (
    <>
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h5" mb={2}>
          No Seats Configured
        </Typography>
        <Typography variant="body1" mb={3}>
          You haven't created any seats yet. Would you like to create individual
          seats or generate a complete aircraft layout?
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => setCreateFormOpen(true)}
            sx={{ mb: 2 }}
            startIcon={<Add />}
          >
            Create Individual Seat
          </Button>

          <Button
            variant="outlined"
            color="primary"
            onClick={handleGenerateAllSeats}
            sx={{ mb: 2 }}
          >
            Generate All Seats (A-F to 1-40)
          </Button>
          {/* <Button onClick={resetSeatToGetData}>Reset</Button> */}
        </Box>

        {/* <Dialog
                open={createFormOpen}
                onClose={() => setCreateFormOpen(false)}
                maxWidth="sm"
                fullWidth
              >
                <DialogTitle>Create New Seat</DialogTitle>
                <DialogContent>
                 
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setCreateFormOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateSingleSeat} variant="contained">
                    Create Seat
                  </Button>
                </DialogActions>
              </Dialog> */}

        {/* <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              >
                <Alert
                  onClose={() => setSnackbarOpen(false)}
                  severity={snackbarSeverity}
                  sx={{ width: "100%" }}
                >
                  {snackbarMessage}
                </Alert>
              </Snackbar> */}
      </Box>
    </>
  );
};

export default CreateSeat;
