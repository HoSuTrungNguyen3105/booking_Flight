import { Box, Button, Stack, Typography } from "@mui/material";
import { memo, useCallback, useState } from "react";
import { DateFormatEnum, formatDateKR } from "../../hooks/format";

export interface ISearchQuery {
  startDate: number | string;
  endDate: number | string;
}

interface ISearchBarProps {
  disabled?: boolean;
  startDate?: number;
  endDate?: number;
  onClickFirst: (query: ISearchQuery) => void;
  onClickSecond?: (query: string) => void;
}

const InspectionSearchBar = ({
  disabled = false,
  startDate,
  endDate,
  onClickFirst,
  onClickSecond,
}: ISearchBarProps) => {
  const [valueStartDate, setValueStartDate] = useState<string | number>(
    startDate as number
  );
  const [valueEndDate, setValueEndDate] = useState<string | number>(
    endDate as number
  );

  return (
    <Stack
      gap={2}
      direction="row"
      alignItems="flex-start"
      p={2}
      bgcolor="white"
      border={1}
      borderColor="grey.200"
    >
      <Stack alignItems="center" sx={{ flex: 16 }}>
        <Stack direction="row" gap={2} alignItems="center" width="100%">
          <Box sx={{ flex: 1 }}>
            <Typography>
              {formatDateKR(
                DateFormatEnum.YYYY_MM_DD_HH_MM_SS,
                valueStartDate as number
              )}
            </Typography>
          </Box>
          -
          <Box sx={{ flex: 1 }}>
            <Typography>
              {formatDateKR(
                DateFormatEnum.YYYY_MM_DD_HH_MM_SS,
                valueStartDate as number
              )}
            </Typography>
          </Box>
        </Stack>
      </Stack>

      <Stack direction="row" alignItems="center" sx={{ flex: 3 }}>
        <Stack direction="row" spacing={2} mt={0.5}>
          <Button
            disabled={!valueStartDate || !valueEndDate}
            variant="contained"
            onClick={() => {
              const query: ISearchQuery = {
                startDate: valueStartDate,
                endDate: valueEndDate,
              };
              onClickFirst(query);
            }}
          >
            임시 레포트 생성
          </Button>

          <Button
            disabled={disabled}
            variant="contained"
            onClick={() => {
              const dateRange = `${valueStartDate} - ${valueEndDate}`;
              onClickSecond?.(dateRange);
            }}
          >
            최종 레포트 생성
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default memo(InspectionSearchBar);
