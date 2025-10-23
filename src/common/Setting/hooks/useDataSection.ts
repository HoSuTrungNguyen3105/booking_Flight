import { useMemo } from "react";
import { UserRole, type UserRoleType } from "../../../utils/type";
import { FieldType, type IFormField } from "../../CustomRender/FieldRenderer";
import {
  mapStringToDropdown,
  useFindAllDepartments,
  useFindAllEmployeeStatuses,
  useFindAllPositions,
  useFindAllRoles,
} from "../../../context/Api/useGetApi";

export type UserFormConfig = {
  id?: number;
  email: string;
  name?: string;
  role: UserRoleType;
  password?: string;
  employeeNo?: string;
  department?: string;
  position?: string;
  baseSalary?: number;
  status?: string;
};

export const useDataSection = (
  data: Partial<UserFormConfig>,
  formType?: "register" | "update"
  // isDisable = false
): IFormField[] => {
  const { dataRoles } = useFindAllRoles();
  const { dataEmployeeStatuses } = useFindAllEmployeeStatuses();
  const { dataDepartments } = useFindAllDepartments();
  const { dataPositions } = useFindAllPositions();

  const departmentOptions = mapStringToDropdown(dataDepartments?.data || []);

  const positionOptions = mapStringToDropdown(dataPositions?.data || []);

  const statusOptions = mapStringToDropdown(dataEmployeeStatuses?.data || []);
  const roleOptions = useMemo(
    () => mapStringToDropdown(dataRoles?.data || []),
    [dataRoles]
  );

  return useMemo(() => {
    const isUpdate = formType === "update";

    const commonDisabled = isUpdate;

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
        visible: isUpdate,
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
          },
        ],
      },
      {
        label: "employeeNo",
        fields: [
          {
            id: "employeeNo",
            type: FieldType.INPUT_WITH_TYPE_TEXT,
            placeholder: "Nhập employeeNo...",
            value: data.employeeNo ?? "",
            options: [],
          },
        ],
      },
      {
        visible: !isUpdate,
        label: "Department",
        fields: [
          {
            id: "department",
            type: FieldType.DROPDOWN,
            placeholder: "Chọn phòng ban...",
            options: departmentOptions,
            value: data.department ?? "",
          },
        ],
      },
      // thêm mới phần Position
      {
        visible: !isUpdate,
        label: "Position",
        fields: [
          {
            id: "position",
            type: FieldType.DROPDOWN,
            placeholder: "Chọn chức vụ...",
            options: positionOptions,
            value: data.position ?? "",
          },
        ],
      },
      // thêm mới phần BaseSalary
      {
        visible: !isUpdate,
        label: "Base Salary",
        fields: [
          {
            id: "baseSalary",
            type: FieldType.INPUT_WITH_NUMBER,
            placeholder: "Nhập lương cơ bản...",
            value: data.baseSalary ?? 0,
            options: [],
          },
        ],
      },
      // thêm mới phần Status
      {
        visible: !isUpdate,
        label: "Status",
        fields: [
          {
            id: "status",
            type: FieldType.DROPDOWN,
            placeholder: "Chọn trạng thái...",
            options: statusOptions,
            value: data.status ?? "",
          },
        ],
      },
    ];

    return fields;
  }, [data, formType, roleOptions]);
};
