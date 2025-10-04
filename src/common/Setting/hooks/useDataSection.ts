import { useMemo } from "react";
import { UserRole, type UserRoleType } from "../../../utils/type";
import { FieldType, type IFormField } from "../../CustomRender/FieldRenderer";

export type UseRCreate = {
  email: string;
  name?: string;
  role?: UserRoleType;
  password: string;
};

export type UpdateUserForm = {
  pictureUrl?: string;
  rank?: string;
  role?: UserRoleType;
  name?: string;
  userAlias?: string;
};

const roleOptions = [
  { label: "Thành viên", value: UserRole.USER },
  { label: "Monitor", value: UserRole.MONITOR },
  { label: "Quản trị", value: UserRole.ADMIN },
];

export const useDataSection = (
  data: Partial<UseRCreate & UpdateUserForm>,
  formType?: "register" | "update",
  isDisable = false
): IFormField[] => {
  return useMemo(() => {
    const isUpdate = formType === "update";
    const commonDisabled = isUpdate || isDisable;

    const fields: IFormField[] = [
      {
        fields: {
          id: "name",
          label: "Tên đăng nhập",
          options: [],
          readOnly: commonDisabled,
          type: FieldType.INPUT_WITH_TYPE_TEXT,
          placeholder: "Nhập tên đăng nhập...",
          value: data.name ?? "",
          disabled: commonDisabled,
        },
      },
      {
        fields: {
          id: "password",
          label: "Mật khẩu",
          options: [],
          readOnly: true,
          type: FieldType.INPUT_WITH_TYPE_PASSWORD,
          placeholder: "Nhập mật khẩu...",
          value: data.password ?? "",
          disabled: commonDisabled,
        },
      },
      {
        fields: {
          id: "email",
          label: "Email",
          options: [],
          readOnly: commonDisabled,
          type: FieldType.INPUT_WITH_TYPE_TEXT,
          placeholder: "Nhập email...",
          value: data.email ?? "",
          disabled: commonDisabled,
        },
      },
      {
        fields: {
          id: "role",
          type: FieldType.DROPDOWN,
          placeholder: "Chọn vai trò...",
          options: roleOptions,
          value: data.role ?? UserRole.USER,
          disabled: isDisable, // riêng role chỉ disable khi isDisable true
        },
      },
    ];

    return fields;
  }, [data, formType, isDisable]);
};
