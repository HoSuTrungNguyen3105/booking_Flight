import React, { useEffect, useState } from "react";
import { Box, TextField, IconButton, Typography } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import ContentModal from "../Modal/ContentModal";
import useDebounce from "../../context/use[custom]/useDebounce";
import TextArea from "../Input/TextArea";
import { type GridColDef } from "@mui/x-data-grid";
import DataTable from "../DataGrid/index";
import { useNavigate } from "react-router-dom";

const mockData = [
  { id: 1, name: "Kim Gil-dong", department: "Tech", location: "Seoul" },
  { id: 2, name: "Lee Gil-dong", department: "HR", location: "Busan" },
  { id: 3, name: "Jang Gil-dong", department: "Finance", location: "Daegu" },
  { id: 4, name: "Nguyen Dinh Thi", department: "TaiXiu", location: "TamKi" },
  { id: 5, name: "Doan Cong Son", department: "Drug", location: "KonTum" },
  { id: 6, name: "Nguyen Viet Nhan", department: "LuaDao", location: "Hue" },
  { id: 7, name: "Tran Minh Chau", department: "Marketing", location: "Hanoi" },
  { id: 8, name: "Pham Van An", department: "Sales", location: "Can Tho" },
  { id: 9, name: "Le Thi Bich", department: "Support", location: "Hai Phong" },
  {
    id: 10,
    name: "Hoang Van Cuong",
    department: "Development",
    location: "Nha Trang",
  },
  { id: 11, name: "Nguyen Thi Mai", department: "Design", location: "Da Nang" },
  {
    id: 12,
    name: "Tran Van Khoa",
    department: "Research  ",
    location: "Vung Tau",
  },
];
const columns: GridColDef[] = [
  { field: "name", headerName: "Name", flex: 1 },
  { field: "department", headerName: "Department", flex: 1 },
  { field: "location", headerName: "Location", flex: 1 },
];

const SearchPopup: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState(mockData);
  const [selectedIdsModel, setSelectedIdsModel] = useState<{
    type: "include";
    ids: Set<string>;
  }>({ type: "include", ids: new Set() });

  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  const closeModal = () => setOpen(false);

  const handleSelect = (item: (typeof mockData)[0]) => {
    setSelectedItems((prevSelected) => {
      const isSelected = prevSelected.some(
        (selected) => selected.id === item.id
      );

      if (isSelected) {
        return prevSelected.filter((selected) => selected.id !== item.id);
      } else {
        return [...prevSelected, item];
      }
    });
  };
  // const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery.trim() !== "") {
      handleFilter(debouncedQuery);
    } else {
      setFilteredResults(mockData);
    }
  }, [debouncedQuery]);

  const handleRemoveItem = (id: number) => {
    setSelectedItems((prevSelected) =>
      prevSelected.filter((item) => item.id !== id)
    );
  };

  const handleFilter = (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim() === "") {
      setFilteredResults(mockData);
      return null;
    }
    const filtered = mockData.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredResults(filtered);
  };
  // const handleCheckboxChange = (id: number) => {
  //   setSelectedIdsModel((prev) => {
  //     const newIds = new Set(prev.ids);
  //     if (newIds.has(id)) {
  //       newIds.delete(id);
  //     } else {
  //       newIds.add(id);
  //     }
  //     return { ...prev, ids: newIds };
  //   });
  // }
  // const handleSelectAll = (selectAll: boolean) => {
  //   setSelectedIdsModel((prev) => {
  //     const newIds = selectAll
  //       ? new Set(mockData.map((item) => item.id))
  //       : new Set();
  //     return { ...prev, ids: newIds };
  //   });
  // };
  useEffect(() => {
    if (debouncedQuery.trim() !== "") {
      handleFilter(debouncedQuery);
    } else {
      setFilteredResults(mockData);
    }
  }, [debouncedQuery]);

  const handleCancel = () => {
    setSelectedItems([]);
    setOpen(false);
  };
  const navigate = useNavigate();
  return (
    <Box className="search-popup">
      <Box className="search">
        {selectedItems.length > 0 && (
          <Box
            className="tag-wrapper"
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              mb: 1,
              maxHeight: 80,
              overflowY: "auto",
            }}
          >
            {selectedItems.map((item) => (
              <Box
                key={item.id}
                className="selected-tag"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 0.5,
                  bgcolor: "grey.200",
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2">{item.name}</Typography>
                <IconButton
                  size="small"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <CancelIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Box>
        )}
        <TextArea
          id="uniqueText"
          placeholder="Enter"
          value={query}
          onChange={(e) => handleFilter(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
      </Box>
      <ContentModal
        open={open}
        submitLabel="Select"
        closeLabel="Exit"
        handleClose={closeModal}
        contentArea={
          <Box>
            <Box className="modal-title">
              <Box className="title">
                <Typography variant="h6">User Information</Typography>
              </Box>
            </Box>
            <Box className="header-up">
              <Typography className="bar" variant="h6">
                Search Results
              </Typography>
              <TextField
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
              />
            </Box>
            <Box
              sx={{
                minHeight: 500,
                maxHeight: 600,
                height: "60vh",
                overflowY: "auto",
              }}
            >
              <DataTable
                rows={filteredResults}
                columns={columns}
                checkboxSelection
                loading={false}
                columnHeaderHeight={40}
                onRowSelect={(row: any) => {
                  navigate(`/users/${row.id}`);
                }}
                selectedRows={[...selectedIdsModel.ids]} // convert Set → Array
                onRowSelectionModelChange={(model) => {
                  //setSelectedIdsModel(model);

                  const selected = filteredResults.filter((row) =>
                    model.ids.has(row.id)
                  );
                  setSelectedItems(selected);
                }}
                // onRowSelectionModelChange={(newSelection: { ids: Set<GridRowId> }) => {
                //   const selectedIdSet = new Set(newSelection.ids);
                //   setSelectedIdsModel({
                //     type: "include",
                //     ids: new Set(selectedIdSet),
                //   });

                //   // cập nhật selectedItems từ filteredResults
                //   const selected = filteredResults.filter((row) =>
                //     selectedIdSet.has(row.id)
                //   );
                //   setSelectedItems(selected);
                // }}

                //selectedRows={handleCheckboxChange}
                //rowSelectionModel={selectedIdsModel}
                // onRowSelectionModelChange={(newSelection) => {
                //   setSelectedIdsModel({
                //     type: "include",
                //     ids: new Set(newSelection),
                //   });
                // }}
              />

              {selectedItems.map((item) => (
                <Box key={item.id} className="selected-tag">
                  <Typography>{item.name}</Typography>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedItems((prev) =>
                        prev.filter((i) => i.id !== item.id)
                      );

                      setSelectedIdsModel((prev) => {
                        const newIds = new Set(prev.ids);
                        newIds.delete(item.id); // dùng Set.delete() để xoá
                        return {
                          ...prev,
                          ids: newIds,
                        };
                      });
                    }}
                  >
                    <CancelIcon fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
        }
      ></ContentModal>
    </Box>
  );
};

export default SearchPopup;
