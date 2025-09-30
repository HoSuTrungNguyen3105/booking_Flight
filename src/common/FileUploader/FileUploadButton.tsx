import { Box, Button, Typography, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import { styled } from "@mui/material/styles";

import {
  type FileUploaderProps,
  type TFileUploader,
  sizeToBytes,
  getFileInformation,
  concatStrings,
} from "./type";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const PreviewImage = styled("img")({
  maxWidth: "100%",
  maxHeight: 200,
  borderRadius: 8,
  objectFit: "cover",
  border: "2px solid #e0e0e0",
});

export const FileUploadButton = ({
  title,
  name,
  onChange,
  accept = "image/*",
  maxSize = "5 MB",
  maxFiles = 1,
  hidePreview = false,
  disabled = false,
  width = "200px",
  height = "200px",
  multiple = false,
  value = [],
}: FileUploaderProps & { title: string }) => {
  const [files, setFiles] = useState<TFileUploader[]>(value ?? []);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files ? Array.from(e.target.files) : [];
    if (!newFiles.length) return;

    const maxSizeBytes = sizeToBytes(maxSize);
    const acceptTypes = accept.split(",").map((t) => t.trim().toLowerCase());

    const validated: TFileUploader[] = [];

    for (const file of newFiles) {
      if (file.size > maxSizeBytes) {
        setErrorMessage(`File "${file.name}" vượt quá ${maxSize}`);
        continue;
      }

      const { type } = getFileInformation(file.name);
      const validExt = concatStrings(".", type);
      if (
        accept !== "*/*" &&
        !acceptTypes.some((t) => file.type.includes(t) || validExt === t)
      ) {
        setErrorMessage(`File "${file.name}" không đúng định dạng`);
        continue;
      }

      validated.push({
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : "",
        raw: file,
        size: file.size,
        name: file.name,
        type: file.type,
        fileName: file.name,
      });
    }

    if (validated.length) {
      const updated = multiple ? [...files, ...validated] : validated;
      setFiles(updated);
      setErrorMessage("");
      onChange?.(updated);
    }

    e.target.value = ""; // reset input
  };

  const handleRemoveFile = (index: number) => {
    const updated = [...files];
    const removed = updated.splice(index, 1)[0];
    if (removed?.preview) {
      URL.revokeObjectURL(removed.preview);
    }
    setFiles(updated);
    onChange?.(updated);
  };

  useEffect(() => {
    return () => {
      files.forEach((f) => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });
    };
  }, [files]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}
      >
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          disabled={disabled}
          sx={{ minWidth: 200 }}
        >
          {title}
          <VisuallyHiddenInput
            type="file"
            name={name}
            onChange={handleFileChange}
            accept={accept}
            multiple={multiple}
          />
        </Button>
      </Box>

      {/* Hiển thị danh sách file */}
      {files.map((file, index) => (
        <Box key={index} sx={{ mt: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="body2"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <ImageIcon fontSize="small" />
              {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </Typography>
            <IconButton
              size="small"
              onClick={() => handleRemoveFile(index)}
              color="error"
              title="Xóa file"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>

          {file.preview && (
            <Box sx={{ mt: 1 }}>
              <PreviewImage src={file.preview} alt="Preview" />
            </Box>
          )}
        </Box>
      ))}

      {/* Hiển thị lỗi */}
      {errorMessage && (
        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
          {errorMessage}
        </Typography>
      )}
    </Box>
  );
};
