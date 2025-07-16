import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import type { ResponseMessage } from "./type";

export class ErrorHandlerUtils {
  handleError = (error: ResponseMessage, message?: string) => {
    console.error(error);
    if (isAxiosError(error) && error.resultCode === "09") {
      toast.error("Vui lòng xác thực email trước khi sử dụng chức năng này");
      return;
    }
    if (message) {
      toast.error(message);
      return;
    }
    message = "Đã có lỗi xảy ra";
    if (isAxiosError(error)) {
      message = error.response?.data.message || error.message;
    }
    if (typeof error === "string") {
      message = error;
    }
    toast.error(message);
  };
}
