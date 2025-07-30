import { Box, Tab, Tabs, Typography, type SxProps } from "@mui/material";

export interface ITabItem {
  label: string;
  value: string;
  description?: string;
}

interface ITabPanelProps {
  sx?: SxProps;
  activeTab: number;
  tabs: ITabItem[];
  onChangeTab: (value: number) => void;
}

const TabPanel = ({ sx, activeTab, tabs, onChangeTab }: ITabPanelProps) => {
  return (
    <Box sx={{ ...sx }}>
      <Tabs
        value={activeTab}
        onChange={(_, v) => onChangeTab(v)}
        sx={{ bgcolor: "white", borderBottom: 1, borderColor: "grey.200" }}
      >
        {tabs.map((tab, idx) => (
          <Tab
            label={<Typography variant="button">{tab.label}</Typography>}
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
