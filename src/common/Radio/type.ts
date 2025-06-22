export interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}
export type RadioProps = {
  label: string;
  options: Option[];
  name: string;
  selectedValue: string;
  color?: "primary" | "secondary";
  onChange: (value: string) => void;
};
