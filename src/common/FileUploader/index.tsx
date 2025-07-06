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
  useRef,
} from "react";
import { sumBy, uniqueId } from "lodash";
import { INPUT_TYPE, type FileUploaderProps, type TFileUploader } from "./type";
import {
  bytesToSize,
  concatStrings,
  getFileInformation,
  sizeToBytes,
} from "../../utils";
import { Box } from "@mui/material";
import { Image } from "@mui/icons-material";
import CancelIcon from "@mui/icons-material/Cancel";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import "./index.scss";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import ContentModal from "../Modal/ContentModal";
import { Button } from "../Button/Button";
import { useToast } from "../../context/ToastContext";
import { styled } from "@mui/material/styles";

type MediaItem = {
  link: string;
  type: "youtube" | "facebook";
  thumbnail: string;
};
const MAX_IMAGE_COUNT = 5;

export const FileUpload: FC<FileUploaderProps> = ({
  width = "100%",
  height = "auto",
  accept = ".jpg,.png",
  maxSize = "10 MB",
  inputType = "thumbnails",
  name,
  value,
  onChange,
  maxFiles = MAX_IMAGE_COUNT,
  multiple = true,
  hidePreview,
  disabled = false,
}) => {
  const [imageFiles, setImageFiles] = useState<TFileUploader[]>(value || []);
  const [currentInputType, setCurrentInputType] = useState(inputType);
  const [openImage, setOpenImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState<TFileUploader | null>(null);
  const [mediaLinks, setMediaLinks] = useState<MediaItem[]>([]);

  useEffect(() => {
    const savedLinks = localStorage.getItem("mediaLinks");
    if (savedLinks) {
      setMediaLinks(JSON.parse(savedLinks));
    }
  }, []);

  const toast = useToast();
  const getYouTubeVideoId = (url: string): string => {
    const match = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([0-9A-Za-z_-]{11})/
    );
    return match?.[1] || "";
  };

  const handleAddLink = (link: string) => {
    const currentCount = mediaLinks.length;

    if (currentCount >= MAX_IMAGE_COUNT) {
      toast(`Chỉ được upload tối đa ${MAX_IMAGE_COUNT} ảnh.`, "error");
      return;
    }

    const isYouTube = isYouTubeLink(link);
    const isFacebook = isFacebookLink(link);

    if (!isYouTube && !isFacebook) {
      toast("Chỉ hỗ trợ link Facebook hoặc YouTube", "error");
      return;
    }

    let newItem: MediaItem | null = null;

    if (isYouTube) {
      const videoId = getYouTubeVideoId(link);
      if (!videoId) {
        toast("Link YouTube không hợp lệ", "error");
        return;
      }

      newItem = {
        link,
        type: "youtube",
        thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      };
    }

    if (isFacebook) {
      newItem = {
        link,
        type: "facebook",
        thumbnail: "/fb-placeholder.jpg",
      };
    }

    if (newItem) {
      const updated = [...mediaLinks, newItem];
      setMediaLinks(updated);
      localStorage.setItem("mediaLinks", JSON.stringify(updated));
    }
  };

  const handleRemoveLink = (index: number) => {
    const updatedLinks = [...mediaLinks];
    updatedLinks.splice(index, 1); // xoá phần tử ở vị trí index

    setMediaLinks(updatedLinks);
    localStorage.setItem("mediaLinks", JSON.stringify(updatedLinks));
  };

  const linkInputRef = useRef<HTMLInputElement | null>(null);
  console.log(linkInputRef);
  const [_, setIsDragging] = useState(false);
  useEffect(() => {
    setImageFiles(value || []);
  }, [value]);

  const toggleInputType = () => {
    setCurrentInputType((prev) => {
      if (prev === "input") return "thumbnails";
      if (prev === "thumbnails") return "read-only";
      return "input";
    });
  };
  const isYouTubeLink = (url: string) =>
    /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(url);

  const isFacebookLink = (url: string) =>
    /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.watch)\//.test(url);

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
        toast("Max size exceeded", "error");
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
        toast("Not a valid file");
        return false;
      }
      if (
        Array.isArray(imageFiles) &&
        files.length + imageFiles.length > maxFiles
      ) {
        toast("Maximum file limit reached");
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

  const handleChange: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files?.length) return;
    const newFile: File[] = Array.from(event.target.files);
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
  const StyledInput = styled("input")({
    flex: 1,
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  });

  const closeImageModal = () => {
    setOpenImage(false);
    setSelectedFile(null);
  };
  const handleDrop: DragEventHandler<HTMLDivElement> = (
    event: DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    if (disabled) return;
    if (!event.dataTransfer.files.length) return;

    const newFile: File[] = Array.from(event.dataTransfer.files);
    const isValid = validateFiles(newFile);
    if (!isValid) return;

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
      toast("Can't choose file in read-only mode", "info");
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
        <Button
          label={`Switch: ${
            currentInputType === INPUT_TYPE.INPUT
              ? INPUT_TYPE.THUMBNAIL
              : currentInputType === INPUT_TYPE.THUMBNAIL
              ? INPUT_TYPE.INPUT
              : INPUT_TYPE.READONLY
          }`}
          size="large"
          onClick={toggleInputType}
        />
        <Box display="flex" gap={1} mt={2}>
          <StyledInput
            ref={linkInputRef}
            placeholder="Paste YouTube/Facebook link"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const link = linkInputRef.current?.value || "";
                handleAddLink(link);
                linkInputRef.current!.value = "";
              }
            }}
            disabled={disabled}
          />
        </Box>
        {mediaLinks.length > 0 && (
          <Box
            sx={{
              display: "flex",
              padding: "1px",
              justifyContent: "start",
            }}
            mt={2}
            display="flex"
            flexDirection="row"
            flexWrap="wrap"
            gap={2}
          >
            {mediaLinks.map((item, i) => (
              <Box key={i}>
                <img
                  src={item.thumbnail}
                  alt={`media-${i}`}
                  style={{
                    width: 120,
                    height: 90,
                    objectFit: "cover",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                  onClick={() => window.open(item.link, "_blank")}
                />
                <button onClick={() => handleRemoveLink(i)}>Xoá</button>
              </Box>
            ))}
          </Box>
        )}
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
                    key={uniqueId()}
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
                      <Box
                        component={"img"}
                        src={selectedFile.preview}
                        alt={selectedFile.fileName}
                        style={{ width: "100%", height: "100%" }}
                      >
                        {/* <img
                          src={selectedFile.preview}
                          alt={selectedFile.fileName}
                          style={{ width: "100%", height: "100%" }}
                        /> */}
                      </Box>
                    ) : null
                  }
                />
              </Box>
            ) : currentInputType === "thumbnails" ? (
              <Box>
                {imageFiles.map((file, index: number) => (
                  <Box
                    key={uniqueId()}
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

                      {/* Bao CancelIcon trong 1 Box để chặn truyền sự kiện */}
                      <Box
                        onClick={(e) => {
                          e.stopPropagation(); // ⛔ chặn click lên cha
                          handleRemoveFile(index);
                        }}
                        sx={{ cursor: "pointer", ml: 1 }} // thêm margin nếu cần
                        data-testid={`remove-file-${index}`}
                      >
                        <CancelIcon sx={{ width: 16, height: 16 }} />
                      </Box>
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
                {imageFiles.map((file) => (
                  <Box
                    key={uniqueId()}
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
