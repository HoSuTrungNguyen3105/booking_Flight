import { Box, Tab, Tabs, Typography, type SxProps } from "@mui/material";
import { useCallback, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export interface ITabItem {
  label: string;
  value: string;
  description?: string | ReactNode;
  path?: string;
}

interface ITabPanelProps {
  sx?: SxProps;
  activeTab: number;
  tabs: ITabItem[];
  onChangeTab: (value: number) => void;
}

const TabPanel = ({ sx, activeTab, tabs, onChangeTab }: ITabPanelProps) => {
  const navigate = useNavigate();

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    onChangeTab(newValue);

    const selectedTab = tabs[newValue];
    if (selectedTab?.path) {
      navigate(selectedTab.path);
    }
  };

  const renderDescription = useCallback((description: ReactNode) => {
    if (!description) return null;

    return (
      <Box bgcolor="white" px="16px" py="12px">
        {typeof description === "string" ? (
          <Typography variant="body2" color="grey.500">
            {description}
          </Typography>
        ) : (
          description
        )}
      </Box>
    );
  }, []);

  return (
    <Box sx={{ ...sx }}>
      <Tabs
        value={activeTab}
        onChange={handleChange}
        sx={{ bgcolor: "white", borderBottom: 1, borderColor: "grey.200" }}
      >
        {tabs.map((tab, idx) => (
          <Tab
            key={idx}
            label={
              <Typography fontSize={"12px"} variant="button">
                {tab.label}
              </Typography>
            }
          />
        ))}
      </Tabs>

      {tabs[activeTab].description &&
        renderDescription(tabs[activeTab].description)}
    </Box>
  );
};

export default TabPanel;
