import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Box,
  Breadcrumbs,
  Collapse,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import ArrowForwardIosTwoToneIcon from "@mui/icons-material/ArrowForwardIosTwoTone";
export interface MenuData {
  label: string;
  url?: string;
}

interface BreadcrumbProps {
  data: MenuData[];
  maxLength?: number;
  limitWidth?: number;
}

const Breadcrumb = ({ data, limitWidth, maxLength = 4 }: BreadcrumbProps) => {
  const [open, setOpen] = useState(false);
  const collapseRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<any>(null);
  const maxWidth = `${limitWidth}px`;

  const dataBreadcrumbs: ReactNode[] = data.map(({ label }) => {
    return (
      <Typography
        key={label}
        color="text.primary"
        className="breadcrumb-item-typography"
        maxWidth={maxWidth}
        title={label}
      >
        {label}
      </Typography>
    );
  });

  const renderCollapse = () => {
    const menuDataCollapse = [];
    if (data.length > maxLength) {
      for (let index = 1; index < data.length - (maxLength - 2); index++) {
        const element = data[index];
        menuDataCollapse.push(element);
      }
    }
    return menuDataCollapse;
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      collapseRef.current &&
      !collapseRef.current.contains(event.target as Node) &&
      event.target !== moreRef.current
    ) {
      setOpen(false);
    }
  };

  useEffect(() => {
    const element = document.querySelector(".MuiBreadcrumbs-ol li button");
    if (element) {
      const elementMore = document.createElement("a");
      elementMore.innerText = "...";
      elementMore.classList.add("text-more");
      element?.replaceWith(elementMore);
      moreRef.current = elementMore;
      elementMore.addEventListener("click", () => {
        setOpen((pre) => !pre);
      });
    }
  }, [open]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <Box sx={{ position: "relative" }}>
      <Breadcrumbs
        separator={<ArrowForwardIosTwoToneIcon />}
        maxItems={maxLength}
        itemsAfterCollapse={maxLength - 2}
        className="breadcrumb-root"
      >
        {dataBreadcrumbs}
      </Breadcrumbs>

      {renderCollapse().length > 0 && (
        <Collapse
          in={open}
          timeout="auto"
          unmountOnExit
          className="breadcrumb-collapse"
          ref={collapseRef}
        >
          <List>
            {renderCollapse().map(({ label, url }) => (
              <ListItem key={label}>
                <Link to={url || ""} className="breadcrumb-collapse-link">
                  {label}
                </Link>
              </ListItem>
            ))}
          </List>
        </Collapse>
      )}
    </Box>
  );
};

export default Breadcrumb;
