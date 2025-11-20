import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { FileUpload } from "../../common/FileUploader";
import { uploadFile } from "../../services/uploadService";
import type { TFileUploader } from "../../common/FileUploader/type";
import axiosInstance from "../../utils/axiosInstance";

const CreateAircraftExample = () => {
  const [name, setName] = useState("");
  const [model, setModel] = useState("");
  const [files, setFiles] = useState<TFileUploader[]>([]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (files.length === 0) {
      setError("Please select an image");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // STEP 1: Upload the file first
      // This uses FormData internally in the service, but your component logic remains clean
      const fileToUpload = files[0].raw;
      const imageUrl = await uploadFile(fileToUpload);

      // STEP 2: Send the Data as JSON
      // Now you can use standard JSON, no FormData required for this part
      const payload = {
        name: name,
        model: model,
        imageAircraft: imageUrl, // Send the URL string
      };

      console.log("Sending JSON payload:", payload);

      await axiosInstance.post("/aircraft", payload);

      setSuccess(true);
      // Reset form
      setName("");
      setModel("");
      setFiles([]);
    } catch (err) {
      console.error(err);
      setError("Failed to create aircraft");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        maxWidth: 500,
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h5">Create Aircraft (JSON Flow)</Typography>

      <TextField
        label="Aircraft Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
      />

      <TextField
        label="Model"
        value={model}
        onChange={(e) => setModel(e.target.value)}
        fullWidth
      />

      <Typography variant="subtitle2">Aircraft Image</Typography>
      <FileUpload
        name="aircraft-image"
        value={files}
        onChange={(newFiles) => {
          if (Array.isArray(newFiles)) {
            setFiles(newFiles);
          } else {
            setFiles([newFiles]);
          }
        }}
        maxFiles={1}
        multiple={false}
        accept=".jpg,.png,.jpeg"
      />

      {error && <Alert severity="error">{error}</Alert>}
      {success && (
        <Alert severity="success">Aircraft created successfully!</Alert>
      )}

      <Button variant="contained" onClick={handleSubmit} disabled={loading}>
        {loading ? <CircularProgress size={24} /> : "Create Aircraft"}
      </Button>
    </Box>
  );
};

export default CreateAircraftExample;
