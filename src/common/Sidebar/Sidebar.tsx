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
      sx={{
        width: 350,
        maxHeight: "calc(100vh - 150px)",
        bgcolor: "grey.100",
        p: 2,
        overflowY: "auto",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" }, // ẩn scrollbar cho Chrome
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold" sx={{ cursor: "pointer" }}>
          {selectedMenu}
        </Typography>
        <Button
          size="large"
          onClick={gotoSetting}
          iconPosition="trailing"
          appearance="unfilled"
          icon={<SettingsRoundedIcon sx={{ color: "#135678" }} />}
        />
      </Box>

      {/* Search */}
      <SearchPopup />

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ mb: 2 }}
      >
        <Tab
          label="탭아이템"
          data-testid="tab1"
          sx={{
            "&.Mui-selected": {
              color: "primary.main",
              fontWeight: "bold",
            },
          }}
        />
        <Tab
          label="탭아이템"
          data-testid="tab2"
          sx={{
            "&.Mui-selected": {
              color: "primary.main",
              fontWeight: "bold",
            },
          }}
        />
      </Tabs>

      {/* Sidebar Items */}
      <Box data-testid="list-item">
        {items.map((item) => (
          <Box key={item.id} mb={1}>
            {/* Parent Item */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1,
                bgcolor:
                  selectedItemsId === item.id ? "primary.main" : "grey.200",
                color: selectedItemsId === item.id ? "white" : "text.primary",
                borderRadius: 1,
                cursor: "pointer",
                transition: "0.2s",
                "&:hover": {
                  bgcolor:
                    selectedItemsId === item.id ? "primary.dark" : "grey.300",
                },
              }}
              onClick={() => handleItemClick(item.id)}
            >
              <Typography
                variant="body1"
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
                    <RemoveIcon fontSize="small" />
                  ) : (
                    <AddIcon fontSize="small" />
                  )}
                </IconButton>
              )}
            </Box>

            {/* Sub Items */}
            {openSubMenus.includes(item.id) && item.subItems && (
              <Box ml={3} mt={1}>
                {item.subItems.map((subItem: TSidebarSubItem) => {
                  const isSubSelected = selectedSubItemsId === subItem.id;

                  return (
                    <Box key={subItem.id} mb={1}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          p: 1,
                          bgcolor: isSubSelected ? "primary.light" : "grey.100",
                          color: isSubSelected
                            ? "primary.dark"
                            : "text.primary",
                          borderRadius: 1,
                          cursor: "pointer",
                          "&:hover": {
                            bgcolor: "grey.200",
                          },
                        }}
                        onClick={() => handleSubItemClick(subItem.id)}
                      >
                        <Typography variant="body2">{subItem.label}</Typography>
                        {subItem.subItems?.length > 0 && (
                          <IconButton
                            size="small"
                            onClick={() => handleToggleSubMenu(subItem.id)}
                          >
                            {openSubMenus.includes(subItem.id) ? (
                              <RemoveIcon fontSize="small" />
                            ) : (
                              <AddIcon fontSize="small" />
                            )}
                          </IconButton>
                        )}
                      </Box>

                      {/* Nested Sub Items */}
                      {openSubMenus.includes(subItem.id) &&
                        subItem.subItems && (
                          <Box ml={3} mt={0.5}>
                            {subItem.subItems.map((nested) => {
                              const isSelected =
                                selectedNestedSubItemsId === nested.id;
                              return (
                                <Box
                                  key={nested.id}
                                  sx={{
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
                                    transition: "0.2s",
                                    "&:hover": {
                                      bgcolor: isSelected
                                        ? "primary.dark"
                                        : "grey.200",
                                    },
                                  }}
                                  onClick={() => {
                                    handleNestedSubItemClick(nested.id);
                                    navigate(`/${nested.id}`);
                                  }}
                                >
                                  <Typography variant="body2">
                                    {nested.label}
                                  </Typography>
                                </Box>
                              );
                            })}
                          </Box>
                        )}
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
