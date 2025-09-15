import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Checkbox } from "../Checkbox/Checkbox";

export type TInfoTableTemp = {
  [key: string]: any;
};
export type HeaderColumn = {
  label: string;
  required?: boolean;
  width?: number | string;
  minWidth?: number | string;
};
export interface InputTableProps<T extends TInfoTableTemp> {
  headersColumn: HeaderColumn[];
  children: React.ReactNode;
  hasCheckbox?: boolean;
  isSelectedAll?: boolean;
  handleSelectAll?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  data?: T;
}

export const InputTableWrapperCustom = <T extends TInfoTableTemp>({
  headersColumn,
  children,
  hasCheckbox = true,
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
          {headersColumn.map(({ label, width, minWidth }) => (
            <TableCell
              key={label}
              sx={{ minWidth, width }}
              style={{ flexShrink: 0, marginTop: "-4px" }}
            >
              {t(label)}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>{children}</TableBody>
    </Table>
  );
};
