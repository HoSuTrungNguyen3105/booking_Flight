import {
  useCallback,
  useEffect,
  useState,
  useMemo,
  type ChangeEvent,
  type ChangeEventHandler,
  type DragEvent,
  type DragEventHandler,
  type FC,
  type MouseEventHandler,
} from "react";
import { sumBy, uniqueId } from "lodash";
import { INPUT_TYPE, type FileUploaderProps, type TFileUploader } from "./type";
import {
  bytesToSize,
  concatStrings,
  getFileInformation,
  sizeToBytes,
} from "../../utils";
import { Box, Button } from "@mui/material";
import { Image } from "@mui/icons-material";
import CancelIcon from "@mui/icons-material/Cancel";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import "./index.scss";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import { toast } from "react-toastify";
import ContentModal from "../Modal/ContentModal";
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
  hidePreview,
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
        toast.error("Max size exceeded");
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
        toast.error("Not a valid file");
        return false;
      }
      if (
        Array.isArray(imageFiles) &&
        files.length + imageFiles.length > maxFiles
      ) {
        toast.success("Maximum file limit reached");
        return false;
      }
      return true;
    },
    [imageFiles]
  );

  console.log("imageFiles", imageFiles);
  console.log("files");

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
      // preview: URL.createObjectURL(file),
      // raw: file,
      // size: file.size,
      // name: getFileInformation(file.name).name,
      // type: getFileInformation(file.name).type,
      // fileName: handleDuplicateName(imageFiles, newFile, file, multiple),
      raw: file,
      preview: URL.createObjectURL(file),
      size: file.size,
      name: file.name,
      type: file.type,
      fileName: file.name,
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
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;
    if (!e.dataTransfer.files.length) return;

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
      // size: file.size,
      // name: getFileInformation(file.name).name,
      // type: getFileInformation(file.name).type,
      // fileName: handleDuplicateName(imageFiles, newFile, file, multiple),
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
      toast.warning("Can't choose file in read-only mode");
      event.preventDefault();
      return;
    }
    const element = event.target as HTMLInputElement;
    element.value = "";
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("png")) return <FilePresentIcon />;
    return <Image />;
  };

  return (
    <Box className="file-uploader-container">
      <section className="upload-image-container" style={{ width, height }}>
        <Button onClick={toggleInputType} data-testid="toggle-input-type">
          Switch:
          {currentInputType === INPUT_TYPE.INPUT
            ? INPUT_TYPE.THUMBNAIL
            : currentInputType === INPUT_TYPE.THUMBNAIL
            ? INPUT_TYPE.INPUT
            : INPUT_TYPE.READONLY}
        </Button>
        <Box
          className={`image-uploader ${
            imageFiles.length > 0 ? "upload-box active" : "upload box"
          }`}
          onDrop={handleDrop}
          onDragOver={(event) => event.preventDefault()}
          sx={{
            pointerEvents: disabled ? "none" : "pointer",
          }}
        >
          {!disabled && (
            <input
              type="file"
              hidden
              id={name}
              onChange={handleChange}
              onClick={onInputClick}
              accept={accept}
              multiple={multiple}
              data-testid="file-input"
            />
          )}
          <label className="mb-0" htmlFor={name}>
            <Box className="upload-info">
              <Box className="gap-[3px] flex items-center flex-grow">
                <AttachFileIcon
                  width={18}
                  height={19}
                  style={{ transform: "rotate(45deg)" }}
                />
                <label htmlFor={name}>Drag drop file here</label>
              </Box>
              <Box className="size">
                <span>{bytesToSize(totalSize)}</span>
                <span>/{maxSize}</span>
              </Box>
            </Box>
          </label>

          {Array.isArray(imageFiles) &&
          imageFiles.length > 0 &&
          !hidePreview ? (
            currentInputType === "input" ? (
              <Box className="container-img">
                {imageFiles.map((file, index) => (
                  <Box
                    data-testid="file-item-1"
                    key={index}
                    className="group-img"
                    sx={{
                      "&:hover": {
                        background: `url(${file.preview}), rgb(221, 224, 223)`,
                      },
                      background: `url(${file.preview}) 0% 0% / 100% 100% no-repeat`,
                    }}
                    onClick={() => openImageModal(file)}
                  >
                    <Box className="layout-img" />
                    <Box className="info-img">
                      <span className="size-img">{bytesToSize(file.size)}</span>
                      <Box className="detail-img">
                        <span>{file.name}</span>
                        <span>{file.type}</span>
                      </Box>
                    </Box>
                    <CancelIcon
                      onClick={(e) => {
                        e.stopPropagation(); // 👈 Ngăn không cho click ảnh
                        handleRemoveFile(index);
                      }}
                      sx={{ cursor: "pointer" }}
                      className="ic-delete"
                      width={16}
                      height={16}
                      data-testid={`remove-file-${index}`}
                    />
                  </Box>
                ))}
                <ContentModal
                  open={openImage}
                  closeLabel="Exit"
                  hideSubmit={true}
                  hideCloseBtn={true}
                  handleClose={closeImageModal}
                  contentArea={
                    selectedFile ? (
                      <Box>
                        <img
                          src={selectedFile.preview}
                          alt={selectedFile.fileName}
                          style={{ width: "100%", height: "100%" }}
                        />
                      </Box>
                    ) : null
                  }
                />
              </Box>
            ) : currentInputType === "thumbnails" ? (
              <Box>
                {imageFiles.map((file, index: number) => (
                  <Box
                    key={index}
                    className="group-file"
                    data-testid="file-item"
                    onClick={() => openImageModal(file)}
                  >
                    <Box className="name-file">
                      {getFileIcon(file.type)}
                      <span>{file.fileName}</span>
                    </Box>
                    <Box className="size-file">
                      <span>{bytesToSize(file.size)}</span>
                      <CancelIcon
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile(index);
                        }}
                        sx={{ cursor: "pointer" }}
                        width={16}
                        height={16}
                        data-testid={`remove-file-${index}`}
                      />
                    </Box>
                  </Box>
                ))}
                <ContentModal
                  open={openImage}
                  closeLabel="Exit"
                  hideSubmit={true}
                  handleClose={closeImageModal}
                  hideCloseBtn={true}
                  contentArea={
                    selectedFile ? (
                      <Box className="image-modal">
                        <img
                          src={selectedFile.preview}
                          alt={selectedFile.fileName}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </Box>
                    ) : null
                  }
                />
              </Box>
            ) : (
              <Box>
                {imageFiles.map((file, index) => (
                  <Box
                    key={index}
                    className="group-file"
                    data-testid="file-item-2"
                  >
                    <Box className="name-file">
                      <Image width={20} height={20} />
                      <span>{file.fileName}</span>
                    </Box>
                    <Box className="size-file">
                      <span>{bytesToSize(file.size)}</span>
                    </Box>
                  </Box>
                ))}
              </Box>
            )
          ) : null}
        </Box>
      </section>
    </Box>
  );
};
