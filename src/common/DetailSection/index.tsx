import { Box, Grid, Typography } from "@mui/material";
import React, { memo, useCallback } from "react";

export interface IDetailItem {
  title: string;
  description: string | React.ReactNode;
  size?: number;
  hasBorder?: boolean;
}

interface IDetailSectionProps {
  title?: string;
  itemPerRow?: 1 | 2 | 3 | 4 | 6 | 12;
  data: IDetailItem[];
  mode?: "row" | "column";
}

const GRID_COL_NUM = 12;

const DetailSection = ({
  title,
  itemPerRow = 4,
  data,
  mode = "column",
}: IDetailSectionProps) => {
  const renderDescription = useCallback(
    (description: string | React.ReactNode) => {
      if (!description) {
        return (
          <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
            -
          </Typography>
        );
      }

      if (typeof description === "string") {
        return (
          <Typography component="pre" variant="body2" sx={{ lineHeight: 1.5 }}>
            {description}
          </Typography>
        );
      }

      return description;
    },
    []
  );

  return (
    <Box bgcolor="white" border={1} borderColor="grey.200">
      {title && (
        <Box px={2} py={1} borderBottom={1} borderColor="grey.200">
          <Typography fontWeight={"bold"} variant="body1">
            {title}
          </Typography>
        </Box>
      )}
      <Grid container spacing={2} p={2}>
        {data.map((item, index) => (
          <Grid
            size={item.size || GRID_COL_NUM / itemPerRow}
            key={index}
            sx={{
              display: "flex",
              flexDirection: mode === "row" ? "row" : "column",
              alignItems: mode === "row" ? "center" : "flex-start",
              justifyContent: mode === "row" ? "space-between" : "flex-start",
              borderRight:
                item.hasBorder || (index + 1) % itemPerRow === 0 ? 0 : 1,
              borderColor: "grey.200",
              pr: (index + 1) % itemPerRow !== 0 ? 2 : 0,
              gap: mode === "row" ? 2 : 0,
            }}
          >
            <Typography
              variant="body2"
              color="grey.500"
              sx={{ minWidth: mode === "row" ? 120 : "auto" }} // để title gọn đẹp
            >
              {item.title}
            </Typography>
            <Box flex={1}>{renderDescription(item.description)}</Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default memo(DetailSection);
