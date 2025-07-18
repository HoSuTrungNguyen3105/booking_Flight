import { Box, Button, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { ArrowBack } from "@mui/icons-material";

type ChildContent = {
  content1: string;
  content2?: string;
  content3?: string;
  content4?: string;
};

type ContentBlock = {
  descContent?: ChildContent;
  content: ChildContent;
  contentLabels?: string[]; // 👉 Mỗi label ứng với content1 -> content4
  getReviewStatusStyle?: (status: string) => React.CSSProperties;
  hasLine?: boolean;
  highlight?: boolean;
  color?: string;
};

type TableInfoProps = {
  title: string;
  description: string;
  content: ContentBlock[];
  buttonLabel?: string;
  buttonOnChange?: () => void;
  getReviewStatusStyle?: (status: string) => React.CSSProperties;
};

const TableInfo = ({
  title,
  description,
  content,
  buttonLabel,
  buttonOnChange,
  getReviewStatusStyle,
}: TableInfoProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const changedTabRef = useRef<number>(0);

  const returnPreviousPage = () => {
    if (unsavedChanges) {
      changedTabRef.current = activeTab;
    } else {
      navigate(-1);
    }
  };

  return (
    <Box gap="8px">
      {/* Header */}
      <Box sx={{ padding: "1px", border: `1px solid grey` }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", padding: "3px", alignItems: "center" }}>
            <ArrowBack onClick={returnPreviousPage} />
            <Typography variant="body1" sx={{ ml: 1 }}>
              {title}
            </Typography>
          </Box>

          {buttonLabel && buttonOnChange && (
            <Button onClick={buttonOnChange} variant="contained">
              <Typography variant="button">{buttonLabel}</Typography>
            </Button>
          )}
        </Box>

        {/* Content */}
        <Box
          sx={{
            paddingBottom: "8px",
            border: `1px solid white`,
            backgroundColor: "white",
          }}
        >
          <Typography variant="caption" padding={2}>
            Details
          </Typography>

          <Grid container spacing={2} sx={{ p: "14px 16px", mb: 2 }}>
            {content.map((block, idx) => (
              <Grid size={3} key={idx}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  {block.hasLine && (
                    <Box
                      sx={{
                        width: "2px",
                        backgroundColor: "rgba(0,0,0,0.3)",
                        borderRadius: "2px",
                        mr: 2,
                      }}
                    />
                  )}
                  <Box
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      backgroundColor: block.highlight
                        ? "#fff9c4"
                        : block.color ?? "transparent",
                      borderRadius: "8px",
                      p: 1,
                    }}
                  >
                    {block.descContent && (
                      <Box mb={1}>
                        <Typography variant="body2" color="grey.600">
                          {block.descContent.content1}
                        </Typography>
                        {block.descContent.content2 && (
                          <Typography variant="body2" color="grey.600">
                            {block.descContent.content2}
                          </Typography>
                        )}
                      </Box>
                    )}

                    {/* {[
                      block.content.content1,
                      block.content.content2,
                      block.content.content3,
                      block.content.content4,
                    ]
                      .filter(Boolean)
                      .map((val, i) => (
                        <Typography
                          key={i}
                          variant="body2"
                          sx={getReviewStatusStyle?.(val || "")}
                        >
                          {val}
                        </Typography>
                      ))} */}
                    {[
                      block.content.content1,
                      block.content.content2,
                      block.content.content3,
                      block.content.content4,
                    ].map((val, i) => {
                      if (!val) return null;
                      const label = block.contentLabels?.[i];
                      return (
                        <Typography
                          key={i}
                          variant="body2"
                          sx={getReviewStatusStyle?.(val)}
                        >
                          {label ? <strong>{label}:</strong> : null} {val}
                        </Typography>
                      );
                    })}
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default TableInfo;
