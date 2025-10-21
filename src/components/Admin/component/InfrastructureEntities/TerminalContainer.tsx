import React, { memo, useCallback, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  styled,
  Stack,
  Alert,
  IconButton,
  alpha,
} from "@mui/material";
import { Edit, Add } from "@mui/icons-material";
import TabPanel, {
  type ITabItem,
} from "../../../../common/CustomRender/TabPanel";
import {
  useGetTerminalData,
  type CreateGateProps,
} from "../../../Api/usePostApi";
import {
  type Facility,
  type FacilityType,
  type Gate,
  type GateStatus,
  type Terminal,
} from "../../../../utils/type";
import theme from "../../../../scss/theme";
import CreateGateModal from "./modal/CreateGateModal";
import { useTerminalContainer } from "./hook/useTerminalContainer";
import ManageFacilityModal from "./modal/ManageFacilityModal";

export type UpdateGateProps = Pick<Gate, "id"> &
  Omit<CreateGateProps, "terminalId">;

const PaperContainer = styled(Paper)(() => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  position: "relative",
  cursor: "pointer",
}));

const GateBox = styled(Box)<{ status: GateStatus }>(({ status }) => {
  const statusStyles: Record<
    GateStatus,
    { backgroundColor: string; color: string }
  > = {
    OCCUPIED: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
    CLOSED: {
      backgroundColor: theme.palette.success.dark,
      color: theme.palette.primary.light,
    },
    AVAILABLE: {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.primary.light,
    },
    MAINTENANCE: {
      backgroundColor: theme.palette.warning.main,
      color: theme.palette.warning.contrastText,
    },
  };

  const { backgroundColor, color } = statusStyles[status] || {
    backgroundColor: theme.palette.grey[300],
    color: theme.palette.text.primary,
  };

  return {
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    textAlign: "center",
    cursor: "pointer",
    backgroundColor,
    color,
    fontWeight: "bold",
  };
});

const EditOverlay = styled(Box)(() => ({
  position: "absolute",
  top: 8,
  right: 8,
  backgroundColor: theme.palette.primary.main,
  borderRadius: "50%",
  width: 32,
  height: 32,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
}));

const TerminalContainer: React.FC = () => {
  const {
    getFacilityStyle,
    editingItem,
    handleAddNew,
    getTerminalData,
    handleGateClick,
    setActiveTab,
    dialogOpen,
    selectedTerminal,
    setSelectedTerminal,
    activeTab,
    setDialogOpen,
    refetchGetTerminalData,
    dialogType,
    handleFacilityClick,
    handleTerminalClick,
    getTerminalColor,
    getGateStatusText,
    gateForm,
    setGateForm,
    terminalId,
  } = useTerminalContainer();

  console.log("terminal", terminalId);

  const renderDescription = useCallback(() => {
    return (
      <>
        <Typography variant="h6" gutterBottom>
          Chú thích
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: "primary.main",
                mr: 1,
                borderRadius: 1,
              }}
            />
            <Typography variant="body2">Đã có chuyến bay</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: "grey.300",
                mr: 1,
                borderRadius: 1,
              }}
            />
            <Typography variant="body2">Có sẵn</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: "warning.main",
                mr: 1,
                borderRadius: 1,
              }}
            />
            <Typography variant="body2">Đang bảo trì</Typography>
          </Box>
        </Box>
        <Alert severity="info">
          Click vào terminal, gate hoặc tiện nghi để chỉnh sửa. Click nút "+" để
          thêm mới.
        </Alert>
      </>
    );
  }, []);

  const tabs: ITabItem[] = [
    { label: "Tất cả", value: "all", description: renderDescription() },
    { label: "Khu A", value: "A", description: renderDescription() },
    { label: "Khu B", value: "B", description: renderDescription() },
    { label: "Khu C", value: "C", description: renderDescription() },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <Stack direction="column" spacing={2} sx={{ mt: 1 }}></Stack>;

      case 1:
        return <Stack direction="column" spacing={2} sx={{ mt: 1 }}></Stack>;

      case 2:
        return <Stack direction="column" spacing={2} sx={{ mt: 1 }}></Stack>;

      case 3:
        return <Stack direction="column" spacing={2} sx={{ mt: 1 }}></Stack>;
    }
  };

  const renderGate = useCallback((terminal: Terminal) => {
    return (
      <>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography variant="h6">
            Cổng ({terminal.gates.length} cổng)
          </Typography>
          <IconButton
            size="small"
            sx={{ ml: 1 }}
            onClick={(e) => {
              e.stopPropagation();
              handleAddNew("gate", terminal.id);
            }}
          >
            <Add />
          </IconButton>
        </Box>

        {terminal.gates.length > 0 ? (
          <Grid container spacing={1}>
            {terminal.gates.map((gate) => (
              <Grid size={4} key={gate.id}>
                <GateBox
                  status={gate.status as GateStatus}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGateClick("update", gate);
                  }}
                >
                  <Typography variant="body2" fontWeight="bold">
                    {gate.code}
                  </Typography>
                  <Typography variant="caption" display="block">
                    {getGateStatusText(gate.status)}
                  </Typography>
                </GateBox>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box
            sx={{
              p: 2,
              textAlign: "center",
              bgcolor: "grey.50",
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Chưa có cổng nào. Click nút + để thêm cổng mới.
            </Typography>
          </Box>
        )}

        {terminal.gates.length > 0 ? (
          <Grid container spacing={1}>
            {terminal.gates.map((gate) => (
              <Grid size={12} key={gate.id}>
                <GateBox
                  status={
                    gate.assignments.length > 0 ? "OCCUPIED" : "AVAILABLE"
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGateClick("update", gate);
                  }}
                >
                  {gate.assignments.length > 0 ? (
                    gate.assignments.map((assignment) => (
                      <Box key={assignment.id} sx={{ mt: 0.5 }}>
                        <Typography
                          variant="caption"
                          display="block"
                          color="success.main"
                        >
                          Flight #{assignment.flightId}
                        </Typography>
                        <Typography variant="caption" display="block">
                          AssignedAt: {assignment.assignedAt}
                        </Typography>
                        <Typography variant="caption" display="block">
                          ReleasedAt: {assignment.releasedAt}
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography
                      variant="caption"
                      display="block"
                      color="text.secondary"
                    >
                      Chưa có assignment
                    </Typography>
                  )}
                </GateBox>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box
            sx={{
              p: 2,
              textAlign: "center",
              bgcolor: "grey.50",
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Chưa có assignment gate nào. Click nút + để thêm mới.
            </Typography>
          </Box>
        )}
      </>
    );
  }, []);

  const renderFacility = useCallback((terminal: Terminal) => {
    return (
      <>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography variant="h6">
            Tiện nghi ({terminal.facilities.length})
          </Typography>
          <IconButton
            size="small"
            sx={{ ml: 1 }}
            onClick={(e) => {
              e.stopPropagation();
              handleAddNew("facility", terminal.id);
              // handleFacilityClick("create", facility);
            }}
          >
            <Add />
          </IconButton>
        </Box>

        {terminal.facilities.length > 0 ? (
          <Box sx={{ mb: 2 }}>
            {terminal.facilities.map((facility) => {
              const info = getFacilityStyle(facility.type as FacilityType);
              const chipBg = alpha(info.color, 0.06);
              const chipHoverBg = alpha(info.color, 0.1);

              return (
                <Chip
                  key={facility.id}
                  clickable
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFacilityClick("update", facility, terminal.id);
                  }}
                  size="medium"
                  variant="outlined"
                  sx={{
                    m: 0.5,
                    borderColor: info.color,
                    color: info.color,
                    backgroundColor: chipBg,
                    "&:hover": {
                      backgroundColor: chipHoverBg,
                      boxShadow: theme.shadows[1],
                    },
                  }}
                  label={
                    <Box sx={{ textAlign: "left", lineHeight: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {facility.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        display="block"
                        sx={{ color: info.color, opacity: 0.9 }}
                      >
                        {info.label}
                      </Typography>
                    </Box>
                  }
                />
              );
            })}
          </Box>
        ) : (
          <Box
            sx={{
              p: 2,
              textAlign: "center",
              bgcolor: "grey.50",
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Chưa có tiện nghi nào. Click nút + để thêm tiện nghi mới.
            </Typography>
          </Box>
        )}

        {/* Hiển thị thông tin airport */}
        <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Thông tin sân bay:
          </Typography>
          <Typography variant="body2">
            {terminal.airport.name} ({terminal.airport.code})
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {terminal.airport.city}, {terminal.airport.city}
          </Typography>
        </Box>
      </>
    );
  }, []);

  return (
    <>
      <Stack sx={{ mb: 1 }}>
        <TabPanel
          activeTab={activeTab}
          onChangeTab={(idx) => {
            setActiveTab(idx);
            setSelectedTerminal(tabs[idx].value);
          }}
          tabs={tabs}
        />
      </Stack>

      <Box
        sx={{
          height: "58vh",
          overflow: "scroll",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {getTerminalData?.list
          ?.filter(
            (t) => selectedTerminal === "all" || t.id === selectedTerminal
          )
          .map((terminal) => (
            <PaperContainer
              key={terminal.id}
              onClick={() => handleTerminalClick(terminal)}
            >
              <EditOverlay
                sx={{ opacity: 1 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleTerminalClick(terminal);
                }}
              >
                <Edit fontSize="small" />
              </EditOverlay>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    backgroundColor: getTerminalColor(terminal.type),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                    mr: 2,
                  }}
                >
                  {terminal.code}
                </Box>
                <Typography
                  variant="h5"
                  component="h2"
                  color={getTerminalColor(terminal.type)}
                >
                  {terminal.name} ({terminal.code}) - {terminal.airport.name}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {terminal.description} • {terminal.type} •{" "}
                  {terminal.airport.city}
                </Typography>
              </Box>

              <Grid container spacing={2}>
                {/* TO_DO IN THIS render*/}
                <Grid size={8}>{renderGate(terminal)}</Grid>

                <Grid size={4}>{renderFacility(terminal)}</Grid>
              </Grid>
            </PaperContainer>
          ))}
      </Box>

      <ManageFacilityModal
        open={dialogOpen.facility}
        terminalId={terminalId}
        mode={dialogType}
        updateData={editingItem as Facility}
        onClose={() => {
          setDialogOpen((prev) => ({ ...prev, facility: false }));
          // refetchGetTerminalData();
        }}
        onSuccess={() => {
          setDialogOpen((prev) => ({ ...prev, facility: false }));
          refetchGetTerminalData();
        }}
      />

      <CreateGateModal
        open={dialogOpen.gate}
        onClose={() => setDialogOpen((prev) => ({ ...prev, gate: false }))}
        onSuccess={() => {
          setDialogOpen((prev) => ({ ...prev, gate: false }));
          refetchGetTerminalData();
        }}
        mode={dialogType}
        data={gateForm as Gate}
        setData={setGateForm}
        terminalId={terminalId}
      />
    </>
  );
};

export default memo(TerminalContainer);
