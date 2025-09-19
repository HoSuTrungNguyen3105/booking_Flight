import { Box, Button, Grid, Typography } from "@mui/material";
import { memo, useCallback } from "react";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import BaseModal from "../../../common/Modal/BaseModal";
import type { AreaKey } from "../AirportMasterplan";

interface IRequestLeaveActionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedArea: AreaKey;
  AREA_DETAILS: Record<
    AreaKey,
    { title: string; description: string; features?: string[] }
  >;
}

const DetailTerminalModal = ({
  open,
  onClose,
  selectedArea,
  AREA_DETAILS,
}: IRequestLeaveActionModalProps) => {
  const renderActions = useCallback(() => {
    return (
      <Box display="flex" gap={1} justifyContent="flex-end" alignItems="center">
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </Box>
    );
  }, [onClose]);

  const renderContent = useCallback(() => {
    return (
      <Box maxHeight="30rem">
        {AREA_DETAILS[selectedArea].features && (
          <>
            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
              Đặc điểm chính:
            </Typography>
            <Grid container spacing={1}>
              {AREA_DETAILS[selectedArea].features?.map((feature, index) => (
                <Grid size={12} sx={{ sm: 6 }} key={index}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        mr: 1,
                      }}
                    />
                    <Typography variant="body2">{feature}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Box>
    );
  }, [AREA_DETAILS, selectedArea]);

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title={AREA_DETAILS[selectedArea].title}
      subtitle={AREA_DETAILS[selectedArea].description}
      Icon={PrivacyTipIcon}
      slots={{ content: renderContent(), actions: renderActions() }}
    />
  );
};

export default memo(DetailTerminalModal);
