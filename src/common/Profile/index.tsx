import DataTable from "../DataGrid/index.tsx";
import Icon from "../../svgs/local.png";
import { useCallback } from "react";
import { Box } from "@mui/material";
const Profile = () => {
  const renderDataGrid = useCallback(() => {
    const columns = [
      { field: "id", headerName: "ID", width: 90 },
      { field: "name", headerName: "Name", width: 150 },
      { field: "age", headerName: "Age", width: 110 },
      { field: "email", headerName: "Email", width: 200 },
    ];
    return (
      <Box sx={{ height: "auto", width: "100%" }}>
        <DataTable
          rows={[]}
          columns={columns}
          loading={false}
          emptyContent="No data available"
          emptyItemIcon={Icon}
        />
      </Box>
    );
  }, []);
  return <div>{renderDataGrid()}</div>;
};

export default Profile;
