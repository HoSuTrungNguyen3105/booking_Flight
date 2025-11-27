import * as React from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  Chip,
  Skeleton,
  Stack,
} from "@mui/material";
import { Add, DeleteForever } from "@mui/icons-material";
import { type DataFlight } from "../../../../utils/type.ts";
import type { GridColDef, GridRowId } from "@mui/x-data-grid";
import { type GridRowDef } from "../../../../common/DataGrid/index.tsx";
import InputTextField from "../../../../common/Input/InputTextField.tsx";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Flight as FlightIcon,
  StarBorder as StarBorderIcon,
  Person as PersonIcon,
  FlightTakeoff as FlightTakeoffIcon,
  FlightLand as FlightLandIcon,
  AirlineSeatReclineNormal as SeatIcon,
} from "@mui/icons-material";
import FlightDetail from "./FlightDetail.tsx";
import TableSection from "../../../../common/AdditionalCustomFC/TableSection.tsx";
import ConfirmPasswordToCallApi from "../../../Common/ConfirmPasswordToCallApi.tsx";
import { useToast } from "../../../../context/ToastContext.tsx";
import type { IDetailItem } from "../../../../common/AdditionalCustomFC/DetailSection.tsx";
import DetailSection from "../../../../common/AdditionalCustomFC/DetailSection.tsx";
import { DateFormatEnum, formatDate } from "../../../../hooks/format.ts";
import { ResponseCode } from "../../../../utils/response.ts";
import { useSearchFlight } from "../../../../context/Api/FlightApi.ts";
import DateTimePickerComponent from "../../../../common/DayPicker/index.tsx";
import { MenuItem } from "@mui/material";

type FlightId = {
  id: number;
};

// export type CabinClassType = "ECONOMY" | "BUSINESS" | "VIP";

export type SearchFlightDto = {
  from: string; // departureAirport
  to: string; // arrivalAirport
  departDate?: number;
  returnDate?: number;
  passengers?: number;
  flightType?: string;
  cabinClass?: string;
  aircraftCode?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  gate?: string;
  terminal?: string;
  minDelayMinutes?: number;
  maxDelayMinutes?: number;
  includeCancelled?: boolean;
};

const Search_layout: React.FC = () => {
  // const [flightData, setFlightData] = React.useState<DataFlight[]>([]);
  const [flightId, setFlightId] = React.useState<FlightId | null>(null);
  const [selectId, setSelectId] = React.useState<number[]>([]);
  const [mode, setMode] = React.useState<"advance" | "simple">("simple");
  const [isUpdate, setIsUpdate] = React.useState<boolean>(false);
  const [isSearch, setIsSearch] = React.useState<boolean>(false);
  const [isReset, setIsReset] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [_, setLoading] = React.useState<boolean>(true);
  const defaultFlightParams: SearchFlightDto = {
    from: "",
    to: "",
    departDate: undefined,
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
  };

  const [flightParams, setFlightParams] =
    React.useState<SearchFlightDto>(defaultFlightParams);
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
      console.error("No flightId found in row data");
    }
  };

  const handleSetTranformMode = React.useCallback(() => {
    if (mode === "simple") {
      setMode("advance");
    } else {
      setMode("simple");
    }
  }, [mode]);

  const { reset: resetUpdate } = useForm<DataFlight[]>({
    defaultValues: rowData,
  });

  const onSubmitValue = React.useCallback(
    async (values: SearchFlightDto) => {
      try {
        setIsSearch(true);
        const res = await refetchSearchFlightList(values);
        if (res?.resultCode === ResponseCode.SUCCESS) {
          const allFlights = [
            ...(res.data?.outbound || []),
            ...(res.data?.inbound || []),
          ];
          setRowData(allFlights as DataFlight[]);
        } else if (res) {
          setRowData([]);
        }
      } catch (error) {
        console.error("Search error:", error);
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

  const handleInputChange = <K extends keyof SearchFlightDto>(
    field: K,
    value: SearchFlightDto[K]
  ) => {
    setFlightParams((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (
    field: "departDate" | "returnDate",
    value: number
  ) => {
    setFlightParams((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleValidPassword = () => {
    console.log(" Xác thực thành công, data sẽ được cập nhật");
  };

  const handleOpen = (data: DataFlight): void => {
    try {
      setFlightId(data.flightId ? { id: data.flightId } : null);
      // setUpdateFlight(true);
    } catch (err) {
      console.error("Error", err);
    }
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

  // const formatDate = (dateValue: string | undefined) => {
  //   if (!dateValue) return null;
  //   const date = new Date(dateValue);
  //   return date.toLocaleString("en-EN");
  // };

  const onResetForm = (): void => {
    if (isReset) return;
    setFlightParams(defaultFlightParams);
    refetchSearchFlightList(defaultFlightParams);
  };

  const [flightRows, setFlightRows] = React.useState<GridRowDef[]>([]);

  const handleFlightRowSelection = (selectedIds: any[]) => {
    setFlightRows((prev) => {
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
      renderCell: (params) =>
        formatDate(
          DateFormatEnum.DD_MM_YYYY_HH_MM_SS,
          params.row.scheduledDeparture
        ),
    },
    {
      field: "scheduledArrival",
      headerName: "Giờ đến dự kiến",
      flex: 1,
      renderCell: (params) =>
        formatDate(
          DateFormatEnum.DD_MM_YYYY_HH_MM_SS,
          params.row.scheduledArrival
        ),
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
    const detailInfoProfile: IDetailItem[] = [
      {
        title: "From",
        size: 3,
        description: (
          <InputTextField
            name="from"
            placeholder="e.g., HAN"
            value={flightParams.from}
            onChange={(e) => handleInputChange("from", e)}
            startIcon={<FlightTakeoffIcon color="action" />}
          />
        ),
      },
      {
        title: "To",
        size: 3,
        description: (
          <InputTextField
            value={flightParams.to}
            name="to"
            placeholder="e.g., SGN"
            onChange={(e) => handleInputChange("to", e)}
            startIcon={<FlightLandIcon color="action" />}
          />
        ),
      },
      {
        title: "Depart Date",
        size: 3,
        description: (
          <DateTimePickerComponent
            language="en"
            value={flightParams.departDate}
            onChange={(val) => handleDateChange("departDate", val)}
          />
        ),
      },
      {
        title: "Return Date",
        size: 3,
        description: (
          <DateTimePickerComponent
            language="en"
            value={flightParams.returnDate}
            onChange={(val) => handleDateChange("returnDate", val)}
          />
        ),
      },
      {
        title: "Passengers",
        size: 3,
        description: (
          <InputTextField
            name="passengers"
            placeholder="1"
            type="number"
            value={String(flightParams.passengers ?? "")}
            onChange={(event) => handleNumberChange("passengers", event)}
            startIcon={<PersonIcon color="action" />}
          />
        ),
      },
      {
        title: "Cabin Class",
        size: 3,
        description: (
          <InputTextField
            name="cabinClass"
            select
            value={flightParams.cabinClass}
            onChange={(e) => handleInputChange("cabinClass", e)}
            startIcon={<SeatIcon color="action" />}
          >
            <MenuItem value="ECONOMY">Economy</MenuItem>
            <MenuItem value="BUSINESS">Business</MenuItem>
            <MenuItem value="VIP">VIP</MenuItem>
          </InputTextField>
        ),
      },
    ];

    return <DetailSection data={detailInfoProfile} />;
  }, [flightParams]);

  // Hàm xử lý thay đổi cho number fields
  const handleNumberChange = (name: keyof SearchFlightDto, value: string) => {
    setFlightParams((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : Number(value),
    }));
  };

  const renderDataOptionDetails = React.useCallback(() => {
    const detailInfoProfile: IDetailItem[] = [
      {
        title: "Gate",
        size: 3,
        description: (
          <InputTextField
            value={flightParams.gate}
            name="gate"
            placeholder="e.g., A12"
            onChange={(e) => handleInputChange("gate", e)}
          />
        ),
      },
      {
        title: "Terminal",
        size: 3,
        description: (
          <InputTextField
            value={flightParams.terminal}
            name="terminal"
            placeholder="e.g., T1"
            onChange={(e) => handleInputChange("terminal", e)}
          />
        ),
      },
      {
        title: "Status",
        size: 3,
        description: (
          <InputTextField
            name="status"
            select
            value={flightParams.status ?? ""}
            onChange={(e) => handleInputChange("status", e)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="SCHEDULED">Scheduled</MenuItem>
            <MenuItem value="DELAYED">Delayed</MenuItem>
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
            <MenuItem value="ARRIVED">Arrived</MenuItem>
            <MenuItem value="DEPARTED">Departed</MenuItem>
          </InputTextField>
        ),
      },
      {
        title: "Aircraft Code",
        size: 3,
        description: (
          <InputTextField
            name="aircraftCode"
            placeholder="e.g., VN-A321"
            value={flightParams.aircraftCode}
            onChange={(e) => handleInputChange("aircraftCode", e)}
          />
        ),
      },
      {
        title: "Min Price",
        size: 3,
        description: (
          <InputTextField
            name="minPrice"
            placeholder="Min"
            type="number"
            value={String(flightParams.minPrice ?? "")}
            onChange={(e) => handleNumberChange("minPrice", e)}
          />
        ),
      },
      {
        title: "Max Price",
        size: 3,
        description: (
          <InputTextField
            name="maxPrice"
            placeholder="Max"
            type="number"
            value={String(flightParams.maxPrice ?? "")}
            onChange={(e) => handleNumberChange("maxPrice", e)}
          />
        ),
      },
      {
        title: "Min Delay (min)",
        size: 3,
        description: (
          <InputTextField
            name="minDelayMinutes"
            placeholder="Min"
            type="number"
            value={String(flightParams.minDelayMinutes ?? "")}
            onChange={(e) => handleNumberChange("minDelayMinutes", e)}
          />
        ),
      },
      {
        title: "Max Delay (min)",
        size: 3,
        description: (
          <InputTextField
            name="maxDelayMinutes"
            placeholder="Max"
            type="number"
            value={String(flightParams.maxDelayMinutes ?? "")}
            onChange={(e) => handleNumberChange("maxDelayMinutes", e)}
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
      onSubmit={(e) => {
        e.preventDefault();
        onSubmitValue(flightParams);
      }}
      // sx={{ p: 2 }}
    >
      <Stack
        sx={{ p: 2, mb: 2, backgroundColor: "primary.main", color: "white" }}
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
      </Stack>

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

            {mode === "advance" && (
              <>
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
                </Grid>
                {renderDataOptionDetails()}
              </>
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
