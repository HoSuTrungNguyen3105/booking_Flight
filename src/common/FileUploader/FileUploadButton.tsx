import { Box, Button, Typography, LinearProgress, Alert } from "@mui/material";
import { useEffect, useState } from "react";
import { FileUpload } from "./index";
import { type TFileUploader, INPUT_TYPE } from "./type";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import type { SendCcBccDto } from "../../context/Api/UserApi";

// Extended type to include upload status
export interface ExtendedFileUploader extends TFileUploader {
  id: string;
  uploadStatus?: "pending" | "uploading" | "success" | "error";
  error?: string;
  url?: string;
}

export interface FileUploaderProps {
  name?: string;
  onChange?: (files: ExtendedFileUploader[]) => void;
  onFilesUploaded?: (uploadedFiles: ExtendedFileUploader[]) => void;
  accept?: string;
  maxSize?: string;
  maxFiles?: number;
  hidePreview?: boolean;
  disabled?: boolean;
  width?: string;
  height?: string;
  multiple?: boolean;
  value?: ExtendedFileUploader[];
}

interface EmailAttachmentUploaderProps extends FileUploaderProps {
  title: string;
  uploadUrl: string;
  emailData?: SendCcBccDto;
  onUploadSuccess?: (response: any, files: ExtendedFileUploader[]) => void;
  onUploadError?: (error: any, files: ExtendedFileUploader[]) => void;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  autoUpload?: boolean;
}

export const EmailAttachmentUploader = ({
  title,
  name,
  onChange,
  onFilesUploaded,
  accept = ".jpg,.jpeg,.png,.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.zip,.rar",
  maxSize = "10 MB",
  maxFiles = 10,
  disabled = false,
  multiple = true,
  value = [],
  uploadUrl,
  emailData,
  onUploadError,
  onUploadSuccess,
  autoUpload = true,
  headers = {},
  withCredentials = false,
}: EmailAttachmentUploaderProps) => {
  const [files, setFiles] = useState<ExtendedFileUploader[]>(value ?? []);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<
    Record<string, { loaded: number; total: number; percentage: number }>
  >({});
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Sync internal state with prop value if needed
  useEffect(() => {
    if (value !== files) {
      // logic to sync if needed, but avoiding loops
    }
  }, [value]);

  const handleFileChange = (newFiles: TFileUploader[]) => {
    setErrorMessage("");

    const updatedFiles: ExtendedFileUploader[] = newFiles.map((newFile) => {
      const existing = files.find(
        (f) =>
          f.name === newFile.name &&
          f.size === newFile.size &&
          f.type === newFile.type
      );

      if (existing) {
        return existing;
      }

      return {
        ...newFile,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        uploadStatus: "pending",
      };
    });

    setFiles(updatedFiles);
    onChange?.(updatedFiles);

    if (autoUpload && uploadUrl) {
      const pendingFiles = updatedFiles.filter(
        (f) => f.uploadStatus === "pending"
      );
      if (pendingFiles.length > 0) {
        uploadFiles(pendingFiles);
      }
    }
  };

  const uploadFiles = async (filesToUpload: ExtendedFileUploader[]) => {
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

      filesToUpload.forEach((file) => {
        formData.append("files", file.raw);
      });

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          const newProgress: Record<string, any> = {};
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

      setFiles((prev) =>
        prev.map((f) =>
          filesToUpload.some((uploadFile) => uploadFile.id === f.id)
            ? { ...f, uploadStatus: "uploading" }
            : f
        )
      );

      const response = await new Promise((resolve, reject) => {
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
              let responseData;
              try {
                responseData = JSON.parse(xhr.responseText);
              } catch {
                responseData = xhr.responseText;
              }
              resolve(responseData);
            } else {
              reject(
                new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`)
              );
            }
          }
        };

        xhr.open("POST", uploadUrl);
        Object.entries(headers).forEach(([key, value]) => {
          xhr.setRequestHeader(key, value);
        });
        xhr.withCredentials = withCredentials;
        xhr.send(formData);
      });

      setFiles((prev) =>
        prev.map((f) =>
          filesToUpload.some((uploadFile) => uploadFile.id === f.id)
            ? { ...f, uploadStatus: "success" }
            : f
        )
      );

      onFilesUploaded?.(filesToUpload);
      if (onUploadSuccess) {
        onUploadSuccess(response, filesToUpload);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      const msg = error instanceof Error ? error.message : "Upload failed";
      setErrorMessage(msg);

      setFiles((prev) =>
        prev.map((f) =>
          filesToUpload.some((uploadFile) => uploadFile.id === f.id)
            ? { ...f, uploadStatus: "error", error: msg }
            : f
        )
      );

      onUploadError?.(error, filesToUpload);
    } finally {
      setIsUploading(false);
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

  const handleManualUpload = () => {
    const pendingFiles = files.filter(
      (file) => file.uploadStatus === "pending" || !file.uploadStatus
    );
    if (pendingFiles.length > 0 && uploadUrl && emailData) {
      uploadFiles(pendingFiles);
    }
  };

  const isAnyUploading = files.some((f) => f.uploadStatus === "uploading");
  const hasPending = files.some((f) => f.uploadStatus === "pending");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="subtitle2" fontWeight="bold">
        {title}
      </Typography>

      <FileUpload
        name={name || "file-upload"}
        accept={accept}
        maxSize={maxSize}
        maxFiles={maxFiles}
        multiple={multiple}
        disabled={disabled || isUploading}
        value={files}
        onChange={handleFileChange}
        inputType={INPUT_TYPE.THUMBNAIL}
      />

      {isAnyUploading && (
        <Box sx={{ mt: 1 }}>
          {files
            .filter((f) => f.uploadStatus === "uploading")
            .map((f) => (
              <Box key={f.id} sx={{ mb: 1 }}>
                <Typography variant="caption">{f.name}</Typography>
                <LinearProgress
                  variant="determinate"
                  value={uploadProgress[f.id]?.percentage || 0}
                />
              </Box>
            ))}
        </Box>
      )}

      {!autoUpload && hasPending && (
        <Button
          variant="contained"
          startIcon={<AttachEmailIcon />}
          onClick={handleManualUpload}
          disabled={isUploading || !emailData}
          sx={{ mt: 1, alignSelf: "flex-start" }}
        >
          Send with Attachments
        </Button>
      )}

      {errorMessage && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {errorMessage}
        </Alert>
      )}
    </Box>
  );
};
