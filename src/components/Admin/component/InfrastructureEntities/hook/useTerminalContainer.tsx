import { useCallback, useEffect, useState } from "react";
import type {
  Facility,
  FacilityType,
  Gate,
  Terminal,
} from "../../../../../utils/type";
import theme from "../../../../../scss/theme";
import type { UpdateGateProps } from "../TerminalContainer";
import {
  useFindTerminalIDStatuses,
  useGetTerminalData,
} from "../../../../../context/Api/AirportApi";

export const useTerminalContainer = () => {
  const { dataTerminalIDStatuses } = useFindTerminalIDStatuses();
  const [selectedTerminal, setSelectedTerminal] = useState<string>("all");

  useEffect(() => {
    if (dataTerminalIDStatuses?.list?.length) {
      setSelectedTerminal(dataTerminalIDStatuses.list[0].value);
    }
  }, [dataTerminalIDStatuses]);

  const [activeTab, setActiveTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState({
    terminal: false,
    gate: false,
    facility: false,
    assignments: false,
  });
  const { getTerminalData, refetchGetTerminalData } = useGetTerminalData();
  const [editingItem, setEditingItem] = useState<
    Terminal | Facility | Gate | null
  >(null);

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
    id: "",
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

  const handleFacilityClick = useCallback(
    (type: "create" | "update", facility: Facility) => {
      setDialogType(type);
      setEditingItem(facility);
      setDialogOpen((prev) => ({ ...prev, facility: true }));
    },
    [setDialogType, setEditingItem, setDialogOpen]
  );

  const handleTerminalClick = useCallback(
    (terminal: Terminal) => {
      setEditingItem(terminal);
      setTerminalId(terminal.id);
      setDialogOpen((prev) => ({ ...prev, terminal: true }));
    },
    [setEditingItem, setTerminalId, setDialogOpen]
  );

  const handleAddNew = useCallback(
    (type: "gate" | "facility", terminalID: string) => {
      setDialogType("create");
      setTerminalId(terminalID);
      setDialogOpen((prev) => ({ ...prev, [type]: true }));
    },
    [setDialogType, setTerminalId, setEditingItem, setDialogOpen]
  );

  const handleGateClick = useCallback(
    (type: "create" | "update", gate?: Gate) => {
      setDialogType(type);
      if (type === "update" && gate) {
        setGateForm({
          code: gate.code,
          status: gate.status,
          id: gate.id,
        });
      } else {
        setGateForm({ code: "", status: "AVAILABLE", id: "" });
      }
      setDialogOpen((prev) => ({ ...prev, gate: true }));
    },
    [setDialogType, setGateForm, setDialogOpen]
  );

  return {
    getFacilityStyle,
    editingItem,
    handleAddNew,
    getTerminalData,
    handleGateClick,
    setActiveTab,
    dialogOpen,
    setDialogOpen,
    selectedTerminal,
    setSelectedTerminal,
    activeTab,
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
  } as const;
};
