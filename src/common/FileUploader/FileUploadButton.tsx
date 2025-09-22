import { Box, Button, Typography, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import { styled } from "@mui/material/styles";

export interface FileUploadButtonProps {
  title: string;
  name: string;
  setValues: (data: any) => void;
  error?: any;
  isSubmitting?: boolean;
  accept?: string;
  maxSizeMB?: number;
  initialPreviewUrl?: string;
}

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
  error,
  name,
  setValues,
  isSubmitting = false,
  accept = "image/*",
  maxSizeMB = 5,
  initialPreviewUrl = "",
}: FileUploadButtonProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(initialPreviewUrl);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files ? e.target.files[0] : null;
    setErrorMessage("");

    if (!newFile) return;

    // Kiểm tra kích thước file
    if (maxSizeMB && newFile.size > maxSizeMB * 1024 * 1024) {
      setErrorMessage(`File vượt quá kích thước cho phép (${maxSizeMB}MB)`);
      return;
    }

    // Kiểm tra loại file
    if (accept && !newFile.type.match(accept.replace("*", ".*"))) {
      setErrorMessage("Loại file không được hỗ trợ");
      return;
    }

    setFile(newFile);

    // Tạo URL preview cho ảnh
    if (newFile.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(newFile);
      setPreviewUrl(objectUrl);
    } else {
      setPreviewUrl("");
    }

    // Cập nhật values
    setValues((prev: any) => ({
      ...prev,
      [name]: newFile,
    }));
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewUrl(initialPreviewUrl);

    // Xóa file khỏi form values
    setValues((prev: any) => ({
      ...prev,
      [name]: null,
    }));

    // Giải phóng URL object nếu có
    if (previewUrl && previewUrl !== initialPreviewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  useEffect(() => {
    if (isSubmitting) {
      setFile(null);
      // Giải phóng URL object khi submit
      if (previewUrl && previewUrl !== initialPreviewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(initialPreviewUrl);
    }
  }, [isSubmitting, initialPreviewUrl]);

  useEffect(() => {
    // Cleanup URL object khi component unmount
    return () => {
      if (previewUrl && previewUrl !== initialPreviewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, initialPreviewUrl]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}
      >
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
          sx={{ minWidth: 200 }}
        >
          {title}
          <VisuallyHiddenInput
            type="file"
            name={name}
            onChange={handleFileChange}
            accept={accept}
            onClick={(event) => ((event.target as HTMLInputElement).value = "")}
          />
        </Button>

        {file && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="body2"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <ImageIcon fontSize="small" />
              {file.name}
            </Typography>
            <IconButton
              size="small"
              onClick={handleRemoveFile}
              color="error"
              title="Xóa file"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* Hiển thị preview ảnh */}
      {previewUrl && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Preview:
          </Typography>
          <PreviewImage
            src={previewUrl}
            alt="Preview"
            onError={() => setPreviewUrl("")}
          />
        </Box>
      )}

      {/* Hiển thị thông tin file */}
      {file && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Kích thước: {(file.size / 1024 / 1024).toFixed(2)} MB
          </Typography>
          <br />
          <Typography variant="caption" color="text.secondary">
            Loại: {file.type}
          </Typography>
        </Box>
      )}

      {/* Hiển thị lỗi */}
      {errorMessage && (
        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
          {errorMessage}
        </Typography>
      )}

      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};
