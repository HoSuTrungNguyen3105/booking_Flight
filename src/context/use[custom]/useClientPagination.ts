import type { GridSortDirection, GridSortModel } from "@mui/x-data-grid";
import { useCallback, useMemo, useState } from "react";

interface IUseClientPaginationProps<T> {
  data: T[];
  initialPageSize?: number;
  initialSortField?: string;
  initialSortDirection?: GridSortDirection;
}
interface IUseClientPaginationReturn<T> {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  paginatedData: T[];
  sortModel: GridSortModel;
  onSortModelChange: (model: GridSortModel) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
}

const useClientPagination = <T>({
  data = [],
  initialPageSize = 10,
  initialSortField = "",
  initialSortDirection,
}: IUseClientPaginationProps<T>): IUseClientPaginationReturn<T> => {
  // Internal state uses 0-based index
  const [internalPage, setInternalPage] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: initialSortField, sort: initialSortDirection },
  ]);
  //   initialSortField
  //     ? [{ field: initialSortField, sort: initialSortDirection }]
  //     : []
  // );

  const sortedData = useMemo(() => {
    if (!sortModel || sortModel.length === 0) return data;

    return [...data].sort((a, b) => {
      const { field, sort } = sortModel[0];
      if (!sort) return 0;

      const aValue = a[field as keyof T];
      const bValue = b[field as keyof T];

      if (sort === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    });
  }, [data, sortModel]);

  // Calculate total pages
  const totalPages = useMemo(
    () => Math.ceil(sortedData.length / pageSize) || 1,
    [sortedData.length, pageSize]
  );

  // Ensure current page is within bounds when data or page size changes
  useMemo(() => {
    if (internalPage >= totalPages) {
      setInternalPage(Math.max(0, totalPages - 1));
    }
  }, [totalPages, internalPage]);

  // Get paginated data (still uses 0-based indexing internally)
  const paginatedData = useMemo(() => {
    const startIndex = internalPage * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, internalPage, pageSize]);

  // Page change handlers (accepts 1-based index from UI, converts to 0-based for internal use)
  const onPageChange = useCallback(
    (page: number) => {
      // Convert 1-based to 0-based
      const zeroBasedPage = page - 1;
      const newPage = Math.max(0, Math.min(zeroBasedPage, totalPages - 1));
      setInternalPage(newPage);
    },
    [totalPages]
  );

  const onPageSizeChange = useCallback(
    (newPageSize: number) => {
      setPageSize(newPageSize);
      // Adjust current page to maintain approximate position
      const firstItemIndex = internalPage * pageSize;
      const newPage = Math.floor(firstItemIndex / newPageSize);
      setInternalPage(
        Math.min(newPage, Math.ceil(sortedData.length / newPageSize) - 1)
      );
    },
    [internalPage, sortedData.length, pageSize]
  );

  const goToNextPage = useCallback(() => {
    setInternalPage((prev) => Math.min(prev + 1, totalPages - 1));
  }, [totalPages]);

  const goToPreviousPage = useCallback(() => {
    setInternalPage((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToFirstPage = useCallback(() => {
    setInternalPage(0);
  }, []);

  const goToLastPage = useCallback(() => {
    setInternalPage(totalPages - 1);
  }, [totalPages]);

  const onSortModelChange = useCallback((model: GridSortModel) => {
    setSortModel(model);
  }, []);

  return {
    currentPage: internalPage + 1, // UI uses 1-based index
    pageSize,
    totalPages,
    totalElements: sortedData.length,
    paginatedData,
    sortModel,
    onSortModelChange,
    onPageChange,
    onPageSizeChange,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
  };
};

export default useClientPagination;
