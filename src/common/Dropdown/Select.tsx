import { Box, Chip, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import SearchLayout, {
  type TabItem,
} from "../../components/Layout/SearchLayout.tsx";
import DataGridInTab from "./Data.tsx";

export default function DataGridWithSelectModal() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs: TabItem[] = [
    {
      label: "Tổng quan",
      value: "overview",
      content: <DataGridInTab />,
    },
    {
      label: "Chi tiết",
      value: "details",
      content: <div>Nội dung chi tiết</div>,
    },
    {
      label: "Lịch sử",
      value: "history",
      content: <div>Lịch sử thay đổi</div>,
    },
  ];
  const [searchTerms, setSearchTerms] = useState([
    "React",
    "MUI",
    "TypeScript",
  ]);

  const handleDeleteSearchTerm = (indexToDelete: number) => {
    setSearchTerms((terms) => terms.filter((_, i) => i !== indexToDelete));
  };

  const searchTermChips = useMemo(
    () =>
      searchTerms.map((term, index) => (
        <Chip
          key={`${term}-${index}`}
          label={<Typography variant="body1">{term}</Typography>}
          onDelete={() => handleDeleteSearchTerm(index)}
          variant="outlined"
          sx={{
            borderRadius: "3px",
            borderColor: "grey.200",
          }}
        />
      )),
    [searchTerms, handleDeleteSearchTerm]
  );

  return (
    <>
      <Box sx={{ width: "100%", p: 2 }}>
        <SearchLayout
          title="Thông tin chuyến bay"
          description="Chọn tab để xem nội dung tương ứng"
          tabs={tabs}
          activeTab={activeTab}
          onChangeTab={setActiveTab}
        />
        <Box p={2}>
          <Typography variant="h6" mb={2}>
            Từ khóa tìm kiếm:
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {searchTermChips}
          </Box>
        </Box>
      </Box>
    </>
  );
}
