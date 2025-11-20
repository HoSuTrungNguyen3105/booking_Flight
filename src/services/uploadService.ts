import axiosInstance from "../utils/axiosInstance";

/**
 * Uploads a file to the backend.
 * @param file The file object to upload.
 * @returns The URL of the uploaded file.
 */
export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axiosInstance.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.url;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
