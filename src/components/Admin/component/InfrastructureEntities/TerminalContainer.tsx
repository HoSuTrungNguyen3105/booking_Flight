import React, { memo, useCallback } from "react";
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
import TabPanel from "../../../../common/AdditionalCustomFC/TabPanel";
import {
  type CreateGateProps,
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
import { DateFormatEnum, formatDate } from "../../../../hooks/format";
import { useNavigate } from "react-router-dom";
import { TerminalBatchCreator } from "./CreateTerminal";

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
    dataTerminalIDStatuses,
    setGateForm,
    terminalId,
  } = useTerminalContainer();

  const EmptyState = ({ message }: { message: string }) => (
    <Box
      sx={{
        p: 2,
        textAlign: "center",
        bgcolor: "grey.50",
        borderRadius: 2,
        border: "1px dashed",
        borderColor: "grey.300",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );

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

  const tabs = [
    { label: "Tất cả", value: "all", description: renderDescription() },
    ...(dataTerminalIDStatuses?.list?.map((e) => ({
      label: e.label,
      value: e.value,
      description: renderDescription(),
    })) || []),
  ];

  const renderGate = useCallback(
    (terminal: Terminal) => {
      const hasGates = terminal.gates.length > 0;

      return (
        <Box sx={{ mb: 3 }}>
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
            <Typography variant="h6" fontWeight={600}>
              Cổng ({terminal.gates.length})
            </Typography>
            <IconButton
              size="small"
              sx={{ ml: 1 }}
              onClick={(e) => {
                e.stopPropagation();
                handleAddNew("gate", terminal.id);
              }}
            >
              <Add fontSize="small" />
            </IconButton>
          </Box>

          {/* Gate List */}
          {hasGates ? (
            <Grid container spacing={1}>
              {terminal.gates.map((gate) => {
                const isOccupied = gate.assignments.length > 0;
                return (
                  <Grid key={gate.id} size={4}>
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
                      <Typography
                        variant="caption"
                        color={isOccupied ? "success.main" : "text.secondary"}
                      >
                        {isOccupied
                          ? `${gate.assignments.length} chuyến bay`
                          : getGateStatusText(gate.status)}
                      </Typography>

                      {/* Assignments Info */}
                      {isOccupied && (
                        <Box sx={{ mt: 0.5 }}>
                          {gate.assignments.map((as) => (
                            <Box key={as.id} sx={{ mt: 0.25 }}>
                              <Typography variant="caption" display="block">
                                Flight #{as.flightId}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {as.assignedAt
                                  ? `Bắt đầu: ${formatDate(
                                      DateFormatEnum.DD_MM_YYYY_HH_MM_SS,
                                      as.assignedAt
                                    )}`
                                  : "Chưa xác định"}
                              </Typography>
                              <Typography variant="caption" display="block">
                                {" "}
                                ReleasedAt:{" "}
                                {formatDate(
                                  DateFormatEnum.DD_MM_YYYY_HH_MM_SS,
                                  as.releasedAt
                                )}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </GateBox>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <EmptyState message="Chưa có cổng nào. Click nút + để thêm cổng mới." />
          )}
        </Box>
      );
    },
    [handleAddNew, handleGateClick]
  );

  const renderFacility = useCallback(
    (terminal: Terminal) => {
      const hasFacilities = terminal.facilities.length > 0;

      return (
        <Box sx={{ mb: 3 }}>
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
            <Typography variant="h6" fontWeight={600}>
              Tiện nghi ({terminal.facilities.length})
            </Typography>
            <IconButton
              size="small"
              sx={{ ml: 1 }}
              onClick={(e) => {
                e.stopPropagation();
                handleAddNew("facility", terminal.id);
              }}
            >
              <Add fontSize="small" />
            </IconButton>
          </Box>

          {/* Facility List */}
          {hasFacilities ? (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {terminal.facilities.map((facility) => {
                const info = getFacilityStyle(facility.type as FacilityType);
                const chipBg = alpha(info.color, 0.06);

                return (
                  <Chip
                    key={facility.id}
                    clickable
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFacilityClick("update", facility);
                    }}
                    label={
                      <Box sx={{ lineHeight: 1.2 }}>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{ color: info.color }}
                        >
                          {facility.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ opacity: 0.8 }}
                        >
                          {info.label}
                        </Typography>
                      </Box>
                    }
                    sx={{
                      bgcolor: chipBg,
                      border: `1px solid ${info.color}`,
                      borderRadius: 2,
                      "&:hover": { boxShadow: theme.shadows[1], opacity: 0.9 },
                    }}
                  />
                );
              })}
            </Box>
          ) : (
            <EmptyState message="Chưa có tiện nghi nào. Click nút + để thêm tiện nghi mới." />
          )}

          {/* Airport Info */}
          <Box sx={{ mt: 2, p: 1.5, bgcolor: "grey.50", borderRadius: 2 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              Thông tin sân bay
            </Typography>
            <Typography variant="body2">
              {terminal.airport.name} ({terminal.airport.code})
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {terminal.airport.city}
            </Typography>
          </Box>
        </Box>
      );
    },
    [handleAddNew, handleFacilityClick]
  );

  const navigate = useNavigate();

  const handleViewDetail = (terminalId: string) => {
    navigate("/admin/terminal/facility", {
      state: { terminalId: terminalId },
    });
  };

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
                  // handleTerminalClick(terminal);
                  handleViewDetail(terminal.id);
                  // handleTerminalClick(terminal);
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
                  {terminal.name} {terminal.code} - {terminal.airport.name}
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
