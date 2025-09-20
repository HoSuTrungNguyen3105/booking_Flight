import { Box, Button, Typography, IconButton } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CancelIcon from "@mui/icons-material/Cancel";
import ImageIcon from "@mui/icons-material/Image";
import { useToast } from "../../context/ToastContext";
import {
  useCallback,
  useEffect,
  useState,
  useMemo,
  type FC,
  type MouseEventHandler,
} from "react";
import { sumBy } from "lodash";
import { INPUT_TYPE, type FileUploaderProps, type TFileUploader } from "./type";
import { concatStrings, getFileInformation, sizeToBytes } from "../../utils";
import { Image } from "@mui/icons-material";
import ContentModal from "../Modal/ContentModal";

const FilePreview = ({
  files,
  type,
  openImageModal,
  handleRemoveFile,
}: any) => {
  useEffect(() => {
    if (files?.length > 0) {
      console.log(files, "success");
    }
  }, [files]);

  if (!files || files.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        Chưa có file nào được tải lên
      </Typography>
    );
  }

  switch (type) {
    case "input":
      return (
        <Box display="flex" flexWrap="wrap" gap={2}>
          {files.map((file: any, index: number) => (
            <Box
              key={index}
              sx={{
                width: 120,
                height: 120,
                borderRadius: 2,
                backgroundImage: `url(${file.preview})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
                cursor: "pointer",
              }}
              onClick={() => openImageModal(file)}
            >
              <IconButton
                size="small"
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  bgcolor: "white",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile(index);
                }}
              >
                <CancelIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      );

    case "thumbnails":
      return (
        <Box display="flex" flexDirection="column" gap={1}>
          {files.map((file: any, index: number) => (
            <Box
              key={index}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{
                p: 1,
                borderRadius: 1,
                bgcolor: "grey.100",
              }}
              onClick={() => openImageModal(file)}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <ImageIcon />
                <Typography variant="body2">{file.fileName}</Typography>
              </Box>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile(index);
                }}
              >
                <CancelIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      );

    case "read-only":
      return (
        <Box display="flex" flexDirection="column" gap={1}>
          {files.map((file: any, index: number) => (
            <Typography key={index} variant="body2">
              {file.fileName}
            </Typography>
          ))}
        </Box>
      );

    default:
      return null;
  }
};

export const FileUpload: FC<FileUploaderProps> = ({
  width = "100%",
  height = "auto",
  accept = ".jpg,.png",
  maxSize = "10 MB",
  inputType = "thumbnails",
  name,
  value,
  onChange,
  maxFiles = 5,
  multiple = true,
  disabled = false,
}) => {
  const [imageFiles, setImageFiles] = useState<TFileUploader[]>(value || []);
  const [currentInputType, setCurrentInputType] = useState(inputType);
  const [openImage, setOpenImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState<TFileUploader | null>(null);

  const [_, setIsDragging] = useState(false);

  const toggleInputType = () => {
    setCurrentInputType((prev) => {
      if (prev === "input") return "thumbnails";
      if (prev === "thumbnails") return "read-only";
      return "input";
    });
  };

  const totalSize = useMemo(() => {
    let total = 0;
    if (Array.isArray(imageFiles)) {
      imageFiles.forEach((file) => (total += file.size));
    }
    return total;
  }, [imageFiles]);

  const validateFiles = useCallback(
    (files: File[]) => {
      const acceptTypeList = accept
        .split(",")
        .map((item) => item.toLowerCase());
      const sizeFiles = sumBy(files, "size") + totalSize;
      if (sizeFiles > sizeToBytes(maxSize)) {
        return false;
      }
      if (
        files.some(
          (file) =>
            !acceptTypeList.includes(
              concatStrings(".", getFileInformation(file.name).type)
            )
        )
      ) {
        return false;
      }
      if (
        Array.isArray(imageFiles) &&
        files.length + imageFiles.length > maxFiles
      ) {
        return false;
      }
      return true;
    },
    [imageFiles]
  );

  const handleDuplicateName = (
    currentFile: TFileUploader[],
    fileList: File[],
    newFile: File,
    isMultiple = false
  ) => {
    if (!isMultiple) return newFile.name;
    const amountDuplicate =
      (currentFile?.filter(
        (item) =>
          item.fileName === newFile.name || item.raw.name === newFile.name
      )?.length ??
        0) ||
      0;
    const duplicateList =
      fileList.filter((item) => item.name === newFile.name) ?? [];
    const amountDuplicateTotal =
      amountDuplicate + duplicateList.indexOf(newFile);
    if (amountDuplicateTotal === 0) return newFile.name;
    return concatStrings(
      getFileInformation(newFile.name).name,
      "-",
      amountDuplicateTotal,
      ".",
      getFileInformation(newFile.name).type
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFile: File[] = Array.from(e.target.files);
    const isValid = validateFiles(newFile);
    if (!isValid || disabled) return;
    const fileSrc: TFileUploader[] = newFile.map((file: File) => ({
      preview: URL.createObjectURL(file),
      raw: file,
      size: file.size,
      name: getFileInformation(file.name).name,
      type: getFileInformation(file.name).type,
      fileName: handleDuplicateName(imageFiles, newFile, file, multiple),
    }));
    const updatedFiles = multiple ? [...imageFiles, ...fileSrc] : fileSrc;
    setImageFiles(updatedFiles);
    onChange?.(multiple ? [...imageFiles, ...fileSrc] : fileSrc);
  };

  const openImageModal = (file: any) => {
    setSelectedFile(file);
    setOpenImage(true);
  };

  const closeImageModal = () => {
    setOpenImage(false);
    setSelectedFile(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    // e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;
    // if (!e.dataTransfer.files.length) return;

    const newFile: File[] = Array.from(e.dataTransfer.files);
    const isValid = validateFiles(newFile);
    if (!isValid) return;

    const fileSrc: TFileUploader[] = newFile.map((file: File) => ({
      raw: file,
      preview: URL.createObjectURL(file),
      size: file.size,
      name: file.name,
      type: file.type,
      fileName: file.name,
    }));
    const updatedFiles = multiple ? [...imageFiles, ...fileSrc] : fileSrc;
    setImageFiles(updatedFiles);
    onChange?.(updatedFiles);
  };

  const handleRemoveFile = (index: number) => {
    if (currentInputType === "read-only") return;
    const updatedFiles = imageFiles.filter((_, i: number) => i !== index);
    setImageFiles(updatedFiles);
    onChange?.(updatedFiles);
    // onChange?.(imageFiles.filter((_, i: number) => i !== index));
  };

  const onInputClick: MouseEventHandler<HTMLInputElement> = (event) => {
    event.stopPropagation();
    if (currentInputType === INPUT_TYPE.READONLY) {
      event.preventDefault();
      return;
    }
    const element = event.target as HTMLInputElement;
    element.value = "";
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("png")) return null;
    return <Image />;
  };

  return (
    <Box sx={{ width }}>
      <Button onClick={toggleInputType}>Switch view: {currentInputType}</Button>
      <Box
        sx={{
          mt: 2,
          p: 2,
          border: "2px dashed grey",
          borderRadius: 2,
          height,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: disabled ? "none" : "auto",
        }}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {!disabled && (
          <input
            type="file"
            hidden
            id={name}
            accept={accept}
            multiple={multiple}
            onChange={handleChange}
            onClick={onInputClick}
          />
        )}
        <label htmlFor={name} style={{ cursor: "pointer" }}>
          <Box display="flex" alignItems="center" gap={1}>
            <AttachFileIcon sx={{ transform: "rotate(45deg)" }} />
            <Typography variant="body2">Kéo thả hoặc chọn file</Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            {totalSize}/{maxSize}
          </Typography>
        </label>

        <FilePreview
          files={imageFiles}
          type={currentInputType}
          openImageModal={openImageModal}
          handleRemoveFile={handleRemoveFile}
          selectedFile={selectedFile}
          openImage={openImage}
          closeImageModal={closeImageModal}
        />

        <ContentModal
          open={openImage}
          closeLabel="Exit"
          hideSubmit={true}
          hideCloseBtn={true}
          handleClose={closeImageModal}
          contentArea={
            selectedFile ? (
              <Box
                component={"img"}
                src={selectedFile.preview}
                alt={selectedFile.fileName}
                sx={{ width: "100%", height: "100%" }}
              />
            ) : (
              "None Image"
            )
          }
        />
      </Box>
    </Box>
  );
};
