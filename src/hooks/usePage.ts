import { useState, useCallback } from 'react';
import type { TablePaginationConfig } from 'antd/es/table';

interface UsePageOptions {
  initialPage?: number;
  initialPageSize?: number;
}

interface UsePageReturn {
  currentPage: number;
  pageSize: number;
  total: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setTotal: (total: number) => void;
  handlePageChange: (pagination: TablePaginationConfig) => void;
  resetPagination: () => void;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    showSizeChanger: boolean;
    showTotal: (total: number) => string;
  };
}

/**
 * 分页管理 Hook
 * @param options 配置选项
 * @returns 分页状态和方法
 */
const usePage = (options: UsePageOptions = {}): UsePageReturn => {
  const { initialPage = 1, initialPageSize = 10 } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [total, setTotal] = useState(0);

  // 处理分页变化
  const handlePageChange = useCallback((pagination: TablePaginationConfig) => {
    setCurrentPage(pagination.current || 1);
    setPageSize(pagination.pageSize || initialPageSize);
  }, [initialPageSize]);

  // 重置分页到第一页
  const resetPagination = useCallback(() => {
    setCurrentPage(initialPage);
    setPageSize(initialPageSize);
  }, [initialPage, initialPageSize]);

  // 分页配置对象，可直接用于 Ant Design Table
  const pagination = {
    current: currentPage,
    pageSize: pageSize,
    total: total,
    showSizeChanger: true,
    showTotal: (total: number) => `共 ${total} 条`,
  };

  return {
    currentPage,
    pageSize,
    total,
    setCurrentPage,
    setPageSize,
    setTotal,
    handlePageChange,
    resetPagination,
    pagination,
  };
};

export default usePage;
