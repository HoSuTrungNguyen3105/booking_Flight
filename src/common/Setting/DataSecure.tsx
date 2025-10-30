import { useState, useMemo, useCallback, useEffect } from "react";
import type { GridRowDef } from "../DataGrid";
import { Box, Button, Typography } from "@mui/material";
import TableSection from "../CustomRender/TableSection";
import type { GridColDef } from "@mui/x-data-grid";
import theme from "../../scss/theme";
import { useFindPassengerById } from "../../context/Api/usePostApi";
import type { Passenger } from "../../utils/type";
import DetailSection, { type IDetailItem } from "../CustomRender/DetailSection";
import { DateFormatEnum, formatDate } from "../../hooks/format";
import { useToast } from "../../context/ToastContext";
import { ResponseCode } from "../../utils/response";

type DataSecureProps = {
  passenger: string;
  returnButton: () => void;
};

const DataSecure = ({ passenger, returnButton }: DataSecureProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Passenger | null>(null);
  const { dataPassengerById, refetchPassengerById } = useFindPassengerById();
  const toast = useToast();
  const fetchPassenger = useCallback(async () => {
    if (!passenger) return;

    setIsLoading(true);
    try {
      const res = await refetchPassengerById({ id: passenger });
      if (res?.resultCode === ResponseCode.SUCCESS && res.data) {
        setData(res.data as Passenger);
      } else {
        toast(res?.resultMessage || "Không tìm thấy hành khách hoặc mã lỗi");
        setData(null);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu hành khách:", error);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, [passenger, refetchPassengerById]);

  useEffect(() => {
    fetchPassenger();
  }, [fetchPassenger]);

  const columnBookingList: GridColDef[] = useMemo(
    () => [
      {
        field: "id",
        headerName: "Booking ID",
        flex: 1,
      },
      {
        field: "bookingTime",
        headerName: "Booking Time",
        flex: 1,
        renderCell: ({ value }) =>
          formatDate(DateFormatEnum.MMMM_D_YYYY, value),
      },
      {
        field: "mealCount",
        headerName: "Meal Orders",
        flex: 1,
      },
    ],
    []
  );

  const columnMealOrder: GridColDef[] = useMemo(
    () => [
      {
        field: "id",
        headerName: "Booking ID",
        flex: 1,
      },
      {
        field: "bookingId",
        headerName: "Booking ID",
        flex: 1,
      },
      {
        field: "mealId",
        headerName: "Booking Time",
        flex: 1,
        renderCell: ({ value }) =>
          formatDate(DateFormatEnum.MMMM_D_YYYY, value),
      },
      {
        field: "quantity",
        headerName: "Meal quantity",
        flex: 1,
      },
    ],
    []
  );

  const rowData = useMemo(
    () =>
      dataPassengerById?.data?.bookings.map((item) => ({
        ...item,
        id: item.id,
      })) || [],
    [dataPassengerById]
  );

  const rowDataMealOrder = useMemo(
    () =>
      dataPassengerById?.data?.bookings[0]?.mealOrders?.map((item) => ({
        ...item,
        id: item.id,
      })) || [],
    [dataPassengerById]
  );

  const detailData: IDetailItem[] = [
    {
      title: "Họ và tên",
      description: data?.fullName,
    },
    {
      title: "Email",
      description: data?.email,
    },
    {
      title: "Số điện thoại",
      description: data?.phone,
    },
    {
      title: "Passport",
      description: data?.passport,
    },
    {
      title: "Lần đăng nhập cuối",
      description: formatDate(
        DateFormatEnum.MM_DD_YYYY,
        Number(data?.lastLoginDate)
      ),
    },
    {
      title: "Tài khoản khóa",
      description: data?.accountLockYn === "Y" ? "Đã khóa" : "Hoạt động",
    },
    {
      title: "Flight Booking",
      description: data?.bookings?.[0]?.flight?.flightNo,
    },
    {
      title: "Seat No",
      description:
        data?.bookings?.[0]?.seats?.seatNumber &&
        data?.bookings?.[0]?.seats?.seatRow
          ? `${data.bookings[0].seats.seatNumber} - ${data.bookings[0].seats.seatRow}`
          : "-",
    },
    {
      title: "Email xác thực",
      description:
        data?.isEmailVerified === "Y" ? "Đã xác thực" : "Chưa xác thực",
    },
  ];

  const renderDataSection = useCallback(
    (
      name: string,
      columns: GridColDef[],
      rows: GridRowDef[],
      isLoading: boolean,
      handleRowClick?: (row: GridRowDef) => void
    ) => {
      return (
        <Box borderTop={1} borderColor={theme.palette.grey[200]}>
          <Box
            bgcolor="white"
            px="16px"
            py="12px"
            border={1}
            borderTop={0}
            borderBottom={0}
          >
            <Typography variant="subtitle1" sx={{ gap: "10px" }}>
              {name}
            </Typography>
          </Box>
          <Box sx={{ padding: "8px" }}>
            <TableSection
              setRows={() => {}}
              rows={rows}
              columns={columns}
              isLoading={isLoading}
              handleRowClick={handleRowClick}
            />
          </Box>
        </Box>
      );
    },
    []
  );

  return (
    <Box minHeight={"50vh"}>
      <Box overflow={"auto"} minHeight={"50vh"}>
        <Button sx={{ mb: 1 }} onClick={returnButton} variant="contained">
          Return
        </Button>

        <DetailSection data={detailData} />

        <Box borderTop={1} paddingTop={2} borderColor={"grey.200"}>
          {renderDataSection(
            "Booking List",
            columnBookingList,
            rowData,
            isLoading
          )}
          {renderDataSection(
            "Meal Order",
            columnMealOrder,
            rowDataMealOrder,
            isLoading
          )}
        </Box>
      </Box>
    </Box>
  );
};
export default DataSecure;
