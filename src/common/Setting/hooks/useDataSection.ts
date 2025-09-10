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

type FieldConfig = {
  disabled?: boolean;
  hidden?: boolean;
  overrideType?: FieldType;
};

type FieldConfigs = Record<string, FieldConfig>;

export const useDataSection = (
  data: Partial<UseRCreate & UpdateUserForm>,
  formType?: "register" | "update",
  isDisable?: boolean,
  fieldConfigs: FieldConfigs = {}
): IFormField[] => {
  return useMemo(() => {
    const fields: IFormField[] = [
      {
        fields: {
          id: "name",
          label: "Tên đăng nhập",
          type: FieldType.INPUT_WITH_TYPE_TEXT,
          placeholder: "Nhập tên đăng nhập...",
          options: [],
          value: data.name,
        },
      },
      {
        fields: {
          id: "password",
          label: "Mật khẩu",
          type: FieldType.INPUT_WITH_TYPE_PASSWORD,
          placeholder: "Nhập mật khẩu...",
          options: [],
          value: data.password,
        },
      },
      {
        fields: {
          id: "email",
          label: "Email",
          type: FieldType.INPUT_WITH_TYPE_TEXT,
          placeholder: "Nhập email...",
          options: [],
          value: data.email,
        },
      },
      {
        fields: {
          id: "rank",
          label: "Rank",
          disabled: formType === "register",
          type: FieldType.INPUT_WITH_TYPE_TEXT,
          placeholder: "Nhập email...",
          options: [],
          value: data.rank,
        },
      },
      {
        fields: {
          id: "role",
          label: "Chọn vai trò",
          type: FieldType.DROPDOWN,
          placeholder: "Chọn vai trò...",
          options: [
            { label: "Thành viên", value: UserRole.USER },
            { label: "Monitor", value: UserRole.MONITOR },
            { label: "Quản trị", value: UserRole.ADMIN },
          ],
          value: data.role,
        },
      },
    ];

    return fields.filter((f) => !fieldConfigs[f.fields.id]?.hidden);
  }, [data, isDisable, fieldConfigs]);
};
