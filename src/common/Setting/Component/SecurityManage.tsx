import { memo, useCallback, useMemo, useState } from "react";
import type { TabItem } from "../../../components/Layout/SearchLayout";
import SearchLayout from "../../../components/Layout/SearchLayout";
import InspectionSection from "../../CustomRender/InspectionSection";
import type { GridColDef } from "@mui/x-data-grid";
import { Typography } from "@mui/material";
import { DateFormatEnum, formatDate } from "../../../hooks/format";
import type { GridRowDef } from "../../DataGrid";
import { useFindAllPassenger } from "../../../components/Api/useGetApi";
import DataSecure from "../DataSecure";

export const columnsPassenger: GridColDef[] = [
  { field: "fullName", headerName: "Họ và tên", flex: 1 },
  { field: "email", headerName: "Email", flex: 1 },
  { field: "phone", headerName: "Số điện thoại", flex: 1 },
  { field: "passport", headerName: "Passport", flex: 1 },
  {
    field: "accountLockYn",
    headerName: "Tài khoản khóa",
    flex: 1,
    renderCell: ({ value }) => (
      <Typography>{value === "Y" ? "Đã khóa" : "Hoạt động"}</Typography>
    ),
  },
  {
    field: "isEmailVerified",
    headerName: "Email xác thực",
    flex: 1,
    renderCell: ({ value }) => (
      <Typography>{value === "Y" ? "Đã xác thực" : "Chưa xác thực"}</Typography>
    ),
  },
  {
    field: "lastLoginDate",
    headerName: "Lần đăng nhập cuối",
    flex: 1,
    renderCell: ({ value }) => (
      <Typography>{formatDate(DateFormatEnum.MMMM_D_YYYY, value)}</Typography>
    ),
  },
];

const SecurityManage = () => {
  const [tabX, setTab] = useState(0);
  const [getValuePassenger, setGetValuePassenger] = useState(false);
  const [passengerId, setPassengerId] = useState("");

  const { dataAllPassenger } = useFindAllPassenger();

  const onRowSelect = (rowData: GridRowDef) => {
    setGetValuePassenger(true);
    setPassengerId(rowData.id as string);
  };

  const rowData = useMemo(
    () =>
      dataAllPassenger?.list?.map((item) => ({
        ...item,
        id: item.id,
      })) || [],
    [dataAllPassenger]
  );

  const handleReturn = useCallback(() => {
    setGetValuePassenger(false);
  }, [setGetValuePassenger]);

  const tabs: TabItem[] = [
    {
      label: "passenger",
      value: "passenger",
      content: (
        <InspectionSection
          onRowClick={onRowSelect}
          handleAction={() => {}}
          columns={columnsPassenger}
          rows={rowData}
          loading={false}
          onSearch={() => {}}
        />
      ),
    },
    // {
    //   label: "inspectionSection",
    //   value: "auto",
    //   content: <Typography></Typography>,
    // },
  ];

  if (getValuePassenger)
    return <DataSecure returnButton={handleReturn} passenger={passengerId} />;

  return (
    <SearchLayout
      onChangeTab={setTab}
      activeTab={tabX}
      title="Security Manage"
      tabs={tabs}
    />
  );
};

export default memo(SecurityManage);
