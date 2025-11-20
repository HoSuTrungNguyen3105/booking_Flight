import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { FileUpload } from "../../common/FileUploader";
import { uploadFile } from "../../services/uploadService";
import type { TFileUploader } from "../../common/FileUploader/type";

const UploadExample = () => {
  const [files, setFiles] = useState<TFileUploader[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setError(null);
    setUploadedUrl(null);

    try {
      // Assuming single file upload for this example
      const fileToUpload = files[0].raw;
      if (!fileToUpload) {
        throw new Error("No raw file found");
      }

      const url = await uploadFile(fileToUpload);
      setUploadedUrl(url);
      console.log("Uploaded URL:", url);
    } catch (err) {
      setError("Failed to upload file. Please check the backend connection.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        Cloudinary Upload Example
      </Typography>

      <FileUpload
        name="example-upload"
        value={files}
        onChange={(newFiles) => {
          // Ensure newFiles is treated as an array
          if (Array.isArray(newFiles)) {
            setFiles(newFiles);
          } else {
            // If it's a single object (depending on implementation), wrap it
            setFiles([newFiles]);
          }
        }}
        maxFiles={1}
        multiple={false}
        accept=".jpg,.png,.jpeg"
      />

      <Box sx={{ mt: 2, display: "flex", gap: 2, alignItems: "center" }}>
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={files.length === 0 || uploading}
        >
          {uploading ? "Uploading..." : "Upload to Cloudinary"}
        </Button>
        {uploading && <CircularProgress size={24} />}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {uploadedUrl && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Upload Successful! <br />
          <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">
            View Image
          </a>
        </Alert>
      )}
    </Box>
  );
};

export default UploadExample;
