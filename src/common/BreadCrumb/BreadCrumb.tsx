import type { BreadcrumbItem } from "./type";
interface CustomBreadCrumb {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
}
const BreadCrumb: React.FC<CustomBreadCrumb> = ({ items, separator = "/" }) => {
  return (
    <nav aria-label="breadcrumb">
      <ol style={{ display: "flex", listStyle: "none", padding: 0 }}>
        {items.map((item, index) => (
          <li key={index} style={{ display: "flex", alignItems: "center" }}>
            {item.icon && <span style={{ marginRight: 4 }}>{item.icon}</span>}
            {item.href ? (
              <a
                href={item.href}
                style={{ textDecoration: "none", color: "#007bff" }}
              >
                {item.label}
              </a>
            ) : (
              <span>{item.label}</span>
            )}
            {index < items.length - 1 && (
              <span style={{ margin: "0 8px" }}>{separator}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadCrumb;
