import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography, Tabs, Tab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { useSidebar } from "../../context/SidebarContext";
import SearchPopup from "../SearchPopup/SearchPopup";
import type { TSidebarItem, TSidebarSubItem } from "./type";
import "./index.scss";
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
    console.log("Fetching JSON from:", getJsonFile(selectedMenu));

    fetch(getJsonFile(selectedMenu))
      .then((response) => response.json())
      .then((data) => {
        console.log("Loaded Data:", data);
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
  const handleItemClick = (itemId: string) => {
    setSelectedItemId(itemId);
    setSelectedSubItemId(null);
  };
  const handleSubItemClick = (subItemId: string) => {
    setSelectedSubItemId(subItemId);
  };
  const handleNestedSubItemClick = (nestedSubItemId: string) => {
    setSelectedNestedSubItemsId(nestedSubItemId);
  };
  const items = activeTab === 0 ? tab1Items : tab2Items;

  if (!isOpen) return null;
  return (
    <Box>
      <Box
        className="sidebar-header"
        sx={{ p: 2, display: "flex", justifyContent: "space-between" }}
      >
        <Typography variant="h6" fontWeight="bold">
          {selectedMenu}
        </Typography>
        <IconButton>
          <SettingsRoundedIcon
            sx={{ fill: "none !important", stroke: "black" }}
          />
        </IconButton>
      </Box>
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
        {items.map((item) => (
          <Box key={item.id}>
            <Box
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
                    <RemoveIcon fontSize="small" />
                  ) : (
                    <AddIcon fontSize="small" />
                  )}
                </IconButton>
              )}
            </Box>

            {openSubMenus.includes(item.id) && item.subItems && (
              <Box ml={4}>
                {item.subItems.map((subItem: TSidebarSubItem) => (
                  <Box key={subItem.id}>
                    <Box
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
                            <RemoveIcon fontSize="small" />
                          ) : (
                            <AddIcon fontSize="small" />
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
                                  // sx={{
                                  //   cursor: "pointer",
                                  //   p: 1,
                                  //   bgcolor:
                                  //     selectedNestedSubItemsId ===
                                  //     nestedSubItem.id
                                  //       ? "darkgrey"
                                  //       : "transparent",
                                  //   color:
                                  //     selectedNestedSubItemsId ===
                                  //     nestedSubItem.id
                                  //       ? "white"
                                  //       : "inherit",
                                  // }}
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
                                  onClick={() =>
                                    handleNestedSubItemClick(nestedSubItem.id)
                                  }
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
