import { Box, Stack, Tab, Tabs, Typography } from "@mui/material";
import { memo } from "react";

export type TabItem = {
  label: string;
  value: string;
  content: React.ReactNode;
};

interface ISearchLayoutProps {
  title: string;
  description?: string;
  tabs: TabItem[];
  activeTab: number;
  onChangeTab: (tabIndex: number) => void;
}

const SearchLayout = ({
  title,
  description,
  tabs,
  activeTab,
  onChangeTab,
}: ISearchLayoutProps) => {
  return (
    <Stack px={2} pb={2} height="100%" gap="10px">
      <Box>
        <Typography variant="subtitle1">{title}</Typography>
        {description && (
          <Typography variant="body1" color="grey.500" mt={1}>
            {description}
          </Typography>
        )}
      </Box>

      <Tabs
        value={activeTab}
        onChange={(_, v) => onChangeTab(v)}
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        {tabs.map((tab, idx) => (
          <Tab
            label={<Typography variant="caption">{tab.label}</Typography>}
            key={idx}
          />
        ))}
      </Tabs>

      <Box flexGrow={1}>{tabs[activeTab].content}</Box>
    </Stack>
  );
};

export default memo(SearchLayout);
