import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  Typography,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ContentModal from "../Modal/ContentModal";
import useDebounce from "../../hooks/useDebounce";
import TextArea from "../Input/TextArea";
import {
  DataGrid,
  type GridColDef,
  type GridRowId,
  type GridRowSelectionModel,
} from "@mui/x-data-grid";

const mockData = [
  { id: 1, name: "Kim Gil-dong", department: "Tech", location: "Seoul" },
  { id: 2, name: "Lee Gil-dong", department: "HR", location: "Busan" },
  { id: 3, name: "Jang Gil-dong", department: "Finance", location: "Daegu" },
  { id: 4, name: "Nguyen Dinh Thi", department: "TaiXiu", location: "TamKi" },
  { id: 5, name: "Doan Cong Son", department: "Drug", location: "KonTum" },
  { id: 6, name: "Nguyen Viet Nhan", department: "LuaDao", location: "Hue" },
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
  const [selectedItems, setSelectedItems] = useState<(typeof mockData)[0][]>(
    []
  );
  const [selectedIdsModel, setSelectedIdsModel] =
    useState<GridRowSelectionModel>({
      type: "include",
      ids: new Set<GridRowId>(),
    });

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
  return (
    <Box className="search-popup">
      {/* <Box className="search">
        <TextArea
          id="uniqueText"
          placeholder={selectedItems.length === 0 ? "Enter" : ""}
          value={query}
          onChange={(e) => handleFilter(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // Ngăn textarea xuống dòng
              setOpen(true);
            }
          }}
          className="search-bar"
          sx={{ maxHeight: "max-content", display: "flex", flexWrap: "wrap" }}
          InputProps={{
            startAdornment: (
              <>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  <InputAdornment position="end" sx={{ margin: "0" }}>
                    <IconButton
                      onClick={() => setOpen(true)}
                      className="btn-modal"
                      sx={{ padding: "0" }}
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                  {selectedItems.map((item) => (
                    <Chip
                      key={item.id}
                      label={item.name}
                      onDelete={() => handleRemoveItem(item.id)}
                      size="small"
                      sx={{ bgcolor: "grey.200" }}
                    />
                  ))}
                </Box>
              </>
            ),
          }}
        />
      </Box> */}
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
        closeLabel="Exit"
        handleClose={closeModal}
        contentArea={
          <Box>
            <Box className="modal-title">
              <Box className="title">
                <FiberManualRecordIcon className="circle" />
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
                // variant="outlined"
                // value={query}
                className="search-bar"
                // onChange={(e) => {
                //   handleFilter(e.target.value);
                // }}
              />
            </Box>
            <Box className="search-results" data-testid="search-results">
              <DataGrid
                rows={filteredResults}
                columns={columns}
                checkboxSelection
                rowSelectionModel={selectedIdsModel}
                onRowSelectionModelChange={(newModel) => {
                  setSelectedIdsModel(newModel as GridRowSelectionModel);

                  const selectedRows = mockData.filter((item) =>
                    (newModel as GridRowSelectionModel).ids.has(item.id)
                  );
                  setSelectedItems(selectedRows);
                }}
                getRowId={(row) => row.id}
                disableRowSelectionOnClick
                sx={{ backgroundColor: "#fff", borderRadius: 1 }}
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
