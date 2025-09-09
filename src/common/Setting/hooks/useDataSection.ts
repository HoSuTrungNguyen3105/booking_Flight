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
          type:
            // fieldConfigs["name"]?.overrideType ??
            FieldType.INPUT_WITH_TYPE_TEXT,
          placeholder: "Nhập tên đăng nhập...",
          options: [],
          value: data.name,
        },
      },
      {
        // disabled: fieldConfigs["password"]?.disabled ?? isDisable ?? false,
        fields: {
          id: "password",
          label: "Mật khẩu",
          type:
            // fieldConfigs["password"]?.overrideType ??
            FieldType.INPUT_WITH_TYPE_PASSWORD,
          placeholder: "Nhập mật khẩu...",
          options: [],
          value: data.password,
        },
      },
      {
        // disabled: fieldConfigs["email"]?.disabled ?? isDisable ?? false,
        fields: {
          id: "email",
          label: "Email",
          type:
            // fieldConfigs["email"]?.overrideType ??
            FieldType.INPUT_WITH_TYPE_TEXT,
          placeholder: "Nhập email...",
          options: [],
          value: data.email,
        },
      },
      {
        // disabled: fieldConfigs["email"]?.disabled ?? isDisable ?? false,
        fields: {
          id: "rank",
          label: "Rank",
          type:
            // fieldConfigs["email"]?.overrideType ??
            FieldType.INPUT_WITH_TYPE_TEXT,
          placeholder: "Nhập email...",
          options: [],
          value: data.rank,
        },
      },
      // {
      //   // disabled: fieldConfigs["email"]?.disabled ?? isDisable ?? false,
      //   fields: {
      //     id: "mfaEnabledYn",
      //     label: "Mfa EnabledYn",
      //     type: FieldType.CHECKBOX_SELECT,
      //     placeholder: "EnabledYn",
      //     options: [],
      //     value: data.mfaEnabledYn,
      //     valueIncheckbox: [],
      //   },
      // },
      {
        // disabled: fieldConfigs["role"]?.disabled ?? isDisable ?? false,
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
