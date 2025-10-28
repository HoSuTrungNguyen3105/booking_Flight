import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
} from "@mui/material";
import { Add, Edit, Delete, LocationOn, Schedule } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { useGetFaclilityByTerminalID } from "../../../../context/Api/useGetApi";
import type { Facility } from "../../../../utils/type";
import ManageFacilityModal from "./modal/ManageFacilityModal";

const FacilityManagement = () => {
  const location = useLocation();
  const { terminalId } = location.state as { terminalId: string };
  // const [facilities, setFacilities] = useState<Facility[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [dialogType, setDialogType] = useState<"update" | "create">("create");
  // const [formData, setFormData] = useState({
  //   name: "",
  //   type: "RESTAURANT",
  //   description: "",
  //   location: "",
  //   openingHours: "",
  //   terminalId: terminalId || "",
  // });

  const { dataGetFaclilityByTerminalID, refetchGetFaclilityByTerminalID } =
    useGetFaclilityByTerminalID(terminalId);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this facility?")) {
      try {
        await fetch(`http://localhost:3000/facilities/${id}`, {
          method: "DELETE",
        });
      } catch (error) {}
    }
  };

  const facilityTypes = {
    RESTAURANT: { label: "Nhà hàng", color: "primary" },
    SHOP: { label: "Cửa hàng", color: "secondary" },
    LOUNGE: { label: "Phòng chờ", color: "success" },
    ATM: { label: "ATM", color: "warning" },
    WIFI: { label: "Wi-Fi", color: "info" },
  };

  return (
    <>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h5">
            Quản lý Tiện nghi {terminalId && `- Terminal ${terminalId}`}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setEditingFacility(null);
              setDialogType("create");
              // setFormData({
              //   name: "",
              //   type: "RESTAURANT",
              //   description: "",
              //   location: "",
              //   openingHours: "",
              //   terminalId: terminalId || "",
              // });
              setDialogOpen(true);
            }}
          >
            Thêm tiện nghi
          </Button>
        </Box>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          {dataGetFaclilityByTerminalID?.list?.map((facility) => (
            <Grid size={6} key={facility.id}>
              <Card>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="start"
                    mb={2}
                  >
                    <Typography variant="h6">{facility.name}</Typography>
                    <Chip
                      label={
                        facilityTypes[
                          facility.type as keyof typeof facilityTypes
                        ]?.label
                      }
                      color={
                        facilityTypes[
                          facility.type as keyof typeof facilityTypes
                        ]?.color as any
                      }
                      size="small"
                    />
                  </Box>

                  {facility.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      {facility.description}
                    </Typography>
                  )}

                  <Box sx={{ mb: 2 }}>
                    {facility.location && (
                      <Box display="flex" alignItems="center" mb={1}>
                        <LocationOn
                          fontSize="small"
                          sx={{ mr: 1, color: "text.secondary" }}
                        />
                        <Typography variant="body2">
                          {facility.location}
                        </Typography>
                      </Box>
                    )}
                    {facility.openingHours && (
                      <Box display="flex" alignItems="center">
                        <Schedule
                          fontSize="small"
                          sx={{ mr: 1, color: "text.secondary" }}
                        />
                        <Typography variant="body2">
                          {facility.openingHours}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    Terminal: {facility.terminal.name}
                  </Typography>

                  <Box display="flex" justifyContent="flex-end" gap={1} mt={2}>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setEditingFacility(facility);
                        setDialogType("update");
                        setDialogOpen(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(facility.id)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {dialogOpen && (
        <ManageFacilityModal
          open={dialogOpen}
          terminalId={terminalId}
          mode={dialogType}
          updateData={editingFacility as Facility}
          onClose={() => {
            setDialogOpen(false);
          }}
          onSuccess={() => {
            setDialogOpen(false);
            refetchGetFaclilityByTerminalID();
          }}
        />
      )}
    </>
  );
};

export default FacilityManagement;
