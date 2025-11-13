import { useCallback, useState } from "react";
import { Typography, Grid, Button, Stack, Chip, Box } from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";
import {
  mapStringToDropdown,
  useFindAllFlightStatuses,
  useGetAllFlightIds,
} from "../../../../context/Api/useGetApi";
import SelectDropdown from "../../../../common/Dropdown/SelectDropdown";
import {
  useCreateFlightStatus,
  useUpdateFlightStatus,
} from "../../../../context/Api/usePostApi";
import { useToast } from "../../../../context/ToastContext";
import InputTextField from "../../../../common/Input/InputTextField";
import { ResponseCode } from "../../../../utils/response";
import { FlightStatusType } from "../../../../utils/type";

const FlightStatus = ({ onReturn }: { onReturn: () => void }) => {
  const { dataFlightStatuses } = useFindAllFlightStatuses();
  const { getAllFlightIds, refetchGetAllFlightIds } = useGetAllFlightIds();
  const [description, setDescription] = useState<Record<number, string>>({});
  const [edited, setEdited] = useState<Record<number, string>>({});
  const toast = useToast();
  const handleChange = (flightId: number, newStatus: string) => {
    setEdited((prev) => ({ ...prev, [flightId]: newStatus }));
  };
  const { refetchCreateFlightStatus } = useCreateFlightStatus();
  const { refetchUpdateFlightStatus } = useUpdateFlightStatus();

  const handleDescriptionChange = (flightId: number, value: string) => {
    setDescription((prev) => ({
      ...prev,
      [flightId]: value,
    }));
  };

  const onUpdateStatus = useCallback(
    async (
      state: "add" | "update",
      flightId: number,
      id: number,
      status: string
    ) => {
      let res;
      if (state === "add") {
        res = await refetchCreateFlightStatus({
          flightId,
          status,
          description: description[flightId] || "",
        });
      } else if (state === "update") {
        res = await refetchUpdateFlightStatus({
          id,
          status,
        });
      }

      if (res?.resultCode === ResponseCode.SUCCESS) {
        toast(res.resultMessage);
        refetchGetAllFlightIds();
      } else {
        toast(res?.resultMessage || "error", "error");
      }
    },
    [
      refetchCreateFlightStatus,
      refetchUpdateFlightStatus,
      description,
      refetchGetAllFlightIds,
      toast,
    ]
  );

  // Khi save
  const handleSave = (
    state: "add" | "update",
    flightId: number,
    statusObjId?: number
  ) => {
    const key = statusObjId ?? flightId;
    const newStatus = edited[key];
    if (!newStatus) return;

    onUpdateStatus(state, flightId, statusObjId ?? 0, newStatus);

    setEdited((prev) => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
  };

  const getStatusColor = (status: FlightStatusType): string => {
    switch (status) {
      case FlightStatusType.COMPLETED:
        return "success";
      case FlightStatusType.ARRIVED:
        return "warning";
      case FlightStatusType.DELAYED:
        return "error";
      case FlightStatusType.CANCELLED:
        return "default";
      case FlightStatusType.BOARDING:
        return "success";
      case FlightStatusType.DEPARTED:
        return "warning";
      case FlightStatusType.IN_AIR:
        return "error";
      case FlightStatusType.SCHEDULED:
        return "default";
      default:
        return "info";
    }
  };

  const isFlightEdited = (flightId: number) => {
    return edited[flightId] !== undefined;
  };

  const statusOptions = mapStringToDropdown(dataFlightStatuses?.data || []).map(
    (item) => ({
      ...item,
      color: item.value, //getStatusColor
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
        {getAllFlightIds?.list?.map((flight) => {
          const statusObj = flight.flightStatuses?.[0]; // lấy status đầu tiên nếu có
          const statusLabel = statusObj?.status || "Chưa có status";
          const statusId = statusObj?.id ?? flight.flightId; // fallback id để xử lý SelectDropdown

          return (
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
                        {flight?.flightNo || ""}
                      </Typography>
                      {!flight.flightStatuses ||
                      flight.flightStatuses.length === 0 ? (
                        <InputTextField
                          key={flight.flightId}
                          value={description[flight.flightId] || ""}
                          onChange={(e) =>
                            handleDescriptionChange(flight.flightId, e)
                          }
                          placeholder="Description (optional)"
                        />
                      ) : (
                        <InputTextField
                          key={flight.flightId}
                          value={
                            description[flight.flightId] ??
                            flight.flightStatuses[0].description ??
                            ""
                          }
                          onChange={(e) =>
                            handleDescriptionChange(flight.flightId, e)
                          }
                        />
                      )}

                      <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={() => handleSave("add", flight.flightId)}
                        disabled={!isFlightEdited(flight.flightId)}
                        sx={{ minWidth: 120, px: 3 }}
                      >
                        Add
                      </Button>

                      <Chip
                        label={statusLabel}
                        sx={{
                          color: getStatusColor(
                            statusLabel as FlightStatusType
                          ),
                        }}
                        variant="filled"
                        size="small"
                      />

                      {isFlightEdited(statusId) && (
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
                          handleChange(statusId, value as string)
                        }
                        value={edited[statusId] ?? statusLabel}
                        options={statusOptions}
                        placeholder="Flight Status"
                      />
                      <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={() =>
                          handleSave(
                            "update",
                            statusId,
                            flight.flightStatuses[0].flightId
                          )
                        }
                        disabled={!isFlightEdited(statusId)}
                        sx={{ minWidth: 120, px: 3 }}
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
                        bgcolor: getStatusColor(
                          statusLabel as FlightStatusType
                        ),
                        borderRadius: 2,
                      }}
                    />
                  </Box>
                </Stack>
              </Stack>
            </Grid>
          );
        })}
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
