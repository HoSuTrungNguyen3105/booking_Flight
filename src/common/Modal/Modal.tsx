import { type FC, useEffect, useMemo } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  IconButton,
  SvgIcon,
  Tooltip,
  DialogContent,
  Typography,
} from "@mui/material";
import clsx from "clsx";
import { CloseOutlined } from "@mui/icons-material";
import type { ModalProps } from "./type";
import { convertToString, quickValue } from "../../utils";
import { Button } from "../Button/Button";
import "./../../scss/_modal.scss";
const Modal: FC<ModalProps> = ({
  type = "modal",
  contentArea,
  customContentArea,
  customHeaderTitle,
  customBtnArea,
  hideSubmit = false,
  handleClose,
  handleSubmit,
  title2,
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
  errorMessage,
  leftBtns,
  middleBtns,
  height,
  removePadding = false,
  hideHeader = false,
  hideFooter = false,
  overflowHidden = false,
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
              <DialogTitle className="text">
                {/* <Tooltip title={<Box>{title}</Box>}>
                  <Box
                    sx={{
                      color: titleColor,
                      fontSize: titleFontSize,
                      maxWidth,
                    }}
                    className="overflow-hidden "
                  >
                    {title}
                    <Typography
                      fontSize={15}
                      sx={{
                        color: titleColor,
                      }}
                    >
                      {title2 ?? null}
                    </Typography>
                  </Box>
                </Tooltip> */}
                <Tooltip title={<Box>{title}</Box>}>
                  <Box
                    sx={{
                      // display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flexDirection: "column",
                      color: titleColor,
                      fontSize: titleFontSize,
                      // maxWidth,
                      // overflow: "hidden",
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 1000,
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        // overflow: "hidden",
                      }}
                    >
                      {title}
                    </Typography>

                    {title2 && (
                      <Typography
                        variant="body2"
                        fontSize={15}
                        sx={{
                          color: titleColor,
                          // whiteSpace: "nowrap",
                          // fontWeight: 500,
                          // whiteSpace: "nowrap",
                          fontWeight: 500,
                          textOverflow: "ellipsis",
                          // overflow: "hidden",
                        }}
                      >
                        {title2}
                      </Typography>
                    )}
                  </Box>
                </Tooltip>
              </DialogTitle>
            </Box>
          )}
          <IconButton onClick={handleClose}>
            <SvgIcon className="icon-close">
              <CloseOutlined />
            </SvgIcon>
          </IconButton>
        </Box>
      )}
      <DialogContent className="content-dialog" dividers>
        {customContentArea ?? contentArea}
      </DialogContent>
      {!hideFooter && (
        <Box className="modal-footer">
          {customBtnArea ?? (
            <>
              {errorMessage ? (
                <Typography sx={{ display: "flex", color: "red" }}>
                  {errorMessage}
                </Typography>
              ) : null}
              {leftBtns?.map((props) => (
                <Box>
                  <Button
                    {...props}
                    appearance="contained"
                    priority="custom"
                    customColor="#fdd835"
                    size="large"
                    disabled={disabled}
                    customLabelColor="#000000"
                  />
                </Box>
              ))}
              {!hideSubmit && (
                <Button
                  disabled={disabled}
                  onClick={handleSubmit}
                  label={submitLabel}
                  // priority="primary"
                  appearance="contained"
                  priority="custom"
                  customColor="#fdd835"
                  size="large"
                  customLabelColor="#000000"
                />
              )}
              {middleBtns?.map((props) => (
                <Button
                  appearance="contained"
                  priority="custom"
                  customColor="#fdd835"
                  size="large"
                  disabled={disabled}
                  customLabelColor="#000000"
                  key={convertToString(props.label)}
                  {...props}
                />
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

export default Modal;
