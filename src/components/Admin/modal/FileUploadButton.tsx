import { useState } from "react";
import {
  FileUploadButton,
  type FileUploadButtonProps,
} from "../../../common/FileUploader/FileUploadButton";

export const FileUploadButtonWithValidation = ({
  title,
  name,
  setValues,
  isSubmitting,
  accept = "image/*",
  maxSizeMB = 5,
}: FileUploadButtonProps) => {
  const [validationError, setValidationError] = useState("");

  const handleValidation = (file: File | null) => {
    if (!file) {
      setValidationError("Vui lòng chọn file");
      return false;
    }

    if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
      setValidationError(`File không được vượt quá ${maxSizeMB}MB`);
      return false;
    }

    if (accept && !file.type.match(accept.replace("*", ".*"))) {
      setValidationError("Loại file không được hỗ trợ");
      return false;
    }

    setValidationError("");
    return true;
  };

  const handleSetValues = (values: any) => {
    const file = values[name];
    if (handleValidation(file)) {
      setValues(values);
    }
  };

  return (
    <FileUploadButton
      title={title}
      name={name}
      setValues={handleSetValues}
      error={validationError}
      isSubmitting={isSubmitting}
      accept={accept}
      maxSizeMB={maxSizeMB}
    />
  );
};

export default FileUploadButtonWithValidation;
