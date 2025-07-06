import type { ReactNode } from "react";

export interface CategoryType {
  img?: string;
  label?: string;
  icon?: ReactNode;
  description?: string;
}

export const categories: CategoryType[] = [
  {
    img: "assets/beach_cat.jpg",
    label: "All",
  },
  {
    img: "assets/beach_cat.jpg",
    label: "Beachfront",
    description: "This property is close to the beach!",
  },
  {
    img: "assets/windmill_cat.webp",
    label: "Windmills",
    // icon: <GiWindmill />,
    description: "This property has windmills!",
  },
  {
    img: "assets/modern_cat.webp",
    label: "Iconic cities",
    // icon: <TbBuildingSkyscraper />,
    description: "Located in famous iconic cities!",
  },
];
