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
import TabPanel, { type ITabItem } from "../../common/CustomRender/TabPanel";
import { useGetTerminalData, type CreateGateProps } from "../Api/usePostApi";
import {
  type Facility,
  type FacilityType,
  type Gate,
  type GateStatus,
  type Terminal,
} from "../../utils/type";
import CreateGateForm from "../User/CreateGateForm";
import CreateFacility from "./modal/CreateFacility";
import { useFindAllFacilityTypes } from "../Api/useGetApi";
import theme from "../../scss/theme";

export type UpdateGateProps = Omit<CreateGateProps, "terminalId">;

// Styled components
const PaperContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  position: "relative",
  cursor: "pointer",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: theme.shadows[4],
    transform: "translateY(-2px)",
  },
}));

const GateBox = styled(Box)<{ status: GateStatus }>(({ theme, status }) => {
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
    transition: "all 0.2s ease-in-out",
    position: "relative",
    "&:hover": {
      opacity: 0.8,
      transform: "scale(1.05)",
    },
  };
});

const EditOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 8,
  right: 8,
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  borderRadius: "50%",
  width: 32,
  height: 32,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  opacity: 0,
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    color: "white",
  },
}));

const TerminalContainer: React.FC = () => {
  const [selectedTerminal, setSelectedTerminal] = useState<string>("all");
  const [activeTab, setActiveTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState({
    terminal: false,
    gate: false,
    facility: false,
    assignments: false,
  });
  // const [dialogType, setDialogType] = useState<
  //   "terminal" | "gate" | "facility"
  // >("facility");
  const { getTerminalData, refetchGetTerminalData } = useGetTerminalData();
  const [editingItem, setEditingItem] = useState<
    Terminal | Facility | Gate | null
  >(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    status: "",
    type: "",
    location: "",
    openingHours: "",
    flight: "",
  });
  // const { dataFacilityTypes } = useFindAllFacilityTypes();

  const getFacilityStyle = (type: FacilityType) => {
    const t = type?.toUpperCase() || "OTHER";
    switch (t) {
      case "RESTAURANT":
        return { label: "Nhà hàng", color: theme.palette.primary.main };
      case "SHOP":
        return { label: "Cửa hàng", color: theme.palette.secondary.main };
      case "LOUNGE":
        return { label: "Phòng chờ", color: theme.palette.success.main };
      case "INFORMATION":
        return { label: "Thông tin", color: theme.palette.info.main };
      case "SECURITY":
        return { label: "An ninh", color: theme.palette.error.main };
      case "TRANSPORTATION":
        return { label: "Di chuyển", color: theme.palette.warning.main };
      default:
        return { label: "Khác", color: theme.palette.grey[700] };
    }
  };

  const [dialogType, setDialogType] = useState<"update" | "create">("create");
  const [gateForm, setGateForm] = useState<UpdateGateProps>({
    code: "",
    status: "",
  });

  const [terminalId, setTerminalId] = useState("");

  const getTerminalColor = (type: string): string => {
    const colorMap: { [key: string]: string } = {
      DOMESTIC: "#1976d2",
      INTERNATIONAL: "#2e7d32",
      BUSINESS: "#ed6c02",
      CARGO: "#757575",
    };
    return colorMap[type] || "#9c27b0";
  };

  const getGateStatusText = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      AVAILABLE: "Có sẵn",
      OCCUPIED: "Đã có chuyến bay",
      MAINTENANCE: "Đang bảo trì",
      CLOSED: "Đã đóng",
    };
    return statusMap[status] || status;
  };

  const handleFacilityClick = (
    type: "create" | "update",
    facility: Facility
  ) => {
    setDialogType(type);
    setEditingItem(facility);
    setDialogOpen((prev) => ({ ...prev, facility: true }));
  };

  const handleTerminalClick = (terminal: Terminal) => {
    // setDialogType("terminal");
    setEditingItem(terminal);
    setFormData({
      name: terminal.name,
      code: terminal.id,
      status: "available",
      type: "",
      location: "",
      openingHours: "",
      flight: "",
    });
    setDialogOpen((prev) => ({ ...prev, terminal: true }));
  };

  const [facilities, setFacilities] = useState({
    name: "",
    type: "LOUNGE",
    description: "",
    terminalId: "",
    location: "",
    openingHours: "",
  });

  // const handleChange = (e: string) => {
  //   setFacilities({ ...facilities, [e]: e });
  // };

  // const handleSelectChange = (name: string, value: string | number) => {
  //   setFacilities((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  const handleAddNew = (type: "gate" | "facility", terminalId: string) => {
    setDialogType("create");
    setTerminalId(terminalId);
    setDialogOpen((prev) => ({ ...prev, [type]: true }));
  };

  const handleGateClick = (type: "create" | "update", gate: Gate) => {
    setDialogType(type);
    setGateForm({
      code: gate.code,
      status: gate.status,
    });
    console.log("gate, ", gate);
    setDialogOpen((prev) => ({ ...prev, gate: true }));
  };

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

  if (dialogOpen.facility) {
    return (
      <CreateFacility
        terminalId={terminalId}
        mode={dialogType}
        updateData={editingItem as Facility}
        onClose={() => {
          setDialogOpen((prev) => ({ ...prev, facility: false }));
          refetchGetTerminalData();
        }}
      />
    );
  }

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
          height: "50vh",
          overflow: "scroll",
          p: "8px",
          // Ẩn thanh cuộn trên mọi trình duyệt
          scrollbarWidth: "none", // Firefox
          "&::-webkit-scrollbar": {
            display: "none", // Chrome, Safari
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
              elevation={2}
              sx={{
                borderLeft: `4px solid ${getTerminalColor(terminal.type)}`,
              }}
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
                <Grid size={8}>
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
                </Grid>

                {terminal.gates.length > 0 ? (
                  <Grid container spacing={1}>
                    {terminal.gates.map((gate) => (
                      <Grid size={12} key={gate.id}>
                        <GateBox
                          status={
                            gate.assignments.length > 0
                              ? "OCCUPIED"
                              : "AVAILABLE"
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

                <Grid size={4}>
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
                        const info = getFacilityStyle(
                          facility.type as FacilityType
                        );
                        const chipBg = alpha(info.color, 0.06);
                        const chipHoverBg = alpha(info.color, 0.1);

                        return (
                          <Chip
                            key={facility.id}
                            clickable
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFacilityClick("update", facility);
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
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 600 }}
                                >
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
                        Chưa có tiện nghi nào. Click nút + để thêm tiện nghi
                        mới.
                      </Typography>
                    </Box>
                  )}

                  {/* Hiển thị thông tin airport */}
                  <Box
                    sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}
                  >
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
                </Grid>
              </Grid>
            </PaperContainer>
          ))}
      </Box>
      <CreateGateForm
        open={dialogOpen.gate}
        onClose={() => setDialogOpen((prev) => ({ ...prev, gate: false }))}
        onSuccess={() => setDialogOpen((prev) => ({ ...prev, gate: false }))}
        mode={dialogType}
        data={gateForm}
        terminalId={terminalId}
      />
    </>
  );
};

export default memo(TerminalContainer);
