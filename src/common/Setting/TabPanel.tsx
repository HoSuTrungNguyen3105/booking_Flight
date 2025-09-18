import { Box, Tab, Tabs, Typography, type SxProps } from "@mui/material";
import { useNavigate } from "react-router-dom";

export interface ITabItem {
  label: string;
  value: string;
  description?: string;
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

  return (
    <Box sx={{ ...sx }}>
      <Tabs
        value={activeTab}
        // onChange={(_, v) => onChangeTab(v)}
        onChange={handleChange}
        sx={{ bgcolor: "white", borderBottom: 1, borderColor: "grey.200" }}
      >
        {tabs.map((tab, idx) => (
          <Tab
            label={
              <Typography fontSize={"12px"} variant="button">
                {tab.label}
              </Typography>
            }
            key={idx}
          />
        ))}
      </Tabs>

      {tabs[activeTab].description && (
        <Box bgcolor="white" px="16px" py="12px">
          <Typography variant="body2" color="grey.500">
            {tabs[activeTab].description}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TabPanel;
