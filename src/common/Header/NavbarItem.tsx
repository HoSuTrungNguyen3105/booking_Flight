import { Box, Button, Typography, Paper, Divider } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import ButtonLink from "../Button/ButtonLink";
import theme from "../../scss/theme";
import { useAuth } from "../../context/AuthContext";
import { menuData } from "../../utils/name_sb1";
import { keyframes } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";

const fadeSlideIn = keyframes`
  0% { opacity: 0; transform: translateY(-10px); }
  100% { opacity: 1; transform: translateY(0); }
`;

export default function NavbarItem() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  // Click ngoài dropdown → đóng
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setActiveTab(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleTabClick = (title: string) => {
    navigate(`/content/${title}`);
    setActiveTab(null);
  };

  const handleMouseEnter = (tab: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setDownArrowIcon(true);
      setActiveTab(tab);
    }, 300);
  };

  const [downArrowIcon, setDownArrowIcon] = useState(false);

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setDownArrowIcon(false);
  };

  const visibleTabs = Object.keys(menuData).filter(
    (tab) => isAdmin || menuData[tab].name !== "Admin"
  );

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      {/* NAV BAR */}
      <Box
        sx={{
          display: "flex",
          gap: 4,
          alignItems: "center",
          py: 2,
          px: 5,
          borderBottom: "1px solid #ddd",
        }}
      >
        {visibleTabs.map((tab) => (
          <Button
            key={tab}
            onMouseEnter={() => handleMouseEnter(tab)}
            onMouseLeave={handleMouseLeave}
            endIcon={
              downArrowIcon ? <KeyboardArrowDown /> : <KeyboardArrowUp />
            }
            onClick={() => handleTabClick(tab)}
            sx={{
              fontSize: "14px",
              px: 1,
              pb: 0.5,
              color: activeTab === tab ? "#6a0dad" : "#000",
              borderBottom: activeTab === tab ? "2px solid #6a0dad" : "none",
              borderRadius: 0,
              textTransform: "none",
              transition: "color 0.2s",
              "&:hover": { color: "#6a0dad", background: "transparent" },
            }}
          >
            {menuData[tab].name}
          </Button>
        ))}
      </Box>

      {/* DROPDOWN */}
      {activeTab && menuData[activeTab].items.length > 0 && (
        <Paper
          ref={dropdownRef}
          elevation={4}
          onMouseEnter={() => setActiveTab(activeTab)}
          onMouseLeave={() => setActiveTab(null)}
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "max-content",
            minWidth: 600,
            maxWidth: "90vw",
            bgcolor: "#fff",
            py: 3,
            px: 4,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 3,
            borderRadius: 2,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            zIndex: 50,
            animation: `${fadeSlideIn} 0.26s ease-out forwards`,
          }}
        >
          <Box sx={{ gridColumn: "1 / -1" }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {menuData[activeTab].name}
            </Typography>
            <Divider sx={{ my: 2 }} />
          </Box>

          {menuData[activeTab].items.map((item) => (
            <Box
              key={item.label}
              width={250}
              onClick={() => setActiveTab(null)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                cursor: "pointer",
                borderRadius: 2,
                p: 1,
                transition: "all 0.25s ease",
                "&:hover": {
                  bgcolor: theme.palette.action.hover,
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: theme.palette.primary.light,
                  color: theme.palette.primary.dark,
                  transition: "all 0.25s ease",
                  "&:hover": {
                    bgcolor: theme.palette.primary.main,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  },
                }}
              >
                {item.icon}
              </Box>
              <ButtonLink
                url={item.value}
                text={item.label}
                variant="text"
                // sx={{ flex: 1, justifyContent: "flex-start" }}
              />
            </Box>
          ))}
        </Paper>
      )}
    </Box>
  );
}
