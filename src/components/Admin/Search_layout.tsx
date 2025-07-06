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
import { AgGridReact } from "ag-grid-react";
import {
  AdminPanelSettings,
  DeleteForever,
  House,
  StarBorder,
} from "@mui/icons-material";
// import { MessageOption, type DataFlight, type SearchType } from "";
import type { SelectionChangedEvent } from "ag-grid-community";
import { useFlightUpdate, useSearchFlight } from "../Api/usePostApi";
import BreadCrumb from "../../common/BreadCrumb/BreadCrumb";
import { Button } from "../../common/Button/Button";
import ContentModal from "../../common/Modal/ContentModal";
import "../../scss/_ag-grid.scss";
// import TextArea from "../../common/Input/TextArea";
import type { BreadcrumbItem } from "../../common/BreadCrumb/type";
import { toast } from "react-toastify";
import {
  MessageOption,
  type DataFlight,
  type SearchType,
} from "../../utils/type";
import Input from "../../common/CustomRender/Input";
// import { useFlightSearchContext } from "../../context/SearchContext";
type FlightId = {
  id: number;
};
const Search_layout: React.FC = () => {
  const [flightData, setFlightData] = React.useState<DataFlight>();
  const [flightId, setFlightId] = React.useState<FlightId | null>(null);
  const [selectId, setSelectId] = React.useState<number[]>([]);
  const [updateFlight, setUpdateFlight] = React.useState<boolean>(false);
  // const [displayDataFlight, setDisplayDataFlight] = React.useState<
  //   DataFlight[]
  // >([]);
  // const search = useSearchContext();

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
  //   const useFlight = React.useMemo(
  //     ()=>({
  //     })
  //     return;
  //   )
  //   const {
  //     airportName,
  //     aircraftName,
  //     aircraft,
  //     status,
  //     departureAirportList,
  //     arrivalAirportList,
  //     handleDepartureChange,
  //     handleArrivalChange,
  //   } = useFlightCode(resetFieldSearch, getValues);
  const { refetchUpdateFlightId } = useFlightUpdate();
  const {
    control,
    handleSubmit: handleUpdateSubmit,
    reset: resetUpdate,
  } = useForm<DataFlight>({
    defaultValues: flightData,
  });
  const onSelectionChanged = (event: SelectionChangedEvent): void => {
    try {
      const selectRows = event.api.getSelectedRows();
      const ids = selectRows
        .map((row: DataFlight) => row.flightId)
        .filter((id): id is number => id !== undefined);
      setSelectId(ids);
    } catch (error) {
      console.error("Error", error);
    }
  };
  const rowClassStyle = {
    "black-row": (params: any) => params.node.rowIndex % 2 !== 0,
    "white-row": (params: any) => params.node.rowIndex % 2 === 0,
  };
  const onSubmitValue = (values: SearchType): void => {
    if (isReset) return;
    // search.saveSearchValues({

    // })
    setFlightParams(values);
    refetchFlightList(values);
    setIsSearch(true);
  };
  const handleOpen = (data: DataFlight): void => {
    try {
      setFlightData(data);
      resetUpdate(data);
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
  const handleCloseUpdate = (): void => setOpenUpdateConfirm(false);
  const handleCloseDelete = (): void => setShowDelete(false);
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
      //   showWarning(Toast, setIsUpdate, 'Please select a flight to delete!');
      toast.warning("Please select a flight to delete!");
    } else if (selectId.length > 1) {
      //   showWarning(Toast, setIsUpdate, `${t('content1')}`);
    } else {
      // navigate(`/admin/deleteFlight/${selectId[0]}`);
      setShowDelete(true);
    }
  };
  // const { fetchFlightId, refetchFlightId } = useFlightById(flightId ?? {});
  // const rowDataFlight = React.useMemo(() => {
  //   if (!flightList) return [];
  //   return Array.isArray(flightList.flightList)
  //     ? flightList.flightList
  //     : flightList.flightList
  //     ? [flightList.flightList]
  //     : [];
  // }, [flightList]);

  // React.useEffect(() => {
  //   const fetchData = async () => {
  //     if (!flightId) return;
  //     setLoading(true);
  //     try {
  //       await refetchFlightId();
  //     } catch (error) {
  //       console.error("Error", error);
  //       setError("Error");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, [flightId]);

  // React.useEffect(() => {
  //   setDisplayDataFlight(rowDataFlight);
  // }, [rowDataFlight]);
  // React.useEffect(() => {
  //   if (fetchFlightId) {
  //     setFlightData(fetchFlightId?.flightList);
  //   }
  // }, [fetchFlightId]);
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
  const defaultColDef = { resizable: true, sortable: true, flex: 1 };
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
  const [colDefs] = React.useState<any[]>([
    {
      headerName: "",
      headerCheckboxSelection: true,
      checkboxSelection: true,
      pinned: "left",
      width: 50,
    },
    {
      headerName: "이름",
      field: "flightId",
      tooltipField: "flightId",
      cellRenderer: (params: { data: DataFlight }) => {
        const { flightId } = params.data;
        return (
          <Typography
            onClick={() => handleOpen(params.data)}
            style={{
              cursor: "pointer",
              padding: 0,
              margin: 0,
              lineHeight: "normal",
              display: "inline-block",
            }}
          >
            {flightId}
          </Typography>
        );
      },
    },
    {
      headerName: "이름",
      field: "flightNo",
      tooltipField: "flightNo",
      cellRenderer: (params: { data: DataFlight }) => {
        const { flightNo } = params.data;
        return (
          <Typography
            onClick={() => handleOpen(params.data)}
            style={{
              cursor: "pointer",
              padding: 0,
              margin: 0,
              lineHeight: "normal",
              display: "inline-block",
            }}
          >
            {flightNo}
          </Typography>
        );
      },
    },
    {
      headerName: "이름",
      field: "scheduledDeparture",
      tooltipValueGetter: (params: any) => formatDate(params.value),
      valueFormatter: (params: { value: string }) => formatDate(params.value),
      cellRenderer: (params: { data: DataFlight }) => {
        const { scheduledDeparture } = params.data;
        return (
          <Typography
            onClick={() => handleOpen(params.data)}
            style={{
              cursor: "pointer",
              whiteSpace: "nowrap",
              padding: 0,
              margin: 0,
              lineHeight: "normal",
              display: "inline-block",
            }}
          >
            {formatDate(scheduledDeparture)}
          </Typography>
        );
      },
    },
    {
      headerName: "이름",
      field: "scheduledArrival",
      tooltipValueGetter: (params: any) => formatDate(params.value),
      valueFormatter: (params: { value: string }) => formatDate(params.value),
      cellRenderer: (params: { data: DataFlight }) => {
        const { scheduledArrival } = params.data;
        return (
          <Typography
            onClick={() => handleOpen(params.data)}
            style={{
              cursor: "pointer",
              whiteSpace: "nowrap",
              padding: 0,
              margin: 0,
              lineHeight: "normal",
              display: "inline-block",
            }}
          >
            {formatDate(scheduledArrival)}
          </Typography>
        );
      },
    },
    {
      headerName: "이름",
      field: "departureAirport",
      tooltipField: "departureAirport",
      minWidth: 100,
      maxWidth: 150,
      cellRenderer: (params: { data: DataFlight }) => {
        const { departureAirport } = params.data;
        return (
          <Typography
            onClick={() => handleOpen(params.data)}
            style={{
              cursor: "pointer",
              padding: 0,
              margin: 0,
              lineHeight: "normal",
              display: "inline-block",
            }}
          >
            {departureAirport}
          </Typography>
        );
      },
    },
    {
      headerName: "이름",
      field: "arrivalAirport",
      tooltipField: "arrivalAirport",
      minWidth: 100,
      maxWidth: 150,
      cellRenderer: (params: { data: DataFlight }) => {
        const { arrivalAirport } = params.data;
        return (
          <Typography
            onClick={() => handleOpen(params.data)}
            style={{
              cursor: "pointer",
              padding: 0,
              margin: 0,
              lineHeight: "normal",
              display: "inline-block",
            }}
          >
            {arrivalAirport}
          </Typography>
        );
      },
    },
    {
      headerName: "이름",
      field: "status",
      tooltipField: "status",
      cellRenderer: (params: { data: DataFlight }) => {
        const { status } = params.data;
        return (
          <Typography
            onClick={() => handleOpen(params.data)}
            style={{
              cursor: "pointer",
              padding: 0,
              margin: 0,
              lineHeight: "normal",
              display: "inline-block",
            }}
          >
            {status}
          </Typography>
        );
      },
    },
    {
      headerName: "이름",
      field: "aircraftCode",
      tooltipField: "aircraftCode",
      cellRenderer: (params: { data: DataFlight }) => {
        const { aircraftCode } = params.data;
        return (
          <Typography
            onClick={() => handleOpen(params.data)}
            style={{
              cursor: "pointer",
              padding: 0,
              margin: 0,
              lineHeight: "normal",
              display: "inline-block",
            }}
          >
            {aircraftCode}
          </Typography>
        );
      },
    },
    {
      headerName: "이름",
      field: "actualDeparture",
      tooltipValueGetter: (params: any) => formatDate(params.value),
      valueFormatter: (params: { value: string }) => formatDate(params.value),
      cellRenderer: (params: { data: DataFlight }) => {
        const { actualDeparture } = params.data;
        return (
          <Typography
            onClick={() => handleOpen(params.data)}
            style={{
              cursor: "pointer",
              whiteSpace: "nowrap",
              padding: 0,
              margin: 0,
              lineHeight: "normal",
              display: "inline-block",
            }}
          >
            {formatDate(actualDeparture)}
          </Typography>
        );
      },
    },
    {
      headerName: "이름",
      field: "actualArrival",
      tooltipValueGetter: (params: any) => formatDate(params.value),
      valueFormatter: (params: { value: string }) => formatDate(params.value),
      cellRenderer: (params: { data: DataFlight }) => {
        const { actualArrival } = params.data;
        return (
          <Typography
            onClick={() => handleOpen(params.data)}
            style={{
              cursor: "pointer",
              whiteSpace: "nowrap",
              padding: 0,
              margin: 0,
              lineHeight: "normal",
              display: "inline-block",
            }}
          >
            {formatDate(actualArrival)}
          </Typography>
        );
      },
    },
  ]);
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
                <Input
                  name="status"
                  control={controlSearch}
                  placeholder="Select"
                  isPassword={false}
                  isEditable={true}
                />

                <Input
                  name="aircraftCode"
                  control={controlSearch}
                  placeholder="Select"
                  isPassword={false}
                  isEditable={true}
                />
              </Box>
              <Box className="bottom-element">
                <Input
                  name="status"
                  control={controlSearch}
                  placeholder="Select"
                  isPassword={false}
                  isEditable={true}
                />

                <Input
                  name="aircraftCode"
                  control={controlSearch}
                  placeholder="Select"
                  isPassword={false}
                  isEditable={true}
                />
              </Box>
              <Box className="right-element">
                <Input
                  name="status"
                  control={controlSearch}
                  placeholder="Select"
                  isPassword={false}
                  isEditable={true}
                />

                <Input
                  name="aircraftCode"
                  control={controlSearch}
                  placeholder="Select"
                  isPassword={false}
                  isEditable={true}
                />
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
            <AgGridReact
              rowSelection="multiple"
              onSelectionChanged={onSelectionChanged}
              rowData={rowData}
              columnDefs={colDefs}
              defaultColDef={defaultColDef}
              pagination={true}
              rowClassRules={rowClassStyle}
              rowMultiSelectWithClick={true}
              suppressRowClickSelection={true}
            />
            <ContentModal
              open={updateFlight}
              closeLabel="Close"
              submitLabel="Save"
              title={`Flight ${flightData?.flightNo}`}
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
                    handleSubmit={handleUpdateSubmit(onSubmitUpdate)}
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
