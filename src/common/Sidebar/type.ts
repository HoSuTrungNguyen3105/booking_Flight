import type { ReactNode } from "react";

export type TSidebarItemType = "link" | "button" | "submenu";

export type TSidebarSubItem = {
  subItems: TSidebarSubItem[];
  id: string;
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

export type TSidebarItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  type: TSidebarItemType;
  onClick?: () => void;
  link?: string;
  subItems?: TSidebarSubItem[];
  disabled?: boolean;
};

export type TSidebarProps = {
  items: TSidebarItem[];
  position?: "left" | "right";
  width?: string;
  open?: boolean;
  onClose?: () => void;
  className?: string;
  backgroundColor?: string;
  iconColor?: string;
  showCollapseButton?: boolean;
  onCollapse?: () => void;
  status?: "default" | "active" | "inactive";
};
