import { useMemo } from "react";
import {
  UserRole,
  type UseRCreate,
  type UserData,
  type UserRoleType,
} from "../../../utils/type";
import { FieldType, type IFormField } from "../../CustomRender/FieldRenderer";
// interface UserDetail {
//   name?: string;
//   password?: string;
//   email?: string;
//   //   firstname?: string;
//   //   lastname?: string;
//   //   pictureUrl?: string;
//   //   rank?: string;
//   role?: UserRoleType;
// }
// export interface UpdateUserForm {
//   firstname?: string;
//   lastname?: string;
//   pictureUrl?: string;
//   rank?: string;
//   role?: UserRoleType;
//   password?: string;
//   name?: string;
//   userAlias?: string;
//   mfaEnabledYn?: string;
// }
export const useDataSection = (data: UseRCreate): IFormField[] => {
  return useMemo(
    () =>
      [
        {
          id: "name",
          label: "Tên đăng nhập",
          type: FieldType.INPUT_WITH_TYPE_TEXT,
          placeholder: "Nhập tên đăng nhập...",
          options: [],
          value: data.name,
          //   onChange: (val) =>
          //     setFormData((prev) => ({ ...prev, userName: val })),
        },
        {
          id: "password",
          label: "Mật khẩu",
          type: FieldType.INPUT_WITH_TYPE_PASSWORD,
          placeholder: "Nhập mật khẩu...",
          options: [],
          value: data.password,
          // onChange: () => {},
        },
        {
          id: "email",
          label: "Email",
          type: FieldType.INPUT_WITH_TYPE_TEXT,
          placeholder: "Nhập email đăng nhập...",
          options: [],
          value: data.email,
          //   onChange: (val) =>
          //     setFormData((prev) => ({ ...prev, userName: val })),
        },
        {
          id: "role",
          label: "Chọn vai trò",
          type: FieldType.DROPDOWN,
          placeholder: "Chọn vai trò...",
          options: [
            { label: "Thành viên", value: UserRole.MEMBER },
            { label: "Quản trị", value: UserRole.ADMIN },
          ],
          value: data.role,
          //   onChange: (val) => setFormData((prev) => ({ ...prev, role: val })),
        },
        // {
        //   id: "addDress",
        //   label: "Địa chỉ",
        //   type: FieldType.INPUT_WITH_TYPE_TEXT,
        //   placeholder: "Nhập địa chỉ...",
        //   options: [],
        //   value: data.userAlias,
        //   //   onChange: (val) =>
        //   //     setFormData((prev) => ({ ...prev, addDress: val })),
        // },
        // {
        //   id: "permissionRole",
        //   label: "Chọn quyền",
        //   type: FieldType.INPUT_WITH_TYPE_TEXT,
        //   placeholder: "Chọn quyền...",
        //   //   options: [
        //   //     { label: "Lựa chọn 1", value: "option1" },
        //   //     { label: "Lựa chọn 2", value: "option2" },
        //   //   ],
        //   value: data.mfaEnabledYn,
        //   //   onChange: (val) =>
        //   //     setFormData((prev) => ({ ...prev, permissionRole: val })),
        // },
      ] as IFormField[],
    [data]
  );
};
