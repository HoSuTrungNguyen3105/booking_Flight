import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
// import RequiredIcon from "../../svgs/add-svg.svg";
// import { Table } from "react-bootstrap"; // 2.7k (gzipped: 1.3k)
import { useTranslation } from "react-i18next"; // 5.3k (gzipped: 2.3k)
import { Checkbox } from "../Checkbox/Checkbox";

export type TInfoTableTemp = {
  [key: string]: any;
};
export type HeaderColumn = {
  label: string; // key để dùng với i18next
  required?: boolean; // có hiển thị RequiredIcon hay không
  width?: number | string;
  minWidth?: number | string;
};
export interface InputTableProps<T extends TInfoTableTemp> {
  headersColumn: HeaderColumn[]; // danh sách các cột
  children: React.ReactNode; // nội dung của tbody
  hasCheckbox?: boolean; // có hiện checkbox chọn tất cả không
  hiddenRequired?: boolean; // ẩn biểu tượng bắt buộc hay không
  isSelectedAll?: boolean; // trạng thái đã chọn hết
  handleSelectAll?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputTableWrapperCustom = <T extends TInfoTableTemp>({
  headersColumn,
  children,
  hasCheckbox = true,
  hiddenRequired = false,
  isSelectedAll,
  handleSelectAll,
}: InputTableProps<T>) => {
  const { t } = useTranslation();
  return (
    <Table>
      <TableHead>
        <TableRow>
          {hasCheckbox && (
            <TableCell sx={{ width: 51 }}>
              <Checkbox checked={isSelectedAll} onChange={handleSelectAll} />
            </TableCell>
          )}
          {headersColumn.map(({ label, required, width, minWidth }, i) => (
            <TableCell
              key={label}
              sx={{ minWidth, width }}
              style={{ flexShrink: 0, marginTop: "-4px" }}
            >
              {/* {required && !hiddenRequired && <RequiredIcon />} */}
              {t(label)}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>{children}</TableBody>
    </Table>
  );
};
