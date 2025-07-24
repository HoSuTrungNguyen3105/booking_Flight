import { Box, Button, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { ArrowBack } from "@mui/icons-material";
import type { TableInfoProps } from "./type";

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
            <Typography variant="body2">{description}</Typography>
          </Typography>

          <Grid container spacing={2} sx={{ p: "14px 16px", mb: 2 }}>
            {content.map((block, idx) => (
              <Grid
                size={block.gridSize ?? 3} // mặc định 3 khi không có
                key={idx}
              >
                <Box
                  sx={{
                    display: "flex",
                    width: "100%",
                  }}
                >
                  {block.hasLine && (
                    <Box
                      sx={{
                        width: "1px",
                        backgroundColor: "rgba(0,0,0,0.3)",
                        borderRadius: "2px",
                        mr: 1,
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
                    {[
                      block.content.content1,
                      block.content.content2,
                      block.content.content3,
                      block.content.content4,
                    ].map((val, i) => {
                      if (!val) return null;
                      // const label = block.contentLabels?.[i];
                      const label =
                        block.contentLabels?.[i] ||
                        block.descContent?.[
                          `content${i + 1}` as keyof typeof block.descContent
                        ];

                      // Nếu là string hoặc number thì bọc Typography
                      const isPrimitive =
                        typeof val === "string" || typeof val === "number";

                      return (
                        <Box
                          key={i}
                          mb={1}
                          display="flex"
                          alignItems="center"
                          gap={1}
                          flexWrap="wrap"
                        >
                          <Typography color="grey">
                            {block.bigContent}
                          </Typography>
                          {label && (
                            <Typography variant="body2" sx={{ minWidth: 20 }}>
                              {label}:
                            </Typography>
                          )}
                          {isPrimitive ? (
                            <Typography
                              variant="body2"
                              sx={getReviewStatusStyle?.(val as string)}
                            >
                              {val}
                            </Typography>
                          ) : (
                            val
                          )}
                        </Box>
                      );
                    })}

                    {/* 👉 hiển thị extraContent nếu có */}
                    {/* {block.extraContent && (
                      <Box mt={1}>
                        {Array.isArray(block.extraContent)
                          ? block.extraContent.map((el, i) => (
                              <Box key={i} mb={1}>
                                {el}
                              </Box>
                            ))
                          : block.extraContent}
                      </Box>
                    )} */}
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
