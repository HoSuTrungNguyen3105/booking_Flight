import { useCallback, useState } from "react";
import {
  Typography,
  Grid,
  Button,
  Stack,
  Chip,
  Box,
  Card,
  type ChipProps,
} from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import {
  mapStringToDropdown,
  useFindAllFlightStatuses,
  useGetAllFlightIds,
} from "../../../../context/Api/useGetApi";
import SelectDropdown, {
  type ActionType,
} from "../../../../common/Dropdown/SelectDropdown";
import { useUpdateFlightStatus } from "../../../../context/Api/usePostApi";
import { useToast } from "../../../../context/ToastContext";

type ValidChipColor = ChipProps["color"];

// const statusOptions: ActionType[] = [
//   {
//     value: "SCHEDULED",
//     label: "Scheduled",
//     color: "info",
//     // icon: (
//     //   <Box
//     //     sx={{
//     //       width: 8,
//     //       height: 8,
//     //       borderRadius: "50%",
//     //       bgcolor: "info.main",
//     //     }}
//     //   />
//     // ),
//   },
//   {
//     value: "BOARDING",
//     label: "Boarding",
//     color: "primary",
//   },
//   {
//     value: "DELAYED",
//     label: "Delayed",
//     color: "warning",
//   },
//   {
//     value: "CANCELLED",
//     label: "Cancelled",
//     color: "error",
//   },
//   {
//     value: "LANDED",
//     label: "Landed",
//     color: "success",
//   },
// ];

const FlightStatus = ({ onReturn }: { onReturn: () => void }) => {
  const { dataLeaveStatuses } = useFindAllFlightStatuses();
  // const statusOptions = mapStringToDropdown(dataLeaveStatuses?.data || [])
  const { getAllFlightIds, refetchGetAllFlightIds } = useGetAllFlightIds();
  const [edited, setEdited] = useState<Record<number, string>>({});
  const toast = useToast();
  const handleChange = (flightId: number, newStatus: string) => {
    setEdited((prev) => ({ ...prev, [flightId]: newStatus }));
  };

  const { refetchUpdateFlightStatus } = useUpdateFlightStatus();

  const onUpdateStatus = useCallback(
    async (id: number, status: string) => {
      // setFlightId(id);
      const res = await refetchUpdateFlightStatus({
        id,
        status,
      });
      if (res?.resultCode === "00") {
        toast(res.resultMessage);
        refetchGetAllFlightIds();
      } else {
        toast(res?.resultMessage || "", "error");
      }
    },
    [refetchUpdateFlightStatus]
  );

  const handleSave = (id: number) => {
    const newStatus = edited[id];
    if (newStatus) {
      onUpdateStatus(id, newStatus);
      setEdited((prev) => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  };

  // const getChipColor = (status: string): ValidChipColor => {
  //   const option = statusOptions.find(
  //     (opt) => opt.value?.toString().toLowerCase() === status.toLowerCase()
  //   );

  //   const validColors: ValidChipColor[] = [
  //     "default",
  //     "primary",
  //     "secondary",
  //     "error",
  //     "warning",
  //     "info",
  //     "success",
  //   ];

  //   const color = option?.color as ValidChipColor;
  //   return validColors.includes(color) ? color : "default";
  // };

  const getStatusColor = (status: string): string => {
    switch (status.toUpperCase()) {
      case "APPROVED":
        return "success";
      case "PENDING":
        return "warning";
      case "REJECTED":
        return "error";
      case "CANCELLED":
        return "default";
      default:
        return "info";
    }
  };

  // const getProgressBarColor = (status: string) => {
  //   const color = getChipColor(status);
  //   return color === "default" ? "grey.500" : `${color}.main`;
  // };

  const isFlightEdited = (flightId: number) => {
    return edited[flightId] !== undefined;
  };

  const statusOptions = mapStringToDropdown(dataLeaveStatuses?.data || []).map(
    (item) => ({
      ...item,
      color: getStatusColor(item.value),
    })
  );

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Box>
        <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
          Flight Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage flight status and updates in real-time
        </Typography>
      </Box>

      <Button onClick={onReturn} variant="contained">
        {" "}
        Return
      </Button>

      {/* Flight List */}
      <Grid container spacing={3}>
        {getAllFlightIds?.list?.map((flight) => (
          <Grid key={flight.flightId} size={12}>
            <Stack
              sx={{
                p: 2,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack spacing={2}>
                {/* Flight Header */}
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="h6" fontWeight="bold">
                      {flight.flight.flightNo}
                    </Typography>
                    <Chip
                      label={flight.status}
                      sx={{ color: getStatusColor(flight.status) }}
                      variant="filled"
                      size="small"
                    />
                    {isFlightEdited(flight.id) && (
                      <Chip
                        label="Unsaved Changes"
                        color="warning"
                        variant="outlined"
                        size="small"
                      />
                    )}
                  </Stack>

                  <Typography variant="caption" color="text.secondary">
                    ID: {flight.flightId}
                  </Typography>
                </Stack>

                {/* Status Update Section */}
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "grey.50",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    alignItems={{ xs: "stretch", sm: "center" }}
                  >
                    <SelectDropdown
                      onChange={(value) =>
                        handleChange(flight.id, value as string)
                      }
                      value={edited[flight.id] ?? flight.status}
                      options={statusOptions}
                      placeholder="Flight Status"
                    />

                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={() => handleSave(flight.id)}
                      disabled={!isFlightEdited(flight.id)}
                      sx={{
                        minWidth: 120,
                        px: 3,
                      }}
                    >
                      Update
                    </Button>
                  </Stack>
                </Box>

                {/* Visual status indicator */}
                <Box
                  sx={{
                    width: "100%",
                    height: 4,
                    bgcolor: "grey.200",
                    borderRadius: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: "33%",
                      height: "100%",
                      bgcolor: getStatusColor(flight.status),
                      borderRadius: 2,
                    }}
                  />
                </Box>
              </Stack>
            </Stack>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {(!getAllFlightIds?.list || getAllFlightIds.list.length === 0) && (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            border: "2px dashed",
            borderColor: "divider",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Flights Available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            There are currently no flights to manage.
          </Typography>
        </Box>
      )}
    </Stack>
  );
};

export default FlightStatus;
