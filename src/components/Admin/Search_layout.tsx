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
import { useToast } from "../../context/ToastContext.tsx";

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
  const toast = useToast();
  const {
    openModalConfirm,
    refetchSearchFlightList,
    // handleCancelPassword,
    searchFlightList,
    handlePasswordConfirm,
    refreshFlag,
    // hasPendingRequest,
    latestData,
  } = useSearchFlight();

  // React.useEffect(() => {
  //   if (latestData && latestData.resultCode === "00" && latestData.data) {
  //     console.log("🔄 Latest data updated:", latestData);
  //     const allFlights = [
  //       ...(latestData.data.outbound || []),
  //       ...(latestData.data.inbound || []),
  //     ];
  //     setRowData(allFlights as DataFlight[]);
  //     toast(`Tìm thấy ${allFlights.length} chuyến bay`, "success");
  //   }
  // }, [latestData, toast]);

  // THEO DÕI fetchData thông thường
  // React.useEffect(() => {
  //   if (
  //     searchFlightList &&
  //     searchFlightList.resultCode === "00" &&
  //     searchFlightList.data
  //   ) {
  //     console.log("🔄 Fetch data updated:", searchFlightList);
  //     const allFlights = [
  //       ...(searchFlightList.data.outbound || []),
  //       ...(searchFlightList.data.inbound || []),
  //     ];
  //     setRowData(allFlights as DataFlight[]);
  //   }
  // }, [searchFlightList]);

  // console.log("logpasw", password);
  // React.useEffect(() => {
  //   console.log("🔄 Refresh flag changed:", refreshFlag);
  //   // Có thể thêm logic re-fetch hoặc cập nhật state ở đây nếu cần
  // }, [refreshFlag]);
  const {
    control: controlSearch,
    handleSubmit: handleSearchSubmit,
    reset: resetSearch,
  } = useForm<SearchFlightDto>({
    defaultValues: flightParams,
  });
  const [isVerifying, setIsVerifying] = React.useState(false);

  // const handlePasswordSuccess = React.useCallback(
  //   async (password: string) => {
  //     setIsVerifying(true);
  //     try {
  //       const response = await handlePasswordConfirm(password);
  //       return response;
  //     } finally {
  //       setIsVerifying(false);
  //     }
  //   },
  //   [handlePasswordConfirm]
  // );

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
        console.log("🔍 Searching with:", values);

        const res = await refetchSearchFlightList(values);
        console.log("📊 Search result:", res);

        if (res?.resultCode === "00") {
          const allFlights = [
            ...(res.data?.outbound || []),
            ...(res.data?.inbound || []),
          ];
          setRowData(allFlights as DataFlight[]);
          toast(`Tìm thấy ${allFlights.length} chuyến bay`, "success");
        } else if (res) {
          toast(res.resultMessage || "Tìm kiếm thất bại", "error");
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
    return await handlePasswordConfirm(password);
  };

  const handleValidPassword = () => {
    console.log("✅ Xác thực thành công, data sẽ được cập nhật");
    // Không cần làm gì thêm vì hook đã tự động gọi lại API
  };

  // const onSubmitValue = React.useCallback(
  //   async (values: SearchFlightDto) => {
  //     try {
  //       setIsSearch(true);

  //       const res = await refetchSearchFlightList(values);
  //       console.log("res", res);
  //       if (res?.resultCode === "00") {
  //         const allFlights = [
  //           ...(res.data?.outbound || []),
  //           ...(res.data?.inbound || []),
  //         ];
  //         setRowData(allFlights as DataFlight[]);
  //       } else {
  //         setRowData([]);
  //         console.error("Search failed:", res);
  //       }
  //     } catch (error) {
  //       console.error("Search error:", error);
  //       setRowData([]);
  //     } finally {
  //       setIsSearch(false);
  //     }
  //   },
  //   [refetchSearchFlightList, setRowData, setIsSearch]
  // );

  // const onSubmitValue = React.useCallback(
  //   async (values: SearchFlightDto) => {
  //     try {
  //       setIsSearch(true);
  //       console.log("🔍 Searching with:", values);

  //       // Đảm bảo refetch trả về promise
  //       const refetchPromise = refetchSearchFlightList(values);

  //       if (refetchPromise && typeof refetchPromise.then === "function") {
  //         const res = await refetchPromise;
  //         console.log("📊 Search result:", res);

  //         if (res?.resultCode === "00") {
  //           // Đảm bảo data tồn tại
  //           const flightsDataOutbound = res.data?.outbound;
  //           const flightsDataInbound = res.data?.inbound;
  //           const allFlights = [
  //             ...(flightsDataOutbound || []),
  //             ...(flightsDataInbound || []),
  //           ];

  //           console.log("✅ Found flights:", allFlights);
  //           setRowData(allFlights as DataFlight[]);
  //         } else {
  //           console.warn("❌ Search failed:", res);
  //           setRowData([]);
  //         }
  //       } else {
  //         console.error("❌ refetchSearchFlightList không trả về promise");
  //         setRowData([]);
  //       }
  //     } catch (error) {
  //       console.error("❌ Search error:", error);
  //       setRowData([]);
  //     } finally {
  //       setIsSearch(false);
  //     }
  //   },
  //   [refetchSearchFlightList, setRowData, setIsSearch]
  // );

  // const onSubmitValue = React.useCallback(
  //   async (values: SearchFlightDto) => {
  //     try {
  //       setIsSearch(true);
  //       console.log("🔍 Searching with:", values);

  //       // Gọi API và await kết quả
  //       const res = await refetchSearchFlightList(values);
  //       console.log("📊 Search result:", res);

  //       // Kiểm tra res có tồn tại không
  //       if (!res) {
  //         console.warn("⚠️ API returned undefined or null");
  //         toast("Không nhận được phản hồi từ server", "error");
  //         setRowData([]);
  //         return;
  //       }

  //       // Kiểm tra resultCode
  //       if (res.resultCode === "00") {
  //         console.log("✅ Search successful");

  //         // Kiểm tra data structure
  //         const flightsData = res.data;
  //         const outbound = Array.isArray(flightsData?.outbound)
  //           ? flightsData.outbound
  //           : [];
  //         const inbound = Array.isArray(flightsData?.inbound)
  //           ? flightsData.inbound
  //           : [];

  //         const allFlights = [...outbound, ...inbound];
  //         console.log(`✅ Found ${allFlights.length} flights`);

  //         setRowData(allFlights as DataFlight[]);

  //         // Hiển thị thông báo thành công
  //         if (allFlights.length > 0) {
  //           toast(`Tìm thấy ${allFlights.length} chuyến bay`, "success");
  //         } else {
  //           toast("Không tìm thấy chuyến bay phù hợp", "info");
  //         }
  //       } else {
  //         // Xử lý khi resultCode khác "00"
  //         console.warn("❌ Search failed with resultCode:", res.resultCode);
  //         console.warn("Error message:", res.resultMessage);

  //         setRowData([]);

  //         // Hiển thị thông báo lỗi từ server
  //         toast(res.resultMessage || "Tìm kiếm thất bại", "error");
  //       }
  //     } catch (error) {
  //       console.error("❌ Search error:", error);
  //       setRowData([]);
  //       toast("Đã xảy ra lỗi khi tìm kiếm", "error");
  //     } finally {
  //       setIsSearch(false);
  //     }
  //   },
  //   [refetchSearchFlightList, setRowData, setIsSearch, toast]
  // );

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

              <FormRow direction="column" label="From Airport">
                <InputTextField
                  value={flightParams.from}
                  name="from"
                  placeholder="e.g., SGN"
                />
              </FormRow>

              <FormRow direction="column" label="To Airport">
                <InputTextField
                  value={flightParams.to}
                  name="to"
                  placeholder="e.g., HAN"
                />
              </FormRow>

              <FormRow direction="column" label="Depart Date">
                <InputTextField
                  value={String(flightParams.departDate)}
                  name="departDate"
                />
              </FormRow>

              <FormRow direction="column" label="Return Date">
                <InputTextField
                  value={String(flightParams.returnDate)}
                  name="returnDate"
                />
              </FormRow>

              <FormRow direction="column" label="Passengers">
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

      {openModalConfirm && (
        <ConfirmPasswordToCallApi
          open={openModalConfirm}
          onSuccess={handlePasswordConfirm}
          onClose={() => {}}
          // onSuccess={handlePasswordSuccess}
          onValidPassword={handleValidPassword}
          isLoading={isVerifying}
        />
      )}
    </Box>
  );
};

export default React.memo(Search_layout);
