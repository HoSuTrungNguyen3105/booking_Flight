import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  IconButton,
  ListItem,
  InputAdornment,
  Typography,
  Radio,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import DoneIcon from "@mui/icons-material/Done";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const mockData = [
  { id: 1, name: "Kim Gil-dong", department: "Tech", location: "Seoul" },
  { id: 2, name: "Lee Gil-dong", department: "HR", location: "Busan" },
  { id: 3, name: "Jang Gil-dong", department: "Finance", location: "Daegu" },
  { id: 4, name: "Nguyen Dinh Thi", department: "TaiXiu", location: "TamKi" },
  { id: 5, name: "Doan Cong Son", department: "Drug", location: "KonTum" },
  { id: 6, name: "Nguyen Viet Nhan", department: "LuaDao", location: "Hue" },
];

const SearchPopup: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState(mockData);
  const [selectedItems, setSelectedItems] = useState<(typeof mockData)[0][]>(
    []
  );
  const [tempSelectedItems, setTempSelectedItems] = useState<
    (typeof mockData)[0][]
  >([]);

  const handleSelect = (item: (typeof mockData)[0]) => {
    setSelectedItems((prevSelected) => {
      setSelectedItems(tempSelectedItems);
      const isSelected = prevSelected.some(
        (selected) => selected.id === item.id
      );
      return isSelected
        ? prevSelected.filter((selected) => selected.id !== item.id)
        : [...prevSelected, item];
    });
  };

  const handleRemoveItem = (id: number) => {
    setSelectedItems((prevSelected) =>
      prevSelected.filter((item) => item.id !== id)
    );
  };

  const handleDone = () => {
    // setSelectedItems(tempSelectedItems);
    setOpen(false);
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
  const handleCancel = () => {
    setSelectedItems([]);
    setOpen(false);
  };
  return (
    <Box className="search-popup">
      <Box className="search">
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          id="uniqueText"
          placeholder={selectedItems.length === 0 ? "placeholder" : ""}
          value={query}
          data-testid="search-popup"
          onChange={(e) => handleFilter(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
          className="search-bar"
          sx={{ maxHeight: "max-content", display: "flex", flexWrap: "wrap" }}
          InputProps={{
            style: {
              overflow: "auto",
              whiteSpace: "nowrap",
            },
            startAdornment: (
              <>
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
                  <Box key={item.id} className="selected-tag">
                    <Typography
                      sx={{
                        alignContent: "center",
                        maxWidth: "fit-content",
                        width: "max-content",
                      }}
                    >
                      {item.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveItem(item.id)}
                      data-testid={`cancel-button-${item.id}`}
                    >
                      <CancelIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </>
            ),
          }}
        />
      </Box>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        className="search-modal"
        data-testid="search-modal"
      >
        <Box
          className="modal-box"
          sx={{
            width: "1000",
            height: "800px",
            bgcolor: "white",
            p: 3,
            borderRadius: 2,
            boxShadow: 24,
            overflow: "hidden",
          }}
        >
          <Box className="modal-title">
            <Box className="title">
              <FiberManualRecordIcon className="circle" />
              <Typography variant="h6">userInformation</Typography>
            </Box>
            <IconButton
              className="close-modal"
              onClick={() => handleCancel()}
              data-testid="close-button"
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Box className="header-up">
            <Typography className="bar" variant="h6">
              searchResults
            </Typography>
            <TextField
              variant="outlined"
              fullWidth
              value={query}
              data-testid="placeholder"
              onChange={(e) => handleFilter(e.target.value)}
              className="search-bar"
            />
            <Button className="black" variant="contained" color="primary">
              <SearchIcon />
              select
            </Button>
          </Box>
          <Box className="header">
            <Typography className="bar" variant="h6">
              searchResults
            </Typography>
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton
                      onClick={() => setOpen(true)}
                      className="btn-modal"
                      sx={{ padding: "0" }}
                    >
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              fullWidth
              value={query}
              sx={{ maxWidth: "30%" }}
              onChange={(e) => handleFilter(e.target.value)}
              className="search-bar"
            />
          </Box>
          <Box className="table-header">
            <CheckCircleOutlineIcon className="check-circle" />
            <Box className="table-description">
              <Typography className="result-name">name</Typography>
              <Typography className="result-department">department</Typography>
              <Typography className="result-location">location</Typography>
            </Box>
          </Box>
          <Box className="search-results" data-testid="search-results">
            {query.trim() !== "" && filteredResults.length > 0 ? (
              filteredResults.map((item) => (
                <ListItem
                  key={item.id}
                  className="search-result-item"
                  onClick={() => handleSelect(item)}
                  data-testid={`search-item-${item.id}`}
                >
                  <Radio
                    checked={selectedItems.some(
                      (selected) => selected.id === item.id
                    )}
                    className="result-radio"
                  />
                  <Box className="table-description">
                    <Typography className="result-name">{item.name}</Typography>
                    <Typography className="result-department">
                      {item.department}
                    </Typography>
                    <Typography className="result-location">
                      {item.location}
                    </Typography>
                  </Box>
                </ListItem>
              ))
            ) : (
              <Box className="no-results">noResults</Box>
            )}
          </Box>

          <Box className="modal-footer">
            <Button
              variant="outlined"
              onClick={() => handleCancel()}
              data-testid="cancel-button"
            >
              cancel
            </Button>
            <Button
              onClick={handleDone}
              variant="contained"
              color="primary"
              data-testid="done-button"
            >
              <DoneIcon />
              select
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default SearchPopup;
