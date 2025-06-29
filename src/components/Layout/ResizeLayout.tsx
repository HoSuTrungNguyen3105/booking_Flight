import React from "react";
import { useLocation } from "react-router-dom";
import AsideLnb from "./../Admin/Sidebar";
import { Box, List } from "@mui/material";
const ResizeLayout = () => {
  const { pathname } = useLocation();
  const [openMenu, setOpenMenu] = React.useState<Record<string, boolean>>({});
  const handleMenuToggle = (label: string) => {
    setOpenMenu((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };
  return (
    <AsideLnb>
      <Box
        sx={(theme) => ({
          //   width: '100%',
          height: "100%",
          //   overflow: 'hidden',
          //   display: 'flex',
          border: `1px solid ${theme.palette.grey[200]}`,
          bgcolor: theme.palette.common.white,
        })}
      >
        <List>{}</List>
      </Box>
    </AsideLnb>
  );
};

export default ResizeLayout;
