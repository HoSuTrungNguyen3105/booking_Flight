import { useMemo } from "react";
import { UserRole, type UserRoleType } from "../../../utils/type";
import { FieldType, type IFormField } from "../../CustomRender/FieldRenderer";
import {
  mapStringToDropdown,
  useFindAllRoles,
} from "../../../components/Api/useGetApi";

export type UserFormConfig = {
  email: string;
  name?: string;
  role: UserRoleType;
  password?: string;
};

export const useDataSection = (
  data: Partial<UserFormConfig>,
  formType?: "register" | "update",
  isDisable = false
): IFormField[] => {
  return useMemo(() => {
    const isUpdate = formType === "update";
    const { dataRoles } = useFindAllRoles();
    const roleOptions = mapStringToDropdown(dataRoles?.data || []);
    const commonDisabled = isUpdate || isDisable;

    const fields: IFormField[] = [
      {
        label: "Tên đăng nhập",
        fields: [
          {
            id: "name",
            options: [],
            readOnly: commonDisabled,
            type: FieldType.INPUT_WITH_TYPE_TEXT,
            placeholder: "Nhập tên đăng nhập...",
            value: data.name ?? "",
            disabled: commonDisabled,
          },
        ],
      },
      {
        label: "Mật khẩu",
        fields: [
          {
            id: "password",
            options: [],
            readOnly: true,
            type: FieldType.INPUT_WITH_TYPE_PASSWORD,
            placeholder: "Nhập mật khẩu...",
            value: data.password ?? "",
            disabled: commonDisabled,
          },
        ],
      },
      {
        label: "Email",
        fields: [
          {
            id: "email",
            options: [],
            readOnly: commonDisabled,
            type: FieldType.INPUT_WITH_TYPE_TEXT,
            placeholder: "Nhập email...",
            value: data.email ?? "",
            disabled: commonDisabled,
          },
        ],
      },
      {
        label: "Role",
        fields: [
          {
            id: "role",
            type: FieldType.DROPDOWN,
            placeholder: "Chọn vai trò...",
            options: roleOptions,
            value: data.role ?? UserRole.USER,
            disabled: isDisable, // riêng role chỉ disable khi isDisable true
          },
        ],
      },
    ];

    return fields;
  }, [data, formType, isDisable]);
};
