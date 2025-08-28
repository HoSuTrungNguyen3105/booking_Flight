import * as React from "react";
import { useForm } from "react-hook-form";
import RefreshSharpIcon from "@mui/icons-material/RefreshSharp";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  FormControl,
  Skeleton,
  TableContainer,
  Typography,
} from "@mui/material";
import {
  AdminPanelSettings,
  DeleteForever,
  House,
  StarBorder,
} from "@mui/icons-material";
import type { SelectionChangedEvent } from "ag-grid-community";
import { useFlightUpdate, useSearchFlight } from "../Api/usePostApi";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";
import { Button } from "../../common/Button/Button";
import ContentModal from "../../common/Modal/ContentModal";
import type { BreadcrumbItem } from "../../common/BreadCrumb/type";
import { toast } from "react-toastify";
import {
  MessageOption,
  type DataFlight,
  type SearchType,
} from "../../utils/type";
import Input from "./component/Input";
import FormRow from "../../common/CustomRender/FormRow";
import type { GridColDef, GridRowId } from "@mui/x-data-grid";
import DataTable from "../../common/DataGrid/index.tsx";
type FlightId = {
  id: number;
};

const Search_layout: React.FC = () => {
  const [flightData, setFlightData] = React.useState<DataFlight[]>([]);
  const [flightId, setFlightId] = React.useState<FlightId | null>(null);
  const [selectId, setSelectId] = React.useState<number[]>([]);
  const [updateFlight, setUpdateFlight] = React.useState<boolean>(false);
  const [openUpdateConfirm, setOpenUpdateConfirm] =
    React.useState<boolean>(false);
  const [isUpdate, setIsUpdate] = React.useState<boolean>(false);
  const [isSearch, setIsSearch] = React.useState<boolean>(false);
  const [isReset, setIsReset] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [_, setLoading] = React.useState<boolean>(true);
  const [flightParams, setFlightParams] = React.useState<SearchType>({
    status: "",
    scheduledDeparture: "",
    scheduledArrival: "",
    departureAirport: "",
    arrivalAirport: "",
    aircraftCode: "",
  });
  const [showDelete, setShowDelete] = React.useState<boolean>(false);
  const { flightList, refetchFlightList } = useSearchFlight(flightParams);
  const {
    control: controlSearch,
    handleSubmit: handleSearchSubmit,
    reset: resetSearch,
  } = useForm<SearchType>({
    defaultValues: flightParams,
  });

  React.useEffect(() => {
    if (!flightList) return;
  }, [flightList]);

  const { refetchUpdateFlightId } = useFlightUpdate();
  const { handleSubmit: handleUpdateSubmit, reset: resetUpdate } = useForm<
    DataFlight[]
  >({
    defaultValues: flightData,
  });

  const onSubmitValue = (values: SearchType): void => {
    if (isReset) return;
    setFlightParams(values);
    refetchFlightList(values);
    setIsSearch(true);
  };

  const handleOpen = (data: DataFlight): void => {
    try {
      // setFlightData(data);
      // resetUpdate(data);
      setFlightId(data.flightId ? { id: data.flightId } : null);
      setUpdateFlight(true);
    } catch (err) {
      console.error("Error", err);
    }
  };

  const handleClose = (): void => {
    setUpdateFlight(false);
    setFlightId(null);
    setSelectId([]);
  };

  const handleCloseUpdate = () => setOpenUpdateConfirm(false);

  const handleCloseDelete = () => setShowDelete(false);

  const onSubmitUpdate = async (data: DataFlight) => {
    if (!data?.flightId) return;
    try {
      const response = await refetchUpdateFlightId(data);
      await new Promise((resolve) => setTimeout(resolve, 200));
      if (response?.resultCode === MessageOption.Option00) {
        await refetchFlightList(flightParams);
        setUpdateFlight(false);
        setOpenUpdateConfirm(false);
      } else {
        setUpdateFlight(true);
        setOpenUpdateConfirm(false);
      }
    } catch (err) {
      console.error(err);
      setError("Update error");
      setUpdateFlight(true);
      setOpenUpdateConfirm(true);
    }
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
    refetchFlightList(flightParams);
  };

  const handleOpenUpdateConfirm = () => setOpenUpdateConfirm(true);

  const rowData: DataFlight[] = [
    {
      flightId: 1,
      flightNo: "VN101",
      scheduledDeparture: "2025-06-21T06:00:00Z",
      scheduledArrival: "2025-06-21T08:00:00Z",
      departureAirport: "SGN",
      arrivalAirport: "HAN",
      status: "Scheduled",
      aircraftCode: "A321",
      actualDeparture: "2025-06-21T06:05:00Z",
      actualArrival: "2025-06-21T07:55:00Z",
    },
    {
      flightId: 2,
      flightNo: "VN202",
      scheduledDeparture: "2025-06-21T09:00:00Z",
      scheduledArrival: "2025-06-21T11:30:00Z",
      departureAirport: "DAD",
      arrivalAirport: "SGN",
      status: "Delayed",
      aircraftCode: "B787",
      actualDeparture: "2025-06-21T09:30:00Z",
      actualArrival: "2025-06-21T12:00:00Z",
    },
    {
      flightId: 3,
      flightNo: "VN303",
      scheduledDeparture: "2025-06-21T13:00:00Z",
      scheduledArrival: "2025-06-21T15:00:00Z",
      departureAirport: "HAN",
      arrivalAirport: "DAD",
      status: "Cancelled",
      aircraftCode: "A350",
    },
  ];

  const colDefs: GridColDef[] = [
    {
      headerName: "",
      field: "checkbox",
    },
    {
      field: "flightId",
      headerName: "Mã chuyến bay",
      width: 150,
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
      width: 120,
      renderCell: (params) => (
        <Typography
          onClick={() => handleOpen(params.row)}
          sx={{ cursor: "pointer" }}
        >
          {params.row.flightNo}
        </Typography>
      ),
    },
    {
      field: "scheduledDeparture",
      headerName: "Giờ khởi hành dự kiến",
      width: 200,
      renderCell: (params) => (
        <Typography
          onClick={() => handleOpen(params.row)}
          sx={{ cursor: "pointer", whiteSpace: "nowrap" }}
        >
          {formatDate(params.row.scheduledDeparture)}
        </Typography>
      ),
    },
    {
      field: "scheduledArrival",
      headerName: "Giờ đến dự kiến",
      width: 200,
      renderCell: (params) => (
        <Typography
          onClick={() => handleOpen(params.row)}
          sx={{ cursor: "pointer", whiteSpace: "nowrap" }}
        >
          {formatDate(params.row.scheduledArrival)}
        </Typography>
      ),
    },
    {
      field: "departureAirport",
      headerName: "Sân bay đi",
      width: 150,
      renderCell: (params) => (
        <Typography
          onClick={() => handleOpen(params.row)}
          sx={{ cursor: "pointer" }}
        >
          {params.row.departureAirport}
        </Typography>
      ),
    },
    {
      field: "arrivalAirport",
      headerName: "Sân bay đến",
      width: 150,
      renderCell: (params) => (
        <Typography
          onClick={() => handleOpen(params.row)}
          sx={{ cursor: "pointer" }}
        >
          {params.row.arrivalAirport}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Trạng thái",
      width: 120,
      renderCell: (params) => (
        <Typography
          onClick={() => handleOpen(params.row)}
          sx={{ cursor: "pointer" }}
        >
          {params.row.status}
        </Typography>
      ),
    },
    {
      field: "aircraftCode",
      headerName: "Mã máy bay",
      width: 120,
      renderCell: (params) => (
        <Typography
          onClick={() => handleOpen(params.row)}
          sx={{ cursor: "pointer" }}
        >
          {params.row.aircraftCode}
        </Typography>
      ),
    },
    {
      field: "actualDeparture",
      headerName: "Giờ khởi hành thực tế",
      width: 200,
      renderCell: (params) => (
        <Typography
          onClick={() => handleOpen(params.row)}
          sx={{ cursor: "pointer", whiteSpace: "nowrap" }}
        >
          {formatDate(params.row.actualDeparture)}
        </Typography>
      ),
    },
    {
      field: "actualArrival",
      headerName: "Giờ đến thực tế",
      width: 200,
      renderCell: (params) => (
        <Typography
          onClick={() => handleOpen(params.row)}
          sx={{ cursor: "pointer", whiteSpace: "nowrap" }}
        >
          {formatDate(params.row.actualArrival)}
        </Typography>
      ),
    },
  ];

  // const rowDataGrid = React.useCallback(()=>{

  //   const data = rowData.map((item, index) => ({ ...item, id: index + 1 }));
  //   return setFlightData(data);

  // },[rowData])

  // React.useEffect(() => {
  //   if (rowData && rowData.length > 0) {
  //     setFlightData(data);
  //   }
  // }, [rowData]);

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
  const breadCrumbText: BreadcrumbItem[] = [
    { label: "Home", href: "/", icon: <House /> },
    { label: "Admin", href: "/admin", icon: <AdminPanelSettings /> },
    { label: "Search" },
  ];
  return (
    <form onSubmit={handleSearchSubmit(onSubmitValue)}>
      <FormControl fullWidth>
        <TableContainer className="flight-container">
          {/* sx={{ p: 1, mt: 2 }} */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <StarBorder />
              <Typography>Search Flight</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <BreadCrumb items={breadCrumbText} />
            </Box>
          </Box>
          <Box sx={{ borderRadius: 1, border: "solid 3px #f2f3f8" }}>
            <Box className="search-status">
              <Box className="left-element">
                <FormRow label="Status">
                  <Input
                    name="status"
                    control={controlSearch}
                    placeholder="Select"
                    isPassword={false}
                    isEditable={true}
                  />
                </FormRow>
                <FormRow label="Aircraft Code">
                  <Input
                    name="aircraftCode"
                    control={controlSearch}
                    placeholder="Select"
                    isPassword={false}
                    isEditable={true}
                  />
                </FormRow>
              </Box>
              <Box className="bottom-element">
                <FormRow label="Status">
                  <Input
                    name="status"
                    control={controlSearch}
                    placeholder="Select"
                    isPassword={false}
                    isEditable={true}
                  />
                </FormRow>

                <FormRow label="Aircraft Code">
                  <Input
                    name="aircraftCode"
                    control={controlSearch}
                    placeholder="Select"
                    isPassword={false}
                    isEditable={true}
                  />
                </FormRow>
              </Box>
              <Box className="right-element">
                <FormRow label="Aircraft Code">
                  <Input
                    name="status"
                    control={controlSearch}
                    placeholder="Select"
                    isPassword={false}
                    isEditable={true}
                  />
                </FormRow>
                <FormRow label="Aircraft Code">
                  <Input
                    name="aircraftCode"
                    control={controlSearch}
                    placeholder="Select"
                    isPassword={false}
                    isEditable={true}
                  />
                </FormRow>
              </Box>
              <Box
                sx={{
                  gap: "6px",
                  display: "flex",
                  padding: "0.2px",
                  p: 1,
                  mt: 9.3,
                }}
              >
                <Button
                  priority="normal"
                  onClick={onResetForm}
                  label={<RefreshSharpIcon />}
                  iconPosition="trailing"
                  size="large"
                  type="reset"
                  iconSize={21}
                />
                <Button
                  priority="normal"
                  iconPosition="trailing"
                  size="large"
                  type="submit"
                  disabled={isSearch}
                  label={
                    <Box>
                      <Typography>
                        <SearchIcon />
                        선택
                      </Typography>
                    </Box>
                  }
                />
              </Box>
            </Box>
          </Box>

          <Box className="agrid-theme" mt={1.5} sx={{ height: "66vh" }}>
            <DataTable
              rows={rowData.map((r) => ({
                ...r,
                id: (r.flightId ?? r.flightId) as GridRowId, // đảm bảo luôn có id dạng number/string
              }))}
              columns={colDefs}
            />
            <ContentModal
              open={updateFlight}
              closeLabel="Close"
              submitLabel="Save"
              handleSubmit={handleOpenUpdateConfirm}
              handleClose={handleClose}
              middleBtns={[
                {
                  label: "Reset",
                  onClick: () => resetUpdateField(),
                  priority: "normal",
                },
              ]}
              contentArea={
                <Box sx={{ gap: 3.5, padding: 1.5 }}>
                  <ContentModal
                    open={openUpdateConfirm}
                    closeLabel="Cancel"
                    submitLabel="Confirm Update"
                    handleClose={handleCloseUpdate}
                    contentArea={
                      <Typography>
                        Do you want to confirm the information of flight and
                        save a change?
                      </Typography>
                    }
                  />
                </Box>
              }
            />
          </Box>
          <Box sx={{ padding: 1 }}>
            <Button
              icon={<DeleteForever />}
              label="Delete"
              priority="normal"
              iconPosition="trailing"
              size="large"
              type="button"
              iconSize={31}
              disabled={isUpdate}
              onClick={handleDeleteClick}
            />
            <ContentModal
              open={showDelete}
              closeLabel="Cancel"
              submitLabel="Confirm"
              contentArea={<Box>Box</Box>}
              //   contentArea={<DeleteFlight id={selectId[0]} />}
              handleClose={handleCloseDelete}
            />
          </Box>
        </TableContainer>
      </FormControl>
    </form>
  );
};

export default Search_layout;
