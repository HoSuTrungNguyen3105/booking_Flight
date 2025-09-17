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
import { type DataFlight } from "../../utils/type";
import FormRow from "../../common/CustomRender/FormRow";
import type { GridColDef, GridRowId } from "@mui/x-data-grid";
import { type GridRowDef } from "../../common/DataGrid/index.tsx";
import InputTextField from "../../common/Input/InputTextField.tsx";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Flight as FlightIcon,
  StarBorder as StarBorderIcon,
} from "@mui/icons-material";
import FlightDetail from "./component/FlightDetail.tsx";
import TableSection from "../../common/Setting/TableSection.tsx";
import ConfirmPasswordToCallApi from "../User/ConfirmPasswordToCallApi.tsx";
import { useToast } from "../../context/ToastContext.tsx";
import type { IDetailItem } from "../../common/DetailSection/index.tsx";
import DetailSection from "../../common/DetailSection/index.tsx";
import RhfInputTextField from "../../common/CustomRender/RhfInputTextField.tsx";

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

  const toast = useToast();
  const {
    openModalConfirm,
    refetchSearchFlightList,
    handleCancelPassword,
    handleCloseConfirmPassword,
    handlePasswordConfirm,
    hasPendingRequest,
  } = useSearchFlight();

  const {
    control: controlSearch,
    handleSubmit: handleSearchSubmit,
    getValues: getValues,
    register: registerSearch,
    reset: resetSearch,
  } = useForm<SearchFlightDto>({
    defaultValues: flightParams,
  });
  const [isVerifying, setIsVerifying] = React.useState(false);

  const [rowData, setRowData] = React.useState<DataFlight[]>([]);

  const [selectedFlight, setSelectedFlight] = React.useState<number>();
  const [selectedFlightData, setSelectedFlightData] =
    React.useState<DataFlight | null>(null);

  const [detailModalOpen, setDetailModalOpen] = React.useState(false);

  const handleRowClick = (rowData: any) => {
    const flightId = rowData.flightId || rowData.id;
    if (flightId) {
      setSelectedFlight(flightId);
      setSelectedFlightData(rowData);
      setDetailModalOpen(true);
    } else {
      console.error("❌ No flightId found in row data");
    }
  };

  const handleSetTranformMode = React.useCallback(() => {
    if (mode === "simple") {
      setMode("advance");
    } else {
      setMode("simple");
    }
  }, [mode]);

  const resetForm = () => {
    setFlightParams({
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
  };

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
        } else if (res) {
          setRowData([]);
        }
      } catch (error) {
        console.error("❌ Search error:", error);
        toast("Đã xảy ra lỗi khi tìm kiếm", "error");
        setRowData([]);
      } finally {
        setIsSearch(false);
      }
    },
    [refetchSearchFlightList, setRowData, setIsSearch, toast]
  );

  const handlePasswordSuccess = async (password: string) => {
    setIsVerifying(true);
    try {
      const response = await handlePasswordConfirm(password);
      return response;
    } catch (error) {
      return { resultCode: "99", resultMessage: "Lỗi xác thực" };
    } finally {
      setIsVerifying(false);
    }
  };

  // const handleInputChange = (name: keyof SearchFlightDto, value: string) => {
  //   setFlightParams((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  const handleInputChange = <K extends keyof SearchFlightDto>(
    field: K,
    value: SearchFlightDto[K]
  ) => {
    setFlightParams((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleValidPassword = () => {
    console.log("✅ Xác thực thành công, data sẽ được cập nhật");
  };

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
      toast("Please select a flight to delete!");
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
  ];

  const renderDataOption1 = React.useCallback(() => {
    const currentValues = getValues(); // Lấy giá trị hiện tại

    const detailInfoProfile: IDetailItem[] = [
      {
        title: "from",
        size: 4,
        description: (
          <InputTextField
            name="from"
            placeholder="e.g., HAN"
            value={currentValues.from} // Truyền value vào
            onChange={(e) => handleInputChange("from", e)}
          />
        ),
      },
      {
        title: "name",
        size: 4,
        description: (
          <InputTextField
            value={flightParams.to}
            name="to"
            placeholder="e.g., HAN"
            onChange={(e) => handleInputChange("to", e)}
          />
        ),
      },
      {
        title: "returnDate",
        size: 4,
        description: (
          <InputTextField
            value={String(flightParams.returnDate)}
            name="returnDate"
            onChange={(e) => handleNumberChange("returnDate", e)}
          />
        ),
      },
      {
        title: "passengers",
        size: 6,
        description: (
          <InputTextField
            name="passengers"
            placeholder="1"
            value={String(flightParams.passengers)}
            onChange={(event) => handleNumberChange("passengers", event)}
          />
        ),
      },
    ];

    return (
      <Box sx={{ height: "auto", width: "100%" }}>
        <DetailSection data={detailInfoProfile} />
      </Box>
    );
  }, [flightParams]);

  // Hàm xử lý thay đổi cho number fields
  const handleNumberChange = (name: keyof SearchFlightDto, value: string) => {
    setFlightParams((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : Number(value),
    }));
  };

  const renderDataOption2 = React.useCallback(() => {
    const detailInfoProfile: IDetailItem[] = [
      {
        title: "id",
        size: 4,
        description: (
          <InputTextField
            value={flightParams.from}
            name="from"
            placeholder="e.g., SGN"
          />
        ),
      },
      {
        title: "name",
        size: 4,
        description: (
          <InputTextField
            value={flightParams.to}
            name="to"
            placeholder="e.g., HAN"
          />
        ),
      },
      {
        title: "mfaEnabledYn",
        size: 4,
        description: (
          <InputTextField
            value={String(flightParams.returnDate)}
            name="returnDate"
          />
        ),
      },
      {
        title: "email",
        size: 6,
        description: (
          <InputTextField
            name="passengers"
            placeholder="1"
            value={String(flightParams.passengers)}
          />
        ),
      },
      {
        title: "role",
        size: 6,
        description: (
          <InputTextField
            value={flightParams.from}
            name="from"
            placeholder="e.g., SGN"
          />
        ),
      },
      {
        title: "createdAt",
        size: 6,
        description: (
          <InputTextField
            value={flightParams.from}
            name="from"
            placeholder="e.g., SGN"
          />
        ),
      },
      {
        title: "updatedAt",
        size: 6,
        description: (
          <InputTextField
            value={flightParams.from}
            name="from"
            placeholder="e.g., SGN"
          />
        ),
      },
    ];

    return (
      <Box sx={{ height: "auto", width: "100%" }}>
        <DetailSection data={detailInfoProfile} />
      </Box>
    );
  }, []);

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

  if (detailModalOpen) {
    return (
      <FlightDetail
        flight={selectedFlightData as DataFlight}
        onBookFlight={() => setDetailModalOpen(false)}
      />
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
              {renderDataOption1()}
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
              {/* //jjjj */}
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
              // onSelectedRowIdsChange={handleFlightRowSelection}
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

      {openModalConfirm && (
        <ConfirmPasswordToCallApi
          open={openModalConfirm}
          onCancel={handleCancelPassword}
          onClose={handleCloseConfirmPassword}
          hasPendingRequest={hasPendingRequest}
          onSuccess={handlePasswordSuccess}
          onValidPassword={handleValidPassword}
          isLoading={isVerifying}
        />
      )}
    </Box>
  );
};

export default React.memo(Search_layout);
