import {
  Box,
  Button,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { memo, useCallback, useState } from "react";
import { UserRole, type UserData } from "../../../utils/type";
import theme from "../../../scss/theme";
import { useTranslation } from "react-i18next";

interface ITransferAuthoritySectionProps {
  myInfo?: UserData;
  setOpenModal: (type: "approve" | "transfer", employeeNo?: string) => void;
}

const TransferAuthoritySection = ({
  myInfo,
  setOpenModal,
}: ITransferAuthoritySectionProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [employeeNo, setEmployeeNo] = useState("");

  const isAdmin = myInfo?.role === UserRole.ADMIN;

  const canTransferAdmin =
    isAdmin &&
    myInfo.fromTransferAdminUserYn === "N" &&
    myInfo.toTransferAdminUserYn !== "Y";

  const isProgressTransferAdmin =
    isAdmin &&
    myInfo.fromTransferAdminUserYn === "Y" &&
    myInfo.toTransferAdminUserYn === "N";

  const handleButtonClick = useCallback(() => {
    if (isAdmin) {
      setOpen(true);
    } else {
      setOpenModal("approve");
    }
  }, [isAdmin, setOpenModal]);

  const handleSubmit = () => {
    if (employeeNo.trim()) {
      setOpenModal("transfer", employeeNo);
      setOpen(false);
      setEmployeeNo("");
    }
  };

  if (!canTransferAdmin && !isProgressTransferAdmin) return null;

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        padding: "8px 12px",
        border: `1px solid ${theme.palette.grey[200]}`,
        marginBottom: "8px",
      }}
    >
      <Box mb={1}>
        <Typography component="p" variant="subtitle1" fontWeight="bold">
          {t("transferAuthority")}
        </Typography>
        <Typography variant="body2" color="grey.500">
          {t("transferInfo")}
        </Typography>
        {isProgressTransferAdmin && (
          <Typography variant="body2" color="grey.500">
            {t("transferInProgress")}
          </Typography>
        )}
      </Box>

      <Button variant="contained" onClick={handleButtonClick}>
        {isAdmin ? t("transferRequest") : t("transferApprove")}
      </Button>

      {/* Modal nhập employeeNo */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{t("inputEmployeeNo")}</DialogTitle>
        <DialogContent>
          <TextField
            label={t("inputEmployeeNo")}
            value={employeeNo}
            onChange={(e) => setEmployeeNo(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>{t("cancel")}</Button>
          <Button onClick={handleSubmit} variant="contained">
            {t("confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default memo(TransferAuthoritySection);
