import {
  Box,
  Button,
  Typography,
  IconButton,
  LinearProgress,
  Chip,
  Alert,
} from "@mui/material";
import { useEffect, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import DescriptionIcon from "@mui/icons-material/Description";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import { styled } from "@mui/material/styles";

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

const UploadProgressContainer = styled(Box)({
  width: "100%",
  marginTop: 8,
});

// Types
export interface TFileUploader {
  id: string;
  preview: string;
  raw: File;
  size: number;
  name: string;
  type: string;
  fileName: string;
  uploadStatus?: "pending" | "uploading" | "success" | "error";
  serverResponse?: any;
  error?: string;
  url?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface FileUploaderProps {
  name?: string;
  onChange?: (files: TFileUploader[]) => void;
  onFilesUploaded?: (uploadedFiles: TFileUploader[]) => void;
  accept?: string;
  maxSize?: string;
  maxFiles?: number;
  hidePreview?: boolean;
  disabled?: boolean;
  width?: string;
  height?: string;
  multiple?: boolean;
  value?: TFileUploader[];
}

interface EmailAttachmentUploaderProps extends FileUploaderProps {
  title: string;
  uploadUrl: string;
  emailData?: {
    toList: string[];
    ccList?: string[];
    bccList?: string[];
    subject: string;
    text: string;
    html?: string;
  };
  onUploadSuccess?: (response: any, files: TFileUploader[]) => void;
  onUploadError?: (error: any, files: TFileUploader[]) => void;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  autoUpload?: boolean;
}

// Utility functions
export const sizeToBytes = (sizeStr: string): number => {
  const units: { [key: string]: number } = {
    B: 1,
    KB: 1024,
    MB: 1024 * 1024,
    GB: 1024 * 1024 * 1024,
  };

  const match = sizeStr.match(/^(\d+(?:\.\d+)?)\s*([KMG]?B)$/i);
  if (!match) return 5 * 1024 * 1024; // default 5MB

  const value = parseFloat(match[1]);
  const unit = match[2].toUpperCase();

  return value * (units[unit] || units["MB"]);
};

export const getFileInformation = (
  filename: string
): { type: string; extension: string } => {
  const extension = filename.split(".").pop()?.toLowerCase() || "";
  const typeMap: { [key: string]: string } = {
    jpg: "image",
    jpeg: "image",
    png: "image",
    gif: "image",
    bmp: "image",
    webp: "image",
    pdf: "pdf",
    doc: "document",
    docx: "document",
    txt: "text",
    xls: "spreadsheet",
    xlsx: "spreadsheet",
    ppt: "presentation",
    pptx: "presentation",
    zip: "archive",
    rar: "archive",
  };

  return {
    type: typeMap[extension] || "file",
    extension,
  };
};

export const concatStrings = (
  separator: string,
  ...strings: string[]
): string => {
  return strings.filter((str) => str).join(separator);
};

export const EmailAttachmentUploader = ({
  title,
  name,
  onChange,
  onFilesUploaded,
  accept = "image/*,application/pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.zip,.rar",
  maxSize = "10 MB",
  maxFiles = 10,
  hidePreview = false,
  disabled = false,
  multiple = true,
  value = [],
  uploadUrl,
  emailData,
  onUploadSuccess,
  onUploadError,
  headers = {},
  withCredentials = false,
  autoUpload = true,
}: EmailAttachmentUploaderProps) => {
  const [files, setFiles] = useState<TFileUploader[]>(value ?? []);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<
    Record<string, UploadProgress>
  >({});
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Validate files on initial load
  useEffect(() => {
    if (value && value.length > 0) {
      const validatedFiles = value.map((file) => ({
        ...file,
        preview:
          file.preview ||
          (file.type?.startsWith("image/") ? file.url || "" : ""),
      }));
      setFiles(validatedFiles);
    }
  }, [value]);

  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    const maxSizeBytes = sizeToBytes(maxSize);
    const acceptTypes = accept.split(",").map((t) => t.trim().toLowerCase());

    if (file.size > maxSizeBytes) {
      return {
        isValid: false,
        error: `File "${file.name}" exceeds maximum size of ${maxSize}`,
      };
    }

    const { type: fileType, extension } = getFileInformation(file.name);
    const validExt = concatStrings(".", extension);

    if (
      accept !== "*/*" &&
      !acceptTypes.some((acceptType) => {
        // Check MIME type
        if (file.type && acceptType.includes("/")) {
          return file.type.includes(acceptType.replace("*", ""));
        }
        // Check file extension
        return validExt === acceptType || `.${fileType}` === acceptType;
      })
    ) {
      return {
        isValid: false,
        error: `File "${file.name}" is not in accepted format. Accepted: ${accept}`,
      };
    }

    return { isValid: true };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files ? Array.from(e.target.files) : [];
    if (!newFiles.length) return;

    setErrorMessage("");

    // Check max files limit
    if (multiple && maxFiles > 0 && files.length + newFiles.length > maxFiles) {
      setErrorMessage(`Maximum ${maxFiles} files allowed`);
      e.target.value = "";
      return;
    }

    const validated: TFileUploader[] = [];
    const errors: string[] = [];

    for (const file of newFiles) {
      const validation = validateFile(file);

      if (!validation.isValid) {
        errors.push(validation.error!);
        continue;
      }

      validated.push({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : "",
        raw: file,
        size: file.size,
        name: file.name,
        type: file.type,
        fileName: file.name,
        uploadStatus: "pending",
      });
    }

    if (errors.length > 0) {
      setErrorMessage(errors.join(", "));
    }

    if (validated.length > 0) {
      const updated = multiple ? [...files, ...validated] : validated;
      setFiles(updated);
      onChange?.(updated);

      // Auto-upload if enabled and uploadUrl is provided
      if (autoUpload && uploadUrl) {
        uploadFiles(validated);
      }
    }

    e.target.value = ""; // reset input
  };

  const uploadFiles = async (filesToUpload: TFileUploader[]) => {
    if (!uploadUrl) {
      console.error("Upload URL is required");
      return;
    }

    if (!emailData) {
      console.error("Email data is required for upload");
      setErrorMessage("Email configuration is missing");
      return;
    }

    setIsUploading(true);
    setErrorMessage("");

    try {
      const formData = new FormData();

      // Append email data
      formData.append("toList", JSON.stringify(emailData.toList));
      formData.append("subject", emailData.subject);
      formData.append("text", emailData.text);

      if (emailData.ccList) {
        formData.append("ccList", JSON.stringify(emailData.ccList));
      }

      if (emailData.bccList) {
        formData.append("bccList", JSON.stringify(emailData.bccList));
      }

      if (emailData.html) {
        formData.append("html", emailData.html);
      }

      // Append files - NestJS AnyFilesInterceptor expects multiple files with the same field name
      filesToUpload.forEach((file) => {
        formData.append("files", file.raw); // Use 'files' field for multiple files
      });

      const xhr = new XMLHttpRequest();

      // Track upload progress for all files
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;

          // Update progress for all files being uploaded
          const newProgress: Record<string, UploadProgress> = {};
          filesToUpload.forEach((file) => {
            newProgress[file.id] = {
              loaded: event.loaded,
              total: event.total,
              percentage: progress,
            };
          });
          setUploadProgress((prev) => ({ ...prev, ...newProgress }));
        }
      });

      // Update all files status to uploading
      setFiles((prev) =>
        prev.map((f) =>
          filesToUpload.some((uploadFile) => uploadFile.id === f.id)
            ? { ...f, uploadStatus: "uploading" }
            : f
        )
      );

      // const response = await new Promise((resolve, reject) => {
      //   xhr.onreadystatechange = () => {
      //     if (xhr.readyState === 4) {
      //       if (xhr.status >= 200 && xhr.status < 300) {
      //         let responseData;
      //         try {
      //           responseData = JSON.parse(xhr.responseText);
      //         } catch {
      //           responseData = xhr.responseText;
      //         }
      //         resolve(responseData);
      //       } else {
      //         reject(
      //           new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`)
      //         );
      //       }
      //     }
      //   };

      //   xhr.open("POST", uploadUrl);

      //   // Set headers
      //   Object.entries(headers).forEach(([key, value]) => {
      //     xhr.setRequestHeader(key, value);
      //   });

      //   xhr.withCredentials = withCredentials;
      //   xhr.send(formData);
      // });

      setFiles((prev) =>
        prev.map((f) =>
          filesToUpload.some((uploadFile) => uploadFile.id === f.id)
            ? { ...f, uploadStatus: "success" }
            : f
        )
      );

      onFilesUploaded?.(filesToUpload);
    } catch (error) {
      console.error("Upload failed:", error);

      setFiles((prev) =>
        prev.map((f) =>
          filesToUpload.some((uploadFile) => uploadFile.id === f.id)
            ? {
                ...f,
                uploadStatus: "error",
                error: error instanceof Error ? error.message : "Upload failed",
              }
            : f
        )
      );

      setErrorMessage(error instanceof Error ? error.message : "Upload failed");
      onUploadError?.(error, filesToUpload);
    } finally {
      setIsUploading(false);

      // Clear progress after a delay
      setTimeout(() => {
        setUploadProgress((prev) => {
          const newProgress = { ...prev };
          filesToUpload.forEach((file) => {
            delete newProgress[file.id];
          });
          return newProgress;
        });
      }, 2000);
    }
  };

  const handleRemoveFile = (index: number) => {
    const fileToRemove = files[index];

    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }

    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);

    // Remove from progress tracking
    if (fileToRemove.id) {
      setUploadProgress((prev) => {
        const newProgress = { ...prev };
        delete newProgress[fileToRemove.id];
        return newProgress;
      });
    }

    onChange?.(updated);
  };

  const handleManualUpload = () => {
    const pendingFiles = files.filter(
      (file) => file.uploadStatus === "pending" || !file.uploadStatus
    );
    if (pendingFiles.length > 0 && uploadUrl && emailData) {
      uploadFiles(pendingFiles);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <ImageIcon fontSize="small" />;
    if (fileType === "application/pdf")
      return <DescriptionIcon fontSize="small" />;
    return <InsertDriveFileIcon fontSize="small" />;
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "success":
        return "success";
      case "error":
        return "error";
      case "uploading":
        return "primary";
      default:
        return "default";
    }
  };

  const hasPendingFiles = files.some(
    (file) => file.uploadStatus === "pending" || !file.uploadStatus
  );
  const allFilesUploaded =
    files.length > 0 && files.every((file) => file.uploadStatus === "success");

  useEffect(() => {
    return () => {
      files.forEach((f) => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });
    };
  }, [files]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Upload Controls */}
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}
      >
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          disabled={disabled || isUploading}
          sx={{ minWidth: 200 }}
        >
          {isUploading ? "Uploading..." : title}
          <VisuallyHiddenInput
            type="file"
            name={name}
            onChange={handleFileChange}
            accept={accept}
            multiple={multiple}
            disabled={disabled || isUploading}
          />
        </Button>

        {/* Manual upload button for non-auto upload mode */}
        {!autoUpload && hasPendingFiles && uploadUrl && (
          <Button
            variant="outlined"
            startIcon={<AttachEmailIcon />}
            onClick={handleManualUpload}
            disabled={isUploading || !emailData}
          >
            Send with Attachments
          </Button>
        )}

        {/* File count indicator */}
        {maxFiles > 0 && (
          <Typography variant="body2" color="text.secondary">
            {files.length} / {maxFiles} files
          </Typography>
        )}
      </Box>

      {/* Success Alert */}
      {allFilesUploaded && (
        <Alert severity="success" sx={{ mt: 1 }}>
          All files have been uploaded successfully and are ready to be sent
          with the email.
        </Alert>
      )}

      {/* File list */}
      {files.map((file, index) => (
        <Box
          key={file.id}
          sx={{
            mt: 1,
            p: 2,
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}
            >
              {getFileIcon(file.type)}
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography variant="body2" noWrap title={file.name}>
                  {file.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {/* Upload status chip */}
              {file.uploadStatus && (
                <Chip
                  label={file.uploadStatus}
                  size="small"
                  color={getStatusColor(file.uploadStatus) as any}
                  variant="outlined"
                />
              )}

              <IconButton
                size="small"
                onClick={() => handleRemoveFile(index)}
                color="error"
                title="Remove file"
                disabled={file.uploadStatus === "uploading"}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Upload progress */}
          {uploadProgress[file.id] && (
            <UploadProgressContainer>
              <LinearProgress
                variant="determinate"
                value={uploadProgress[file.id].percentage}
                color={file.uploadStatus === "error" ? "error" : "primary"}
              />
              <Typography variant="caption" color="text.secondary">
                {Math.round(uploadProgress[file.id].percentage)}%
              </Typography>
            </UploadProgressContainer>
          )}

          {/* Error message for individual file */}
          {file.error && (
            <Typography
              variant="caption"
              color="error"
              sx={{ mt: 0.5, display: "block" }}
            >
              {file.error}
            </Typography>
          )}

          {/* Image preview */}
          {!hidePreview && file.preview && (
            <Box sx={{ mt: 1 }}>
              <PreviewImage
                src={file.preview}
                alt={`Preview of ${file.name}`}
              />
            </Box>
          )}
        </Box>
      ))}

      {/* Global error message */}
      {errorMessage && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {errorMessage}
        </Alert>
      )}

      {/* Helper text */}
      <Typography variant="caption" color="text.secondary">
        Accepted formats: {accept} | Max size: {maxSize}{" "}
        {maxFiles > 0 ? `| Max files: ${maxFiles}` : ""}
      </Typography>
    </Box>
  );
};
