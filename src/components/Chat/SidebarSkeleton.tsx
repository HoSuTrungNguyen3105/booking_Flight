import { Skeleton, Box, Typography } from "@mui/material";
import { FaUser } from "react-icons/fa";

const SidebarSkeleton = () => {
  const skeletonContacts = Array.from({ length: 10 });

  return (
    <Box
      component="aside"
      sx={{
        height: "100%",
        // width: { xs: "80px", lg: "280px" },
        borderRight: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.2s",
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          width: "100%",
        }}
      >
        {skeletonContacts.map((_, idx) => (
          <Box
            key={idx}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 1.5,
            }}
          >
            {/* Avatar skeleton */}
            <Skeleton
              variant="circular"
              width={48}
              height={48}
              sx={{ mx: { xs: "auto", lg: 0 } }}
            />

            {/* User info skeleton - chỉ hiện ở lg */}
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                display: { xs: "none", lg: "block" },
              }}
            >
              <Skeleton variant="text" width={120} height={20} sx={{ mb: 1 }} />
              <Skeleton variant="text" width={60} height={16} />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SidebarSkeleton;
