import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  ListItem,
  InputAdornment,
  Typography,
  Radio,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ContentModal from "../Modal/ContentModal";
import useDebounce from "../../hooks/useDebounce";
import TextArea from "../Input/TextArea";

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
  // const [tempSelectedItems, setTempSelectedItems] = useState<
  //   (typeof mockData)[0][]
  // >([]);
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

  // const handleSearch = useDebounce((value: (typeof mockData)[0]) => {
  //   // hàm gọi API hoặc xử lý gì đó
  //   handleSelect(value);
  // }, 1000);
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
  // const handleSearch = useDebounce((value: string) => {
  //   handleFilter(value);
  // }, 1000);

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
      <Box className="search">
        <TextArea
          // variant="outlined"
          // size="small"
          // fullWidth
          id="uniqueText"
          placeholder={selectedItems.length === 0 ? "Enter" : ""}
          value={query}
          // data-testid="search-popup"
          onChange={(e) => handleFilter(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
          className="search-bar"
          sx={{ maxHeight: "max-content", display: "flex", flexWrap: "wrap" }}
          InputProps={{
            // style: {
            //   overflow: "auto",
            //   whiteSpace: "nowrap",
            // },
            startAdornment: (
              <>
                <InputAdornment position="end" sx={{ margin: "0" }}>
                  <IconButton
                    onClick={() => setOpen(true)}
                    className="btn-modal"
                    // sx={{ padding: "0" }}
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
                {selectedItems.map((item) => (
                  <Box key={item.id} className="selected-tag">
                    <Typography>{item.name}</Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveItem(item.id)}
                      // data-testid={`cancel-button-${item.id}`}
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
      <ContentModal
        open={open}
        closeLabel="Exit"
        handleClose={closeModal}
        // onClose={() => setOpen(false)}
        // className="search-modal"
        // data-testid="search-modal"
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
                      <Typography className="result-name">
                        {item.name}
                      </Typography>
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
                <Box className="no-results">No Results</Box>
              )}
            </Box>
          </Box>
        }
      ></ContentModal>
    </Box>
  );
};

export default SearchPopup;
