// import zxcvbn from "zxcvbn";
// import { Controller, useForm } from "react-hook-form";
// import TextArea from "../../common/Input/TextArea";
// import { Typography } from "@mui/material";
// import { Dropdown } from "../../common/Dropdown/Dropdown";
// import type { DropdownOptions } from "../../common/Dropdown/type";
// import { toast } from "react-toastify";
// import { useAuth } from "../../context/AuthContext";
// import { useState } from "react";
// import InputField from "../../common/Input/InputField";

// type RegisterForm = {
//   username: string;
//   email: string;
//   password: string;
//   firstname: string;
//   lastname: string;
// };

// const Register = () => {
//   const [formData, setFormData] = useState<RegisterForm>({
//     username: "",
//     email: "",
//     password: "",
//     firstname: "",
//     lastname: "",
//   });

//   const { control } = useForm({
//     defaultValues: formData,
//   });

//   const { register } = useAuth();

//   const mailOption: DropdownOptions[] = [
//     { label: "Gmail", value: "gmail.com" },
//     { label: "Yahoo", value: "yahoo.com" },
//     { label: "Outlook", value: "outlook.com" },
//     { label: "Hotmail", value: "hotmail.com" },
//   ];

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       const result = await register(formData); // ✅ Gọi hàm register
//       //   if (result) {
//       //     toast.success("Vui lòng kiểm tra email để lấy mã xác thực!");
//       //     // setIsVerificationStep(true);
//       //   }
//     } catch (error) {
//       toast.error("Đã có lỗi xảy ra, vui lòng thử lại!");
//     }
//   };

//   const getPasswordStrength = (password: string): string => {
//     const { score } = zxcvbn(password);
//     switch (score) {
//       case 0:
//       case 1:
//         return "Very Weak";
//       case 2:
//         return "Weak";
//       case 3:
//         return "Strong";
//       case 4:
//         return "Very Strong";
//       default:
//         return "";
//     }
//   };

//   return (
//     <div>
//       <form className="infoForm authForm" onSubmit={handleSubmit}>
//         <h3 style={{ fontSize: "20px" }}>Đăng Ký</h3>

//         {/* Username */}
//         <div>
//           <input
//             type="text"
//             className="infoInput"
//             placeholder="Username"
//             value={formData.username}
//             onChange={(e) =>
//               setFormData({ ...formData, username: e.target.value })
//             }
//           />
//         </div>

//         {/* Email */}
//         <div>
//           <TextArea />
//           <Typography variant="caption" className="text-base-content/40">
//             @
//           </Typography>
//           <Controller
//             name="email"
//             control={control}
//             render={({ field }) => (
//               <Dropdown
//                 value={
//                   mailOption.find((opt) => opt.value === field.value) ??
//                   (field.value
//                     ? { label: field.value, value: field.value }
//                     : null)
//                 }
//                 onChange={(e, selected: any) => {
//                   const newValue = selected?.value ?? "";
//                   field.onChange(newValue);
//                 }}
//               />
//             )}
//           />
//         </div>

//         {/* First and Last Name */}
//         <div>
//           <input
//             type="text"
//             placeholder="First Name"
//             className="infoInput"
//             value={formData.firstname}
//             onChange={(e) =>
//               setFormData({ ...formData, firstname: e.target.value })
//             }
//           />
//           <input
//             type="text"
//             placeholder="Last Name"
//             className="infoInput"
//             value={formData.lastname}
//             onChange={(e) =>
//               setFormData({ ...formData, lastname: e.target.value })
//             }
//           />
//         </div>

//         {/* Password */}
//         <div>
//           <InputField
//             isPassword
//             placeholder="••••••••"
//             value={formData.password}
//             onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//               setFormData({ ...formData, password: e.target.value })
//             }
//           />

//           <p>Mật khẩu: {getPasswordStrength(formData.password)}</p>
//         </div>

//         {/* Submit Button */}
//         <button type="submit" className="btn btn-primary mt-4">
//           Đăng ký
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Register;

import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import "./index.scss";
interface FormDataType {
  // name?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  profileImage: File | null;
}

const Register = () => {
  const [formData, setFormData] = useState<FormDataType>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
  });

  const [passwordMatch, setPasswordMatch] = useState(true);
  const navigate = useNavigate();

  const handleImageChange = useCallback((e: any) => {
    const files = Array.from(e.target.files);
    Promise.all(
      files.map((file: any) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      })
    ).then((image: FormDataType) => {
      setFormData((prev) => ({
        ...prev,
        image: [...prev.image, ...image],
      }));
    });
  }, []);

  const handleRemoveImage = (indexToRemove: any) => {
    setFormData((prevState) => ({
      ...prevState,
      image: prevState.image.filter((_, index) => index !== indexToRemove),
    }));
  };

  // Xử lý thay đổi form
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "profileImage" ? (files ? files[0] : null) : value,
    }));
  };

  // Kiểm tra khớp mật khẩu
  useEffect(() => {
    setPasswordMatch(
      formData.password === formData.confirmPassword ||
        formData.confirmPassword === ""
    );
  }, [formData.password, formData.confirmPassword]);

  // Gửi form
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const register_form = new FormData();
      for (const key in formData) {
        const value = formData[key as keyof FormDataType];
        if (value !== null) {
          register_form.append(key, value);
        }
      }

      const response = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        body: register_form,
      });

      if (response.ok) {
        navigate("/login");
      } else {
        console.error("Registration failed with status", response.status);
      }
    } catch (err: any) {
      console.error("Registration failed", err.message);
    }
  };

  return (
    <div className="register">
      <div className="register_content">
        <form className="register_content_form" onSubmit={handleSubmit}>
          <input
            placeholder="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            required
          />
          <input
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            type="password"
            required
          />

          {!passwordMatch && (
            <p style={{ color: "red" }}>Passwords are not matched!</p>
          )}

          <input
            id="image"
            type="file"
            name="profileImage"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleChange}
            required
          />
          <label htmlFor="image">
            <img src="/assets/addImage.png" alt="add profile photo" />
            <p>Upload Your Photo</p>
          </label>

          {formData.profileImage && (
            <img
              src={URL.createObjectURL(formData.profileImage)}
              alt="profile photo"
              style={{ maxWidth: "80px" }}
            />
          )}
          <button type="submit" disabled={!passwordMatch}>
            REGISTER
          </button>
        </form>
        <a href="/login">Already have an account? Log In Here</a>
      </div>
    </div>
  );
};

export default Register;
