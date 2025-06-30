import React from "react";
import { useLocation } from "react-router-dom";
import AsideLnb from "./../Admin/Sidebar";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { menuData, type MenuItem } from "../../../public/db";

const ResizeLayout = () => {
  const { pathname } = useLocation();
  const [openMenu, setOpenMenu] = React.useState<Record<string, boolean>>({});

  const handleMenuToggle = (id: string) => {
    setOpenMenu((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Đệ quy hiển thị menu
  const renderMenuItems = (items: MenuItem[], level = 0) => {
    return items.map((item) => {
      const hasSubItems = !!item.subItems?.length;
      const isOpen = openMenu[item.id] || false;

      return (
        <React.Fragment key={item.id}>
          <ListItemButton
            sx={{ pl: 2 + level * 2 }}
            onClick={() => hasSubItems && handleMenuToggle(item.id)}
          >
            <ListItemText primary={item.label} />
            {hasSubItems &&
              (isOpen ? (
                <ExpandLess fontSize="small" />
              ) : (
                <ExpandMore fontSize="small" />
              ))}
          </ListItemButton>
          {hasSubItems && (
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
              <List disablePadding>
                {renderMenuItems(item.subItems!, level + 1)}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <AsideLnb>
      <Box
        sx={(theme) => ({
          height: "100%",
          overflowY: "auto",
          border: `1px solid ${theme.palette.grey[200]}`,
          bgcolor: theme.palette.common.white,
        })}
      >
        <List subheader={<strong>Tab 1</strong>}>
          {renderMenuItems(menuData.tab1Items)}
        </List>
        <List subheader={<strong>Tab 2</strong>}>
          {renderMenuItems(menuData.tab2Items)}
        </List>
      </Box>
    </AsideLnb>
  );
};

export default ResizeLayout;
