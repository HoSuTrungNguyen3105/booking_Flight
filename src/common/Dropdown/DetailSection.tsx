import { Box, Grid, Typography } from "@mui/material";
import React, { memo, useCallback } from "react";

export interface IDetailItem {
  title: string;
  description: string | React.ReactNode;
  size?: number; // Add this new property for custom grid size
  hasBorder?: boolean;
}

interface IDetailSectionProps {
  title?: string;
  itemPerRow?: 1 | 2 | 3 | 4 | 6 | 12;
  data: IDetailItem[];
}

const GRID_COL_NUM = 12;

const DetailSection = ({
  title,
  itemPerRow = 4,
  data,
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
              borderRight:
                // index + 1 === data.length
                item.hasBorder ? 0 : (index + 1) % itemPerRow !== 0 ? 1 : 0,
              borderColor: "grey.200",
              pr: (index + 1) % itemPerRow !== 0 ? 2 : 0,
            }}
          >
            <Typography variant="body2" color="grey.500">
              {item.title}
            </Typography>
            <Box>{renderDescription(item.description)}</Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default memo(DetailSection);
