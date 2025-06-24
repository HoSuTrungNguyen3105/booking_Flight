import React, { useState, useEffect, useCallback } from "react";
import { Box, IconButton, Typography, Tabs, Tab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { useSidebar } from "../../context/SidebarContext";
import SearchPopup from "../SearchPopup/SearchPopup";
import type { TSidebarItem, TSidebarSubItem } from "./type";
import "./index.scss";
import { Button } from "../Button/Button";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
const REACT_APP_URL_TRANSFER = "http://localhost:5173";
export const Sidebar = () => {
  const [tab1Items, setTab1Items] = useState<TSidebarItem[]>([]);
  const [tab2Items, setTab2Items] = useState<TSidebarItem[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const { isOpen, selectedMenu, getJsonFile } = useSidebar();
  const [openSubMenus, setOpenSubMenus] = useState<string[]>([]);
  const [selectedItemsId, setSelectedItemId] = useState<string | null>(null);
  const [selectedSubItemsId, setSelectedSubItemId] = useState<string | null>(
    null
  );
  const [selectedNestedSubItemsId, setSelectedNestedSubItemsId] = useState<
    string | null
  >(null);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    event.stopPropagation();
    setActiveTab(newValue);
  };
  useEffect(() => {
    // console.log("Fetching JSON from:", getJsonFile(selectedMenu));
    fetch(getJsonFile(selectedMenu))
      .then((response) => response.json())
      .then((data) => {
        // console.log("Loaded Data:", data);
        setTab1Items(data.tab1Items || []);
        setTab2Items(data.tab2Items || []);
      })
      .catch((error) => console.error("Error when fetching data:", error));
  }, [selectedMenu]);
  const handleToggleSubMenu = (id: string) => {
    setOpenSubMenus((prev) =>
      prev.includes(id)
        ? prev.filter((submenuId) => submenuId !== id)
        : [...prev, id]
    );
  };
  const navigate = useNavigate();
  const gotoSetting = () => {
    navigate("/setting");
  };
  const handleItemClick = useCallback((itemId: string) => {
    setSelectedItemId(itemId);
    setSelectedSubItemId(null);
  }, []);
  const handleSubItemClick = (subItemId: string) => {
    setSelectedSubItemId(subItemId);
  };
  const handleNestedSubItemClick = (nestedSubItemId: string) => {
    if (selectedNestedSubItemsId !== null) {
      setSelectedNestedSubItemsId("");
    }
    setSelectedNestedSubItemsId(nestedSubItemId);
  };
  const items = activeTab === 0 ? tab1Items : tab2Items;

  if (!isOpen) return null;
  return (
    <Box
      // className="sidebar-container"
      sx={{
        // scrollMarginBlock: 1,
        width: 350,
        // height: "30px",
        maxHeight: "calc(100vh - 200px)", // hoặc giá trị thực tế bạn tính
        // bgcolor: "gray.100",
        p: 2,
        // maxHeight: "calc(100vh - 200px)",
        overflowY: "auto",
        // scrollbarWidth: "none",
        // "&::-webkit-scrollbar": {
        //   display: "none",
        // },
      }}
    >
      <Box
        className="sidebar-header"
        sx={{ p: 2, display: "flex", justifyContent: "space-between" }}
      >
        {/* <Single12Timepicker /> */}
        {/* <Single24Timepicker /> */}
        <Typography sx={{ cursor: "pointer" }} variant="h6" fontWeight="bold">
          {selectedMenu}
        </Typography>
        <Button
          priority="normal"
          iconPosition="leading" //leading trailing
          size="large"
          onClick={gotoSetting}
          appearance="unfilled"
          icon={<SettingsRoundedIcon sx={{ fill: "#135678 !important" }} />}
        />
      </Box>
      {/* <TextArea /> */}
      {/* <Button /> */}
      <SearchPopup />
      {/* Tabs */}
      <Tabs
        className="sidebar-tabs"
        value={activeTab}
        onChange={handleTabChange}
        variant="fullWidth"
      >
        <Tab
          label="탭아이템"
          data-testid="tab1"
          sx={{
            "&.Mui-selected": {
              color: "rgb(47, 154, 180) !important",
            },
          }}
        />
        <Tab
          label="탭아이템"
          data-testid="tab2"
          sx={{
            "&.Mui-selected": {
              color: "rgb(47, 154, 180) !important",
            },
          }}
        />
      </Tabs>
      <Box data-testid="list-item">
        {/* <Box className="sidebar-scrollable"></Box> */}
        {items.map((item) => (
          <Box key={item.id}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1,
                bgcolor: "grey.200",
                borderRadius: 1,
                cursor: "pointer",
              }}
              className={`side-bar ${
                selectedItemsId === item.id ? "active" : ""
              }`}
              onClick={() => handleItemClick(item.id)}
            >
              <Typography
                variant="body1"
                ml={1}
                onClick={() => handleToggleSubMenu(item.id)}
              >
                {item.label}
              </Typography>

              {item.subItems && item.subItems.length > 0 && (
                <IconButton
                  size="small"
                  onClick={() => handleToggleSubMenu(item.id)}
                >
                  {openSubMenus.includes(item.id) ? (
                    <RemoveIcon
                      // onClick={() =>
                      //   navigate(
                      //     `${process.env.REACT_APP_URL_TRANSFER}/${item.id}`
                      //   )
                      // }
                      onClick={() =>
                        toast(`${REACT_APP_URL_TRANSFER}/${item.id}`)
                      }
                      fontSize="small"
                    />
                  ) : (
                    <AddIcon
                      fontSize="small"
                      onClick={() =>
                        toast(`${REACT_APP_URL_TRANSFER}/${item.id}`)
                      }
                    />
                  )}
                </IconButton>
              )}
            </Box>
            {openSubMenus.includes(item.id) && item.subItems && (
              <Box ml={4}>
                {item.subItems.map((subItem: TSidebarSubItem) => (
                  <Box key={subItem.id}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 1,
                        bgcolor: "grey.200",
                        borderRadius: 1,
                        cursor: "pointer",
                      }}
                      className={`sub-item ${
                        selectedSubItemsId === subItem.id ? "active" : ""
                      }`}
                      onClick={() => handleSubItemClick(subItem.id)}
                    >
                      <Typography
                        variant="body2"
                        onClick={() => handleToggleSubMenu(subItem.id)}
                      >
                        {subItem.label}
                      </Typography>
                      {subItem.subItems && subItem.subItems.length > 0 && (
                        <IconButton
                          size="small"
                          onClick={() => handleToggleSubMenu(subItem.id)}
                        >
                          {openSubMenus.includes(subItem.id) ? (
                            <RemoveIcon
                              fontSize="small"
                              onClick={() =>
                                toast(`${REACT_APP_URL_TRANSFER}/${subItem.id}`)
                              }
                            />
                          ) : (
                            <AddIcon
                              fontSize="small"
                              onClick={() =>
                                toast(
                                  `${process.env.REACT_APP_URL_TRANSFER}/${subItem.id}`
                                )
                              }
                            />
                          )}
                        </IconButton>
                      )}
                    </Box>
                    {openSubMenus.includes(subItem.id) && subItem.subItems && (
                      <Box ml={4}>
                        {subItem.subItems.map(
                          (nestedSubItem: TSidebarSubItem) => {
                            const isSelected =
                              selectedNestedSubItemsId === nestedSubItem.id;
                            return (
                              <Box key={nestedSubItem.id}>
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="space-between"
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    px: 2,
                                    py: 1,
                                    borderRadius: 1,
                                    cursor: "pointer",
                                    bgcolor: isSelected
                                      ? "primary.main"
                                      : "transparent",
                                    color: isSelected
                                      ? "white"
                                      : "text.primary",
                                    "&:hover": {
                                      bgcolor: isSelected
                                        ? "primary.dark"
                                        : "grey.200",
                                    },
                                    transition: "background-color 0.2s ease",
                                  }}
                                  // onClick={() => {
                                  //   handleNestedSubItemClick(nestedSubItem.id);
                                  //   toast(
                                  //     `${REACT_APP_URL_TRANSFER}/${subItem.id}/${selectedNestedSubItemsId}`
                                  //   );
                                  // }}
                                  onClick={() => {
                                    handleNestedSubItemClick(nestedSubItem.id);
                                    toast(
                                      `${REACT_APP_URL_TRANSFER}/${subItem.id}/${nestedSubItem.id}`
                                    );
                                  }}
                                >
                                  <Typography variant="body2">
                                    {nestedSubItem.label}
                                  </Typography>
                                </Box>
                              </Box>
                            );
                          }
                        )}
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
