import { memo, useCallback, useMemo, useState } from "react";
import type { TabItem } from "../Layout/SearchLayout";
import SearchLayout from "../Layout/SearchLayout";
import InspectionSection from "../../common/CustomRender/InspectionSection";
import type { GridColDef } from "@mui/x-data-grid";
import { DateFormatEnum, formatDate } from "../../hooks/format";
import type { GridRowDef } from "../../common/DataGrid";
import { useFindAllPassenger } from "../../context/Api/useGetApi";
import DataSecure from "../../common/Setting/DataSecure";
import type { ISearchQuery } from "../../common/CustomRender/SearchBar";
import ManageMyInfo from "../Profile/ManageMyInfo";

export const columnsPassenger: GridColDef[] = [
  { field: "fullName", headerName: "Họ và tên", flex: 1 },
  { field: "email", headerName: "Email", flex: 1 },
  { field: "phone", headerName: "Số điện thoại", flex: 1 },
  { field: "passport", headerName: "Passport", flex: 1 },
  {
    field: "accountLockYn",
    headerName: "Tài khoản khóa",
    flex: 1,
    renderCell: ({ value }) => (value === "Y" ? "Đã khóa" : "Hoạt động"),
  },
  {
    field: "isEmailVerified",
    headerName: "Email xác thực",
    flex: 1,
    renderCell: ({ value }) =>
      value === "Y" ? "Đã xác thực" : "Chưa xác thực",
  },
  {
    field: "lastLoginDate",
    headerName: "Lần đăng nhập cuối",
    flex: 1,
    renderCell: ({ value }) => formatDate(DateFormatEnum.MMMM_D_YYYY, value),
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

  const handleSearch = useCallback(
    (query: ISearchQuery) => {
      if (!query.text || query.text.length === 0) {
        return;
      }
      rowData.filter((r) =>
        query.text.filter(
          (keyword) =>
            r.fullName?.toLowerCase().includes(keyword.toLowerCase()) ||
            r.email?.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    },
    [rowData]
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
          columns={columnsPassenger}
          rows={rowData}
          loading={false}
          onSearch={handleSearch}
        />
      ),
    },
    {
      label: "manage employee info",
      value: "employee",
      content: <ManageMyInfo />,
    },
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
