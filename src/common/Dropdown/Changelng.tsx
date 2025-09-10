import Language from "../../svgs/globe-svgrepo.svg";
import { Box, Button } from "@mui/material";
import { useCallback, useState } from "react";
import ChangeLanguageModal from "./ChangeLanguageModal";

export const LanguageButton = () => {
  const [openModal, setOpenModal] = useState(false);

  const renderButton = useCallback(() => {
    return (
      <Button
        variant="contained"
        sx={{
          borderRadius: "20px",
          textTransform: "none",
          fontWeight: "bold",
          px: 2,
        }}
        onClick={() => setOpenModal(true)}
      >
        <Box component={"img"} sx={{ width: 24, height: 24 }} src={Language} />
      </Button>
    );
  }, []);

  return (
    <>
      {renderButton()}
      <ChangeLanguageModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={() => setOpenModal(false)}
      />
    </>
  );
};
