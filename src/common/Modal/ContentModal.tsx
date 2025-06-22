import { type FC, useMemo } from "react";
// import { ModalProps } from "./type";
import {
  Box,
  Dialog,
  DialogTitle,
  IconButton,
  SvgIcon,
  Tooltip,
  DialogContent,
} from "@mui/material";
import clsx from "clsx";
import { CloseOutlined } from "@mui/icons-material";
// import { convertToString, quickValue } from "utils";
import type { ModalProps } from "./type";
import { convertToString, quickValue } from "../../utils";
import { Button } from "../Button/Button";
const ContentModal: FC<ModalProps> = ({
  type = "modal",
  contentArea,
  customContentArea,
  customHeaderTitle,
  customBtnArea,
  hideSubmit = false,
  handleClose,
  handleSubmit,
  titleIcon,
  titleColor,
  titleFontSize,
  position = "basic",
  open,
  size = 1000,
  sx,
  title = "",
  component,
  closeLabel = "btn_close",
  submitLabel = "btn_save",
  hideCloseBtn = false,
  disabled = false,
  leftBtns,
  middleBtns,
  height,
  removePadding = false,
  hideHeader = false,
  hideFooter = false,
  overflowHidden = false,
  modalContentClassName,
  paperClassName,
  maxWidthTitle = "",
}) => {
  const maxWidth = quickValue(!!maxWidthTitle, maxWidthTitle, "none");
  const getHeight = useMemo(() => {
    if (height === 0) return undefined;
    return height ? `${height}px` : "auto";
  }, [height]);
  return (
    <Dialog
      PaperProps={{
        style: {
          minWidth: `${size}px`,
          height: getHeight,
          overflow: overflowHidden ? "hidden" : "auto",
        },
        className: clsx([
          "paper-container",
          position === "overflow" ? "overflow-position" : "",
          removePadding ? "p-0" : "",
          paperClassName,
          "content-modal-container",
        ]),
      }}
      open={open}
      className="container-content-modal"
      hideBackdrop={type === "modaless"}
      sx={sx}
      component={component}
    >
      {!hideHeader && (
        <Box className="modal-header">
          {customHeaderTitle ?? (
            <Box className="title">
              {titleIcon ?? <Box className="icon" />}{" "}
              <DialogTitle className="text">
                <Tooltip title={<h4>{title}</h4>}>
                  <Box
                    sx={{
                      color: titleColor,
                      fontSize: titleFontSize,
                      maxWidth,
                    }}
                    className="overflow-hidden whitespace-nowrap text-ellipsis"
                  >
                    {title}{" "}
                  </Box>
                </Tooltip>
              </DialogTitle>
            </Box>
          )}
          <IconButton onClick={handleClose}>
            <SvgIcon className="icon-close">
              <CloseOutlined />{" "}
            </SvgIcon>
          </IconButton>
        </Box>
      )}
      <DialogContent className={modalContentClassName} dividers>
        {customContentArea ?? contentArea}
      </DialogContent>
      {!hideFooter && (
        <Box className="modal-footer">
          {customBtnArea ?? (
            <>
              {leftBtns?.map((props) => (
                <Button key={convertToString(props.label)} {...props} />
              ))}
              {!hideSubmit && (
                <Button
                  disabled={disabled}
                  onClick={handleSubmit}
                  label={submitLabel}
                  priority="primary"
                />
              )}
              {middleBtns?.map((props) => (
                <Button key={convertToString(props.label)} {...props} />
              ))}
              {!hideCloseBtn && (
                <Button
                  onClick={handleClose}
                  label={closeLabel}
                  appearance="outlined"
                  priority="normal"
                />
              )}
            </>
          )}
        </Box>
      )}
    </Dialog>
  );
};
export default ContentModal;
