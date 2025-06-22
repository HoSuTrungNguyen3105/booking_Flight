import zxcvbn from "zxcvbn";
import { Controller, useForm } from "react-hook-form";
import TextArea from "../../common/Input/TextArea";
import { Typography } from "@mui/material";
import { Dropdown } from "../../common/Dropdown/Dropdown";
import type { DropdownOptions } from "../../common/Dropdown/type";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import InputField from "../../common/Input/InputField";

type RegisterForm = {
  username: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
};

const Register = () => {
  const [formData, setFormData] = useState<RegisterForm>({
    username: "",
    email: "",
    password: "",
    firstname: "",
    lastname: "",
  });

  const { control } = useForm({
    defaultValues: formData,
  });

  const { register } = useAuth();

  const mailOption: DropdownOptions[] = [
    { label: "Gmail", value: "gmail.com" },
    { label: "Yahoo", value: "yahoo.com" },
    { label: "Outlook", value: "outlook.com" },
    { label: "Hotmail", value: "hotmail.com" },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await register(formData); // ✅ Gọi hàm register
      //   if (result) {
      //     toast.success("Vui lòng kiểm tra email để lấy mã xác thực!");
      //     // setIsVerificationStep(true);
      //   }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const getPasswordStrength = (password: string): string => {
    const { score } = zxcvbn(password);
    switch (score) {
      case 0:
      case 1:
        return "Very Weak";
      case 2:
        return "Weak";
      case 3:
        return "Strong";
      case 4:
        return "Very Strong";
      default:
        return "";
    }
  };

  return (
    <div>
      <form className="infoForm authForm" onSubmit={handleSubmit}>
        <h3 style={{ fontSize: "20px" }}>Đăng Ký</h3>

        {/* Username */}
        <div>
          <input
            type="text"
            className="infoInput"
            placeholder="Username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
        </div>

        {/* Email */}
        <div>
          <TextArea />
          <Typography variant="caption" className="text-base-content/40">
            @
          </Typography>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Dropdown
                value={
                  mailOption.find((opt) => opt.value === field.value) ??
                  (field.value
                    ? { label: field.value, value: field.value }
                    : null)
                }
                onChange={(e, selected: any) => {
                  const newValue = selected?.value ?? "";
                  field.onChange(newValue);
                }}
              />
            )}
          />
        </div>

        {/* First and Last Name */}
        <div>
          <input
            type="text"
            placeholder="First Name"
            className="infoInput"
            value={formData.firstname}
            onChange={(e) =>
              setFormData({ ...formData, firstname: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Last Name"
            className="infoInput"
            value={formData.lastname}
            onChange={(e) =>
              setFormData({ ...formData, lastname: e.target.value })
            }
          />
        </div>

        {/* Password */}
        <div>
          <InputField
            isPassword
            placeholder="••••••••"
            value={formData.password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <p>Mật khẩu: {getPasswordStrength(formData.password)}</p>
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary mt-4">
          Đăng ký
        </button>
      </form>
    </div>
  );
};

export default Register;
