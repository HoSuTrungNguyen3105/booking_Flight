import * as React from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  Divider,
  Chip,
  Skeleton,
} from "@mui/material";
import { Add, DeleteForever } from "@mui/icons-material";
import { useSearchFlight } from "../Api/usePostApi";
import { toast } from "react-toastify";
import { type DataFlight } from "../../utils/type";
import FormRow from "../../common/CustomRender/FormRow";
import type { GridColDef, GridRowId } from "@mui/x-data-grid";
import { type GridRowDef } from "../../common/DataGrid/index.tsx";
import InputTextField from "../../common/Input/InputTextField.tsx";
import SelectDropdown from "../../common/Dropdown/SelectDropdown.tsx";
import {
  cabinClassOptions,
  flightStatusOptions,
  flightTypeOptions,
} from "./hook.ts";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Flight as FlightIcon,
  StarBorder as StarBorderIcon,
} from "@mui/icons-material";
import FlightDetail from "./component/FlightDetail.tsx";
import TableSection from "../../common/Setting/TableSection.tsx";
import ConfirmPasswordToCallApi from "../User/ConfirmPasswordToCallApi.tsx";

type FlightId = {
  id: number;
};

type CabinClassType = "ECONOMY" | "BUSINESS" | "VIP";
export type SearchFlightDto = {
  from: string; // departureAirport
  to: string; // arrivalAirport
  departDate?: number;
  returnDate?: number;
  passengers?: number;
  flightType?: "oneway" | "roundtrip";
  cabinClass?: CabinClassType;
  aircraftCode?: string;
  status?:
    | "scheduled"
    | "boarding"
    | "departed"
    | "arrived"
    | "delayed"
    | "cancelled";
  minPrice?: number;
  maxPrice?: number;
  gate?: string;
  terminal?: string;
  minDelayMinutes?: number;
  maxDelayMinutes?: number;
  includeCancelled?: boolean;
};

const Search_layout: React.FC = () => {
  const [flightData, setFlightData] = React.useState<DataFlight[]>([]);
  const [flightId, setFlightId] = React.useState<FlightId | null>(null);
  const [selectId, setSelectId] = React.useState<number[]>([]);
  // const [updateFlight, setUpdateFlight] = React.useState<boolean>(false);
  const [openUpdateConfirm, setOpenUpdateConfirm] =
    React.useState<boolean>(false);
  const [mode, setMode] = React.useState<"advance" | "simple">("simple");
  const [isUpdate, setIsUpdate] = React.useState<boolean>(false);
  const [isSearch, setIsSearch] = React.useState<boolean>(false);
  const [isReset, setIsReset] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [_, setLoading] = React.useState<boolean>(true);
  const [flightParams, setFlightParams] = React.useState<SearchFlightDto>({
    from: "",
    to: "",
    departDate: 0,
    returnDate: undefined,
    passengers: undefined,
    flightType: undefined,
    gate: "",
    cabinClass: "ECONOMY",
    aircraftCode: "",
    status: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    terminal: "",
    minDelayMinutes: undefined,
    maxDelayMinutes: undefined,
    includeCancelled: false,
  });

  const [showDelete, setShowDelete] = React.useState<boolean>(false);
  const { openModalConfirm, refetchSearchFlightList } = useSearchFlight();
  const {
    control: controlSearch,
    handleSubmit: handleSearchSubmit,
    reset: resetSearch,
  } = useForm<SearchFlightDto>({
    defaultValues: flightParams,
  });

  const [rowData, setRowData] = React.useState<DataFlight[]>([]);

  const [selectedFlight, setSelectedFlight] = React.useState<number>();
  const [selectedFlightData, setSelectedFlightData] =
    React.useState<DataFlight | null>(null);

  const [detailModalOpen, setDetailModalOpen] = React.useState(false);

  const handleRowClick = (rowData: any) => {
    console.log("🎯 Row clicked in parent component:", rowData);

    // Lấy flightId từ row data
    const flightId = rowData.flightId || rowData.id;
    console.log("🎯 Extracted Flight ID:", flightId);

    if (flightId) {
      setSelectedFlight(flightId);
      setSelectedFlightData(rowData);
      setDetailModalOpen(true);
    } else {
      console.error("❌ No flightId found in row data");
    }
  };

  console.log("openModalConfirm", openModalConfirm);

  const [formData, setFormData] = React.useState({
    quantity: 0,
    price: 0,
    discount: 10,
  });

  const handleSetTranformMode = React.useCallback(() => {
    if (mode === "simple") {
      setMode("advance");
    } else {
      setMode("simple");
    }
  }, [mode]);

  const { reset: resetUpdate } = useForm<DataFlight[]>({
    defaultValues: flightData,
  });

  const onSubmitValue = React.useCallback(
    async (values: SearchFlightDto) => {
      try {
        setIsSearch(true);

        const res = await refetchSearchFlightList(values);

        if (res?.resultCode === "00") {
          const allFlights = [
            ...(res.data?.outbound || []),
            ...(res.data?.inbound || []),
          ];
          setRowData(allFlights as DataFlight[]);
        } else {
          setRowData([]);
          console.error("Search failed:", res?.resultMessage);
        }
      } catch (error) {
        console.error("Search error:", error);
        setRowData([]);
      } finally {
        setIsSearch(false);
      }
    },
    [refetchSearchFlightList, setRowData, setIsSearch]
  );

  const handleOpen = (data: DataFlight): void => {
    try {
      setFlightId(data.flightId ? { id: data.flightId } : null);
      // setUpdateFlight(true);
    } catch (err) {
      console.error("Error", err);
    }
  };

  const handleClose = (): void => {
    // setUpdateFlight(false);
    setFlightId(null);
    setSelectId([]);
  };

  const resetUpdateField = async () => {
    await resetUpdate(flightData);
  };

  const handleDeleteClick = (): void => {
    if (isUpdate) return;
    if (selectId.length === 0) {
      toast.warning("Please select a flight to delete!");
    } else if (selectId.length > 1) {
    } else {
      setShowDelete(true);
    }
  };

  const formatDate = (dateValue: string | undefined) => {
    if (!dateValue) return null;
    const date = new Date(dateValue);
    return date.toLocaleString("en-EN");
  };

  const onResetForm = (): void => {
    if (isReset) return;
    resetSearch();
    refetchSearchFlightList(flightParams);
  };

  const [flightRows, setFlightRows] = React.useState<GridRowDef[]>([]);

  const handleOpenUpdateConfirm = () => setOpenUpdateConfirm(true);

  const [selectedMealRows, setSelectedMealRows] = React.useState<GridRowDef[]>(
    []
  );

  const handleFlightRowSelection = (selectedIds: any[]) => {
    setSelectedMealRows((prev) => {
      const newSelectedRows = flightRows.filter((row) =>
        selectedIds.includes(row.id)
      );
      return newSelectedRows;
    });
  };

  const colDefs: GridColDef[] = [
    {
      field: "flightId",
      headerName: "Mã chuyến bay",
      flex: 1,
      renderCell: (params) => (
        <Typography
          onClick={() => handleOpen(params.row)}
          sx={{ cursor: "pointer" }}
        >
          {params.row.flightId}
        </Typography>
      ),
    },
    {
      field: "flightNo",
      headerName: "Số hiệu",
      flex: 0.5,
    },
    {
      field: "scheduledDeparture",
      headerName: "Giờ khởi hành dự kiến",
      flex: 1,
      renderCell: (params) => formatDate(params.row.scheduledDeparture),
    },
    {
      field: "scheduledArrival",
      headerName: "Giờ đến dự kiến",
      flex: 1,
      renderCell: (params) => formatDate(params.row.scheduledArrival),
    },
    {
      field: "departureAirport",
      headerName: "Sân bay đi",
      flex: 1,
    },
    {
      field: "arrivalAirport",
      headerName: "Sân bay đến",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Trạng thái",
      flex: 1,
    },
    {
      field: "aircraftCode",
      headerName: "Mã máy bay",
      flex: 1,
    },
    {
      field: "actualDeparture",
      headerName: "Giờ khởi hành thực tế",
      flex: 1,
      renderCell: (params) => formatDate(params.row.actualDeparture),
    },
    {
      field: "actualArrival",
      headerName: "Giờ đến thực tế",
      flex: 1,
      renderCell: (params) => formatDate(params.row.actualArrival),
    },
  ];

  if (!selectId) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="800px"
      >
        <Typography color="error" sx={{ p: 2 }}>
          <Skeleton sx={{ p: 2 }}>
            Cannot find flight with ID:{selectId}
          </Skeleton>
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        minHeight="800px"
        p={3}
      >
        <Typography color="error" sx={{ p: 2 }}>
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSearchSubmit(onSubmitValue)}
      sx={{ p: 2 }}
    >
      <Paper
        elevation={2}
        sx={{ p: 2, mb: 2, bgcolor: "primary.main", color: "white" }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FlightIcon fontSize="large" />
          <Typography variant="h5" fontWeight="bold">
            Flight Search
            {/* <MultiTimepicker type={typeEnum.Confirmed}></MultiTimepicker> */}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
          Find your perfect flight with advanced search options
        </Typography>
      </Paper>

      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid size={12}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  color: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <StarBorderIcon /> Flight Route
              </Typography>

              <FormRow label="From Airport">
                <InputTextField
                  value={flightParams.from}
                  name="from"
                  placeholder="e.g., SGN"
                />
              </FormRow>

              <FormRow label="To Airport">
                <InputTextField
                  value={flightParams.to}
                  name="to"
                  placeholder="e.g., HAN"
                />
              </FormRow>

              <FormRow label="Depart Date">
                <InputTextField
                  value={String(flightParams.departDate)}
                  name="departDate"
                />
              </FormRow>

              <FormRow label="Return Date">
                <InputTextField
                  value={String(flightParams.returnDate)}
                  name="returnDate"
                />
              </FormRow>

              <FormRow label="Passengers">
                <InputTextField
                  name="passengers"
                  placeholder="1"
                  value={String(flightParams.passengers)}
                />
              </FormRow>
            </Grid>

            <Grid size={12}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  color: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <StarBorderIcon /> Flight Details
              </Typography>

              <FormRow label="Flight Type">
                <SelectDropdown
                  value={flightParams.flightType}
                  options={flightTypeOptions}
                />
              </FormRow>

              <FormRow label="Cabin Class">
                <SelectDropdown
                  value={flightParams.cabinClass}
                  options={cabinClassOptions}
                />
              </FormRow>

              <FormRow label="Aircraft Code">
                <InputTextField
                  name="aircraftCode"
                  placeholder="e.g., A321, B737"
                  value={flightParams.aircraftCode}
                />
              </FormRow>

              <FormRow label="Status">
                <SelectDropdown
                  value={flightParams.status}
                  options={flightStatusOptions}
                />
              </FormRow>
            </Grid>

            {mode === "advance" && (
              <Grid size={12}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    color: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <StarBorderIcon /> Additional Filters
                </Typography>

                <FormRow label="Gate">
                  <InputTextField
                    value={flightParams.gate}
                    name="gate"
                    placeholder="e.g., A12, B3"
                  />
                </FormRow>

                <FormRow label="Terminal">
                  <InputTextField
                    value={flightParams.terminal}
                    name="terminal"
                    placeholder="e.g., T1, T2"
                  />
                </FormRow>

                <FormRow label="Price Range">
                  <Box display="flex" gap={1} alignItems="center">
                    <InputTextField
                      name="minPrice"
                      placeholder="Min"
                      sx={{ flex: 1 }}
                      value={String(flightParams.minPrice)}
                    />
                    <Typography variant="body2">to</Typography>
                    <InputTextField
                      name="maxPrice"
                      placeholder="Max"
                      sx={{ flex: 1 }}
                      value={String(flightParams.maxPrice)}
                    />
                  </Box>
                </FormRow>

                <FormRow label="Delay Range (minutes)">
                  <Box display="flex" gap={1} alignItems="center">
                    <InputTextField
                      name="minDelayMinutes"
                      placeholder="Min"
                      sx={{ flex: 1 }}
                      value={String(flightParams.minDelayMinutes)}
                    />
                    <Typography variant="body2">to</Typography>
                    <InputTextField
                      name="maxDelayMinutes"
                      placeholder="Max"
                      sx={{ flex: 1 }}
                      value={String(flightParams.maxDelayMinutes)}
                    />
                  </Box>
                </FormRow>
              </Grid>
            )}
          </Grid>

          <Divider sx={{ my: 3 }} />
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={onResetForm}
              size="large"
              sx={{ minWidth: 120 }}
            >
              Reset
            </Button>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={handleSetTranformMode}
              size="large"
              sx={{ minWidth: 120 }}
            >
              Advanced
            </Button>
            <Button
              variant="contained"
              startIcon={<SearchIcon />}
              type="submit"
              disabled={isSearch}
              size="large"
              sx={{ minWidth: 120 }}
            >
              Search
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card elevation={2}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6">
              Flight Results ({rowData.length} flights found)
            </Typography>
            <Chip
              label={`Last updated: ${new Date().toLocaleTimeString()}`}
              size="small"
              variant="outlined"
            />
          </Box>

          <Box sx={{ height: "60vh", minHeight: 400 }}>
            <TableSection
              rows={rowData.map((r) => ({
                ...r,
                id: (r.flightId ?? r.flightId) as GridRowId,
              }))}
              columns={colDefs}
              isLoading={false}
              setRows={setFlightRows}
              onSelectedRowIdsChange={handleFlightRowSelection}
              handleRowClick={handleRowClick}
              nextRowClick
              largeThan
            />
          </Box>

          <Box
            sx={{ display: "flex", gap: 2, mt: 2, justifyContent: "flex-end" }}
          >
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteForever />}
              onClick={handleDeleteClick}
              disabled={isUpdate}
              size="large"
            >
              Delete Selected
            </Button>
          </Box>
        </CardContent>
      </Card>

      {detailModalOpen && (
        <FlightDetail
          onSuccess={() => {}}
          open={detailModalOpen}
          flightId={selectedFlight}
          flight={selectedFlightData}
          onClose={() => setDetailModalOpen(false)}
        />
      )}

      {openModalConfirm && <ConfirmPasswordToCallApi />}
    </Box>
  );
};

export default React.memo(Search_layout);
